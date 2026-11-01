[Home](../README.md) / SOC and Blue Team

# SOC and Blue Team

A security operations center (SOC) is the team and the machinery that watches an organization's technology for signs of compromise, decides what matters, and drives the response. "Blue team" is the informal name for the defensive side of security work: monitoring, detection engineering, incident response, threat hunting, and the unglamorous engineering that makes all of it reliable.

This guide is for learners who want to work in a SOC, for IT administrators who have inherited monitoring duties, and for offensive practitioners who want to understand how their actions appear to defenders. It assumes you can read logs and are comfortable on a command line, but it does not assume prior SOC experience.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Beginner to advanced; tier 1 triage is entry level, detection engineering and hunting are senior |
| Realistic time | 6-12 months of consistent study and lab work to be interview-ready for tier 1 |
| Cost | Free to learn; commercial SIEMs and EDRs are paid, but open-source equivalents exist |
| Prerequisites | Networking fundamentals, operating system basics (Windows and Linux), basic scripting |
| Lab requirement | Essential. A small home lab with a SIEM, one Windows VM, one Linux VM, and synthetic attacks |

## Why this field matters

Most organizations do not detect breaches because they lack tools. They detect them late because nobody connected the evidence, nobody owned the alert, or the detection was never tested. A SOC converts raw telemetry into decisions: is this malicious, how far did it spread, what do we do in the next hour, and how do we prevent a repeat?

The work has a real defensive payoff. A well-tuned detection can catch a ransomware operator during reconnaissance. A careful analyst can distinguish a legitimate administrator using remote access from an attacker using the same tool. Good evidence handling can turn a messy alert into a defensible incident timeline. Those skills are scarce and portable across every industry.

It is also honest to say the job has friction: alert queues, false positives, night shifts in some organizations, and the emotional weight of responding to a real intrusion. The best preparation is hands-on triage practice, not tool certificates alone.

## What you will learn

- How a SOC is organized, how work flows between tiers, and where automation helps.
- How logs travel from endpoints and network sensors into a SIEM, and why pipelines fail silently.
- How to write, test, tune, document, and retire detection rules.
- How to triage an alert with enough evidence to justify a disposition.
- How to use MITRE ATT&CK as a map for coverage and threat hunting.
- How the incident response lifecycle works, from preparation to post-incident review.
- Which Windows, Linux, and network telemetry sources answer which questions.
- How to produce incident notes and reports that another analyst can trust.

## Prerequisites and honest expectations

You should be able to explain TCP/IP, DNS, HTTP, and the difference between authentication and authorization. You should be able to navigate Windows Event Viewer and a Linux shell. Basic Python, PowerShell, or Bash makes detection work much easier; you do not need to be a developer, but you do need to read code and query data.

Expect the first month of a real SOC to feel like drinking from a firehose. Tools differ, but the reasoning transfers. Do not chase a SIEM vendor certification before you can explain what a false positive is and how you would prove it. Also expect to write: triage notes, detection documentation, and post-incident findings are a large part of the job.

## Core concepts

### 1. The SOC as a socio-technical system

A SOC is not a room full of screens. It is a set of agreements: what is monitored, what counts as an incident, who may isolate a host, how evidence is preserved, and when to escalate to legal or communications. Technology supports those agreements. When a SOC fails, the cause is often an unclear ownership boundary rather than a missing tool. Learn to ask "who owns this decision?" as often as "which query should I run?".

### 2. Tiers, roles, and escalation

Many SOCs use a tiered model. Tier 1 triages alerts, enriches them, and closes obvious false positives. Tier 2 investigates, contains, and coordinates remediation. Tier 3 handles complex intrusions, malware analysis, hunting, and detection engineering. Small organizations blend these roles; large ones split them further into queue management, threat intelligence, and DFIR.

The tiers are a workload design, not a hierarchy of worth. A tier 1 analyst who documents a clean disposition and spots the one anomalous field is doing high-value work. Escalation criteria should be written down: what evidence forces a tier 2 review, what triggers an incident declaration, and who can authorize containment.

### 3. Telemetry: collection before detection

Detection is downstream of collection. Before writing a rule, ask whether the necessary event exists, whether it is enabled by default, how long it is retained, and what fields it contains. A common failure is designing a detection for an event that the organization never logs, or logging it on 10 percent of endpoints.

Telemetry quality dimensions worth tracking: coverage (which assets), completeness (gaps, dropped events), latency (event time to search time), fidelity (how much noise), retention (how far back), and cost. Document the answers. A detection catalog without a data source inventory is fiction.

