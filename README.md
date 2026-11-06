# TradeSentinel Console

Working prototype of TradeSentinel, an AI-assisted triage console for the support team of a trading platform. Built for the Management of AI Products capstone (MBA ZG583).

- **Live demo:** [jodhdeep10.github.io/tradesentinel-console](https://jodhdeep10.github.io/tradesentinel-console/)
- **Source code:** [github.com/jodhdeep10/tradesentinel-console](https://github.com/jodhdeep10/tradesentinel-console)

All clients, tickets, incidents and releases are invented. Nothing connects to a live system, and a local classifier stands in for the pilot's API language model.

## What it shows

The AI reads and matches, rules set the limits, and a person makes the decisions that matter.

- The home board splits issues by who must act next: with your team, or with the client
- Unclear, failed-trade, security and critical issues are flagged for a subject matter expert (SME) to check
- Suggested fixes are assigned to the development team, who apply them through the normal change process
- The suggested client reply can be edited before it is sent
- Reports are classified, with confidence and alternatives shown
- Likely duplicates are grouped, and a person confirms any merge
- Severity can only go up, and every step is explained
- Automation is set per category: L0 shadow, L1 suggest, L2 assisted
- Causes are ranked with citations to past incidents and releases
- A client update cannot be sent while it has blanks or lacks approval

## Run it locally

Open `index.html` in a browser. It needs no server, install or API key.

## Repeat the evaluation

Requires Node.js. No packages are needed.

```bash
node evaluate.js holdout
```

Results are written to `data/eval_results_holdout.json`. After changing data or code, rebuild the page with `node build.js`.

## Limits

One author wrote the training data, test data and incident catalog, so results are likely optimistic and say nothing about real tickets. In the held-out test, three critical issues were under-triaged. See the Evaluation evidence tab.

## Files

| File | Purpose |
|---|---|
| `index.html` | The demo, built into one file |
| `app.template.html` | Interface source |
| `engine.js` | Classifier, control logic, clustering, cause ranking, drafting |
| `evaluate.js` | Evaluation harness |
| `data/control_config.json` | Floors, levels and rules (the control layer) |
| `data/market_data_feed_delay.config.json` | Reuse test for a second category (paper only, not run) |
| `data/` (other files) | Synthetic reports and catalogs |
