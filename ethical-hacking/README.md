# Ethical hacking

[Home](../README.md) / Ethical hacking

Ethical hacking is authorised adversary simulation: using an attacker's perspective to find weaknesses before someone with worse intentions does. The technical work is only half of it. The other half is scoping, evidence, communication, and the discipline to stop at the agreed boundary.

This guide teaches the engagement lifecycle end to end. It is written for someone who has completed the foundations and wants to understand how professional testing is actually run, not just which tools appear in walkthroughs.

> Practise only on systems you own or have explicit written permission to test. Authorisation, scope, and data handling are not optional extras; they are the job.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Intermediate. Requires existing operating system, networking, and web knowledge. |
| Realistic time | 6–9 months of part-time study and labs after the foundations. |
| Cost | Free-first: many labs and courses are free; paid labs and certifications are optional. |
| Prerequisites | [Networking](../foundations/networking/README.md), [Linux](../foundations/linux/README.md), [Windows](../foundations/windows/README.md), and web basics. |
| Lab requirement | An isolated local lab plus legal practice targets; never public systems. |
| Evidence of learning | A signed scope, a test log, a validated findings report, and a retest note. |

## Why this field matters

Organisations cannot fix what they cannot see. A well-run test finds the path an attacker would actually take, proves the business impact in a controlled way, and gives engineers a fix they can implement. That is very different from running a scanner and forwarding the output.

The attacker mindset also makes defenders better. You learn how trust is abused, how controls fail in practice, and which alerts matter. Many of the best defenders have spent time on the offensive side, and many testers spend time in detection and response.

## What you will learn

- Explain the difference between a vulnerability assessment, a penetration test, a red team exercise, an audit, and a bug bounty.
- Write a scope and rules of engagement that a client can sign and a tester can follow.
- Plan reconnaissance and enumeration around a defined objective rather than a tool list.
- Validate vulnerabilities manually, prove impact safely, and avoid false positives.
- Capture evidence that supports a finding and survives scrutiny.
- Write an executive summary and technical findings that engineers can act on.
- Use CVSS, EPSS, and exploitation evidence without confusing severity with priority.
- Run a retest and close findings with clear criteria.

## Prerequisites and honest expectations

You should be comfortable with IP addressing, DNS, HTTP, TLS, Linux and Windows command lines, and at least one scripting language. You do not need to be an expert in all of them before starting, but you will struggle if none of them are familiar.

- Lab targets are not production. Real systems have fragile integrations, politics, and change freezes.
- Methodology matters more than tooling. Interviewers can tell within minutes whether you have one.
- Reporting is a technical skill. A brilliant finding that nobody can reproduce is a failed engagement.
- Expect to spend more time reading, documenting, and waiting than exploiting.
- No guide can promise a job. A portfolio of clean reports and a public lab write-up are stronger signals than another course certificate.

## Core concepts

### Engagement types and methodology

Different engagements answer different questions. A vulnerability assessment asks "what known weaknesses exist?" and is broad rather than deep. A penetration test asks "can a tester with defined access achieve a defined objective?" and validates exploitability. A red team exercise asks "would our detection and response catch a realistic adversary?" and prioritises stealth and objectives over coverage. An audit checks evidence against a standard, and a bug bounty is a continuous, scope-limited public programme. A CTF is a game, not client assurance.

Methodologies give structure. NIST SP 800-115 describes planning, discovery, attack, and reporting. The Penetration Testing Execution Standard (PTES) expands the same arc into pre-engagement, intelligence gathering, threat modelling, vulnerability analysis, exploitation, post-exploitation, and reporting. OWASP's Web Security Testing Guide covers application-specific test cases. Choose one, document it, and adapt it to the scope instead of improvising.

### Scoping and rules of engagement

Scope is a technical control. It lists assets, domains, applications, IP ranges, accounts, and environments, plus explicit exclusions such as production payment systems, third-party SaaS, or employee devices. It defines the testing window, source addresses, permitted techniques, data-handling rules, and the people who can approve changes.

Rules of engagement turn scope into behaviour: no denial-of-service testing, no social engineering unless separately authorised, no persistence, no data exfiltration beyond a proof, and a stop condition such as "stop and call the client if you reach regulated data". Add escalation contacts, a deconfliction plan so the client's defenders know a test is running, and insurance or indemnity terms where appropriate.

### Objectives, threat modelling, and success criteria

