# Cybersecurity fundamentals

[Home](../../README.md) / Foundations / Cybersecurity fundamentals

Cybersecurity is the work of keeping systems, data, and people working as intended when someone else wants them to fail. It is part engineering, part risk management, and part communication. Most of the job is not breaking into things: it is deciding what matters, reducing the chance it breaks, noticing quickly when it does, and recovering without panic.

This guide is the shared vocabulary for the rest of the curriculum. It is written for a motivated beginner who can use a computer but has never studied security formally. If you already work in IT, it fills the conceptual gaps that tool tutorials skip.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner. No security background required; comfort with computers is essential. |
| Realistic time | 8–10 weeks at 6–8 hours per week, including lab work. |
| Cost | Free. Optional paid books or certifications are marked as paid where mentioned. |
| Prerequisites | Confident computer use and the ability to run a virtual machine; basic networking helps but is not required. |
| Lab requirement | A machine with 8 GB RAM or more for a local virtual lab. No internet-facing targets. |
| Evidence of learning | A threat model, a scored risk register, two detection rules, and an incident timeline. |

## Why this field matters

Every organisation now runs on software it did not write, on networks it only partly controls, and on identities reachable from anywhere. A single stolen password can become a ransomware deployment; a single unpatched appliance can become an entry point into a hospital, a bank, or a water utility. Security work makes that risk visible and reduces it before it becomes an outage or a breach notification.

The field is also broad. Some practitioners analyse logs, some review code, some write policy, some test systems with permission, and some design networks so that one mistake does not become a company-wide incident. All of them need the same foundation: a clear model of what they protect and what can go wrong. Defensive roles also outnumber offensive ones in most organisations and are often easier to enter without prior security experience.

## What you will learn

- Explain confidentiality, integrity, and availability, and recognise the trade-offs between them.
- Tell the difference between a threat, a vulnerability, an exploit, and a risk, and use the terms precisely.
- Build a simple threat model and a scored risk register for a small system.
- Describe how identity, authentication, and authorisation work together, and why identity is the modern perimeter.
- Explain defence in depth, least privilege, secure defaults, and zero trust without treating them as slogans.
- Read a CVE, a CVSS vector, an EPSS score, and a KEV entry, and explain why severity is not the same as priority.
- Trace a basic intrusion through logs and describe the phases of incident response.

## Prerequisites and honest expectations

You do not need programming, a certification, or a home lab full of enterprise hardware to start. You do need patience with ambiguity: security decisions are rarely provable, only defensible. You will regularly say "it depends", and then explain what it depends on.

- Expect vocabulary-heavy weeks at the start. That is normal and it pays off quickly.
- Do not expect a job guarantee from this or any guide. Entry-level roles are competitive and reward demonstrated work.
- Do not expect to "finish" security. The field changes continuously; the skill is learning how to update your model.

If you have no IT background, spend extra time on the networking and operating system guides in this directory before the detection material. If you already administer systems, skim the vocabulary and focus on risk, detection, and frameworks.

## Core concepts

### The CIA triad and its neighbours

Confidentiality means only authorised people can read data. Integrity means data and systems are accurate and have not been altered without detection. Availability means the people who need a service can use it when they need it. Almost every control serves one of these goals and trades one against another: encrypting a database protects confidentiality but adds key-management failure modes; a redundant cluster protects availability but multiplies the attack surface that must be patched.

Security also cares about authenticity (proving who sent something), non-repudiation (a sender cannot credibly deny it), and privacy (using personal data lawfully and minimally). When someone claims a design is "secure", ask which properties it protects, against which adversary, and at what cost. The answer is usually narrower than the marketing suggests.

### Threat, vulnerability, exploit, and risk

These four words are often used interchangeably in news coverage. Precision matters because each one calls for a different response.

| Term | Meaning | Example |
| --- | --- | --- |
| Threat | A person or event with the potential to cause harm | A ransomware affiliate scanning for exposed remote access |
| Vulnerability | A weakness that can be used to cause harm | An internet-facing service missing a security patch |
| Exploit | A technique or piece of code that abuses a vulnerability | Public code that takes advantage of the missing patch |
| Risk | The combination of likelihood and impact if a threat acts on a vulnerability | A likely outage of a revenue system with no tested backup |

You cannot eliminate threats, and you cannot always remove every vulnerability. You can change likelihood (patching, segmentation, monitoring) and impact (backups, least privilege, insurance). That is risk management, and it sits behind every security decision.

### Risk management in practice

Start by identifying assets: the data, services, and capabilities the organisation cannot afford to lose. Then ask what could go wrong, how likely it is, and what it would cost. Teams often use a five-point scale for likelihood and impact; a heat map is a visual way of ranking combinations. A defensible qualitative assessment beats an unread quantitative report.

