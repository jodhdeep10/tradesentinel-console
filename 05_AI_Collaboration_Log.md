# AI Collaboration Log

Team013 (Individual) · Jodhdeep Singh · 2025mb26112

## How I Worked With AI

I worked as the product manager and used an AI assistant to build and draft. The problem, the first wedge, the trust ladder, the guardrails, the payoff matrix and the decision gates come from my October proposal, which I wrote before this work started. For each later piece of work, I gave the assistant a brief. I reviewed what came back, in live demos for the prototype, and then either accepted it or sent it back with specific changes. This log records the prompts I actually used, what the assistant produced, and what I changed.

## Tools Used

- **Claude Code (Claude Opus 5.5), in the Claude desktop app:** prototype code, synthetic data, evaluation harness, first drafts of the documents and deck, and the GitHub Pages set-up.
- **[Other tools, including any AI used for the October proposal, or "None"]**

## Where AI Helped

| Area | What the assistant did | My role |
|---|---|---|
| Discovery | Mapped the packet's requirements to a deliverables checklist | Chose the topic, user and wedge in my proposal |
| Drafting | First drafts of the report, executive summary, PRD, roadmap, risk note and deck | Set the structure: first the packet's required files, then one page per section for GitHub |
| Wireframing | First console layout and low-fidelity wireframes | Rejected the crowded first version; specified two lanes and three plain steps |
| Coding | Prototype interface, decision engine and evaluation harness | Wrote the product requirements, reviewed demos and accepted each round |
| Data | All synthetic training, test and catalog data | Accepted it as synthetic, with its limits disclosed |
| Metrics | Evaluation design, baseline comparison, calibration and scenario arithmetic | Supplied the payoff values and the break-even logic in my proposal |
| Risk review | First draft of the risk register, harm scenarios and launch blockers | Supplied the escalate-only rule and the never-allowed list in my proposal |
| Hosting | Created the GitHub repository and the Pages site | Chose public hosting, signed in to GitHub and approved the public repository |

## Example Prompts or Workflows

These are prompts I actually gave, lightly corrected for spelling.

**Prompt 1: brief for the package.** *"I have the attached assignment to complete. I have also attached the guidelines and the requirements for it. Can you create the documents in the same format as the proposal, and the other required things too?"* I attached my proposal and the course packet.
- **Output:** a draft of every required deliverable, plus a working prototype with a measured evaluation.
- **My review:** I kept the proposal's format and recommendation logic, and moved on to the product itself.

**Prompt 2: hosting decision.** *"Can you host this site on GitHub and then make the changes wherever required?"*
- **Output:** two choices to decide. I chose to install the GitHub CLI and to make the repository public, then signed in myself.

**Prompt 3: UX correction.** *"The dashboard is very complex and congested. Can we make it look more aesthetic, with no complexity? The triage queue is good, but the dashboard should show the issues with the user in a separate area and the ones with the client in a separate area. Please keep it simple."*
- **Output:** a home board with two lanes, "With your team" and "With the client", and a three-step issue page.
- **My judgment:** a support desk's first question is who must act next, not how the model scored the issue. The decision logic did not change, so the evaluation still applies.

**Prompt 4: review gate before publishing.** *"Can you show me the demo, then push the code to GitHub and update the hosted prototype site?"*
- **Output:** a walkthrough of the redesigned console, followed by the push to the live site. I reviewed it first and then gave the corrections in Prompt 5.

**Prompt 5: domain corrections.** *"Instead of senior engineer, it can be a subject matter expert (SME), and fixes can be assigned to the development team. Please check the URL in the GitHub README; I don't think it is correct. The responses sent to the client should be editable. The language on the console should be less complex. Also, improve the overall look of the console."*
- **Output:** the SME role, a "Assign fix to the development team" step, an editable reply, plainer labels and a cleaner layout.
- **On the README link:** it was checked and found working, and it was made clearer.

**Prompt 6: documentation structure.** I asked for the documents to be split by the packet sections I listed (Product Strategy 2.1 to 2.6, PM Artifact Pack 3.1 to 3.6, UX 4.1 to 4.6, Data 5.1 to 5.3 and so on), in Markdown so that they read well on GitHub, with the PDF versions kept. I also asked that the AI-use documents show my product-management role accurately.
- **Output:** the Documentation folder, Markdown copies of every deliverable, and this log.