### 4. Log pipelines and the SIEM

A typical pipeline is: endpoint agent or network sensor, transport, parser or normalization, enrichment, index or data lake, detection engine, case management. The SIEM is the query and correlation layer, not the whole pipeline.

Normalization matters because the same event arrives in different shapes. Common schemas such as Elastic Common Schema (ECS) and Open Cybersecurity Schema Framework (OCSF) give fields consistent names, so a rule can refer to `source.ip` rather than five vendor-specific paths. Enrichment adds asset criticality, identity context, geolocation, and threat intelligence. Watch for backpressure, parsing failures, clock skew, and ingestion gaps; these create blind spots that look like quiet days.

### 5. Detection engineering

Detection engineering is software development with an adversarial customer. A workable lifecycle is: hypothesis, data check, rule authoring, positive test, negative test, tuning, documentation, deployment, monitoring, and retirement.

Good rules carry metadata: a stable ID, title, description, severity, log source, required fields, known false positives, response guidance, ATT&CK mapping, author, and test evidence. Sigma is a vendor-neutral rule format that many SIEMs can translate; it is useful for sharing logic without sharing a specific query language. Rules should be version-controlled and reviewed like code. A rule that nobody can explain during an incident is technical debt.

### 6. Alert triage and evidence quality

Triage is a decision under uncertainty. A repeatable sequence: read the alert, confirm the rule fired as intended, pull the raw event, enrich with asset and identity context, check for related events before and after, decide a disposition, and document why.

Useful dispositions include true positive, false positive, benign true positive (expected activity that matched), and inconclusive with a follow-up task. "Closed" is not an explanation. Evidence should be preserved as close to raw as possible: event IDs, timestamps in UTC, host identifiers, hashes, and the query used. Screenshots are supporting material, not primary evidence. Chain of custody and legal hold requirements vary by organization and jurisdiction; learn yours before an incident.

### 7. MITRE ATT&CK as a map

ATT&CK is a knowledge base of adversary tactics, techniques, and sub-techniques observed in the real world. Tactics are the "why" (initial access, persistence, privilege escalation); techniques are the "how" (phishing, scheduled task, credential dumping). It is a map, not a checklist, and it is not a maturity score.

Use ATT&CK to structure detection coverage conversations, map hunts, and compare an incident to known behavior. Each technique page lists data sources that can support detection. A coverage heat map is only meaningful when paired with evidence that the detection actually fires; otherwise it measures ambition, not capability.

### 8. Threat intelligence and the intelligence cycle

Threat intelligence is information that has been collected, evaluated, and contextualized for a decision. The intelligence cycle runs: requirements, collection, processing, analysis, dissemination, and feedback. Most teams need tactical indicators (hashes, domains, IPs), operational context (campaigns, tooling), and strategic awareness (sector targeting).

Indicators decay. A file hash is useful until the file changes; an IP is useful until infrastructure rotates. The Pyramid of Pain captures this: hashes and IPs are cheap for an adversary to change, while tactics, techniques, and procedures are expensive. Share indicators with terms such as TLP (Traffic Light Protocol) and use platforms like MISP to store, correlate, and exchange them with partners. Never block on a low-confidence indicator without checking context.

### 9. Threat hunting

Threat hunting is proactive, hypothesis-driven search through data for activity that existing detections missed. A hunt starts with a question grounded in intelligence or an attack technique: "Do we see any process making outbound connections shortly after a scheduled task is created?" The deliverable is not only "found or not found"; it is a new detection, a data gap, or a documented reason the behavior is impossible in this environment.

Hunts should be time-boxed and written up. Track hypotheses, data sources, queries, findings, and follow-up actions. A hunt that finds nothing but closes a coverage gap has succeeded.

### 10. Incident response lifecycle

NIST Special Publication 800-61 Revision 3 is the current US guidance for incident response. It frames response around governance and continuous improvement, aligned with the NIST Cybersecurity Framework, and retains the operational rhythm most teams recognize: prepare, detect and analyze, contain/eradicate/recover, and learn from the incident.

In practice: preparation covers playbooks, contacts, access, backups, and exercises. Detection and analysis covers validation, scoping, and severity. Containment options range from blocking an indicator to isolating a host to disabling an identity, each with a blast-radius tradeoff. Eradication removes the cause, recovery restores service with monitoring, and the post-incident review captures what changed. Document decisions and their rationale as you go; memory is not evidence.

### 11. Windows telemetry