A test without an objective becomes a tool tour. Before touching a target, agree what "success" means: demonstrating access to a specific dataset, proving that a customer can reach another customer's records, or showing that an external attacker can reach the management network. That objective shapes reconnaissance, the depth of exploitation, and what counts as evidence.

Threat modelling connects the objective to the organisation. Who would attack this system, what do they want, and what would they try first? A public-facing login form, a partner API, and a help desk attract different adversaries. Write the hypotheses down; they become the structure of your test plan and your report.

### Reconnaissance

Reconnaissance gathers information without touching the target where possible. Passive sources include the organisation's own documentation, DNS records, certificate transparency logs, search engines, job postings, and public code repositories. Active sources include resolving discovered names and inspecting publicly available metadata, but only within scope.

The output is an asset inventory with evidence: what exists, who owns it, how it was discovered, and whether it is in scope. Record timestamps and sources. Do not collect personal information about employees beyond what is necessary, and never use reconnaissance as an excuse to stalk or socially engineer people who are not part of the engagement.

### Enumeration

Enumeration turns an asset into a picture of its services, versions, users, shares, endpoints, and authentication mechanisms. It is inherently noisier than reconnaissance, so rate-limit scans, avoid fragile devices such as printers and industrial controllers, and confirm that the client's monitoring team expects the traffic.

Depth should follow the objective. A single web application may need endpoint discovery, parameter mapping, and role analysis. A network segment may need host discovery, service versions, and share enumeration. For every service, ask: what is it, what version, what authentication, what does it expose, and what would an attacker try next? Record the exact command and output that supports each conclusion.

### Vulnerability analysis and validation

Scanners produce candidates, not findings. A version banner may be inaccurate, a plugin may misread a response, and a "critical" result may depend on a configuration that is not present. Validate manually: reproduce the behaviour, confirm the vulnerable code path, and check whether the preconditions an attacker needs actually hold.

Chaining matters. A low-severity information leak plus a weak password reset flow can become account takeover. Conversely, a scary-looking finding with no reachable attack path may be lower priority than it appears. Document exploitability, prerequisites, and business impact, and do not inflate severity to make a report look impressive.

### Exploitation in authorised labs

Exploitation is used to prove that a vulnerability is real and to measure impact. In a professional engagement, the least invasive proof is usually enough: a benign command, a test account, or reading a single synthetic record. Do not deploy destructive payloads, ransomware simulators, or persistence unless the scope explicitly authorises them and the client understands the consequences.

Know your stop conditions before you start. If a system becomes unstable, if you reach data you did not expect, or if you find yourself outside the agreed scope, stop, document, and contact the client. The best testers are conservative: they would rather leave a finding unproven than cause an outage.

### Post-exploitation and impact demonstration

Post-exploitation answers the question the business actually asked: what could an attacker do next, and what would it cost? Map the access you obtained, identify the data or systems it reaches, and demonstrate impact with the minimum evidence required. Screenshot a synthetic record, not a customer database; show the path, not the contents.

Then clean up. Remove uploaded files and test accounts you created, restore configuration changes, close sessions, and verify that the environment is back to its pre-test state. List every change in the report appendix. Unapproved persistence or leftover tooling is a finding against you, not the client.

### Evidence handling and test logs

Evidence must be reliable and defensible. Keep a timestamped command log, capture tool output to files, and screenshot with enough context to show the host, user, and time. Hash important artefacts with SHA-256 and record the hash in your notes. For anything transferred, keep a chain-of-custody record.

Store evidence encrypted, restrict access to the engagement team, and define a retention period in the contract. Redact personal data and credentials in the report, but keep the unredacted original in secure storage if the client needs it for remediation. Never store client evidence in personal cloud drives or public repositories.

### Reporting

The report is the deliverable. An executive summary should explain, in business language, what was tested, what was found, what it means, and what to fix first. The technical section should contain findings that an engineer can reproduce without asking you questions: title, severity, affected assets, description, reproduction steps, evidence, impact, remediation, and references.

Quality signals are consistent severity ratings, no scanner dumps, clear reproduction steps, and remediation advice that fits the environment. Separate observations from vulnerabilities, and state what you did not test. A short report with five validated findings beats a hundred-page export.

### CVSS, EPSS, and prioritisation