Every risk needs a treatment: mitigate it with a control, transfer it (insurance or contract), avoid the activity, or accept it with a named owner and review date. What remains after controls is residual risk, and risk appetite is the amount of residual risk leadership will carry. Record decisions in a risk register or the same argument returns every quarter.

### Attack surface, trust boundaries, and the cloud

Attack surface is everything an adversary can interact with: exposed services, APIs, employee inboxes, third-party integrations, build pipelines, cloud identities, and physical access. You can shrink it (close unused ports, retire stale accounts, remove features) or monitor it, but you cannot ignore it.

Trust boundaries are where data or control passes between components that trust each other differently: internet to DMZ, user space to kernel, one tenant to another, a build system to production. Most serious vulnerabilities are boundary failures, where one side assumes the other validated something. In cloud environments the provider secures physical infrastructure and the managed service, while the customer secures identity, configuration, data, and access paths; misconfiguration, not provider compromise, is the usual cause of cloud incidents.

### Attack lifecycle, adversaries, and MITRE ATT&CK

Adversaries range from opportunistic criminals who buy access and run ransomware, to insiders misusing legitimate permissions, to patient nation-state groups. Capability ranges from unmodified scanning tools to custom malware with supply-chain access, so defences must be scoped to the adversaries who realistically target you.

Attacks are usually described as a sequence: reconnaissance, initial access, execution, persistence, privilege escalation, credential access, discovery, lateral movement, collection, command and control, exfiltration, and impact. The classic kill chain uses a similar progression; each stage offers a chance to detect or block before the next succeeds. MITRE ATT&CK catalogues observed behaviour as tactics (the goal) and techniques (how), which defenders use to map detection coverage. The Pyramid of Pain adds a useful heuristic: blocking a hash is easy for an adversary to bypass, while forcing a change in preferred technique is expensive.

### Defence in depth, least privilege, and secure defaults

No single control is reliable. Defence in depth layers identity controls, endpoint protection, network segmentation, application security, data protection, monitoring, and people. A phishing email might bypass the mail filter, be opened by a user, run in a restricted context, be blocked by endpoint policy, and still generate an alert a human investigates. Each layer buys time and evidence.

Least privilege means every person, service, and process gets only the access required, for only as long as required. Separation of duties prevents one person from both making and approving a sensitive change. Secure defaults mean the safe configuration is the one you get without extra work. These principles are simple to state and hard to operate, because business pressure constantly pushes toward convenience and broad access.

### Zero trust

Zero trust rejects the idea that a request is trustworthy because it comes from inside the corporate network. Every request should be authenticated, authorised, and evaluated against policy using signals such as identity, device health, location, and resource sensitivity. NIST SP 800-207 describes the architecture; phishing-resistant multi-factor authentication, microsegmentation, and continuous verification are common implementations.

Zero trust is not a product you buy, and it does not mean abandoning firewalls or monitoring. It is a direction of travel: reduce implicit trust, make policy explicit, and verify continuously. It also raises operational questions about user experience, legacy systems, and who owns policy when every request is evaluated individually.

### Identity, authentication, and authorisation

Authentication proves who is asking. Authorisation decides what they may do. Accounting records what they did. Multi-factor authentication combines something you know, something you have, and something you are; the strongest common form is phishing-resistant, using hardware keys or passkeys bound to the origin of the site.

Identity failures dominate real incidents: reused passwords, help-desk reset flows, over-privileged service accounts, forgotten test accounts, and tokens that never expire. Good programmes cover the full lifecycle: joiners get least privilege, movers lose old access, leavers are disabled promptly, and privileged access is separated, time-bound, and logged.

### Cryptography for defenders

Symmetric encryption uses one shared key and is fast; asymmetric encryption uses a public and private key pair and solves key distribution; hashing is one-way and supports integrity and password storage; message authentication codes and digital signatures provide integrity and authenticity. Passwords should be stored with a slow, salted password hash such as Argon2id or bcrypt, never a fast general-purpose hash.

TLS combines these primitives to protect data in transit, and public-key infrastructure lets a client decide whether to trust a certificate. Most cryptographic failures are not broken algorithms: they are keys in source code, missing certificate validation, deprecated protocols, weak randomness, and home-grown schemes. Use vetted libraries and standard protocols, and plan for the migration to post-quantum algorithms now being standardised.

### Vulnerabilities, severity, and prioritisation

A CVE identifier names a publicly disclosed vulnerability. The NVD enriches many CVEs with CVSS scores, which describe severity from base characteristics, optionally adjusted by temporal and environmental factors. CVSS measures severity, not likelihood and not business impact. EPSS estimates the probability that a vulnerability will be exploited in the next 30 days, and CISA's Known Exploited Vulnerabilities catalog records exploitation observed in the wild.