The Security event log is the backbone of Windows detection. High-value events include 4624 (logon), 4625 (failed logon), 4648 (explicit credential use), 4672 (special privileges assigned), 4688 (process creation, only useful with command-line auditing enabled), 4720 (account created), 4768 (Kerberos TGT request), 4769 (service ticket request), and 4771 (Kerberos pre-authentication failure).

Sysmon adds endpoint detail: process creation with hashes and parent process (Event ID 1), network connections (3), image loads (7), remote thread creation (8), process access (10), file creation (11), registry changes (12-14), DNS queries (22), and file deletion (23). PowerShell script block logging (4104) and module logging add visibility into a frequently abused interpreter. More logging is not automatically better; each source adds volume, privacy exposure, and tuning work.

### 12. Linux and network telemetry

On Linux, `auditd` records syscalls, execs, and file access; `journald` and syslog collect service and authentication events; shell history and process accounting fill gaps. Modern environments add eBPF-based sensors for runtime behavior. Key questions: who authenticated, from where, what executed, what changed, and what talked to the network.

On the network, Zeek produces rich connection, DNS, HTTP, TLS, and file logs. Suricata provides signature alerts and flow records. NetFlow or IPFIX gives traffic summaries without payload. DNS and proxy logs often reveal command-and-control earlier than endpoint logs. Encryption limits payload inspection, so metadata, JA3/JA4 fingerprints, and endpoint telemetry matter more than ever.

### 13. EDR and endpoint response

Endpoint detection and response (EDR) agents collect process, file, registry, network, and memory telemetry, apply behavioral detections, and offer response actions such as network isolation, process termination, and artifact collection. EDR is powerful but not omniscient: coverage varies by operating system, user-mode hooks can be bypassed, and tamper protection can block your own response actions if misconfigured.

Learn the console and the underlying data. Analysts who only click "isolate" without capturing volatile evidence lose information they cannot recover. Know what the agent does not record before you claim a host is clean.

### 14. Detection validation and purple teaming

A detection is a hypothesis until it is tested. Atomic Red Team provides small, mapped tests that emulate specific ATT&CK techniques; CALDERA can automate adversary emulation in a lab. Run a test, confirm the telemetry arrived, confirm the rule fired, measure time to detect, and record the result. Purple teaming is the structured conversation between offensive and defensive practitioners that turns test results into better detections.

Do this only in environments you own or are explicitly authorized to test. Production validation requires a change record, a scope, and a rollback plan.

## Legal and safe practice

Monitoring is regulated. Employee privacy law, works councils, sector rules, and data protection regimes constrain what you may collect and how long you keep it. A SOC should operate under a documented monitoring notice and retention policy, not ad hoc curiosity.

For learners: use isolated virtual machines, synthetic logs, and public challenge platforms. Never scan or test systems you do not own or have written permission to test. Malware samples belong in an isolated analysis environment; do not run them on your workstation or upload sensitive incident data to random scanners.

