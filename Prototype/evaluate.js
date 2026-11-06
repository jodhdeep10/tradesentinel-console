// Evaluation harness. Usage: node evaluate.js [dev|holdout]  Writes data/eval_results_<split>.json
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const d = f => fs.readFileSync(path.join(__dirname, 'data', f), 'utf8');
const data = E.parseData({ train: d('train.txt'), test: d('test.txt'), incidents: d('incidents.txt'), deployments: d('deployments.txt'), demo: d('demo.txt') });
const config = JSON.parse(d('control_config.json'));
const runbooks = JSON.parse(d('runbooks.json'));
const split = process.argv[2] || 'holdout';
const { RANK } = E;

// Choose the temperature by 5-fold cross validation on the training set only.
function nll(T) {
  let loss = 0, n = 0;
  for (let f = 0; f < 5; f++) {
    const tr = data.train.filter((_, i) => i % 5 !== f), te = data.train.filter((_, i) => i % 5 === f);
    const eng = E.create({ config, train: tr, incidents: data.incidents, deployments: data.deployments, runbooks, temperature: T });
    te.forEach(x => { const r = eng.triage({ text: x.text, marketHours: true }); const p = r.category === x.cat ? r.confidence : (r.alternatives.find(a => a.label === x.cat) || { p: 0.01 }).p; loss -= Math.log(Math.max(p, 1e-3)); n++; });
  }
  return loss / n;
}
const grid = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
const nlls = grid.map(nll);
const temperature = grid[nlls.indexOf(Math.min(...nlls))];
const eng = E.create({ config, train: data.train, incidents: data.incidents, deployments: data.deployments, runbooks, temperature });

const test = data.test.filter(t => t.split === split).sort((a, b) => a.minute - b.minute);
test.forEach(t => { t.triage = eng.triage(t); t.kw = E.keywordBaseline(t.text); });

// Blast radius uses suggested incidents, as in the workflow.
const groups = eng.cluster(test);
groups.forEach(g => {
  g.members.forEach(i => {
    const t = test[i];
    const b = eng.applyBlastRadius(t.triage.severity, g.members.length, t.marketHours);
    t.finalSev = b.severity; t.groupSize = g.members.length;
  });
});

const pct = (a, b) => (b ? +(100 * a / b).toFixed(1) : null);
const catOK = test.filter(t => t.triage.category === t.cat).length;
const kwOK = test.filter(t => t.kw.category === t.cat).length;
const cats = Object.keys(config.categories);
function macroF1(pred) {
  const f = cats.map(c => { const tp = test.filter(t => pred(t) === c && t.cat === c).length, fp = test.filter(t => pred(t) === c && t.cat !== c).length, fn = test.filter(t => pred(t) !== c && t.cat === c).length; const p = tp / (tp + fp || 1), r = tp / (tp + fn || 1); return p + r ? 2 * p * r / (p + r) : 0; });
  return +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(3);
}
const perCat = cats.map(c => { const n = test.filter(t => t.cat === c); return { category: c, n: n.length, correct: n.filter(t => t.triage.category === c).length }; });
// Calibration: expected calibration error over five confidence bins.
const bins = [0, 0.2, 0.4, 0.6, 0.8, 1.0001].slice(0, -1).map((lo, i, a) => ({ lo, hi: a[i + 1] || 1.0001, n: 0, conf: 0, ok: 0 }));
test.forEach(t => { const b = bins.find(x => t.triage.confidence >= x.lo && t.triage.confidence < x.hi); b.n++; b.conf += t.triage.confidence; b.ok += t.triage.category === t.cat ? 1 : 0; });
const ece = bins.reduce((s, b) => s + (b.n ? b.n / test.length * Math.abs(b.conf / b.n - b.ok / b.n) : 0), 0);

const crit = test.filter(t => RANK[t.sev] >= RANK.S2), sev1 = test.filter(t => t.sev === 'S1'), minor = test.filter(t => RANK[t.sev] < RANK.S2);
const under = (list, f) => list.filter(t => RANK[f(t)] < RANK[t.sev]);
const esc = s => RANK[s] >= RANK.S2;
const strategies = { 'TradeSentinel (floors + blast radius)': t => t.finalSev, 'Model alone, no control layer': t => t.triage.modelSeverity, 'Keyword rules baseline': t => t.kw.severity, 'Escalate everything': () => 'S1', 'Escalate nothing': () => 'S4' };
const PAY = { tp: 5000, fn: -50000, fp: -150, tn: 40 };
const prevalence = [0.01, 0.05, 0.10];
const sevTable = Object.entries(strategies).map(([name, f]) => {
  const recall = crit.filter(t => esc(f(t))).length / crit.length, fpr = minor.filter(t => esc(f(t))).length / minor.length;
  const ev = p => Math.round(p * (recall * PAY.tp + (1 - recall) * PAY.fn) + (1 - p) * (fpr * PAY.fp + (1 - fpr) * PAY.tn));
  return { name, criticalRecall: +(100 * recall).toFixed(1), missed: crit.filter(t => !esc(f(t))).map(t => t.id), falseEscalationRate: +(100 * fpr).toFixed(1), netPayoffPerIssue: Object.fromEntries(prevalence.map(p => [p, ev(p)])) };
});

