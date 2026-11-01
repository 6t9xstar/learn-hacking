[Repository home](../../README.md) / Additional topics / Threat intelligence

# Cyber Threat Intelligence

Cyber threat intelligence (CTI) is the discipline of turning information about adversaries into decisions: which risks to prioritize, which detections to build, which patches to accelerate, and which business processes need protection. It is not a feed subscription or a list of IP addresses. It is a process that starts with a question a decision-maker needs answered and ends with a product someone acts on.

This guide is for SOC analysts, detection engineers, incident responders, and security leaders who want to practice intelligence as a craft. It emphasizes public sources, structured analysis, and honest confidence levels, and it treats privacy and legal boundaries as part of the tradecraft rather than an afterthought.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Intermediate; writing and analytical rigor matter as much as tooling |
| Realistic time | 80–140 hours to produce competent tactical and operational products |
| Cost | Free with public sources and self-hosted tooling |
| Prerequisites | Networking, security fundamentals, OSINT discipline, clear writing |
| Lab requirement | Isolated MISP/OpenCTI instance; public data only; no live adversary engagement |
| Best for | SOC analysts, threat hunters, detection engineers, CTI analysts |

## Why this field matters

Security teams are overwhelmed by alerts and underwhelmed by context. A vulnerability scanner says a system is exposed; intelligence says whether the actor targeting your sector is exploiting that vulnerability this month. A detection rule fires on a suspicious IP; intelligence says whether that IP belongs to a ransomware affiliate or a scanner. CTI converts raw observation into prioritization.

Done well, intelligence shortens the gap between a report and a defensive action. It informs patching priorities, detection coverage, incident scoping, and executive risk conversations. Done badly, it produces indicator lists with no context, alerts that fire on harmless infrastructure, and briefs that repeat vendor marketing. The difference is method.

## What you will learn

- Run the intelligence cycle from requirements through feedback.
- Write priority intelligence requirements that are answerable and decision-relevant.
- Collect from public, internal, and commercial sources without crossing legal or ethical lines.
- Distinguish tactical indicators from operational and strategic intelligence.
- Use the Diamond Model, Cyber Kill Chain, and MITRE ATT&CK appropriately.
- Express confidence, surface bias, and avoid overclaiming.
- Share products correctly using TLP and structured formats.
- Close the loop from intelligence to detection and back.

## Prerequisites and honest expectations

You should understand how networks and endpoints generate telemetry, what an incident response workflow looks like, and how to read a vulnerability advisory. You do not need to be a malware reverse engineer, but you should know what a hash, domain, IP, and user-agent represent and why their durability differs.

Expect to write. A large part of the job is producing clear, concise assessments for busy readers. You will also spend time on data hygiene: normalizing feeds, deduplicating indicators, and deciding what not to collect. Intelligence work attracts people who like tools; the professionals are the ones who like questions.

## Core concepts

### The intelligence cycle

The intelligence cycle is a loop: direction, collection, processing, analysis, dissemination, and feedback. Direction sets the questions. Collection gathers raw data. Processing normalizes and enriches it. Analysis turns it into judgments. Dissemination delivers it to the right audience. Feedback tells you whether it was useful and starts the next cycle.

The cycle is a discipline, not a bureaucracy. Its value is that it forces you to start with a decision and end with an outcome. If a product does not change a decision, it is information, not intelligence. If a requirement cannot be answered with available sources, say so early rather than producing a confident-sounding guess.

### Requirements and priority intelligence requirements

A priority intelligence requirement (PIR) is a question tied to a decision, with a deadline and an owner. "What ransomware groups target healthcare?" is too broad. "Which ransomware families have targeted our region's hospitals in the last six months, and what initial access vectors did they use?" is answerable and leads to action.

Good requirements are specific, time-bound, and linked to a consumer. Below each PIR, essential elements of information define what evidence would answer it. Review requirements quarterly; a PIR that nobody uses is a signal to retire it, not to produce more reports about it.