Evidence handling has real consequences. Preserve originals, work from copies, record hashes and timestamps, and follow your organization's legal hold process. If an incident may become a legal matter, involve legal early rather than reconstructing the chain of custody later.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations | Networking, OS internals, logs | Complete a networking refresher and learn to read Windows Security and Linux auth logs | A one-page explanation of a 4624 event and an SSH login, with field meanings |
| 2. Telemetry | Build a small lab | Install Wazuh or Elastic, enroll a Windows VM with Sysmon and a Linux VM with auditd | A data source inventory table with coverage, latency, and retention |
| 3. Detection | Write and test rules | Convert three behaviors into Sigma rules, test with Atomic Red Team | Three tested rules with positive and negative evidence |
| 4. Triage | Work realistic alerts | Complete CyberDefenders, BTLO, and KC7 investigations | Ten documented dispositions with evidence and reasoning |
| 5. Response | Run an incident | Write a playbook for one scenario and exercise it in the lab | An incident report with timeline, decisions, and lessons learned |
| 6. Hunting | Hypothesis-driven search | Run two hunts against your lab data and map results to ATT&CK | A hunt report and an updated coverage map |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [LetsDefend](https://letsdefend.io/) | LetsDefend | Beginner | Freemium; a subset of courses and challenges are free, full paths need an account/paid plan | Yes | SOC analyst simulations with alert triage and case review |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Beginner to intermediate | Free account; challenge labs are free | Yes | Blue team CTF-style investigations across endpoint and network artifacts |
| [Blue Team Labs Online](https://blueteamlabs.online/) | BTLO | Beginner to advanced | Freemium; some challenges free, subscription unlocks more | Yes | Scenario-based investigations and reporting practice |
| [TryHackMe SOC paths](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; introductory rooms free, paths require subscription | Yes | Guided rooms on SIEM, Splunk, Wireshark, and incident response |
| [KC7](https://kc7cyber.com/) | KC7 | Beginner | Free | Yes | KQL-based investigations in a game-like environment |
| [Splunk free courses](https://www.splunk.com/en_us/training/free-courses/overview.html) | Splunk | Beginner to intermediate | Free account required | Yes, in Splunk lab environments | Search processing language and security use cases, with vendor-specific depth |
| [Security Onion documentation](https://docs.securityonion.net/) | Security Onion Solutions | Intermediate | Free documentation and open-source platform | Yes, self-hosted | A full network security monitoring stack with Zeek, Suricata, and Elastic |

## Official documentation and standards

- [NIST SP 800-61r3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — the current incident response guidance, aligned with the NIST Cybersecurity Framework.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — the governance and risk vocabulary many response programs are mapped to.
- [MITRE ATT&CK](https://attack.mitre.org/) — adversary tactics and techniques with detection data sources.
- [Microsoft advanced auditing documentation](https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624) — event-level reference for Windows Security logs; use the event list to look up IDs you encounter.
- [Sysmon documentation](https://learn.microsoft.com/sysinternals/downloads/sysmon) — configuration and event reference for the most common Windows endpoint sensor.
- [CISA federal incident and vulnerability response playbooks](https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks) — practical, reusable response structure.
- [Sigma specification and rule repository](https://github.com/SigmaHQ/sigma) — vendor-neutral detection rule format and a large rule corpus.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [CyberDefenders](https://cyberdefenders.org/) | Investigation challenges | Free | Evidence is provided; no live systems are attacked |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Scenario challenges | Freemium | Platform-hosted artifacts only |
| [LetsDefend](https://letsdefend.io/) | SOC simulation | Freemium | Simulated alerts in a hosted environment |
| [TryHackMe](https://tryhackme.com/) | Guided rooms and paths | Freemium | Use the provided target machines, never public IPs |
| [KC7](https://kc7cyber.com/) | KQL investigations | Free | Synthetic datasets in a hosted environment |
| [Security Onion](https://docs.securityonion.net/) | Self-hosted NSM lab | Free, self-hosted | Keep the lab on an isolated virtual network |

## Essential open-source tools

Tools do not replace methodology. A SIEM with a hundred connectors and no documented detection logic is a log archive. Learn the question first, then the tool.

| Tool | Purpose | Official link |
| --- | --- | --- |
| Wazuh | Open-source SIEM and endpoint security platform with agents, decoders, and rules | [wazuh.com](https://wazuh.com/) |
| Elastic Security | SIEM, EDR, and detection rules on the Elastic Stack | [elastic.co/security](https://www.elastic.co/security) |
| Sigma | Vendor-neutral detection rule format plus a large community rule set | [github.com/SigmaHQ/sigma](https://github.com/SigmaHQ/sigma) |
| Velociraptor | Endpoint visibility and DFIR collection at scale | [docs.velociraptor.app](https://docs.velociraptor.app/) |
| Zeek | Network security monitor producing structured connection and protocol logs | [zeek.org](https://www.zeek.org/) |
| Suricata | High-performance network IDS, IPS, and flow logging | [suricata.io](https://suricata.io/) |
| MISP | Threat intelligence sharing and correlation platform | [misp-project.org](https://www.misp-project.org/) |
| TheHive and Cortex | Case management and observable analysis for incident response | [thehive-project.org](https://thehive-project.org/) |
| Chainsaw | Fast Sigma-based hunting over Windows event logs | [github.com/WithSecureLabs/chainsaw](https://github.com/WithSecureLabs/chainsaw/) |

## Practical projects and exercises

### Exercise 1: Build a minimum viable SOC lab

Objective: stand up Wazuh or Elastic, enroll one Windows virtual machine with Sysmon and one Linux virtual machine with auditd, and generate controlled activity.

Constraints: keep everything on a host-only or internal virtual network; take snapshots before installing agents; do not expose the SIEM to the internet.

Deliverable: a lab notebook containing the architecture diagram, agent enrollment steps, a data source inventory with coverage and retention, and five screenshots of real events (one logon, one process creation, one network connection, one Linux sudo event, one file change).

### Exercise 2: Triage ten alerts and defend every disposition

Objective: complete ten investigations on CyberDefenders, BTLO, or LetsDefend and document each one as if it were a production ticket.

Constraints: use only the provided evidence; record the exact query or filter used; do not rely on a platform's answer key until after writing your own conclusion.

Deliverable: an incident notebook with one row per alert: alert name, rule logic, raw evidence, enrichment, disposition (true positive, false positive, benign true positive, inconclusive), reasoning, and follow-up action. Add a one-paragraph reflection on which alert was hardest to decide and why.

### Exercise 3: Detection engineering portfolio piece

Objective: emulate three ATT&CK techniques with Atomic Red Team in your lab, then build and test Sigma rules that detect them.

Constraints: run tests only against lab VMs you own; capture logs before and after; include at least one test that your first rule misses, then improve the rule and document the false negative.

Deliverable: a public-safe report containing the technique IDs, test commands (redacted if needed), before/after log excerpts, rule YAML, translation to your SIEM, test results, false-positive analysis, and a coverage table. This is a strong interview artifact because it shows the full detection lifecycle rather than a screenshot of a dashboard.

## Common mistakes and misconceptions

1. **Buying tools before defining questions.** A SIEM does not tell you what matters. Start with the decisions the SOC must make and the evidence needed for them.
2. **Treating alert closure as success.** Closing 200 alerts without documented reasoning hides missed detections. Measure quality, not just queue throughput.
3. **Confusing ATT&CK coverage with detection capability.** A colored heat map is a planning tool. Without test evidence, it is decoration.
4. **Ignoring data quality.** Dropped events, clock skew, and disabled audit policies produce false confidence. Monitor the pipeline as a system.
5. **Over-relying on indicators.** Blocking a hash or IP feels productive but rarely stops a determined adversary. Behavior-based detection and hunting scale better.
6. **Skipping the negative test.** A rule that fires on everything is not a detection. Test both malicious and benign activity before deployment.
7. **Losing volatile evidence during containment.** Isolating a host is sometimes right, but capture memory and relevant logs first when feasible.
8. **Writing for yourself instead of the next analyst.** Notes that assume context will be useless at 3 a.m. during handover. Write for the stranger who inherits the case.
9. **Ignoring privacy and legal constraints.** Monitoring without a lawful basis creates organizational risk that outweighs most detections.

## Career paths and roles

Common entry points are SOC analyst tier 1, security operations technician, and IT security administrator with monitoring duties. From there, analysts specialize into incident response, threat hunting, detection engineering, threat intelligence, or DFIR. Adjacent roles include vulnerability management, identity and access management, and security engineering.

What employers want to see: the ability to explain a decision, familiarity with at least one SIEM and one EDR, evidence of hands-on investigations, and clear writing. A public portfolio of lab reports and detection rules is more persuasive than a list of tools. Certifications can help with screening, but they do not substitute for a demonstrated investigation.

Realistic progression: tier 1 to tier 2 in one to three years for strong performers; detection engineering and hunting usually require several years of operational exposure or equivalent lab depth. Salaries and shift patterns vary widely by region and industry; research local postings rather than trusting a single survey.

## Next steps

1. Build the lab in Exercise 1 and keep a dated notebook from day one.
2. Complete ten investigations and ask a mentor or community reviewer to critique two of your dispositions.
3. Write three Sigma rules with tests and publish sanitized versions.
4. Read NIST SP 800-61r3 and map one real or simulated incident to its phases.
5. Follow the [SOC analyst roadmap](../roadmaps/soc-analyst.md) and browse the [intermediate training grounds](../resources/training-grounds/intermediate.md) for the next tier of practice.

## References

1. NIST, [SP 800-61r3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management](https://csrc.nist.gov/pubs/sp/800/61/r3/final).
2. NIST, [Cybersecurity Framework](https://www.nist.gov/cyberframework).
3. MITRE, [ATT&CK knowledge base](https://attack.mitre.org/).
4. MITRE, [D3FEND defensive technique knowledge base](https://d3fend.mitre.org/).
5. Microsoft, [Advanced security audit policy event reference](https://learn.microsoft.com/windows/security/threat-protection/auditing/event-4624).
6. Microsoft, [Sysmon](https://learn.microsoft.com/sysinternals/downloads/sysmon).
7. CISA, [Incident and vulnerability response playbooks](https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks).
8. SigmaHQ, [Sigma rule repository](https://github.com/SigmaHQ/sigma).

---

Last reviewed: 2026-10-31

[Repository home](../README.md) | [Ethics policy](../ETHICS.md) | [Roadmaps](../roadmaps/) | [Resources](../resources/) | [Contributing](../CONTRIBUTING.md)
