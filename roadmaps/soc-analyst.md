# SOC Analyst Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 6–10 months**

[Home](../README.md) › [Roadmaps](README.md) › SOC analyst

A Security Operations Centre (SOC) analyst is the person who decides whether an alert matters. The work is part investigation, part documentation, and part communication: query logs, reconstruct what happened, separate benign activity from real intrusion, contain what needs containing, and hand the rest to the right team with evidence. This roadmap covers networking and operating system fundamentals, SIEM queries, alert triage, phishing and endpoint investigation, MITRE ATT&CK, and the incident response process. It is the most accessible entry point into defensive security, and it is also a job with shifts, queues, and repetition.

Read [ETHICS.md](../ETHICS.md) before investigating any system. SOC work grants access to sensitive logs and communications; use only what the investigation requires and follow your organization's data-handling policy.

## At a glance

| Item | Detail |
|---|---|
| Target role | SOC Analyst Tier 1, security operations analyst, incident response analyst (junior), threat monitoring analyst |
| Realistic duration | 6–10 months at 8–10 hours per week; 3–6 months with help-desk, networking, or system administration experience |
| Cost | Free tools and labs; optional paid platforms, courses, and exams |
| Lab needs | 16 GB RAM; a local SIEM (Wazuh, Elastic, or Splunk Free); Windows and Linux VMs; sample logs and packet captures |
| Difficulty | Moderate; breadth of knowledge and consistency matter more than deep exploitation skill |
| Main output | A home SOC lab, five incident reports, detection queries, and an ATT&CK coverage map |

This is a map, not a race. The fastest route into a SOC is usually a help-desk or IT operations role plus demonstrable investigation skill. Prior IT experience can shorten this roadmap substantially, but nobody can promise a job.

## Who this is for

This roadmap suits career changers with basic IT skills, help-desk technicians, network administrators, and graduates who want a defensive role rather than offensive testing. It also suits developers who want to understand detection.

Honest prerequisites:

- **Networking basics.** IP, TCP/UDP, DNS, HTTP, and common ports. You will read packet captures and proxy logs.
- **Windows and Linux familiarity.** Event Viewer, process behaviour, services, and the Linux command line.
- **Security vocabulary.** Malware, phishing, lateral movement, privilege escalation, and the CIA triad.
- **Comfort with ambiguity.** Many alerts are inconclusive. You will need to say "unknown, here is what I checked".
- **Written communication.** Every investigation ends in a ticket, an escalation, or a report.
- **Shift expectations.** Many SOC roles include nights, weekends, or on-call rotations. Ask about this early.

If you have never used a SIEM, that is fine; Stage 2 teaches it. If you cannot read a Windows event log or explain DNS, spend time on foundations first.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Log literacy | Read Windows, Linux, network, and cloud logs and know what normal looks like | An annotated log sample with normal and suspicious examples |
| SIEM querying | Write queries to filter, correlate, and summarize events | A query library with explanations |
| Alert triage | Decide severity, scope, and next action under time pressure | Five triage reports with decisions and rationale |
| Phishing analysis | Inspect headers, URLs, attachments, and authentication results safely | A phishing analysis with indicators and verdict |
| Endpoint investigation | Use process, file, registry, and network evidence to assess a host | A host timeline with containment recommendation |
| Threat intelligence | Apply ATT&CK and indicator context without overclaiming | An ATT&CK coverage map for your detections |
| Incident response | Follow the incident handling lifecycle and escalate correctly | An incident timeline and escalation note |
| Documentation | Write clear, concise, reproducible tickets | A ticket template and three worked examples |

Typical entry-level tasks:

- Triage a phishing report and decide whether to block, purge, or escalate.
- Investigate a burst of failed logins and determine whether it is a password spray.
- Query a SIEM for a suspicious process and correlate it with network activity.
- Escalate a confirmed compromise with a timeline and recommended containment.
- Document a false positive and tune the rule that produced it.

## Learning sequence

The sequence starts with logs and normal behaviour, then adds the SIEM, then investigation types, then process. Each stage should produce a written artifact.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Networking, operating systems, and logs | 6–8 weeks | Log literacy notebook |
| 2 | SIEM and query fundamentals | 6–8 weeks | Query library and dashboard |
| 3 | Triage and investigation | 8–10 weeks | Five incident reports |
| 4 | Incident response and threat intelligence | 6–8 weeks | IR timeline and ATT&CK map |
| 5 | Portfolio and interviews | 4–6 weeks | Public triage portfolio |

### Stage 1 — Networking, operating systems, and logs