### Sources and collection

Sources include internal telemetry (EDR, DNS, proxy, identity logs), public reporting (vendor blogs, government advisories, CERT notices), open-source data (WHOIS, passive DNS, certificate transparency), commercial feeds, and information-sharing communities such as ISACs. Each has different latency, reliability, and bias.

Evaluate sources with a structured scale such as the Admiralty system: reliability of the source (A–F) and credibility of the information (1–6). A vendor blog may be reliable about its own product and speculative about attribution. A government advisory may be authoritative but late. Record provenance so a future analyst can re-check the claim.

### Processing, standards, and enrichment

Raw collection is noisy. Processing normalizes formats, deduplicates indicators, resolves conflicting timestamps, and adds context such as ASN, geolocation, and malware family. STIX 2.1 is the common structured language for threats; TAXII 2.1 is a transport protocol for sharing collections. MISP and OpenCTI both speak STIX and provide their own data models.

Enrichment is not free. Every lookup sends data to a third party and may expose an investigation. Use private or self-hosted services for sensitive indicators, and record which enrichment source produced each fact. An indicator without a timestamp and source is nearly useless six months later.

### Tactical, operational, and strategic intelligence

Tactical intelligence supports immediate detection and response: hashes, domains, IPs, and specific techniques. It has a short shelf life and high volume. Operational intelligence describes campaigns, tools, and actor behavior over weeks or months; it supports hunting and detection engineering. Strategic intelligence addresses long-term risk, sector trends, and adversary intent for executives and planners.

The same event can produce all three. A new ransomware campaign yields hashes for the SOC, a technique profile for detection engineers, and a sector-risk assessment for leadership. Match the product to the consumer; a board does not need a hash list, and a SOC does not need a five-year geopolitical forecast.

### IOCs versus TTPs and the pyramid of pain

Indicators of compromise are observable artifacts: file hashes, domains, IP addresses, URLs, registry keys. They are easy to share and easy for adversaries to change. Tactics, techniques, and procedures describe how an adversary operates and are far more durable.

The pyramid of pain ranks indicators by how much difficulty changing them causes the adversary, from hash values at the bottom to TTPs at the top. Detection programs should invest upward: a rule for a specific hash catches one sample, while a behavioral detection for credential dumping can catch a family of tools. Indicators still matter for scoping and blocking, but they are not a strategy.

### Analysis frameworks: Diamond Model, Kill Chain, ATT&CK

The Diamond Model describes an intrusion event through four vertices: adversary, infrastructure, capability, and victim. It encourages pivoting: from a malware sample to the infrastructure it contacts, from that infrastructure to other victims, and from the capability to the actor. Meta-features such as timestamp and confidence keep the analysis honest.

The Cyber Kill Chain describes phases from reconnaissance through actions on objectives. It is useful for explaining where a defense intervenes. MITRE ATT&CK is a knowledge base of adversary tactics and techniques observed in the wild, with sub-techniques, mitigations, and detections. Use ATT&CK for coverage mapping and hunting hypotheses, not as a checklist that guarantees safety.

### Confidence, estimative language, and bias

Analysts are routinely wrong, and good products make that visible. Separate what you know from what you infer. Use consistent estimative language: "high confidence" should mean multiple independent, reliable sources and strong technical evidence; "moderate" means credible but incomplete; "low" means plausible but thin.

Beware anchoring on the first hypothesis, confirmation bias toward a preferred actor, and availability bias from the latest headline. Analysis of competing hypotheses (ACH) is a simple antidote: list plausible explanations, score the evidence for and against each, and look for the hypothesis that survives disconfirmation. State what would change your mind.

| Confidence | Evidence standard | Example phrasing |
| --- | --- | --- |
| High | Multiple independent reliable sources plus technical artifacts | "The actor almost certainly used the vulnerable VPN appliance" |
| Moderate | Credible reporting, some corroboration, gaps remain | "The actor likely obtained initial access through phishing" |
| Low | A single source or plausible inference without artifacts | "The campaign may be financially motivated" |

