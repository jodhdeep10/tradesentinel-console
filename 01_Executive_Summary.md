# Executive Summary on TradeSentinel

*Team013 (Individual) · Jodhdeep Singh · 2025mb26112 · MBA – AI in Business · Management of AI Products · November 2026*

## Problem

Technical issues reach a trading platform’s support team as free text, in clients’ own words. For each one an engineer must work out what is broken, how serious it is, whether others have reported it, and who owns it. This takes about 10 to 20 minutes per issue (assumed), and the queue grows fastest in volatile markets. The costs are lopsided: at the proposal’s illustrative payoffs, one missed critical issue costs about as much as 333 needless escalations.

## Target User / Customer

L1 and L2 support engineers on the order-entry and execution flow, backed by subject matter experts (SMEs) for hard cases and the development team for fixes. Clients benefit through faster and more accurate updates; operations and risk leaders own the decision to allow automation.

## Product Concept

TradeSentinel reads each report, proposes a category, severity and owner, groups likely duplicates, ranks causes with evidence, and drafts client updates. A rules-based control layer decides what is allowed: severity can only rise, every claim needs a citation, and automation is earned one category at a time through a four-level trust ladder. Some actions are never allowed, including closing, merging or downgrading an issue without a person.

## Why AI?

The hard step is reading unstructured, reworded and often understated language. Rules alone cannot do this; AI alone is not safe enough. Our test shows both halves of that claim:

| Approach (70 held-out synthetic reports) | Category correct | Critical issues escalated | Net USD per issue, 5% critical |
|---|---|---|---|
| Keyword rules | 45.7% | 43.9% | −1,273 |
| AI model alone | 90% | 82.9% | −200 |
| **TradeSentinel: AI plus control layer** | **90%** | **97.6%** | **+196** |

*Payoffs and the 5% share are assumptions. One author wrote the data and tests, so results are likely optimistic and say nothing yet about real tickets.*

## What the Prototype Showed

- **Works:** a functional web demo (jodhdeep10.github.io/tradesentinel-console) runs the full loop from report to approved update. All five guardrail checks held on every test ticket, and the true cause appeared in the top three for 96.8% of cases.
- **Falls short:** three critical issues were under-triaged. One report opening “Not urgent, but…” got a wrong category at 82% confidence, so no control fired. Understated language is the key weakness.
- **Not yet measured:** time saved, because that needs real users.
- **Economics:** inference costs about USD 0.05 per issue. False escalations cost far more, so time savings alone may not pay. The case rests on avoiding critical misses: in the conservative scenario, one avoided miss about every 2.8 months covers the shortfall.

## Recommendation

**Pilot, in shadow mode only. Do not scale yet.** Gate 1 is only partly met. Approve a narrow pilot on one flow, one client tier and one venue, at an assumed build cost of about USD 60,000:

1. **First:** fix the understated-report weakness, re-test on a new held-out set, and run a timed trial with engineers.
2. **Then:** eight weeks of silent shadow mode on masked real tickets, plus replay of past critical incidents.
3. **Decide at Gate 2:** move one category to Suggest (L1), stay in shadow, or stop.

**Stop if** critical issues still fall below the escalation line in shadow mode, if real-ticket accuracy does not clearly beat rules, or if client data cannot be protected. If it proves useful but not safe to automate, it stays an assist feature.