// Pairwise clustering quality.
let tp = 0, fp = 0, fn = 0;
const gid = {}; groups.forEach((g, n) => g.members.forEach(i => { gid[i] = n; }));
for (let i = 0; i < test.length; i++) for (let j = i + 1; j < test.length; j++) {
  const same = test[i].cluster !== '-' && test[i].cluster === test[j].cluster, pred = gid[i] === gid[j];
  if (same && pred) tp++; else if (!same && pred) fp++; else if (same && !pred) fn++;
}

const withCause = test.filter(t => t.cause !== 'user_error_training');
const hyp = withCause.map(t => ({ id: t.id, list: eng.hypotheses(t.text, t.triage.category, t.minute).map(h => h.cause), cause: t.cause }));
const top1 = hyp.filter(h => h.list[0] === h.cause).length, top3 = hyp.filter(h => h.list.includes(h.cause)).length;

const wrong = test.filter(t => t.triage.category !== t.cat);
const caught = wrong.filter(t => t.triage.senior);
const auto = test.filter(t => !t.triage.senior && t.triage.category === t.cat).length;

// Guardrail invariants: these must hold on every ticket, not on average.
const inv = { severityNeverLowered: test.every(t => RANK[t.finalSev] >= RANK[t.triage.modelSeverity]), floorAlwaysApplied: test.every(t => RANK[t.finalSev] >= RANK[t.triage.floorSeverity]) };
const dNo = eng.draftUpdate({ reports: 3, severity: 'S2', category: 'order_stuck', confirmed: null, startedAt: '09:52', approved: true });
inv.unconfirmedCauseCannotSend = dNo.canSend === false && dNo.text.includes('CAUSE NOT CONFIRMED');
const hSample = eng.hypotheses('orders stuck pending no ack', 'order_stuck', 50);
inv.hypothesesAlwaysCiteEvidence = test.every(t => eng.hypotheses(t.text, t.triage.category, t.minute).every(h => h.evidence.length > 0));
const dUnapproved = eng.draftUpdate({ reports: 3, severity: 'S2', category: 'order_stuck', confirmed: hSample[0], startedAt: '09:52', approved: false });
inv.unapprovedCannotSend = dUnapproved.canSend === false;

const t0 = process.hrtime.bigint(); for (let k = 0; k < 200; k++) eng.triage(test[k % test.length]);
const msPer = Number(process.hrtime.bigint() - t0) / 1e6 / 200;

const results = {
  split, n: test.length, trainN: data.train.length, temperature, confidenceThreshold: config.confidence_threshold,
  category: { accuracy: pct(catOK, test.length), correct: catOK, baselineAccuracy: pct(kwOK, test.length), baselineCorrect: kwOK, macroF1: macroF1(t => t.triage.category), baselineMacroF1: macroF1(t => t.kw.category), top2: pct(test.filter(t => t.triage.category === t.cat || t.triage.alternatives[0].label === t.cat).length, test.length), perCat },
  calibration: { ece: +ece.toFixed(3), bins: bins.map(b => ({ range: `${b.lo.toFixed(1)}-${Math.min(b.hi, 1).toFixed(1)}`, n: b.n, meanConfidence: b.n ? +(b.conf / b.n).toFixed(2) : null, accuracy: b.n ? +(b.ok / b.n).toFixed(2) : null })) },
  severity: { nCritical: crit.length, nS1: sev1.length, nMinor: minor.length, table: sevTable, underS1S2: under(crit, t => t.finalSev).map(t => ({ id: t.id, truth: t.sev, got: t.finalSev, text: t.text })), overTriageRate: pct(minor.filter(t => RANK[t.finalSev] > RANK[t.sev]).length, minor.length) },
  clustering: { pairs: { tp, fp, fn }, precision: pct(tp, tp + fp), recall: pct(tp, tp + fn), trueClusters: new Set(test.map(t => t.cluster).filter(c => c !== '-')).size, suggestedMultiGroups: groups.filter(g => g.members.length > 1).length, tickets: test.length, incidents: groups.length },
  rootCause: { n: hyp.length, top1: pct(top1, hyp.length), top3: pct(top3, hyp.length), misses: hyp.filter(h => !h.list.includes(h.cause)).map(h => h.id) },
  routing: { wrongCategory: wrong.length, wrongCaughtBySeniorReview: caught.length, wrongNotCaught: wrong.filter(t => !t.triage.senior).map(t => ({ id: t.id, truth: t.cat, got: t.triage.category, conf: +t.triage.confidence.toFixed(2), text: t.text })), sentToSenior: pct(test.filter(t => t.triage.senior).length, test.length), correctAndNotSenior: pct(auto, test.length) },
  invariants: inv, latencyMsPerTriage: +msPer.toFixed(2),
};
fs.writeFileSync(path.join(__dirname, 'data', `eval_results_${split}.json`), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 1));
