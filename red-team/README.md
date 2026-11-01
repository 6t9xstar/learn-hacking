[Home](../README.md) / Red Team

# Red Team

Red teaming is authorized adversary emulation: a team attempts to achieve defined objectives against an organization's people, processes, and technology in order to test whether the defensive program can prevent, detect, and respond. It is closer to a controlled military exercise than to a penetration test. The value is not the number of shells obtained; it is the evidence produced about what the organization missed and how quickly it noticed.

This guide is for security practitioners moving from offensive fundamentals into red team operations, for defenders who want to understand how their work is evaluated, and for technical managers who commission red team engagements. It teaches concepts, planning, safety, and reporting. It deliberately does not provide step-by-step exploitation or evasion recipes; those belong in authorized lab curricula, not a general guide.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Advanced; typically a destination after several years of systems, network, and offensive fundamentals |
| Realistic time | 2-4 years of deliberate practice from a strong IT/security base to junior operator readiness |
| Cost | Learning material is largely free; labs, certifications, and commercial C2 infrastructure are paid |
| Prerequisites | Deep Windows and Linux knowledge, Active Directory, networking, scripting, report writing |
| Lab requirement | Essential. Build an isolated range with Windows AD, Linux hosts, and a monitored segment |

## Why this field matters

Defensive programs improve when they are tested against something that thinks. Compliance scans and checklist audits answer "is the control configured?" Red teaming answers harder questions: Would anyone notice a phishing foothold? Can an attacker move from a workstation to Tier 0? Does the incident response plan survive contact with a real timeline? Does the SOC escalate at 2 a.m.?

Red teams also expose organizational failure modes that no scanner can see: excessive trust between teams, undocumented break-glass accounts, monitoring gaps after a cloud migration, or an on-call process that depends on one person. A well-run engagement leaves the organization with a prioritized, evidence-backed improvement plan. A poorly run engagement leaves a scary slide deck and a demoralized defensive team.

The work requires judgment as much as technical skill. You will hold sensitive access, observe private data, and operate inside legal and contractual boundaries. Maturity, documentation, and the ability to say "stop, this is out of scope" matter more than a novel exploit.

## What you will learn

- How red teaming differs from penetration testing and adversary emulation, and when each is appropriate.
- How to negotiate and document rules of engagement, scope, and emergency procedures.
- How to build a threat model and an adversary emulation plan grounded in MITRE ATT&CK.
- How command-and-control infrastructure is designed conceptually, and why operational security matters.
- How to validate detections with the defensive team instead of scoring points against it.
- How to handle sensitive data, legal boundaries, and unexpected access safely.
- How to write a report that drives remediation rather than just demonstrating cleverness.

## Prerequisites and honest expectations

Red teaming is not an entry-level job. You should already be comfortable with Windows internals, Active Directory, Linux administration, TCP/IP, TLS, web protocols, and at least one scripting language. You should understand how EDR and SIEM systems work, because your activity will be observed through them. You should also have practice presenting technical findings to non-technical stakeholders.

Expect years of deliberate practice and a strong ethical foundation. The technical ceiling is high, but the limiting factor for most operators is reliability: planning, note-taking, time management, and communication. Expect to spend more time writing than exploiting. Also expect that the most valuable finding may be a process gap, not a zero-day.

## Core concepts

### 1. Red teaming, penetration testing, and adversary emulation

A penetration test usually has a narrow technical scope and a short window, and it aims to find as many vulnerabilities as possible. Adversary emulation reproduces the behavior of a specific threat actor against a defined target. Red teaming is objective-driven and full-scope: a team emulates realistic threats over a longer period to test detection and response, often without the defenders knowing the details in advance.

The distinctions matter commercially and ethically. A red team engagement without a mature defensive program to observe it becomes an expensive penetration test. A penetration test sold as a red team exercise creates false expectations. Define the objective in the contract: "determine whether the SOC detects and contains a simulated ransomware operator within 24 hours" is a red team objective; "find vulnerabilities in the customer portal" is a penetration test objective.

### 2. Authorization and rules of engagement

Authorization is the foundation of lawful red teaming. A written agreement should identify the legal entity commissioning the work, the systems and people in scope, the time window, prohibited techniques, data handling rules, emergency contacts, and the escalation path if the team discovers a real compromise or causes an outage.

