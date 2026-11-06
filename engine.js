// TradeSentinel decision engine. Runs unchanged in the browser demo and in the evaluation harness.
// The classifiers stand in for the pilot's API language model; the control layer is the real design.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TradeSentinelEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const STOP = new Set('a an the and or but if to of in on at for from by with is are was were be been it this that i my me we our you your they them he she have has had do does did not no as so just please can could would will there here am pm what why how when where who which than then too very some any all'.split(' ').filter(w => !['not', 'no', 'all', 'how', 'where', 'what', 'why', 'any'].includes(w)));
  const RANK = { S4: 0, S3: 1, S2: 2, S1: 3 };
  const SEV = ['S4', 'S3', 'S2', 'S1'];
  const higher = (a, b) => (RANK[a] >= RANK[b] ? a : b);

  function stem(w) {
    if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
    if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
    return w;
  }
  function tokens(text) {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !STOP.has(w)).map(stem);
    const out = words.slice();
    for (let i = 0; i < words.length - 1; i++) out.push(words[i] + '_' + words[i + 1]);
    return out;
  }

  // Multinomial naive Bayes with temperature scaling, so that confidence can be calibrated.
  function trainNB(docs, labelKey, alpha = 0.3) {
    const labels = [...new Set(docs.map(d => d[labelKey]))];
    const counts = {}, totals = {}, prior = {}, vocab = new Set();
    labels.forEach(l => { counts[l] = {}; totals[l] = 0; prior[l] = 0; });
    docs.forEach(d => {
      const l = d[labelKey]; prior[l]++;
      tokens(d.text).forEach(t => { counts[l][t] = (counts[l][t] || 0) + 1; totals[l]++; vocab.add(t); });
    });
    return { labels, counts, totals, prior, V: vocab.size, N: docs.length, alpha, vocab };
  }
  function predictNB(m, text, T = 1) {
    const toks = tokens(text).filter(t => m.vocab.has(t));
    const logs = m.labels.map(l => {
      let s = Math.log(m.prior[l] / m.N);
      toks.forEach(t => { s += Math.log(((m.counts[l][t] || 0) + m.alpha) / (m.totals[l] + m.alpha * m.V)); });
      return s;
    });
    const scale = Math.max(1, toks.length) * T; // length normalised so long tickets are not overconfident
    const max = Math.max(...logs);
    const raw = logs.map(s => Math.exp((s - max) / scale));
    const sum = raw.reduce((a, b) => a + b, 0);
    return m.labels.map((l, i) => ({ label: l, p: raw[i] / sum })).sort((a, b) => b.p - a.p);
  }

  function tfidf(docsTokens) {
    const df = {};
    docsTokens.forEach(ts => new Set(ts).forEach(t => { df[t] = (df[t] || 0) + 1; }));
    const N = docsTokens.length;
    const idf = t => Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;
    const vec = ts => {
      const v = {}; ts.forEach(t => { v[t] = (v[t] || 0) + 1; });
      let n = 0; Object.keys(v).forEach(t => { v[t] = v[t] * idf(t); n += v[t] * v[t]; });
      n = Math.sqrt(n) || 1; Object.keys(v).forEach(t => { v[t] /= n; });
      return v;
    };
    return { vec };
  }
  const cosine = (a, b) => { let s = 0; for (const t in a) if (b[t]) s += a[t] * b[t]; return s; };

  function create({ config, train, incidents, deployments, runbooks, temperature = 1 }) {
    const catModel = trainNB(train, 'cat');
    const sevModel = trainNB(train, 'sev');
    const incTokens = incidents.map(i => tokens(i.title + ' ' + i.symptoms));
    const idx = tfidf(incTokens.concat(train.map(d => tokens(d.text))));
    const incVecs = incTokens.map(idx.vec);

    function severityOf(text, cat, marketHours) {
      const c = config.categories[cat];
      return marketHours ? c.floor_market : c.floor_off;
    }
    function isSecurity(text) {
      const low = text.toLowerCase();
      return config.security_rule.terms.filter(t => low.includes(t));
    }

    function triage(ticket) {
      const probs = predictNB(catModel, ticket.text, temperature);
      const top = probs[0];
      const lowConf = top.p < config.confidence_threshold;
      const sevProbs = predictNB(sevModel, ticket.text, temperature);
      const modelSeverity = sevProbs[0].label;
      const trail = [{ step: 'Model proposal', sev: modelSeverity, why: `Language signals in the report (${Math.round(sevProbs[0].p * 100)}% confidence)` }];
      let sev = modelSeverity;
      const floor = severityOf(ticket.text, top.label, ticket.marketHours);
      if (RANK[floor] > RANK[sev]) trail.push({ step: 'Category floor', sev: floor, why: `${config.categories[top.label].label} ${ticket.marketHours ? 'in market hours' : 'off hours'} is never below ${floor}` });
      sev = higher(sev, floor);
      if (lowConf) { // when unsure, take the strictest floor of any plausible category
        probs.filter(a => a.p >= config.uncertain_alternative_probability).forEach(a => {
          const f = severityOf(ticket.text, a.label, ticket.marketHours);
          if (RANK[f] > RANK[sev]) { trail.push({ step: 'Uncertainty floor', sev: f, why: `Could be ${config.categories[a.label].label} (${Math.round(a.p * 100)}%), so its floor applies` }); sev = f; }
        });
      }
      const sec = isSecurity(ticket.text);
      if (sec.length && RANK[config.security_rule.floor] > RANK[sev]) { trail.push({ step: 'Security rule', sev: config.security_rule.floor, why: `Report mentions "${sec[0]}"` }); sev = config.security_rule.floor; }
      const cat = config.categories[top.label];
      const reasons = [];
      if (sec.length) reasons.push('possible security event');
      if (lowConf) reasons.push(`low confidence (${Math.round(top.p * 100)}%)`);
      if (cat.always_senior) reasons.push('possible execution failure');
      return {
        category: top.label, confidence: top.p, alternatives: probs.slice(1, 3), lowConfidence: lowConf,
        modelSeverity, floorSeverity: floor, severity: sev, trail, security: sec.length > 0,
        owner: sec.length ? config.security_rule.route : cat.owner,
        senior: reasons.length > 0 || sev === 'S1', seniorReasons: reasons, level: cat.level,
      };
    }

    // Suggests incidents only. A human confirms any merge in the interface.
    function cluster(tickets) {
      const vecs = tickets.map(t => idx.vec(tokens(t.text)));
      const groups = [];
      tickets.forEach((t, i) => {
        const tri = t.triage || triage(t);
        let best = null, bestSim = 0;
        groups.forEach(g => {
          if (g.category !== tri.category) return;
          const last = tickets[g.members[g.members.length - 1]];
          if (t.minute - last.minute > config.cluster.window_minutes || t.minute < last.minute) return;
          const sim = Math.max(...g.members.map(m => cosine(vecs[i], vecs[m])));
          if (sim >= bestSim) { bestSim = sim; best = g; }
        });
        // Same category inside the window: text similarity, or two sev-2+ reports in a burst.
        const burst = best && RANK[tri.severity] >= RANK.S2 && t.minute - tickets[best.members[best.members.length - 1]].minute <= 6;
        if (best && (bestSim >= config.cluster.similarity_threshold || burst)) best.members.push(i);
        else groups.push({ category: tri.category, members: [i] });
      });
      return groups;
    }

    // Blast radius can only raise severity.
    function applyBlastRadius(sev, reports, marketHours) {
      let out = sev; const steps = [];
      config.blast_radius.forEach(r => {
        if (reports >= r.min_reports && (!r.market_hours_only || marketHours) && RANK[r.floor] > RANK[out]) {
          out = r.floor; steps.push({ step: 'Blast radius', sev: r.floor, why: `${reports} clients reporting the same fault` });
        }
      });
      return { severity: out, steps };
    }

    function hypotheses(text, category, minute) {
      const v = idx.vec(tokens(text));
      const scored = incidents.map((inc, i) => ({ inc, sim: cosine(v, incVecs[i]) + (inc.cat === category ? 0.1 : 0) })).sort((a, b) => b.sim - a.sim).slice(0, 6);
      const byCause = {};
      scored.forEach(({ inc, sim }) => {
        if (sim <= 0) return;
        const h = byCause[inc.cause] || (byCause[inc.cause] = { cause: inc.cause, score: 0, summary: inc.causeText, fix: inc.fix, evidence: [] });
        h.score += sim;
        h.evidence.push({ type: 'Past incident', id: inc.id, text: inc.title });
      });
      deployments.forEach(d => { // a release shortly before the report is evidence, not proof
        if (minute !== undefined && minute >= d.minute && minute - d.minute <= 240 && byCause[d.cause]) {
          byCause[d.cause].score *= 1.5;
          byCause[d.cause].evidence.push({ type: 'Deployment', id: d.id, text: d.text });
        }
      });
      const list = Object.values(byCause).sort((a, b) => b.score - a.score).slice(0, 3);
      const total = list.reduce((a, h) => a + h.score, 0) || 1;
      list.forEach(h => { h.weight = h.score / total; });
      return list;
    }

    // Statements are only allowed with a citation. A missing cause stays a visible placeholder.
    function draftUpdate({ reports, severity, category, confirmed, startedAt, approved }) {
      const label = config.categories[category].label.toLowerCase();
      const names = { S1: 'critical', S2: 'high', S3: 'medium', S4: 'low' };
      const cause = confirmed ? `We have found the cause: ${confirmed.summary.replace(/\.$/, '')} (reference ${confirmed.evidence[0].id}).` : '[CAUSE NOT CONFIRMED: pick a cause in step 2]';
      const impact = reports > 1 ? `${reports} clients have reported the same problem, and we are handling it as one incident.` : '';
      const text = `Thank you for letting us know. We are working on the problem you reported at ${startedAt} (${label}), and we have given it ${names[severity] || severity} priority. ${impact} ${cause} [NEXT UPDATE TIME: set it below]`.replace(/\s+/g, ' ');
      const placeholders = (text.match(/\[[A-Z ]+[:][^\]]*\]/g) || []);
      return { text, placeholders, canSend: !!approved && placeholders.length === 0 };
    }
    function closureNote({ category, confirmed, fix, severity, reports }) {
      if (!confirmed) return '[Closure note blocked: no confirmed cause selected]';
      return `Category: ${config.categories[category].label}. Final priority: ${severity}. Linked reports: ${reports}. Cause: ${confirmed.summary} Evidence: ${confirmed.evidence.map(e => e.id).join(', ')}. Fix applied by engineer: ${fix || confirmed.fix}. Closed by a human; TradeSentinel cannot close issues.`;
    }

    return { triage, cluster, applyBlastRadius, hypotheses, draftUpdate, closureNote, runbooks, config };
  }

  // Simple alternative used as the evaluation baseline.
  const KEYWORDS = {
    order_rejected: ['reject', 'refused', 'declined', 'invalid'], order_stuck: ['stuck', 'pending', 'hanging', 'no ack'],
    execution_failed: ['failed', 'execution', 'did not fill', 'not execute'], fill_mismatch: ['mismatch', 'fill', 'position', 'allocation', 'recon'],
    session_connectivity: ['fix', 'session', 'disconnect', 'logon', 'gateway', 'tls'], access_howto: ['how do', 'password', 'permission', 'where', 'guide'],
  };
  function keywordBaseline(text) {
    const low = text.toLowerCase();
    let best = 'access_howto', n = 0;
    Object.entries(KEYWORDS).forEach(([c, ks]) => { const hit = ks.filter(k => low.includes(k)).length; if (hit > n) { n = hit; best = c; } });
    const sev = /urgent|down|all |everything|loss|losing/.test(low) ? 'S1' : /fail|stuck|cannot|can't/.test(low) ? 'S2' : n ? 'S3' : 'S4';
    return { category: best, severity: sev };
  }

  function parseData(raw) {
    const lines = s => s.trim().split(/\r?\n/).map(l => l.split('|'));
    return {
      train: lines(raw.train).map(([cat, sev, text]) => ({ cat, sev, text })),
      test: (raw.test ? lines(raw.test) : []).map(([id, split, cat, sev, mh, cl, minute, cause, text]) => ({ id, split, cat, sev, marketHours: mh === '1', cluster: cl, minute: +minute, cause, text })),
      incidents: lines(raw.incidents).map(([id, cat, cause, title, symptoms, causeText, fix]) => ({ id, cat, cause, title, symptoms, causeText, fix })),
      deployments: lines(raw.deployments).map(([id, component, minute, text, cause]) => ({ id, component, minute: +minute, text, cause })),
      demo: lines(raw.demo).map(([id, mh, time, client, channel, text]) => ({ id, marketHours: mh === '1', time, client, channel, text, minute: (+time.slice(0, 2) - 9) * 60 + (+time.slice(3)) - 15 })),
    };
  }

  return { create, keywordBaseline, parseData, tokens, RANK, SEV, higher };
});