CVSS describes the severity of a vulnerability using base metrics (intrinsic characteristics), optional threat metrics (exploit maturity), and optional environmental metrics (the organisation's context). CVSS v4.0 adds supplemental metrics and a revised scoring approach. The vector string documents exactly how the score was derived, which is more useful than the number alone.

Severity is not priority. EPSS estimates the probability of exploitation in the next 30 days, and CISA's Known Exploited Vulnerabilities catalog records exploitation observed in the wild. Combine those signals with asset criticality, exposure, compensating controls, and business impact. A medium-severity flaw on an internet-facing identity provider can outrank a critical flaw on an isolated test box.

### Remediation, retest, and professional conduct

Good remediation advice explains the root cause and offers options: fix the code, change the configuration, add a compensating control, or accept the risk with a named owner. Offer to validate, not to dictate. A retest confirms the fix, checks for regressions, and produces a closure note that references the original finding.

Conduct matters throughout. Send daily status updates on longer engagements, escalate critical findings within hours rather than waiting for the report, and be explicit about limitations. Never surprise the client with an action they did not approve, never keep access after the engagement, and never use findings for leverage. Reputation is built slowly and lost quickly.

## Legal and safe practice

Authorisation is the boundary between a security assessment and a crime. The following rules are minimum expectations for this curriculum.

- Obtain written authorisation from the system owner, with scope, dates, techniques, and data-handling rules.
- Test only in the lab or within the signed scope; treat adjacent systems as out of scope unless approved in writing.
- Do not use destructive payloads, denial-of-service techniques, or persistence outside an explicitly authorised lab exercise.
- Protect evidence and personal data with encryption, access control, and an agreed retention period.
- Report critical findings immediately, and report vulnerabilities privately and in good faith.
- If something goes wrong, stop, preserve evidence, and tell the client; do not try to hide it.

Read [Security ethics](../foundations/security-ethics/README.md) before your first engagement. It covers authorization, disclosure, and privacy in more depth.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Foundations | Complete networking, Linux, Windows, and web basics; practise in legal labs. | Lab notebook and a working local environment |
| 1 | Methodology | Read NIST SP 800-115 and the OWASP WSTG structure; write a test plan for a lab. | A methodology-based test plan |
| 2 | Recon and enumeration | Map a lab network and a web app with documented commands. | Asset inventory and service map with evidence |
| 3 | Validation | Triage scanner output and manually confirm three issues. | Validated findings with reproduction steps |
| 4 | Impact | Prove access to a synthetic record and document the path. | Evidence pack and cleanup log |
| 5 | Reporting | Write a full report for a mock client and have it reviewed. | Executive summary plus five findings |
| 6 | Retest | Fix one finding in the lab and verify the fix. | Retest note with before-and-after evidence |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner to advanced | Free | Interactive labs | The best structured web security practice available |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; many beginner rooms free | Guided labs | Methodology, tooling, and confidence in a browser |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Beginner to advanced | Freemium; some modules free | Guided labs | Structured paths from fundamentals to AD |
| [PentesterLab](https://www.pentesterlab.com/) | PentesterLab | Beginner to intermediate | Freemium; some exercises free | Browser and VM labs | Web exploitation and code review practice |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free | Videos and CTF | Bug bounty workflow and disclosure norms |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) | NIST | The planning-to-reporting structure for technical assessments |
| [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Test cases and methodology for web applications |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Verifiable application security requirements |
| [OWASP Top 10](https://owasp.org/Top10/) | OWASP | The most common web risk categories |
| [FIRST CVSS](https://www.first.org/cvss/) | FIRST | Scoring specification and vector documentation |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Adversary behaviour for scoping and detection mapping |
| [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | CISA | Exploitation evidence for prioritisation |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security/all-labs) | PortSwigger | Free | Web exploitation with clear objectives |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free | Full web assessment on a deliberately vulnerable app |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Guided enumeration and exploitation |
| [Hack The Box](https://www.hackthebox.com/) | Hack The Box | Freemium; free machines rotate | Independent practice on retired or active legal targets |
| [VulnHub](https://www.vulnhub.com/) | VulnHub | Free | Downloadable vulnerable VMs for local practice |
| [GOAD](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Free, open source | Active Directory attack paths in an isolated lab |

Keep every lab on a host-only network, snapshot before testing, and never expose a vulnerable machine to the internet. If a lab requires a public IP, use an isolated cloud account you control and tear it down afterwards.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Nmap | Host discovery, port scanning, and service identification in scope | [nmap.org](https://nmap.org/) |
| Burp Suite Community | Intercept, inspect, and modify web traffic | [PortSwigger](https://portswigger.net/burp/communitydownload) |
| ZAP | Open-source web proxy and scanner for authorised testing | [zaproxy.org](https://www.zaproxy.org/) |
| Wireshark | Verify what actually crossed the network | [wireshark.org](https://www.wireshark.org/) |
| sqlmap | Demonstrate SQL injection only in local, authorised labs | [sqlmap.org](https://sqlmap.org/) |
| Metasploit Framework | Exploitation and payload testing in isolated labs | [metasploit.com](https://www.metasploit.com/) |

Tools do not replace methodology. A scanner cannot decide what matters, cannot judge business impact, and cannot write a remediation that fits the codebase. Use automation for breadth, then validate by hand.

## Practical projects and exercises

**Project 1: Full mock engagement (portfolio-worthy).**
Objective: run the entire lifecycle on a lab you own. Setup: pick Juice Shop and one VulnHub VM, write a scope and RoE, test for two weeks of part-time work, log every command, and prove impact with synthetic data only. Deliverable: scope, test log, five validated findings, executive summary, and a retest note after fixing one issue.

**Project 2: Scanner triage.**
Objective: practise turning noise into findings. Setup: run an authorised scan against a lab target, then manually verify each result, remove duplicates, and group related issues by root cause. Deliverable: a triage sheet showing scanner output, validation result, severity rationale, and the three findings you would actually report.

**Project 3: Detection-aware testing.**
Objective: connect offensive work to defensive value. Setup: with permission, run a controlled scan against a lab host monitored by Suricata or Zeek, collect the alerts, and compare what the defender saw with what you did. Deliverable: a joint timeline and a short note on which steps were visible, which were not, and what detection would have helped.

## Common mistakes and misconceptions

- **Tool-first testing.** Running every tool without an objective produces noise, not assurance.
- **Reporting scanner output.** Unvalidated results destroy credibility and waste engineering time.
- **Scope creep.** Testing an interesting adjacent system without written approval can end a career.
- **CVSS worship.** A base score is not a business priority; context decides what gets fixed first.
- **Proving impact destructively.** Deleting or encrypting data is never acceptable outside an explicitly authorised exercise.
- **No cleanup.** Leftover accounts, files, and configuration changes are unprofessional and risky.
- **Skipping the retest.** A finding is not closed until someone verifies the fix.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Junior penetration tester | Labs, CTFs, and a strong report portfolio | Methodology, validation, and clear writing |
| Application security analyst | Development or QA background | Code review and remediation-focused findings |
| Red team operator | Pentest experience plus networking | Stealth, objective planning, and detection awareness |
| Security consultant | IT operations or GRC plus technical depth | Scoping, client communication, and risk judgement |

Certifications exist and some employers filter on them, but they are paid and rarely sufficient on their own. A public portfolio of lab reports, a clean methodology, and the ability to explain trade-offs will carry more weight in a real interview.

## Next steps

1. Complete the [beginner roadmap](../roadmaps/beginner-to-ethical-hacker.md) before paying for any lab platform.
2. Build the isolated lab and write your first scope and RoE from the [ethics guide](../foundations/security-ethics/README.md).
3. Work through PortSwigger's beginner labs and keep a test log for every one.
4. Practise reporting by turning three lab findings into a short client-style report.
5. Continue to [Web application security](../web-application-security/README.md) or [Network penetration testing](../network-penetration-testing/README.md) for depth.

## References

- NIST, *SP 800-115: Technical Guide to Information Security Testing and Assessment*, <https://csrc.nist.gov/pubs/sp/800/115/final>
- OWASP, *Web Security Testing Guide*, <https://owasp.org/www-project-web-security-testing-guide/>
- OWASP, *Application Security Verification Standard*, <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP, *Top 10*, <https://owasp.org/Top10/>
- FIRST, *CVSS Specification*, <https://www.first.org/cvss/>
- FIRST, *EPSS*, <https://www.first.org/epss/>
- MITRE, *ATT&CK*, <https://attack.mitre.org/>

---

Last reviewed: 2026-10-31

[Repository home](../README.md) · [Learning paths](../roadmaps/README.md) · [Free courses](../resources/free-courses/README.md) · [Contributing](../CONTRIBUTING.md)