The words matter less than consistency. Define your scale in a style guide, use it the same way in every product, and explain any departure.

### TLP and information sharing

The Traffic Light Protocol (TLP) is a sharing convention, not a legal classification. TLP:CLEAR is public. TLP:GREEN is limited to the community. TLP:AMBER is limited to the organization and its clients, with TLP:AMBER+STRICT restricting it to the organization only. TLP:RED is for named recipients only.

Check the source's markings before forwarding anything. Do not strip a TLP marking, and do not assume a public report can be reshared with a client logo attached. When in doubt, ask the originator. Sharing communities work because members respect handling rules; one leak can end participation.

### Dissemination and product writing

A useful product leads with the bottom line. The BLUF (bottom line up front) states the judgment, the confidence, and the recommended action in the first few sentences. Key judgments follow, each with evidence and caveats. Technical details and indicators go in appendices for the readers who need them.

Know the audience. A SOC brief needs detection logic and triage guidance. An executive brief needs business impact, likelihood, and a decision. An incident response brief needs timelines and scoping data. One product cannot serve all three well; write short, targeted products instead of a single document that satisfies nobody.

### Platforms: MISP, OpenCTI, and STIX/TAXII

MISP is an open-source threat intelligence platform focused on event and attribute sharing, with taxonomies, galaxies, feeds, and sharing groups. It is widely used by CERTs and ISACs. OpenCTI is a knowledge graph platform built around STIX 2.1, with connectors and relationship modeling; it is strong for linking actors, campaigns, and observables.

STIX 2.1 defines objects such as indicator, malware, threat-actor, campaign, and relationship, plus sightings. TAXII 2.1 defines collections and channels for exchanging them. Both are standards, not products; understanding the data model makes migration and automation much easier than treating a platform as a black box.

### The detection feedback loop

Intelligence becomes valuable when it changes detection or response. The loop is: a report yields a hypothesis, the hypothesis becomes a detection (Sigma for logs, YARA for files, a SIEM query for behavior), the detection is tested against known-good and known-bad telemetry, and the results feed back to the analyst.

Track which intelligence products produced detections, which detections fired, and which were false positives. This is how a CTI program proves value and improves. A feed that never changes a rule or a decision is expensive noise, even if it is free.

## Writing a CTI brief

A two-page brief is a good first product. Use this structure:

1. **Header.** Title, date, author, TLP marking, and distribution list.
2. **BLUF.** Two or three sentences: what happened, why it matters to this audience, and what to do.
3. **Key judgments.** Three to five bullets, each with a confidence level and the evidence behind it.
4. **Assessment.** The narrative: actor, campaign, infrastructure, capability, victimology, and timeline.
5. **Technical details.** ATT&CK mapping, indicators with context and first-seen dates, and detection opportunities.
6. **Recommendations.** Specific, owner-assigned actions, with priority and expected effort.
7. **Sources and confidence.** Citations, source reliability, gaps, and what would change the judgment.

Keep the language precise. "The actor likely exploited the VPN appliance" is a judgment; "a log shows a successful login from a new ASN" is an observation. Do not blur the two.

## Legal and safe practice

> Intelligence work touches personal data, third-party platforms, and sometimes criminal markets. Authorization and privacy law apply.

Use public sources and internal telemetry you are permitted to access. Do not dox individuals, publish personal information, or attribute a campaign to a named person without strong evidence and a legal basis. Avoid interacting with threat actors, purchasing criminal data, or accessing leaked datasets; these actions can create legal, safety, and ethical problems for you and your employer.

