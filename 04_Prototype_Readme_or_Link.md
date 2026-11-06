# Prototype / MVP: TradeSentinel Console

Team013 (Individual), Jodhdeep Singh, 2025mb26112

## Prototype Type

Working web application in one HTML file. It runs in the browser with no server, API key or install.

## Links

- **Live demo:** https://jodhdeep10.github.io/tradesentinel-console/
- **Local copy:** open `Prototype/index.html` in any modern browser
- **Repository:** https://github.com/jodhdeep10/tradesentinel-console
- **Documentation:** [Documentation/README.md](Documentation/README.md)
- **Screenshots:** [Appendix/Screenshots_or_Video/](Appendix/Screenshots_or_Video/)
- **Video:** [add a link if you record a walkthrough]

## What It Demonstrates

The full decision loop for one flow (order-entry and execution issues, one client tier, one venue):

1. Reports are classified, with confidence and alternatives shown.
2. Likely duplicates are grouped into a suggested incident. A person confirms any merge.
3. Issues that need expert judgment (unclear, possible failed trade, security, critical) are flagged for an SME check. Severity is set by model, category floor, uncertainty floor, security rule and blast radius. It can only go up, and each step is explained.
4. Routing follows the automation level: L0 hidden, L1 suggestion, L2 pre-filled. Execution failures are deliberately held at L1.
5. Overrides require a reason, and review time is logged.
6. Causes are ranked with citations to past incidents and releases.
7. A checklist and suggested fix are shown. The fix is assigned to the development team, who apply it through the change process.
8. The client reply is an editable draft. Blanks stay visible, and Send stays locked until they are filled in.
9. Sending an update moves the issue to the **With the client** lane, showing what is awaited and since when. A client reply moves it back to **With your team**.
10. A person closes the issue, with a cited closure note.

## AI Role

- **Live in the prototype:** a Naive Bayes classifier for category and severity, and TF-IDF similarity for duplicates and cause ranking. These run on any report typed into the console.
- **Stand-in:** templates with slots take the place of language model drafting.
- **Planned for the pilot:** an API language model behind the same control layer.

## Suggested Five-Minute Walkthrough

1. **Home board:** issues are split into **With your team** (needs support action, most urgent first) and **With the client** (update sent, waiting for a reply or confirmation).
2. **Meridian Capital (S1):** four differently worded reports become one suggested incident. Blast radius raises the priority from S2 to S1.
3. **Lotus Wealth:** "Quick question, nothing major". Low confidence asks a subject matter expert (SME) to check it, and nothing is pre-filled.
4. **Vega Markets:** a possible account compromise. The security rule raises the priority and routes it to security.
5. **Resolve one issue:** choose the team, pick a cause, assign the fix to the development team, edit the suggested reply if you like, set the next update time and send. The issue moves to the client lane. Click "The client answered" to bring it back, or close it.
6. **Rules:** change a category's automation level and return to Issues. Behaviour changes with no code change.
7. **Market open switch:** turn it off and see the priority floors change.
8. **Try your own report:** type a message at the bottom of the board.
9. **Results:** finish with the failures, not the successes.

## What It Does Not Yet Prove

- Language model quality, because a local classifier stands in
- Performance on real tickets, because all data is synthetic
- Time saved or engineer trust, because no user trial has been run
- Integration with ticketing, logs or release systems, because these are mocked
- Economics at scale. "Send" is simulated and nothing connects to a live system.

## Repeat the Evaluation

Requires Node.js. No packages are needed.

```bash
cd Prototype
node evaluate.js holdout
```

Results are written to `data/eval_results_holdout.json`. To rebuild the page after changing data or code:

```bash
node build.js
```

## Files

| File | Purpose |
|---|---|
| `index.html` | The demo, built into one file |
| `app.template.html` | Interface source |
| `engine.js` | Classifier, control logic, clustering, cause ranking, drafting |
| `evaluate.js` | Evaluation harness |
| `data/control_config.json` | Floors, levels and rules (the control layer) |
| `data/market_data_feed_delay.config.json` | Reuse test for the second category (paper only, not run) |
| `data/train.txt`, `data/test.txt` | Synthetic reports |
| `data/incidents.txt`, `data/deployments.txt`, `data/runbooks.json` | Synthetic catalogs |

All clients, tickets, incidents and releases are invented.

## Course Demos

No course demo was cloned. This prototype was written for this project.
