# Presentation Deck on TradeSentinel

*Team013 (Individual) · Jodhdeep Singh · 2025mb26112 · MBA – AI in Business · Management of AI Products · November 2026*

Text and speaker notes of each slide. The designed slides are in 03_Presentation_Deck.pdf.

## Slide 1: TradeSentinel

- Should we fund a pilot of AI-assisted support triage for trading issues?
- Team013 (Individual) · Jodhdeep Singh · 2025mb26112
- MBA – AI in Business · Management of AI Products · November 2026

> **Speaker notes:** Treat this as a leadership review. By the end you should be able to decide: fund a narrow pilot, change it, or stop. I will give my recommendation up front: pilot in shadow mode only.

## Slide 2: Recommendation: pilot in shadow mode only, and do not scale yet

- Why go ahead
- The decision repeats on every ticket and its effort is measurable
- AI read reports far better than rules: 90% against 45.7%
- With controls, 97.6% of critical issues were escalated
- Why not more than a pilot
- Three critical issues were under-triaged in testing
- Time saved has not been measured
- All data so far is synthetic
- The ask
- About 1,000 hours of build effort (assumed)
- Fix and re-test, then 8 weeks in silent shadow
- One flow, one client tier, one venue
- Stop conditions agreed in advance

> **Speaker notes:** Answer first. The design works in the prototype, but it missed a target that matters, and we have no real-user or real-ticket evidence. So the ask is narrow: fix the gap, then eight weeks of silent running. Nothing automated reaches a client or an engineer during shadow.

## Slide 3: A missed execution fault costs far more than a needless escalation

- Reports arrive as free text: “my orders are stuck”
- Each needs reading, sizing and routing: 10 to 20 minutes (assumed)
- The queue grows fastest in volatile markets
- One fault gets opened many times and worked separately
- Quality depends on who is on shift
- Hours of effort per issue (assumed)
- Escalate
- Do not escalate
- Genuinely critical
- +80
- −800
- Actually minor
- −2.5
- +0.5
- About 0.3%
- chance of being critical is enough to justify escalating. Even with far less extreme inputs, break-even stays under 3.5%.

> **Speaker notes:** The problem and the stakes, in hours of staff effort. These values are assumptions, in the same proportions as the proposal. The point is the ratio: one miss takes as much effort as about 320 needless escalations. A needless escalation is set at 2.5 hours of SME time, more cautious than the proposal’s “a few minutes”, since it works against our case.

## Slide 4: The user is a support engineer deciding under pressure, and rules alone cannot read client language

- Job to be done
- When I am on shift and reports arrive in clients’ own words during a volatile market, I want to know quickly which are the same fault, how serious each is and what probably caused it, so that I can protect clients without chasing every report by hand.
- Alternative
- Why it falls short
- Keyword rules
- Break on reworded and understated reports
- Dashboards
- Show machine signals, cannot read clients
- More engineers
- Adds cost, not consistency
- AI model alone
- Missed 7 of 41 critical issues in our test
- AI + control layer
- Missed 1 of 41; a real gap remains

> **Speaker notes:** Why this user: the triage engineer makes the decision and carries the error cost. Why AI: the data is unstructured. Why now: API language models remove the need for a large labelled dataset before a trial. Why not AI alone: the same model without controls missed seven critical issues.

## Slide 5: AI reads and matches; rules set the limits; a person makes the decisions that matter

- Trust ladder
- L0 Shadow: silent, recorded
- L1 Suggest: person decides
- L2 Assisted: one-click approval
- L3 Limited auto: not earned yet
- Never allowed
- Lowering severity, closing, merging, production changes, or sending unapproved or uncited updates.
- MVP: order-entry and execution issues, one client tier, one venue.

> **Speaker notes:** Walk the flow left to right, then down. The central idea is that the control layer sits outside the model, so model drift or a clever ticket cannot change the limits. Automation is a setting by category. The MVP covers one flow; market data alerts are a paper test of reuse.

## Slide 6: We made hard choices on scope, sequence and controls

- Decision
- What we chose
- What we gave up
- Why
- First wedge
- Riskiest flow: order and execution
- An easier early win
- If controls hold here, they likely hold elsewhere
- Build vs buy
- API for models; build the control layer
- Model ownership
- Learning speed now; our SLAs and audit are specific to us
- Held at L1
- Execution failures, on purpose
- Time saved on that category
- It has the highest cost of error
- Rejected
- Autonomous fixes; client chatbot
- A flashier demo
- One bad action could outweigh a year of savings
- Prioritization
- Controls before features; RICE for the rest
- Faster feature delivery
- Controls are a precondition for launch

> **Speaker notes:** Show product judgment. Each of these has a real cost. The riskiest flow first looks counter-intuitive but it is the flow where the control design gets tested. We rejected a chatbot and autonomous fixes.

## Slide 7: The prototype shows who must act next, and works end to end

- Live demo: jodhdeep10.github.io/tradesentinel-console
- What the demo proves
- Two lanes: with your team, with the client
- Doubt stated plainly; reasons one click away
- Autonomy changes by configuration
- Reply is editable; blanks lock Send
- What it does not prove
- Language model quality: a local classifier stands in
- Results on real tickets
- Time saved or engineer trust