A responsible programme combines these signals with asset criticality and exposure: an internet-facing, actively exploited vulnerability on a payment system outranks a theoretical issue in an internal test tool, even when the CVSS numbers disagree. Patching is one control; segmentation, disabling the vulnerable feature, and detection can reduce risk while a fix is scheduled.

### Detection, response, and resilience

Detection depends on telemetry: endpoint process events, authentication logs, network flows, DNS queries, cloud audit logs, and application logs. That telemetry flows into a SIEM or data platform where detections are written, tested, and tuned. A detection rule without a response procedure and an owner is a noisy query.

Incident response generally follows preparation, detection and analysis, containment, eradication and recovery, and post-incident lessons learned. Resilience is the part people skip: tested backups following the 3-2-1 pattern, immutable copies, documented recovery time and recovery point objectives, and exercises that prove the plan works when systems are down and people are stressed.

### Frameworks, compliance, and governance

Frameworks give you a shared structure. The NIST Cybersecurity Framework 2.0 organises outcomes into Govern, Identify, Protect, Detect, Respond, and Recover. The CIS Critical Security Controls give a prioritised set of technical safeguards. ISO/IEC 27001 defines requirements for a management system, and SOC 2 reports on controls relevant to service organisations.

Compliance is a floor, not a ceiling: an audit samples evidence at a point in time, while an adversary attacks continuously. Governance connects security work to business ownership through policies, standards, procedures, risk acceptance, and third-party risk management. If security cannot explain its priorities in business language, it loses the budget argument every time.

## Legal and safe practice

Everything in this guide is defensive or conceptual. Practise only on systems you own or have explicit written permission to test, and keep experiments in an isolated virtual lab with no route to the internet or to other people's networks.