Rules of engagement (RoE) translate authorization into operational constraints: which domains and IP ranges are in scope, whether social engineering is allowed, whether physical access is included, what happens to credentials and sensitive data, how evidence is stored, and when testing must pause. The agreement should be signed by someone with authority to bind the organization. A verbal "go ahead" from a manager is not authorization.

Some engagements use a "get out of jail" letter describing the engagement and emergency contacts, carried by the operator. It does not create legal immunity, but it helps resolve misunderstandings with building security or law enforcement. Treat it as a communication aid, not a license.

### 3. Scoping and threat modeling

Scoping defines the technical and organizational boundary. Inventory domains, IP ranges, cloud accounts, subsidiaries, third-party hosted services, and excluded systems such as medical devices or industrial control systems. Ask about production constraints, change freezes, and systems that cannot tolerate load. A scope that includes "the whole company" without an asset inventory is a recipe for an accidental outage.

Threat modeling identifies which adversaries matter. Consider the organization's sector, geography, business model, and previous incidents. A payment processor worries about financially motivated ransomware and card theft; a defense supplier worries about state-aligned espionage. Use that context to select realistic adversaries, objectives, and constraints rather than defaulting to a generic advanced persistent threat.

### 4. Adversary emulation with ATT&CK

MITRE ATT&CK provides a shared vocabulary of tactics and techniques. An emulation plan selects a threat actor or behavior set, maps the relevant techniques, defines the order and dependencies, and specifies the evidence the defenders should be able to see. The plan should state what is being tested: prevention, detection, response, or all three.

Good emulation plans are realistic but bounded. They pick a small number of high-value techniques rather than every technique in a group's profile. They define success criteria in advance, such as "the SOC generates an alert within 15 minutes of the first scheduled task" or "the endpoint agent blocks the payload before execution". They also define abort criteria and safety controls.

### 5. Initial access and execution at a high level

Red teams obtain initial access through the same broad channels adversaries use: phishing and social engineering, exposed services, valid accounts, supply chain relationships, and physical access. The choice should follow from the threat model, not from what is easiest. A phishing-only exercise tests email security and user awareness; an exposed-service exercise tests asset management and patch velocity. Each has different defensive implications.

Execution and persistence concepts include scheduled tasks, services, startup items, web shells, and living-off-the-land binaries. This guide does not describe how to implement them. What matters for planning is the observable footprint: which process trees, file paths, registry keys, network connections, and authentication events the technique produces. That footprint is what the defensive team must be able to see.

### 6. Command-and-control concepts

Command-and-control (C2) is the channel an operator uses to task and receive results from an implant. Conceptually, a C2 framework manages listeners, implants, tasking, and exfiltration. Realistic infrastructure separates the operator's infrastructure from the target-facing infrastructure using redirectors, domain fronting (where lawful and permitted), or residential proxies, and it uses resilient channels that survive blocking.

Operational security for C2 includes infrastructure segregation, unique certificates and domains per engagement, logging, and teardown. Implants should have kill dates, limited functionality, and no persistence beyond what the engagement requires. Commercial and open-source frameworks exist, but capability is not permission: using a framework against a system you do not own is unauthorized access, regardless of the tool's intent.

### 7. Privilege escalation and credential access concepts

Red teams escalate privileges and access credentials to reach objectives, but the concepts can be discussed defensively. Privilege escalation exploits misconfigurations: excessive service permissions, weak ACLs, unquoted service paths, vulnerable drivers, or overly permissive cloud roles. Credential access targets cached secrets, memory, configuration files, and identity systems.

From a defensive standpoint, the important questions are: What would this look like in telemetry? Which accounts and systems would be affected? What controls would make the technique fail? This guide intentionally omits credential-dumping procedures. Learners should practice only in isolated labs with synthetic accounts, and should understand that possessing credentials for systems outside scope is a stop condition, not a trophy.

### 8. Lateral movement and persistence

Lateral movement uses trusted channels and valid accounts to move between systems. Common conceptual mechanisms include remote service creation, remote execution frameworks, shared administrative protocols, and identity token reuse. Persistence keeps access across reboots, credential changes, or partial remediation. Both are areas where red team actions look similar to legitimate administration, which is exactly why they are valuable tests of detection quality.

Scope discipline is critical here. A single misconfigured trust can lead from a workstation into a subsidiary or a partner environment that was never authorized. If you discover that a production identity has access to an out-of-scope system, stop and notify the engagement lead. The finding is valuable; using it is not.

