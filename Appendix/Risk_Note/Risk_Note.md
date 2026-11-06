# Ethics, Governance and Risk Note on TradeSentinel

*Team013 (Individual) · Jodhdeep Singh · 2025mb26112 · MBA – AI in Business · Management of AI Products · November 2026*

Likelihood and impact are the author’s judgement before pilot data exists, on a scale of low, medium and high.

## 1. Risk Register

| ID | Risk | Likelihood | Impact | Control | Evidence or trigger | Owner |
|---|---|---|---|---|---|---|
| R1 | Understated critical report under-triaged | High | High | Floors; new no-outcome rule (to test); seeded test cases; SME check | Holdout miss H68 | Product and SME |
| R2 | Bias against certain wording or client size | Medium | High | Fairness test by style and client size; no tier feature in severity | Any material recall gap | Risk |
| R3 | Client data leaves approved boundary | Low | High | Masking; private route; no-training contract; retention limits | Any masking failure | Security |
| R4 | Invented cause in client update | Medium | High | Citations; placeholders; Send lock; edits logged; approval | Any uncited send | Support lead |
| R5 | Prompt injection via ticket text | Medium | Medium | Text treated as data; rules outside the model; injection tests | Any behaviour change in tests | Engineering |
| R6 | Gaming with “urgent” language | Medium | Low | Floors do not depend on such words; monitor by client | Unusual pattern by client | Support lead |
| R7 | Rubber-stamp approvals | High | High | L1 without pre-fill; review time tracking; sampling; seeded errors | Review time falls, errors do not | Support lead |
| R8 | Drift in volatile markets | High | Medium | Rule floors do not drift; monitor by market regime | Metric drop in stress periods | Product |
| R9 | Overload of SMEs | Medium | Medium | Track SME queue; tune the threshold with evidence | 34.3% sent to SME check in test | Operations |
| R10 | Skill erosion among engineers | Medium | Medium | Rotations without AI; drills | Drill results | Support lead |
| R11 | API outage during market stress | Medium | High | Manual fallback; rules run locally | Timeouts | Engineering |
| R12 | Unclear accountability for errors | Medium | High | Written policy: decisions and system limits have named owners; blameless review | Any disputed incident | Risk |

## 2. Harm Scenarios

| Who | How harm occurs | Main defence |
|---|---|---|
| Retail or smaller client | Polite message about a failed execution waits in a low-priority queue while the market moves | Floors, no-outcome rule, fairness test |
| Many clients | An incident update states a wrong cause and clients act on it | Citations and human approval |
| Support engineer | Held responsible for an AI error presented with false confidence | Visible doubt; accountability policy |
| Firm and market | A reportable event is under-classified and cannot be reconstructed | Audit log; S1 review |

## 3. Launch Checklist

| Area | Must be true before going live at each level | Sign-off |
|---|---|---|
| Review | Gate report completed; samples audited by an SME | Operations |
| Rollback | Category level can be lowered in under five minutes by the on-shift lead; tested in a drill | Engineering |
| Escalation | Path documented and rehearsed; security route tested | Operations |
| Data | Masking verified; contract signed; retention set | Security, Legal |
| Fairness | Test by style and client size completed, with no material gap | Risk |
| Audit | Full decision record can be retrieved for any ticket | Compliance |
| Training | Engineers know what the system cannot do and how to override it | Support lead |

## 4. Launch Blockers

- Any S1 called below S2, or critical issue below the escalation line, in shadow mode without a tested fix.
- Client data cannot be masked or protected by contract.
- Any client update can be sent with an uncited cause.
- Material fairness gap in critical recall.
- Review time collapses without a matching fall in errors.
- Operations or risk declines to sign off.

## 5. Governance Note

This note does not make legal or regulatory claims. Which incidents are reportable, what records must be kept, and what is required of AI in a regulated trading firm must be confirmed with the firm’s compliance team during Phase 0.