- Written authorisation must name the systems, dates, techniques, and people involved. If it is not in scope, it is out of scope.
- Scanning, exploiting, or accessing a system without permission is a criminal offence in many jurisdictions, even if you find nothing and mean no harm.
- Handle data you encounter as if it were personal data: collect the minimum, store it securely, and delete it when the engagement ends.
- Report vulnerabilities through the vendor or a coordinated disclosure process rather than publishing them.
- Read [Security ethics](../security-ethics/README.md) before you touch any offensive tooling.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Vocabulary and models | Read this guide; write your own definitions of the core terms. | A one-page glossary in your own words |
| 1 | Risk and assets | Threat-model a system you use, such as your email or home router. | Diagram with assets, boundaries, threats, and controls |
| 2 | Identity and access | Review your accounts, MFA, password manager, and recovery paths. | Personal access inventory with fixes applied |
| 3 | Networks and web | Work through [Networking foundations](../networking/README.md) and the OWASP Top 10. | Annotated packet capture plus a web write-up |
| 4 | Detection and response | Build a small lab with Sysmon or auditd logs and write two rules. | Rules with test evidence and false-positive notes |
| 5 | Governance and capstone | Score ten risks for a fictional organisation and present a plan. | Risk register and a two-page executive brief |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CS50's Introduction to Cybersecurity](https://cs50.harvard.edu/cybersecurity/) | Harvard University | Beginner | Free | Projects, no live targets | Broad grounding in security, privacy, and law |
| [Introduction to Cybersecurity](https://www.netacad.com/courses/introduction-to-cybersecurity) | Cisco Networking Academy | Beginner | Free account | Interactive modules | Vocabulary, threats, and career context |
| [Pre Security path](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; several rooms free, full path needs a subscription | Guided browser labs | Hands-on Linux, network, and web basics |
| [Security, Compliance, and Identity Fundamentals](https://learn.microsoft.com/training/) | Microsoft Learn | Beginner | Free modules; optional paid exam | Some sandbox exercises | Identity and compliance vocabulary |
| [Cybersecurity for Everyone](https://www.coursera.org/learn/cybersecurity-for-everyone) | University of Maryland via Coursera | Beginner | Free to audit; certificate paid | No labs | Policy, incentives, and organisational context |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) | NIST | Common language for organising outcomes and briefing leadership |
| [CIS Critical Security Controls](https://www.cisecurity.org/controls) | Center for Internet Security | Prioritised, practical safeguards with implementation guidance |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Catalogue of observed adversary behaviour for detection mapping |
| [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final) | NIST | Comprehensive security and privacy control catalogue |
| [NIST SP 800-61 Rev. 2](https://csrc.nist.gov/pubs/sp/800/61/r2/final) | NIST | The classic incident-handling lifecycle reference |
| [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | CISA | Exploitation evidence that should influence patch priority |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; many beginner rooms free | Guided beginner rooms with browser-based machines |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Free | Blue-team challenges using real artefacts and tooling |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Freemium; some challenges free | Investigation and response scenarios |
| Local virtual lab | You | Free | Two isolated VMs for logging, scanning, and hardening experiments |

Keep lab machines on a host-only or internal network. Snapshot before experiments, and never bridge a deliberately vulnerable machine to a network you do not own.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Wireshark | Inspect packet captures to see what actually crossed the wire | [wireshark.org](https://www.wireshark.org/) |
| Zeek | Produce rich connection and protocol logs for analysis | [zeek.org](https://zeek.org/) |
| Suricata | Open-source intrusion detection and network security monitoring | [suricata.io](https://suricata.io/) |
| Sysmon | High-value Windows endpoint telemetry for detection | [Microsoft Sysinternals](https://learn.microsoft.com/sysinternals/downloads/sysmon) |
| Wazuh | Open-source SIEM and endpoint monitoring platform | [wazuh.com](https://wazuh.com/) |

Tools do not replace methodology. A SIEM with no detection logic, owner, and response process is an expensive log archive. Learn what question each tool answers before installing it.

## Practical projects and exercises

**Project 1: Personal threat model.**
Objective: apply the vocabulary to a system you actually use. Setup: pick your email account or home network, list assets, draw trust boundaries, and identify three credible threats with existing controls. Deliverable: a two-page document with a diagram, a threat table, and three prioritised recommendations.

**Project 2: Two detection rules with evidence.**
Objective: turn telemetry into a testable detection. Setup: in an isolated lab, enable Sysmon on Windows or auditd on Linux, generate benign activity such as failed logins, and write rules that fire on the behaviour without flooding on normal activity. Deliverable: rule definitions, sample alerts, false-positive analysis, and a short response procedure for each.

**Project 3: Risk register for a fictional clinic.**
Objective: practise risk communication, the skill most entry-level candidates cannot demonstrate. Setup: invent a ten-person clinic with patient records, a cloud booking system, and one IT generalist; identify ten risks, score likelihood and impact, choose treatments, and assign owners. Deliverable: a register plus a two-page executive summary that recommends a budget priority order without jargon. This project is portfolio-worthy.

## Common mistakes and misconceptions

- **Security equals hacking.** Offensive testing is a small specialty; most work is design, operations, and risk communication.
- **Compliance equals security.** An auditor checks a sample; an attacker chooses the gap.
- **A high CVSS score is automatically the top priority.** Exposure, asset criticality, and known exploitation matter more.
- **Multi-factor authentication solves account takeover.** Push fatigue, token theft, and help-desk resets still work.
- **Zero trust means removing the firewall.** It means removing implicit trust, which increases the need for segmentation and logging.
- **Encryption makes data safe.** It protects one property; keys, endpoints, and backups still need protection.
- **More tools mean more security.** Tool sprawl without ownership produces cost and blind spots.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| SOC analyst (Tier 1) | IT support, networking, or a strong home lab | Triage notes, detection rules, and clear written analysis |
| GRC analyst | Policy, audit, or project coordination | Risk registers, control mapping, and precise writing |
| Junior security engineer | Systems administration or cloud operations | Hardening work, automation, and documented trade-offs |
| Application security analyst | Software development or QA | Code review findings with fixes and tests |

Certifications can help with HR filters but rarely replace demonstrated work. Treat paid certifications as optional investments and check current costs directly with the issuer. The [roadmap](../../roadmaps/beginner-to-ethical-hacker.md) shows how these roles connect over time.

## Next steps

1. Complete the vocabulary stage and write your own one-page glossary without copying definitions.
2. Work through [Networking foundations](../networking/README.md) so packets, DNS, and TLS stop being abstractions.
3. Read [Security ethics](../security-ethics/README.md) before installing any offensive tooling.
4. Build the two-VM lab and finish Project 2; detection evidence is more impressive than another certificate.
5. Choose a direction with the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md), compare [ethical hacking](../../ethical-hacking/README.md) with [web application security](../../web-application-security/README.md), and browse [training grounds](../../resources/training-grounds/beginner.md).

## References

- NIST, *Cybersecurity Framework 2.0*, <https://www.nist.gov/cyberframework>
- NIST, *SP 800-53 Rev. 5, Security and Privacy Controls*, <https://csrc.nist.gov/pubs/sp/800/53/r5/final>
- NIST, *SP 800-61 Rev. 2, Computer Security Incident Handling Guide*, <https://csrc.nist.gov/pubs/sp/800/61/r2/final>
- NIST, *SP 800-207, Zero Trust Architecture*, <https://csrc.nist.gov/pubs/sp/800/207/final>
- Center for Internet Security, *CIS Critical Security Controls*, <https://www.cisecurity.org/controls>
- MITRE, *ATT&CK Enterprise Matrix*, <https://attack.mitre.org/>
- OWASP, *Top 10 Web Application Security Risks*, <https://owasp.org/Top10/>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)