> **Speaker notes:** Do the live demo here, or use this screen. The home board splits issues into With your team and With the client. Open the top S1 issue and show four reports becoming one incident. Open Lotus Wealth: quick question, nothing major, flagged for an SME check. Send an update and show the issue move to the client lane. Then the Rules tab: change a level and show behaviour change.

## Slide 8: The control layer is what makes this worth funding

- 90%
- category accuracy (rules 45.7%)
- 96.8%
- true cause in top three (target 70%)
- 5 of 5
- guardrail checks held on every ticket
- Synthetic data; one author wrote the data and the tests, so results are likely optimistic. 95% interval on critical escalation: 87.4% to 99.6%.

> **Speaker notes:** Seventy held-out synthetic reports, run once on frozen settings. Accuracy looks similar with or without controls, since the controls do not change the category. What changes is the decision, and that turns lost effort into saved effort at the assumed values. Be honest about limits: one author wrote data and tests.

## Slide 9: It failed where we most feared: “Not urgent, but…”

- “Not urgent, but my limit order that should have traded at the touch shows nothing done.”
- True severity S2. System said S3. Wrong category at 82% confidence, so no control fired.
- Gate 1 measure
- Target
- Result
- Status
- Correct cause in top hypotheses
- At least 70%
- 96.8%
- Met (likely flattered)
- Critical issues under-triaged
- Near zero
- 3 of 41 (1 below escalation)
- Not met
- Time to first correct triage
- Under 3 minutes
- Not measured
- Needs real users
- Next: add a rule for orders with no visible outcome, cap confidence on thin reports, and re-test on a new set written by someone else.

> **Speaker notes:** This is the most important slide. A polite report about a real failure got a wrong category at 82 percent confidence, so no floor or SME check fired. Confidence alone is not a safety signal. The fix is proposed but untested, and it needs a new test set as this one has now been seen.

## Slide 10: Running the model costs no staff time; false escalations do, so the case rests on avoided misses

- Minutes per issue, 1,000 issues a month
- Conservative
- Base
- Optimistic
- Triage time saved
- 7 min
- 30 min
- 40 min
- Model running
- None
- None
- None
- Extra false escalations
- −19.7 min
- −12.5 min
- −5.4 min
- Run and maintain
- −4.8 min
- −4.8 min
- −4.8 min
- Net per issue
- −17.5 min
- 12.7 min
- 29.8 min
- Build effort repaid in
- Not from time alone
- 4.7 months
- 2.0 months
- 1 miss
- avoided about every 3.0 months covers the conservative shortfall of about 291 hours a month
- Break-even at about 275 issues a month in the base case. A very small desk may not need this.
- Justified internally by effort saved; a SaaS offer to other brokers only if reuse is proven. All values are assumed hours of staff effort.

> **Speaker notes:** Honest time and effort view, in minutes per issue. Running the model takes no staff time. False escalations take SME time and eat most of the triage savings. In the conservative case the product loses time on triage alone, but a single avoided miss every few months covers the gap. So avoided incidents are the claim that the pilot has to test. All values are assumptions.

## Slide 11: Specific risks have specific controls, and six things block launch

- Risk
- How it shows up here
- Control
- Bias
- Polite or non-native wording gets lower severity
- Fairness test by style and client size before Gate 2
- Privacy
- Tickets hold client names, orders and positions
- Masking; private route; no-training contract
- Hallucination
- An invented cause reaches clients during an incident
- Citations; visible blanks; Send lock; approval
- Misuse
- “Urgent” gaming; prompt injection in ticket text
- Floors ignore such words; rules sit outside the model
- Rubber-stamping
- Tired engineers approve without reading
- L1 not pre-filled; review time tracked; samples
- Launch blockers
- Critical miss in shadow with no tested fix
- Client data cannot be protected
- Any uncited send possible
- Material fairness gap
- Review time collapses, errors do not
- Operations or risk declines

> **Speaker notes:** Stay specific. Bias is real here as understated writing could correlate with client size or language. Prompt injection matters since ticket text is untrusted input. We make no regulatory claims: compliance needs to confirm requirements during Phase 0.

## Slide 12: Each phase must earn the next one through a gate

- Gate 1
- New test set with no critical issue below the escalation line; timed trial under 3 minutes
- Gate 2
- Real tickets match experts; no S1 called below S2; fairness and masking verified
- Gate 3
- Positive net effort saved; ECE below 0.05; operations and risk sign-off

> **Speaker notes:** A failed gate moves everything to its right, so dates are illustrative. In Phase 1, zero misses in n cases only supports a rate below about 3 in n, so we also replay historic critical incidents. About 300 critical cases are needed to claim under one percent.

## Slide 13: Decision needed today: approve the shadow pilot

- We recommend
- Pilot in shadow mode only; do not scale
- One flow, one client tier, one venue
- About 1,000 hours of build effort (assumed)
- Phase 0 fixes the understated-report gap
- 8 weeks silent on masked real tickets
- Gate 2 decides: L1, stay in shadow, or stop
- We would stop if
- Critical issues still fall below the escalation line in shadow
- Real-ticket accuracy does not clearly beat rules
- Client data cannot be protected
- A useful but unsafe system stays an assist feature

> **Speaker notes:** Close decisively. Say the recommendation again, the build effort, and the stop conditions. Then invite challenge. If asked what AI did in this work, refer to the AI collaboration log and be ready to explain what you changed yourself.