### 9. Objective completion and impact

Impact is the endgame: data exfiltration, ransomware deployment, business email compromise, or disruption of a critical service. Simulated impact must be safe. A ransomware simulation might create inert marker files and a report rather than encrypting data. An exfiltration test might copy a small set of synthetic files to a controlled server. The objective is to prove the path and measure detection, not to cause harm.

Agree in advance how "proof" will be demonstrated without retaining sensitive data. A screenshot, a hash, a file count, and a description are usually sufficient. Never exfiltrate real customer data to external infrastructure, and never leave simulated malware that could be mistaken for a real incident.

### 10. Operational security and legal boundaries

Operational security for a red team includes protecting the engagement itself: encrypted notes, need-to-know communication, unique infrastructure, no reuse of personal accounts, and secure destruction of engagement data at the end. It also means protecting the client: don't discuss the engagement publicly, don't publish screenshots that reveal customer data, and follow the agreed disclosure timeline.

Legal boundaries vary by jurisdiction. Computer misuse laws, privacy laws, employment law, and sector regulation may all apply. Social engineering can cross into fraud or harassment if poorly bounded. Cloud providers have acceptable-use policies that prohibit testing without authorization from the provider as well as the customer. When in doubt, ask counsel and the client in writing before proceeding.

### 11. Detection validation and purple teaming

The most useful red team output is not "we got domain admin". It is "here is the timeline, here is what the defenders saw, here is what they missed, and here is the smallest change that would have caught us sooner". Purple teaming makes this explicit: operators and defenders review activity together, run controlled tests, and improve detections collaboratively.

A validation loop looks like: define technique, execute in a controlled way, confirm telemetry, check detection, measure time to detect and respond, tune, retest. Record negative results too. "No alert fired" is a finding, not a failure of the exercise.

### 12. Reporting and risk communication

Reports should lead with the objective and the outcome, then provide an evidence-backed timeline, the detection and response observations, and prioritized recommendations. Separate what was tested from what was not. Avoid breathless language; a calm, precise narrative is more credible.

Write for three audiences: executives who need business risk and priorities, defenders who need technical detail and detection opportunities, and engineers who need remediation specifics. Include an appendix with indicators, but sanitize anything that could harm the client if leaked. Give the client a chance to validate factual claims before wider distribution.

## Legal and safe practice

Never test a system without explicit written authorization from the party that owns it. Authorization from one business unit does not cover a parent company, subsidiary, partner, or cloud provider. Stay inside the agreed scope and time window, and stop immediately if you encounter evidence of a real intrusion, child exploitation material, or other illegal content.

Use isolated lab environments for practice. Public platforms such as Hack The Box and TryHackMe provide authorized targets; your employer's production network does not, unless a signed engagement says so. Do not use real malware outside an isolated analysis lab. Do not retain client credentials, personal data, or sensitive files longer than the engagement requires, and follow the agreed destruction process.

