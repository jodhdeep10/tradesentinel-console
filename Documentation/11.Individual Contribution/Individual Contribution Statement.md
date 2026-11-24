# Individual Contribution Statement

*TradeSentinel · Section 11: Individual Contribution*

Team013 is an individual submission, so I held every role below. As product manager, I set the problem, strategy and controls, briefed an AI coding and drafting assistant (Claude Code) on each piece of work, reviewed what came back, and decided what stayed.

## 1. Who Led Each Artifact

| Role (packet Section 13) | Artifact | My contribution | AI assistant contribution |
|---|---|---|---|
| Product strategy lead | Proposal; topic, wedge, trust ladder, guardrails, cost of being wrong, gates | Authored (October 2026) | Microsoft Copilot: light help with wording only |
| Product strategy lead | Strategy section; recommendation | Set the direction in the proposal; chose “pilot, shadow only” after reviewing the test results | Expanded the proposal into the report sections |
| PM artifacts / PRD lead | PRD, prioritization, roadmap, KPIs | Scope, non-goals, never-allowed list and gates from my proposal; reviewed the drafts | First drafts and the RICE arithmetic |
| UX and workflow lead | Wireframes, flow, trust design | Rejected the first crowded console; specified two lanes by who acts next, plain wording, the SME role and editable replies | Wireframes and interface code to my briefs |
| Data / evaluation lead | Synthetic data, evaluation | Accepted the evaluation approach; its limits are disclosed in the report | Wrote the synthetic data and the test harness, and ran it |
| Prototype / build lead | Web prototype and hosting | Product requirements, review in demos, and the decision to host it publicly on GitHub | Code, test scripts and the GitHub Pages set-up |
| Business / risk lead | Economics; risk note | Outcome values (now in hours) and the escalate-only rule from my proposal | Scenario calculations and the first risk register draft |

## 2. Decisions I Kept (not outsourced to AI, per the packet)

| Decision | My position | Reasoning |
|---|---|---|
| Opportunity choice | TradeSentinel, on the order-entry and execution flow | Repeated decision, measurable cost, and the highest cost of error, so the controls are tested where they matter |
| Risk acceptance | Missing a critical issue is unacceptable; needless escalations are accepted up to a ceiling that protects SME capacity | One miss takes as much effort as 320 needless escalations, but an overloaded SME stops checking carefully |
| Launch recommendation | Pilot, shadow mode only; do not scale | Gate 1 is only partly met: three critical issues were under-triaged, and time saved is unmeasured |
| Monetization judgment | Internal funding for the pilot; a SaaS offer for other brokers only if reuse is proven | Value must be proven for one firm first; the control logic depends on its SLAs |
| Governance claims | Controls and launch blockers in Section 7 of the report | No legal or regulatory claim is made; these must be confirmed with compliance in Phase 0 |

## 3. How Outputs Were Checked

- I reviewed the prototype in live demos before each release and asked for changes: the two-lane board, the SME role, fixes assigned to the development team, editable replies, plainer wording, a clearer README link and hours instead of money.
- Every quoted figure comes from the evaluation output, run once on frozen settings, or from one calculation script.
- I re-ran node evaluate.js holdout myself, and the results matched the documents: 90% category accuracy, 97.6% critical recall and 96.8% top-3 cause.

**Declaration.** I take responsibility for this submission, including the AI-assisted parts, and can explain and defend it. AI use is disclosed in 05_AI_Collaboration_Log.md. Name: Jodhdeep Singh    Roll No.: 2025mb26112    Signature: Jodhdeep Singh    Date: 11 November 2026

---

[← 10.2 What Is Evidence and What Is Assumption](../10.Recommendation/10.2%20What%20Is%20Evidence%20and%20What%20Is%20Assumption.md) · [Contents](../README.md)
