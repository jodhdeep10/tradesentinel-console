# Metrics and Evaluation Results on TradeSentinel

*Team013 (Individual) · Jodhdeep Singh · 2025mb26112 · MBA – AI in Business · Management of AI Products · November 2026*

Results below come from *Prototype/data/eval_results_holdout.json* (70 synthetic reports, one run on frozen settings). Training set: 108 reports. Temperature, chosen by cross-validation on training data only: 0.25. Development set result, for comparison: 95% category accuracy on 20 reports.

## 1. Metric Definitions

| Metric | Definition | Source in pilot | Used for |
|---|---|---|---|
| Time to first correct triage | Ticket open to the first decision that experts later agree with | Ticket and audit timestamps | Value; Gate 1 and 3 |
| Critical recall | Share of true S1/S2 issues given final severity S1/S2 | Expert labels | Safety; all gates |
| Strict under-triage | True S1/S2 issues given any lower severity | Expert labels | Safety; all gates |
| False escalation rate | Share of true S3/S4 issues given S1/S2 | Expert labels | Cost; alert fatigue |
| Calibration error (ECE) | Average gap between confidence and accuracy, over five bins | Model logs, labels | L2 eligibility |
| Top-3 cause hit | Final cause appears in the top three hypotheses | Closure records | Assistant value |
| Override rate | Decisions changed by a person, per category | Audit log | Trust; Gate 2 and 3 |
| Median review time | Open to approve, per decision | Audit log | Rubber-stamp detection |
| Net payoff per issue | Share of each outcome times its payoff | Labels and finance | Gate 3 |

## 2. Category Results by Class

| Category | Reports | Correct | Accuracy |
|---|---|---|---|
| order rejected | 13 | 11 | 85% |
| order stuck | 13 | 13 | 100% |
| execution failed | 14 | 12 | 86% |
| fill mismatch | 10 | 9 | 90% |
| session connectivity | 10 | 10 | 100% |
| access howto | 10 | 8 | 80% |

Overall 90%; macro F1 0.899; correct in top two 95.7%. Keyword baseline: 45.7%; macro F1 0.486.

## 3. Calibration

| Confidence bin | Reports | Mean confidence | Actual accuracy |
|---|---|---|---|
| 0.2-0.4 | 3 | 0.36 | 0.67 |
| 0.4-0.6 | 9 | 0.52 | 0.56 |
| 0.6-0.8 | 13 | 0.7 | 0.92 |
| 0.8-1.0 | 45 | 0.94 | 0.98 |

ECE is 0.083. On this small sample the model tends to under-state its confidence, which is the safer direction. However, the two errors that passed unreviewed had 71% and 82% confidence, so confidence alone is not an adequate safety signal. This is why floors exist. The Gate 3 threshold is 0.05.

## 4. Severity Decisions and Payoff

| Approach | Critical escalated | Missed | False escalation | USD per issue at 1% critical | at 5% | at 10% |
|---|---|---|---|---|---|---|
| TradeSentinel (floors + blast radius) | 97.6% | 1 | 13.8% | +50 | +196 | +378 |
| Model alone, no control layer | 82.9% | 7 | 10.3% | −24 | −200 | −421 |
| Keyword rules baseline | 43.9% | 23 | 10.3% | −238 | −1,273 | −2,567 |
| Escalate everything | 100% | 0 | 100% | −98 | +108 | +365 |
| Escalate nothing | 0% | 41 | 0% | −460 | −2,462 | −4,964 |

Formula: net payoff = p × (recall × 5,000 + (1 − recall) × (−50,000)) + (1 − p) × (FE × (−150) + (1 − FE) × 40), where p is the critical share and FE the false escalation rate. Critical recall has a 95% interval of 87.4% to 99.6% (Wilson; 40 of 41), so small differences between approaches are not meaningful.

## 5. Other Results

| Measure | Result |
|---|---|
| Under-triaged (strict) | H49 (S1 to S2), H50 (S1 to S2), H68 (S2 to S3) |
| Over-triage of minor issues | 17.2% |
| Duplicate pairs | 33 correct, 0 false merges, 0 missed; 70 reports became 55 incidents |
| Cause ranking | Top 1: 80.6%; top 3: 96.8% of 62 reports. Misses: H09, H66 |
| Sent to SME check | 34.3% of reports. This load must be checked in the pilot |
| Wrong category, not sent to SME check | H09 (71% confidence), H68 (82% confidence) |
| Guardrail invariants | 5 of 5 held on every ticket |

## 6. Limits of This Evaluation

- One author wrote the training data, test data and incident catalogue, so shared vocabulary probably flatters results.
- The 41 critical reports are too few to support a claim of a very low miss rate.
- The critical share in the test set is artificial, so payoffs are re-weighted to assumed shares.
- The classifier stands in for a language model, whose errors may differ.
- The holdout has now been seen; fixes need a new test set.