Open-source tools such as Impacket, Sliver, Mythic, and BloodHound are dual-use. They are legal to study and use in authorized environments. Using them against systems without permission can violate computer misuse laws and professional codes. The tool does not confer authorization; the signed scope does.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations | Systems, network, identity | Build and administer a small Windows AD and Linux lab; learn logging and EDR basics | A lab diagram and an incident-free administration journal |
| 2. Offensive fundamentals | Authorized labs | Complete beginner-to-intermediate boxes and web security labs | Ten write-ups focused on methodology, not flags |
| 3. Planning | Scope, RoE, threat model | Draft a complete engagement package for a fictional client | A scope document, RoE, threat model, and emulation plan |
| 4. Adversary emulation | ATT&CK and validation | Run Atomic Red Team tests and a CALDERA operation against your lab | A purple team report with detection results and tuning changes |
| 5. Reporting | Risk communication | Convert the lab operation into executive and technical reports | A sanitized portfolio report reviewed by a mentor |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [TryHackMe red team rooms](https://tryhackme.com/) | TryHackMe | Beginner to intermediate | Freemium; some rooms free, paths require subscription | Yes | Guided practice in enumeration, exploitation, and Active Directory |
| [Hack The Box](https://www.hackthebox.com/) | Hack The Box | Intermediate to advanced | Freemium; a limited set of machines and challenges are free, Pro Labs are paid | Yes | Realistic targets and multi-host Pro Labs for team practice |
| [Red Team Guide](https://redteam.guide/) | Community project | Intermediate | Free | No | A structured, vendor-neutral overview of red team planning and delivery |
| [The Hacker Recipes](https://www.thehacker.recipes/) | Community project | Intermediate to advanced | Free | No | Conceptual and technical notes on Active Directory and enterprise attack paths |
| [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team/) | Red Canary | Intermediate | Free | Yes | Small, mapped technique tests that are ideal for detection validation |
| [CALDERA documentation](https://caldera.mitre.org/) | MITRE | Advanced | Free | Yes, self-hosted | Automated adversary emulation and agent-based exercise design |

## Official documentation and standards

- [NIST SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final) — planning, execution, and reporting fundamentals that still apply to modern engagements.
- [MITRE ATT&CK](https://attack.mitre.org/) — the shared adversary behavior vocabulary used in emulation plans and reports.
- [CALDERA](https://caldera.mitre.org/) — MITRE's adversary emulation platform and documentation.
- [Atomic Red Team documentation](https://github.com/redcanaryco/atomic-red-team/) — technique-mapped tests and safety notes.
- [CREST](https://www.crest-approved.org/) — industry guidance and accreditation context for penetration testing and red teaming.
- [The Hacker Recipes](https://www.thehacker.recipes/) — practitioner reference for enterprise identity concepts, useful for planning.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [Hack The Box Pro Labs](https://www.hackthebox.com/hacker/pro-labs) | Multi-host enterprise ranges | Paid | Fully authorized platform targets; never pivot to the public internet |
| [TryHackMe](https://tryhackme.com/) | Guided rooms and paths | Freemium | Use only platform-provided targets |
| [DetectionLab](https://github.com/clong/DetectionLab) | Self-hosted monitored AD lab | Free | Build on an isolated virtual network with no route to production |
| [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team/) | Technique test library | Free | Run only on lab hosts you own; review each test before execution |
| [CALDERA](https://caldera.mitre.org/) | Adversary emulation platform | Free | Isolated network; restrict agent egress |
| [Game of Active Directory](https://github.com/Orange-Cyberdefense/GOAD) | Vulnerable AD lab | Free | Self-hosted and intentionally vulnerable; never expose it |

## Essential open-source tools

Authorization comes before tooling. Every tool below is legitimate in a signed engagement or an isolated lab and illegitimate against systems you do not own.

| Tool | Purpose | Authorization note | Official link |
| --- | --- | --- | --- |
| Atomic Red Team | Small tests mapped to ATT&CK techniques | Lab or signed scope only; review tests before running | [github.com/redcanaryco/atomic-red-team](https://github.com/redcanaryco/atomic-red-team/) |
| CALDERA | Automated adversary emulation | Isolated lab or client-approved range | [caldera.mitre.org](https://caldera.mitre.org/) |
| BloodHound | Graph analysis of identity attack paths | Requires explicit authorization; it queries directory data | [bloodhound.specterops.io](https://bloodhound.specterops.io/) |
| Impacket | Python toolkit for network protocol research | Dual-use; authorized testing and lab research only | [github.com/fortra/impacket](https://github.com/fortra/impacket) |
| Sliver | Open-source C2 framework | Lab or signed red team engagement only | [github.com/BishopFox/sliver](https://github.com/BishopFox/sliver) |
| Mythic | Modular C2 and agent framework | Lab or signed engagement only; comply with local law | [github.com/its-a-feature/Mythic](https://github.com/its-a-feature/Mythic) |
| DetectionLab | Reproducible monitored AD environment | Self-hosted lab; never expose to the internet | [github.com/clong/DetectionLab](https://github.com/clong/DetectionLab) |

## Practical projects and exercises

### Exercise 1: Write a complete engagement package

Objective: create the paperwork for a fictional 30-day red team engagement against a mid-sized company.

Constraints: no real client data; use a fictional company and invented but plausible assets; include at least two out-of-scope systems that are tempting to test.

Deliverable: a scope table, rules of engagement, threat model with two adversary profiles, an ATT&CK-mapped emulation plan, a communications and escalation plan, abort criteria, and a data handling plan. Have a peer review it and record the issues they find. This artifact demonstrates the planning maturity that distinguishes a red teamer from an exploit enthusiast.

### Exercise 2: Run a five-technique detection validation

Objective: execute five Atomic Red Team tests in DetectionLab or an equivalent lab and measure what the defenders can see.

Constraints: one technique per ATT&CK tactic where feasible; capture logs before and after; do not use destructive tests; reset snapshots between tests.

Deliverable: a purple team report containing the test matrix, timestamps in UTC, raw telemetry excerpts, whether a detection fired, time to detect, time to respond, false negatives, and at least three tuning recommendations. Include a "what we would do differently" section.

### Exercise 3: Build an adversary emulation plan from public reporting

Objective: select a publicly documented threat group relevant to a chosen sector and build a bounded emulation plan.

Constraints: use only public ATT&CK group pages and vendor research; do not reproduce malware; substitute safe simulations for destructive capabilities.

Deliverable: a plan with the group's profile, prioritized techniques, expected observable evidence, required lab preconditions, safety controls, success criteria, and a mapping table from technique to defensive data source to proposed detection. Add a one-page executive summary explaining why this adversary matters to the fictional organization.

## Common mistakes and misconceptions

1. **Treating red teaming as penetration testing with a cooler name.** Without an objective tied to detection and response, you are buying a penetration test at red team prices.
2. **Starting work before the paperwork is signed.** Verbal approval, unclear scope, and missing emergency contacts cause real incidents and legal exposure.
3. **Testing production without rollback plans.** A technique that crashes a service is not a finding; it is an outage you caused.
4. **Chasing domain admin as the only metric.** Access depth matters, but detection rate, dwell time, and response quality are the deliverables.
5. **Hiding from the defenders instead of measuring them.** Full stealth is useful in some engagements, but a pure stealth contest teaches the blue team nothing.
6. **Keeping every credential and file "for evidence".** Retain the minimum necessary, store it securely, and destroy it on schedule.
7. **Publishing or verbally sharing client details.** Reputation is built on confidentiality; one war-story slide can end a career.
8. **Ignoring the cloud and identity layer.** Modern attack paths often run through SaaS, identity providers, and CI/CD, not just on-premises Active Directory.
9. **Overpromising stealth or impact.** Set expectations honestly; detection is a success for the client's program, not a failure for yours.

## Career paths and roles

Entry points include penetration tester, security consultant, and offensive security engineer, usually after several years in IT or blue team roles. Red team operator, adversary emulation specialist, and purple team lead are later specializations. Adjacent roles include detection engineer, incident responder, and security architect, all of which benefit from offensive perspective.

What employers value: safe judgment, strong fundamentals, clear reports, and evidence of working within scope. Certifications such as OSCP or CREST can help with screening but are not substitutes for a portfolio. A public, sanitized write-up of a lab campaign, a detection validation report, or an emulation plan demonstrates more than a badge.

Be honest about the market: red team roles are fewer than SOC roles and often require prior experience. A realistic route is blue team or consulting first, then internal transfer or a junior offensive role. Salary varies by region, sector, and clearance requirements; research local postings rather than relying on headline figures.

## Next steps

1. Draft the engagement package in Exercise 1 and have someone attack your assumptions.
2. Build DetectionLab or an equivalent range and run the five-technique validation.
3. Read the [red team operator roadmap](../roadmaps/red-team-operator.md) and identify the gaps in your current skills.
4. Practice reporting: turn one lab operation into a two-page executive brief and a ten-page technical report.
5. Review the [ethics policy](../ETHICS.md) and the [intermediate training grounds](../resources/training-grounds/intermediate.md) before expanding your lab.

## References

1. NIST, [SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final).
2. MITRE, [ATT&CK](https://attack.mitre.org/).
3. MITRE, [CALDERA](https://caldera.mitre.org/).
4. Red Canary, [Atomic Red Team](https://github.com/redcanaryco/atomic-red-team/).
5. CREST, [penetration testing and red teaming guidance](https://www.crest-approved.org/).
6. SpecterOps, [BloodHound documentation](https://bloodhound.specterops.io/).
7. The Hacker Recipes, [enterprise identity and Active Directory notes](https://www.thehacker.recipes/).
8. NIST, [SP 800-61r3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final).

---

Last reviewed: 2026-10-31

[Repository home](../README.md) | [Ethics policy](../ETHICS.md) | [Roadmaps](../roadmaps/) | [Resources](../resources/) | [Contributing](../CONTRIBUTING.md)
