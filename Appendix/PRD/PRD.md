# Product Requirements Document on TradeSentinel

*Team013 (Individual) · Jodhdeep Singh · 2025mb26112 · MBA – AI in Business · Management of AI Products · November 2026*

**Status:** Draft for pilot review. **Owner:** Jodhdeep Singh. **Scope:** order-entry and execution issues; one client tier; one venue.

## 1. Goal and Non-Goals

- **Goal:** reach a correct first triage faster, with near-zero critical under-triage, and with evidence attached.
- **Not in this release:** other flows; L3 automation; any production action; any client-facing bot; model training on client data.

## 2. Users

| User | Context | Needs | Error cost they carry |
|---|---|---|---|
| L1/L2 support engineer | Handles the queue during market hours, under time pressure | Clear reading of the report; quick routing; no blame for hidden AI errors | A missed fault; a wasted hour on the wrong path |
| Subject matter expert (SME) | Checks unclear, failed-trade, security and critical issues | Only real escalations; full evidence on arrival | Alert fatigue if over-escalation is high |
| Development team | Applies approved fixes through the change process | A clear cause, evidence and suggested fix | Rushed or wrong fixes in production |
| Operations and risk lead | Owns SLA and automation decisions | Evidence for gates; audit trail; quick rollback | Reportable events; regulatory exposure |

## 3. User Stories, Including Uncertainty

| ID | Story | Acceptance criteria |
|---|---|---|
| US1 | As an engineer, I see the AI’s reading, its confidence and alternatives. | Category, confidence and next-best options are shown on every ticket above L0. |
| US2 | When the system is unsure, I want to see that and have an SME check it. | Below 55% confidence: “unsure” marker, strictest plausible floor, SME check. |
| US3 | I want to see why severity is what it is. | A severity trail lists each step and reason. |
| US4 | I want duplicate reports grouped without losing control. | Suggested group shown; merging needs a person; blast radius can raise severity. |
| US5 | I want to disagree and have that count. | Every change requires a reason, which is logged. |
| US6 | I want likely causes with proof. | Each cause lists at least one past incident or release. |
| US7 | I do not want to send a client something unproven. | The draft can be edited; Send is locked while any blank remains; no cause appears without a citation. |
| US8 | As a risk lead, I want to change automation without a release. | Levels are set per category in configuration; rollback is immediate. |
| US9 | As an engineer, I want to see at a glance which issues need me and which are waiting on the client. | Home board has two lanes; sending an update moves an issue to the client lane with what is awaited and since when; a client reply moves it back. |

## 4. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR1 | Classify report into one of six categories with calibrated confidence | Must |
| FR2 | Propose severity; apply category floors by market hours; never lower it | Must |
| FR3 | Apply security rule and blast-radius rule | Must |
| FR4 | Route by automation level: L0 hidden; L1 suggestion; L2 pre-filled | Must |
| FR5 | Suggest duplicates by similarity and time window | Must |
| FR6 | Log model version, suggestion, severity steps, decision, reason and review time | Must |
| FR7 | Rank causes with evidence; show runbook; assign the suggested fix to the development team | Should |
| FR8 | Draft an editable client reply and a closure note, with citations and visible blanks | Should |
| FR9 | Show issues in two lanes by who must act next, with counts; keep detail behind toggles | Must |
| FR10 | L3 auto-routing for low-risk categories | Later, after Gate 3 |

## 5. Never Allowed at Any Level

Downgrade severity; close an issue; merge issues; deploy or roll back in production; send an unapproved update; state an uncited cause.

## 6. Control Configuration

| Category | Owner | Floor: market / off hours | Level in MVP |
|---|---|---|---|
| Order rejected | Order Gateway Support | S3 / S4 | L2 |
| Order stuck (no confirmation) | Order Management (OMS) | S2 / S3 | L2 |
| Execution failed | Execution Engineering | S2 / S3, always SME check | L1 (held on purpose) |
| Trade or position mismatch | Post-Trade Engineering | S3 / S4 | L2 |
| Connection problem | Connectivity Support | S2 / S3 | L2 |
| Access or how-to question | Client Service Desk | S4 / S4 | L2 |

Other rules: security terms set at least S2 and route to SME + Security. Three linked reports set at least S2; four in market hours set S1. Levels in the MVP show the mechanism only; they have not been earned, and the pilot starts all categories at L0.

## 7. Data Assumptions

- Incident records hold usable cause and fix text.
- Release logs carry timestamps and component names.
- Identifiers can be masked before any API call without losing meaning.
- Historic severity labels are unreliable, so experts relabel a sample.

## 8. Fallback

- **Model unavailable or slow:** ticket drops to the manual queue, marked “no AI reading”; rules that do not need the model continue to run.
- **No similar incident:** the assistant says so and does not guess; the runbook remains available.
- **Metric breach:** the category drops a level by configuration.

## 9. Open Questions

- Which API route satisfies data and contract requirements?
- What is the real share of critical issues?
- Who owns control configuration after launch?
- Which events are reportable, and does the audit log meet that need?