Respect platform terms of service and rate limits when collecting OSINT. Keep collected personal data to the minimum needed, store it securely, and delete it when the requirement expires. Follow your organization's data handling policy and applicable privacy law such as the GDPR. If an investigation may lead to law enforcement action, involve legal counsel early. Read [ETHICS.md](../../ETHICS.md) before any collection activity.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Foundations | Intelligence cycle, requirements, sources | A one-page PIR set for a fictional company |
| 2. Collection and processing | OSINT discipline, enrichment, STIX basics | A normalized indicator set with provenance |
| 3. Analysis | Diamond Model, kill chain, ATT&CK, ACH | An assessment with confidence and alternatives |
| 4. Production | BLUF writing, audience tailoring, TLP | A two-page tactical brief |
| 5. Feedback | Detection mapping and validation | A Sigma rule derived from the brief, with test results |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Cyber Threat Intelligence](https://www.coursera.org/learn/cyber-threat-intelligence) | IBM via Coursera | Beginner | Free to audit; certificate paid | Some | CTI concepts, actors, and intelligence lifecycle |
| [Getting started with ATT&CK](https://attack.mitre.org/resources/getting-started/) | MITRE | Beginner | Free | No | How to use tactics, techniques, and Navigator layers |
| [MISP training materials](https://github.com/MISP/misp-training) | MISP project | Intermediate | Free | Yes, with a local instance | Event creation, sharing, taxonomies, and feeds |
| [OpenCTI documentation](https://docs.opencti.io/) | OpenCTI | Intermediate | Free | Yes, with a local instance | Knowledge graph modeling and STIX workflows |
| [OASIS CTI documentation](https://oasis-open.github.io/cti-documentation/) | OASIS | Intermediate | Free | No | STIX and TAXII specifications and examples |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [NIST SP 800-150](https://csrc.nist.gov/pubs/sp/800/150/final) | NIST | A guide to cyber threat information sharing |
| [CISA Traffic Light Protocol](https://www.cisa.gov/tlp) | CISA | The canonical TLP definitions and usage rules |
| [STIX/TAXII documentation](https://oasis-open.github.io/cti-documentation/) | OASIS | Structured threat data and transport standards |
| [MISP documentation](https://www.misp-project.org/documentation/) | MISP project | Platform concepts, data model, and sharing |
| [OpenCTI documentation](https://docs.opencti.io/) | OpenCTI | Knowledge graph and connector architecture |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Adversary tactics and techniques with detections |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [MISP Docker](https://github.com/MISP/MISP) | MISP project | Free, self-hosted | Run on an isolated host; use synthetic events for practice |
| [OpenCTI Docker](https://github.com/OpenCTI-Platform/opencti) | OpenCTI | Free, self-hosted | Isolated deployment; do not ingest sensitive client data |
| [ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/) | MITRE | Free, browser | Build coverage layers; no live systems involved |
| [CyberDefenders](https://www.cyberdefenders.org/) | CyberDefenders | Free account | Blue-team challenges with public artifacts |
| [URLhaus](https://urlhaus.abuse.ch/) | abuse.ch | Free | Use the API for enrichment; do not contact malicious URLs |

## Essential open-source tools

Intelligence tools store and connect knowledge. The analysis, sourcing, and writing remain human work.

| Tool | Purpose | Link |
| --- | --- | --- |
| MISP | Threat sharing platform with events, attributes, and feeds | [misp-project.org](https://www.misp-project.org/) |
| OpenCTI | STIX-native knowledge graph for threat intelligence | [docs.opencti.io](https://docs.opencti.io/) |
| ATT&CK Navigator | Visualize and compare technique coverage | [mitre-attack.github.io](https://mitre-attack.github.io/attack-navigator/) |
| stix2 | Python library for creating and parsing STIX objects | [github.com/oasis-open/cti-python-stix2](https://github.com/oasis-open/cti-python-stix2) |
| Sigma | Vendor-neutral detection rule format | [github.com/SigmaHQ/sigma](https://github.com/SigmaHQ/sigma) |
| YARA | Pattern matching for malware and files | [github.com/VirusTotal/yara](https://github.com/VirusTotal/yara) |
| VirusTotal | File and URL reputation and pivoting | [virustotal.com](https://www.virustotal.com/) |

## Practical projects and exercises

### Project 1: Public-source CTI brief

Objective: produce a two-page intelligence brief on a publicly documented campaign.

Constraints: choose a government advisory or a vendor report about a campaign, not an individual. Use only public sources. Do not include personal data, and do not attempt to contact infrastructure or actors. Assign TLP:CLEAR.

Deliverable: a brief with BLUF, key judgments, ATT&CK mapping, indicators with context, confidence statements, and three defensive recommendations. Add a source table with reliability ratings and a short section on what you could not determine. This is the core portfolio artifact for CTI roles.

### Project 2: MISP event and STIX export

Objective: model the campaign from Project 1 as structured intelligence.

Constraints: run MISP locally, create an event with attributes, objects, galaxies, and tags. Include first-seen timestamps and sources. Export to STIX 2.1 and validate that relationships survive the round trip.

Deliverable: a screenshot-free export bundle, a data-model diagram, and a short note on what was lost or ambiguous in translation. Understanding the limits of the data model is more valuable than a perfect demo.

### Project 3: Detection feedback loop

Objective: turn one intelligence claim into a tested detection.

Constraints: write a Sigma rule for a behavior in the brief, map it to an ATT&CK technique, and test it against synthetic or public telemetry. Do not run it against production without approval.

Deliverable: the rule, a test plan, results including false positives, and a recommendation to deploy, tune, or reject. Close with what you would tell the intelligence analyst who wrote the original report.

## Common mistakes and misconceptions

- Treating a feed subscription as a CTI program. Feeds provide data; analysis provides intelligence.
- Publishing indicator lists without timestamps, context, or confidence.
- Attributing an attack to a named group or country based on weak infrastructure overlap.
- Forgetting that TLP is a sharing convention, not a legal or contractual classification.
- Collecting personal data because it is available, without a requirement or legal basis.
- Writing long reports with no BLUF and no recommended action.
- Mapping every technique in ATT&CK and calling it coverage, without testing detections.
- Never measuring whether intelligence changed a decision or a detection.

## Career paths and roles

CTI analysts produce tactical, operational, and strategic intelligence for SOCs, CERTs, and industry groups. Threat hunters use intelligence to form and test hypotheses in telemetry. Detection engineers translate behavior into durable rules. Incident responders use intelligence for scoping and attribution support. Strategic analysts advise leadership on sector risk. Researchers study actor tooling and campaigns in depth.

Entry points include SOC analysis, malware analysis, OSINT, and intelligence analysis from other domains. A portfolio with two well-sourced briefs, an ATT&CK coverage layer, and a detection derived from intelligence is compelling. Expect interviews to include a writing exercise, a source-evaluation question, and a discussion of how you handle uncertainty.

## Next steps

- Write one PIR and one two-page brief from public sources.
- Stand up MISP locally and model a campaign with sources and timestamps.
- Build an ATT&CK Navigator layer for a system you know and mark the gaps.
- Convert one intelligence claim into a Sigma rule and test it.
- Continue with the [blue team engineer roadmap](../../roadmaps/blue-team-engineer.md) and [advanced training grounds](../../resources/training-grounds/advanced.md).

## References

- NIST, [Guide to Cyber Threat Information Sharing (SP 800-150)](https://csrc.nist.gov/pubs/sp/800/150/final).
- CISA, [Traffic Light Protocol](https://www.cisa.gov/tlp).
- OASIS, [STIX/TAXII documentation](https://oasis-open.github.io/cti-documentation/).
- MISP project, [Documentation](https://www.misp-project.org/documentation/).
- OpenCTI, [Documentation](https://docs.opencti.io/).
- MITRE, [ATT&CK](https://attack.mitre.org/).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