## Where AI Was Weak or Wrong

**Found in my reviews:**
- **Crowded first interface.** The first console showed everything at once and was hard to scan under pressure.
- **Generic roles.** The draft used "senior engineer" as the escalation point and implied that engineers run fixes themselves. That is not how a support desk is organised: an SME judges, and the development team applies fixes.
- **Fixed client replies.** Drafts could only be approved, not edited, which no real support engineer would accept.
- **Technical wording.** Console labels used internal terms that a new engineer would not follow.

**Found by checks on the AI's own work:**
- **It marked its own homework.** The same assistant wrote the training data, the test data and the incident catalog, so shared vocabulary probably flatters every result. The 100% clustering score in particular should not be trusted.
- **Invented inputs.** Volumes, costs, hourly rates and token prices are illustrative assumptions, not data from a real firm. They are labelled as assumptions throughout.
- **Case references from general knowledge.** The Netflix, Instacart, Apple Card and iMerit points were not checked against the course case notes.
- **Overconfidence on short reports.** "Getting error 2047 when I enter" scores 95% confidence. This is disclosed and not yet fixed.
- **No real-world grounding.** No interviews took place and no real tickets were read, so personas and workflow details are reasoned, not observed.

## Human Corrections

| What I changed | Why | Judgment applied |
|---|---|---|
| Home board split into "With your team" and "With the client" | The first board mixed issues waiting on clients with issues needing action | Organise the screen around who acts next |
| "Senior engineer" replaced by the subject matter expert (SME) | Escalation in a support desk goes to domain experts, not to seniority | Match the product to the real organisation |
| Fixes assigned to the development team | Support should not change production; developers apply fixes through change control | Keep the separation of duties that protects production |
| Client replies made editable, with Send still locked while blanks remain | Engineers must own the words sent to a client, but must not send unproven claims | Human control over client communication, without weakening the guardrail |
| Plainer console language | Under time pressure, unclear labels cause errors | Usability is a safety feature here |
| Demo review before every push to the live site | Nothing should be published that I had not seen | A review gate on my own release process |
| Documentation reorganised by packet section, in Markdown | Assessors and readers should find each required element directly | Make the artifacts usable, not just complete |

## Checks Built Into the Work

- The held-out test was run only after the settings were frozen, and its failures were reported instead of tuned away.
- The proposal's break-even of about 0.3% was re-derived and confirmed: 190 / 55,190 = 0.34%.
- One inconsistency in the proposal was flagged: a false escalation was described as "a few minutes" of work but priced at USD 150. The higher figure was kept, because it works against the case, and a higher value was tested for sensitivity.
- After the test results, the recommendation was narrowed from the proposal's "Proceed" to "pilot, shadow mode only", because Gate 1 is only partly met.
- The claim that a new category is "only configuration" was weakened after the paper reuse test found two engine changes that would be needed.

## Decisions Not Outsourced

| Decision | My position |
|---|---|
| Opportunity choice | TradeSentinel on the order-entry and execution flow, chosen in my proposal |
| Risk acceptance | Under-triage is the unacceptable risk; false escalations are accepted as the price of safety |
| Launch recommendation | Pilot in shadow mode only; do not scale until Gate 2 |
| Monetization judgment | Internal value case; no external sale until reuse is proven |
| Governance claims | Controls and launch blockers as stated; no legal or regulatory claim without compliance review |

## Final Reflection

- **Where AI accelerated PM work:** it turned a written proposal into a working prototype and a full document set fast enough that I could spend my time reviewing and correcting rather than producing. Measured results were available before the documents were written, so the recommendation rests on evidence rather than intent.
- **Where AI could not replace PM reasoning:** it did not know how a support desk is organised, who should be allowed to change production, or what an engineer under pressure needs to see first. Each of those came from my corrections. It also could not decide what risk is acceptable or whether to recommend a pilot. Those decisions are mine, and I can defend them.