| Element | Detail |
|---|---|
| Goal | Know what normal looks like on a network and a host, and where that activity is recorded. |
| Topics | TCP/IP, DNS, HTTP, TLS; common ports and protocols; Windows event logs and Sysmon; Linux auth and syslog; process trees; services and scheduled tasks; network flow and proxy logs; baseline behaviour. |
| Free learning | [Microsoft Learn](https://learn.microsoft.com/en-us/training/), [Windows security log encyclopedia](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/), [Wireshark documentation](https://www.wireshark.org/docs/), [SANS Internet Storm Center](https://isc.sans.edu/). |
| Labs | Build Windows and Linux VMs. Generate normal activity and collect logs. Use Sysmon and examine process creation events. Capture DNS and HTTP traffic in Wireshark. |
| Deliverable | A log literacy notebook with ten event types, their fields, and what normal versus suspicious looks like. |
| Exit criteria | Given an event, you can say which system produced it and what it records. |

### Stage 2 — SIEM and query fundamentals

| Element | Detail |
|---|---|
| Goal | Ingest logs into a SIEM and answer questions with queries rather than manual scrolling. |
| Topics | Log ingestion and parsing; indexes and retention; search languages (SPL, KQL, Lucene, or Wazuh queries); correlation; dashboards; alert rules; false positives; time zones. |
| Free learning | [Splunk free training](https://www.splunk.com/en_us/training/free-courses/overview.html), [Splunk documentation](https://docs.splunk.com/Documentation/Splunk), [Elastic documentation](https://www.elastic.co/guide/index.html), [Wazuh documentation](https://documentation.wazuh.com/), [Microsoft Sentinel documentation](https://learn.microsoft.com/en-us/azure/sentinel/). |
| Labs | Deploy Wazuh or Elastic locally and onboard a Windows VM. Write ten queries for common questions. Build a dashboard for authentication failures and process creation. Create one alert rule and test it. |
| Deliverable | A query library with ten documented queries and a working dashboard. |
| Exit criteria | You can answer "what happened on this host at this time" with a query and explain each filter. |

### Stage 3 — Triage and investigation

| Element | Detail |
|---|---|
| Goal | Investigate the alert types a Tier 1 analyst sees most and reach a defensible decision. |
| Topics | Phishing headers, URLs, attachments, and authentication results; endpoint triage with process and file evidence; PowerShell and command-line logging; network connections and DNS; persistence mechanisms; credential access indicators; business email compromise; false-positive analysis. |
| Free learning | [CyberDefenders](https://cyberdefenders.org/), [Blue Team Labs Online](https://blueteamlabs.online/), [LetsDefend](https://letsdefend.io/), [MITRE ATT&CK](https://attack.mitre.org/), [Atomic Red Team](https://atomicredteam.io/). |
| Labs | Complete five CyberDefenders challenges and three BTLO investigations. Analyze a phishing sample safely. Use Atomic Red Team in a lab to generate a technique and find it in your SIEM. |
| Deliverable | Five incident reports covering phishing, suspicious login, malware execution, persistence, and data access. |
| Exit criteria | Each report states what happened, what was checked, what remains unknown, and the recommended next action. |

### Stage 4 — Incident response and threat intelligence

| Element | Detail |
|---|---|
| Goal | Work within an incident response process and use threat intelligence responsibly. |
| Topics | NIST incident handling lifecycle; severity and escalation; containment, eradication, and recovery; evidence preservation; communication; ATT&CK mapping; indicator quality; intelligence sharing; cloud and identity incidents. |
| Free learning | [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final), [CISA advisories](https://www.cisa.gov/news-events/cybersecurity-advisories), [The DFIR Report](https://thedfirreport.com/), [Sigma](https://github.com/SigmaHQ/sigma), [MITRE D3FEND](https://d3fend.mitre.org/). |
| Labs | Run a tabletop exercise for a ransomware scenario. Build an incident timeline from supplied logs. Map your SIEM rules to ATT&CK and identify coverage gaps. |
| Deliverable | An incident response timeline with roles, decisions, and an ATT&CK coverage map. |
| Exit criteria | You can explain the difference between containment and eradication and when to escalate. |

Ethics reminder: SOC access is a position of trust. Do not browse personal communications, retain data beyond the investigation, or share indicators that could identify a victim. Follow your organization's policy and the law. See [ETHICS.md](../ETHICS.md).

### Stage 5 — Portfolio and interviews

| Element | Detail |
|---|---|
| Goal | Demonstrate investigative reasoning and get ready for a Tier 1 interview. |
| Topics | Ticket writing; portfolio redaction; metrics and false positives; interview scenarios; shift expectations; questions to ask an employer. |
| Free learning | [Blue Team Labs Online](https://blueteamlabs.online/), [CyberDefenders](https://cyberdefenders.org/), [lab notes template](../templates/lab-notes.md), [checklists](../checklists/README.md). |
| Labs | Present two investigations in ten minutes each. Complete a timed triage exercise. Write a one-page "how I investigate" methodology. |
| Deliverable | A public portfolio with three redacted reports, a query library, and a methodology page. |
| Exit criteria | You can defend a triage decision, explain what you would do next, and admit what you do not know. |

## Sequence diagram

```text
Stage 1  Networking + OS + logs
  TCP/IP | DNS | Windows events | Sysmon | Linux logs
        |
        v
Stage 2  SIEM + queries
  ingest -> parse -> search -> correlate -> alert
        |
        v
Stage 3  Triage + investigation
  phishing | login | endpoint | persistence | network
        |
        v
Stage 4  IR + threat intelligence
  lifecycle -> escalation -> timeline -> ATT&CK coverage
        |
        v
Stage 5  Portfolio + interview
  reports -> query library -> methodology -> mock triage
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [Splunk free courses](https://www.splunk.com/en_us/training/free-courses/overview.html) | Splunk | Beginner | Free courses; Splunk Free license available | Some labs | SIEM search and dashboard basics |
| [Elastic documentation](https://www.elastic.co/guide/index.html) | Elastic | Beginner–advanced | Free docs; self-managed basic tier free | Yes | Search, Kibana, and detection |
| [Wazuh documentation](https://documentation.wazuh.com/) | Wazuh | Beginner–intermediate | Free, open source | Yes | A complete open-source SIEM and XDR lab |
| [Microsoft Sentinel documentation](https://learn.microsoft.com/en-us/azure/sentinel/) | Microsoft | Intermediate | Free docs; Azure consumption charges apply | Some labs | Cloud-native SIEM and KQL |
| [Microsoft Defender XDR documentation](https://learn.microsoft.com/en-us/defender-xdr/) | Microsoft | Intermediate | Free docs; product licensing required | No | Endpoint and identity investigation |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Beginner–intermediate | Free | No | Adversary behaviour mapping |
| [Atomic Red Team](https://atomicredteam.io/) | Red Canary | Intermediate | Free, open source | Yes | Generating test activity for detections |
| [Sigma](https://github.com/SigmaHQ/sigma) | SigmaHQ | Intermediate | Free, open source | Rules | Vendor-neutral detection rules |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Beginner–advanced | Free challenges; certification paid | Yes | Realistic blue-team investigations |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Beginner–intermediate | Freemium; some free challenges, subscription for more | Yes | Guided investigation practice |
| [LetsDefend](https://letsdefend.io/) | LetsDefend | Beginner | Freemium; limited free investigations, subscription for full access | Yes | A simulated SOC queue |
| [The DFIR Report](https://thedfirreport.com/) | The DFIR Report | Intermediate | Free | No | How real intrusions unfold |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Windows and Linux logging lab | Local VMs | Event sources and normal behaviour | Free |
| 2 | Wazuh or Elastic SIEM deployment | Local | Ingestion, queries, dashboards | Free |
| 3 | Phishing analysis | Local sandbox | Headers, URLs, attachments | Free |
| 4 | Five CyberDefenders challenges | Online | Investigative reasoning | Free |
| 5 | Three BTLO investigations | Online | Guided triage | Free tier |
| 6 | Atomic Red Team detection exercise | Local lab plus SIEM | Generate and detect a technique | Free |
| 7 | Tabletop ransomware exercise | Local | IR roles and decisions | Free |
| 8 | Timed mock triage | Local | Decision-making under time pressure | Free |

Safe-lab caveat: isolate malware and phishing samples in a dedicated VM with no shared folders or clipboard. Do not open attachments on your host. When using online labs, follow their rules and never upload real employer data. In a real SOC, access only the logs required for the ticket and follow the data retention policy. If an investigation involves personal data or legal holds, escalate before copying anything.

## Portfolio projects

1. **Triage portfolio.** Five redacted incident reports with the alert, evidence, analysis, decision, and recommended action. Include at least one false positive, because knowing when not to escalate matters.
2. **Query library.** Ten SIEM queries with comments explaining what each one answers, which log sources it needs, and its limitations.
3. **Home SOC lab.** A diagram and README for a Wazuh or Elastic deployment ingesting Windows, Linux, and firewall logs, with screenshots of dashboards and one custom rule.
4. **ATT&CK coverage map.** A spreadsheet mapping your detection rules to techniques, with gaps and a plan to close two of them.
5. **Phishing analysis write-up.** A safe, redacted analysis of a reported email showing header authentication, URL analysis, and a verdict.

## Milestones and self-assessment

**Months 0–3**

- [ ] I can explain DNS, HTTP, and common ports without notes.
- [ ] I built Windows and Linux VMs and collected logs from both.
- [ ] I can read a Windows event log and identify the key fields.
- [ ] I wrote a log literacy notebook with ten event types.

**Months 3–6**

- [ ] I deployed a SIEM and ingested logs from at least two sources.
- [ ] I wrote ten queries and can explain each filter.
- [ ] I built a dashboard for authentication and process events.
- [ ] I created and tested one custom alert rule.

**Months 6–8**

- [ ] I completed five CyberDefenders or BTLO investigations.
- [ ] I analyzed a phishing email safely and wrote a verdict.
- [ ] I generated a technique with Atomic Red Team and found it in my SIEM.
- [ ] I wrote five incident reports with clear decisions.

**Months 8–10**

- [ ] I completed a tabletop exercise and an incident timeline.
- [ ] I mapped my detections to ATT&CK and identified gaps.
- [ ] My portfolio has three redacted reports and a query library.
- [ ] I completed a timed triage and a mock interview.

## Certifications

Certifications help with HR filters but do not replace investigation evidence. Every exam below is paid; free study material exists for most.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | Common baseline for SOC roles |
| [CySA+](https://www.comptia.org/certifications/cybersecurity-analyst) | CompTIA | Intermediate | Objectives and free video courses | Paid exam | Analyst-focused; good mid-level signal |
| [SC-200](https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/) | Microsoft | Intermediate | Microsoft Learn path is free | Paid exam | Strong for Microsoft Sentinel and Defender shops |
| [BTL1](https://www.securityblue.team/certifications/blue-team-level-1) | Security Blue Team | Beginner–intermediate | Some free lab content | Paid exam | Practical, investigation-focused |
| [Splunk Core Certified User](https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-user.html) | Splunk | Beginner | Free Splunk training courses | Paid exam | Useful if the employer runs Splunk |
| [Elastic Certified Analyst](https://www.elastic.co/training/certification) | Elastic | Intermediate | Free documentation and training | Paid exam | Useful for Elastic-heavy environments |
| [GCIH](https://www.giac.org/certifications/certified-incident-handler-gcih/) | GIAC | Intermediate–advanced | SANS posters and whitepapers | Paid exam | Respected incident handling credential; expensive |

## Common detours and mistakes

- **Closing alerts without evidence.** "Benign" without a reason is not a triage decision. Document what you checked.
- **Tool clicking instead of thinking.** A SIEM is a search engine, not an oracle. Learn the query language and the data model.
- **Ignoring baselines.** You cannot spot anomalous behaviour if you do not know what normal looks like on that host or network.
- **Skipping networking.** Many alerts only make sense at the packet, DNS, or proxy layer.
- **Over-escalating everything.** Escalation has a cost. Learn to distinguish suspicious from confirmed.
- **No notes during investigation.** Timelines are reconstructed from notes. Write as you go.
- **Assuming the alert is the whole incident.** Scope the host, the identity, and the network before concluding.
- **Ignoring shift reality.** SOC work can be repetitive and include nights. Ask about rotation and support before accepting a role.

## Next steps

1. Build the lab in [01-home-lab.md](../practical-projects/01-home-lab.md), then add a SIEM and a Windows VM with Sysmon.
2. Read the [SOC and blue team guide](../soc-blue-team/README.md) and [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final).
3. Work through [CyberDefenders](https://cyberdefenders.org/) and [Blue Team Labs Online](https://blueteamlabs.online/) until triage feels routine.
4. If you want to build detections rather than only consume them, continue with the [blue team engineer roadmap](blue-team-engineer.md); for evidence depth, see [digital forensics](digital-forensics.md).
5. Use the [exercises](../exercises/README.md) and [checklists](../checklists/README.md) for structured practice.

## References

- [NIST SP 800-61: Incident Handling Guide](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [MITRE D3FEND](https://d3fend.mitre.org/)
- [SigmaHQ](https://github.com/SigmaHQ/sigma)
- [CISA cybersecurity advisories](https://www.cisa.gov/news-events/cybersecurity-advisories)
- [SANS Internet Storm Center](https://isc.sans.edu/)
- [Windows security log encyclopedia](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/)
- [The DFIR Report](https://thedfirreport.com/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
