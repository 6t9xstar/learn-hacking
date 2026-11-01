# Beginner to Ethical Hacker Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 9–15 months**

[Home](../README.md) › [Roadmaps](README.md) › Beginner to ethical hacker

This is the broad entry roadmap for someone who wants to understand how attackers think and how defenders respond, without pretending that one path leads straight to a job. It starts with the networking, operating system, and web knowledge that every later specialization assumes, then introduces authorized offensive testing and, most importantly, reporting. Ethical hacking is not a single job: the same foundations feed into network penetration testing, web application security, cloud security, mobile testing, digital forensics, and detection engineering. Use this roadmap to build the base and to choose a direction, not to collect tools.

Before you run any scan or open any testing tool, read [ETHICS.md](../ETHICS.md). Every technique in this roadmap belongs in a lab you own or in an engagement with written authorization and a defined scope.

## At a glance

| Item | Detail |
|---|---|
| Target role | Junior penetration tester, security analyst, IT security apprentice, or ethical hacking intern |
| Realistic duration | 9–15 months at 8–10 study hours per week; prior IT support, networking, or software experience can shorten the foundation stages |
| Cost | Free core path; optional paid lab subscriptions, books, and certification exams |
| Lab needs | 16 GB RAM recommended; virtualization software; two to three isolated virtual machines; no exposure to the internet-facing home network |
| Difficulty | Moderate at the start, high once you attempt full engagements without walkthroughs |
| Main output | A documented home lab, several lab reports, and a chosen specialization |

This roadmap is a map, not a race. The ranges above assume consistent weekly study, not bursts before an exam. Nobody can promise a job at the end, and the people who progress fastest are usually the ones who build things, break them in a lab, and write down what happened.

## Who this is for

This roadmap suits career changers, students, help-desk technicians, developers, and sysadmins who want a structured route into security. It also suits self-taught learners who have watched scattered videos and now want an order of operations.

Honest prerequisites:

- **Computer confidence.** You can install software, manage files, and troubleshoot your own machine without step-by-step help.
- **Basic networking exposure.** You have seen an IP address, a DNS lookup, and a browser developer console. You do not need to be an expert; Stage 1 fixes gaps.
- **Time and patience.** Eight to ten focused hours per week for many months, including evenings where nothing works.
- **Reading endurance.** Most of the best material is documentation, standards, and long lab write-ups, not short videos.
- **A machine you control.** You need permission to install virtualization software and enough disk space for several virtual machines.

This is not the right starting point if you want a shortcut to "hacking" without learning systems, if you are unwilling to document your work, or if you cannot keep lab activity isolated. A learner who cannot yet use a command line should spend two or three weeks on Linux basics first; the [foundations guide](../foundations/README.md) covers that ground.

## What you are working toward

The goal is not to "know Kali". It is to be useful on a security team: able to investigate, test safely, explain risk, and write something another person can act on. The competencies below are the ones that show up in junior-level interviews and tasks.

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Network literacy | Explain how a request travels from browser to server, including DNS, TCP, TLS, and HTTP | A packet capture annotated in your own words |
| Operating system fluency | Navigate Linux confidently and understand Windows accounts, services, and event logs | Lab notebook with commands, outputs, and explanations |
| Structured reconnaissance | Enumerate a lab target methodically instead of guessing | A recon report with a checklist and findings |
| Vulnerability validation | Confirm that a weakness is real and explain its impact without causing damage | A finding with request/response evidence and a safe proof |
| Web fundamentals | Understand sessions, cookies, access control, injection, and common OWASP categories | PortSwigger lab notes covering at least ten categories |
| Reporting | Turn technical detail into a finding, a risk statement, and a fix | A mock assessment report with an executive summary |
| Professional conduct | Work to scope, protect data, and stop when something is out of bounds | A signed mock scope document and rules of engagement |

Typical entry-level tasks you should be able to handle after this roadmap:

- Enumerate a lab host, identify exposed services, and record the evidence cleanly.
- Reproduce a common web weakness in a deliberately vulnerable application and propose a code or configuration fix.
- Write three findings with severity, affected asset, reproduction steps, impact, and remediation.
- Build and reset an isolated lab environment without help.
- Read an advisory or CVE entry and explain who is affected and what to do first.

## Learning sequence

The sequence below is deliberately front-loaded with fundamentals. Skipping to exploitation produces learners who can follow a walkthrough but cannot troubleshoot a target that behaves unexpectedly. Each stage ends with a deliverable, and the deliverable is what you carry into interviews.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Foundations: networking, operating systems, web, lab safety | 8–10 weeks | Lab notebook and network diagram |
| 2 | Core technical skills: administration, scripting, data, enumeration | 10–12 weeks | Scripted log analysis and enumeration notes |
| 3 | Applied offensive basics in authorized labs | 12–14 weeks | Three lab reports |
| 4 | Reporting and specialization choice | 6–8 weeks | Full mock assessment report |
| 5 | Portfolio and interview preparation | 4–6 weeks | Public portfolio and mock interview notes |

### Stage 1 — Foundations

| Element | Detail |
|---|---|
| Goal | Build a working mental model of networks, operating systems, and the web, and set up a safe lab. |
| Topics | TCP/IP and the OSI model; IP addressing and subnets; DNS; HTTP and HTTPS; TLS at a high level; Linux filesystem and permissions; Windows accounts and services; confidentiality, integrity, availability; risk, threat, and vulnerability; authentication basics. |
| Free learning | [Professor Messer's Security+ videos](https://www.professormesser.com/), [Cisco Networking Academy](https://www.netacad.com/), [Linux Journey](https://linuxjourney.com/), [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP). |
| Labs | Install VirtualBox or VMware and create an isolated host-only network. Run [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) through level 20. Use a browser and command line to inspect DNS and HTTP. |
| Deliverable | A lab notebook containing a network diagram, VM inventory, isolation settings, and written explanations of DNS resolution and an HTTPS connection. |
| Exit criteria | You can explain, without notes, what happens between typing a URL and seeing a page. You can move around Linux, read permissions, and restore a VM snapshot. |

### Stage 2 — Core technical skills

| Element | Detail |
|---|---|
| Goal | Move from knowing terms to operating systems and reading code and data. |
| Topics | Linux services, logs, and package management; Windows local accounts, Active Directory concepts, and Event Viewer; Bash and Python; Git; SQL basics; JavaScript and PHP reading; encoding, hashing, and encryption in practice; service enumeration with Nmap. |
| Free learning | [The Missing Semester](https://missing.csail.mit.edu/), [Automate the Boring Stuff](https://automatetheboringstuff.com/), [Nmap book](https://nmap.org/book/), [Microsoft Learn](https://learn.microsoft.com/en-us/training/). |
| Labs | Run Nmap against lab VMs only. Deploy DVWA or OWASP Juice Shop locally. Write a Python script that parses authentication logs and summarizes failed logins by source. Work through [TryHackMe](https://tryhackme.com/) Linux and Windows rooms. |
| Deliverable | A small Python log-analysis tool with a README, plus enumeration notes that explain every Nmap flag you used. |
| Exit criteria | You can write a 100-line script, explain how Active Directory authentication differs from local authentication, and justify an enumeration approach rather than pasting a command. |

### Stage 3 — Applied offensive basics

| Element | Detail |
|---|---|
| Goal | Follow a complete testing workflow in a lab: scope, recon, validation, controlled exploitation, evidence, and cleanup. |
| Topics | Engagement workflow and rules of engagement; passive and active reconnaissance; vulnerability identification and false-positive checks; OWASP Top 10 categories; Burp Suite Community; service exploitation in lab VMs; Linux and Windows privilege escalation concepts; evidence capture and note-taking. |
| Free learning | [PortSwigger Web Security Academy](https://portswigger.net/web-security), [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/), [HackTricks](https://book.hacktricks.xyz/), [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) for understanding test cases. |
| Labs | Complete at least 20 PortSwigger apprentice labs. Work through [Hack The Box Starting Point](https://www.hackthebox.com/) machines. Test one [VulnHub](https://www.vulnhub.com/) VM offline. Keep every target on the host-only network. |
| Deliverable | Three lab reports: one web application, one Linux host, one Windows host. Each includes scope, method, evidence, impact, and remediation. |
| Exit criteria | You can complete three lab machines without a walkthrough, explain the root cause of each weakness, and describe the defensive fix. |

Ethics reminder: a lab VM is not a license to test anything else. Attacking systems without explicit written permission is a criminal offence in most jurisdictions and ends security careers quickly. See [ETHICS.md](../ETHICS.md) and the scope guidance in [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final).

### Stage 4 — Reporting and specialization

| Element | Detail |
|---|---|
| Goal | Convert technical work into professional deliverables and choose a specialization based on evidence, not fashion. |
| Topics | CVSS v3.1 and v4.0 scoring; risk communication; remediation advice; retesting; executive summaries; evidence redaction; legal boundaries; an honest survey of web, network, cloud, mobile, forensics, and blue team work. |
| Free learning | [FIRST CVSS](https://www.first.org/cvss/), [OWASP WSTG reporting guidance](https://owasp.org/www-project-web-security-testing-guide/), [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final), the [lab notes template](../templates/lab-notes.md). |
| Labs | Write a full report for one Stage 3 target. Ask a peer to review it against a rubric. Re-test after applying the fix and record the change. |
| Deliverable | An 8–12 page mock assessment report with an executive summary, findings table, three detailed findings, and a retest section. |
| Exit criteria | A reviewer can reproduce every finding from your report alone. You have chosen one specialization and can name the next three things to learn. |

### Stage 5 — Portfolio and interview preparation

| Element | Detail |
|---|---|
| Goal | Present evidence of competence clearly and survive a technical interview. |
| Topics | Portfolio structure and redaction; writing a technical case study; resume phrasing; STAR stories for behavioural questions; timed lab practice; professional networking. |
| Free learning | [Practical projects](../practical-projects/README.md), [checklists](../checklists/README.md), [FAQ](../FAQ.md), [Learning guide](../LEARNING-GUIDE.md). |
| Labs | Complete one timed lab you have not seen before. Run two mock interviews with a peer, one technical and one behavioural. |
| Deliverable | A public portfolio with three redacted artifacts, two case studies, and a one-page resume. |
| Exit criteria | Three artifacts are publishable, two mock interviews are completed with written feedback, and ten relevant roles have been identified with tailored applications. |

## Sequence diagram

```text
Stage 1  Foundations
  networking | OS | web | safe lab
        |
        v
Stage 2  Core technical skills
  administration | scripting | data | enumeration
        |
        v
Stage 3  Applied offensive basics (lab only)
  scope -> recon -> validate -> controlled test -> evidence
        |
        v
Stage 4  Reporting and specialization
  findings -> CVSS -> remediation -> choose a path
        |
        +--> web application security
        +--> network penetration testing
        +--> cloud security
        +--> mobile security
        +--> blue team / forensics
        |
        v
Stage 5  Portfolio and interview
  artifacts -> case studies -> mock interviews -> applications
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [Professor Messer's Security+ course](https://www.professormesser.com/) | Professor Messer | Beginner | Free videos; optional paid study notes | No | Vendor-neutral security vocabulary and exam-aligned foundations |
| [Cisco Networking Academy](https://www.netacad.com/) | Cisco | Beginner | Free courses with account; some labs need Packet Tracer | Yes | Networking fundamentals with guided practice |
| [Linux Journey](https://linuxjourney.com/) | Linux Journey | Beginner | Free | Interactive | Command line, permissions, and process basics |
| [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) | OverTheWire | Beginner | Free | Yes | Linux problem-solving through SSH |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner–advanced | Free; optional account for progress | Yes | Web vulnerability concepts with hundreds of labs |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; free rooms, paid subscription for full paths | Yes | Guided rooms and a gentle introduction to offensive tooling |
| [Hack The Box](https://www.hackthebox.com/) | Hack The Box | Beginner–advanced | Free tier for machines and challenges; Academy mostly paid | Yes | Less-guided practice and realistic targets |
| [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No | A methodology you can follow and cite |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Intermediate | Free | No | A shared language for adversary behaviour |

## Hands-on labs

Work through these in order. Each one should be documented before you move on.

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Build an isolated home lab | Local virtualization | Isolation, snapshots, network design | Free |
| 2 | Bandit levels 0–20 | OverTheWire | Linux and SSH | Free |
| 3 | Pre Security or Introduction rooms | TryHackMe | Networking, web, and security basics | Free tier |
| 4 | Twenty apprentice labs | PortSwigger Academy | Web vulnerability classes and Burp Suite | Free |
| 5 | Starting Point machines | Hack The Box | Enumeration and basic exploitation | Free tier |
| 6 | OWASP Juice Shop locally | OWASP | Web testing against a safe target | Free |
| 7 | One offline vulnerable VM | VulnHub | End-to-end host testing | Free |

Safe-lab caveat: only test systems you own or have explicit written permission to test. Keep vulnerable machines on a host-only or internal virtual network, never bridged to a network you do not control. Do not store real personal data, credentials, or production captures in a lab. Take a snapshot before each exercise and revert afterwards. If a lab instructs you to attack a public IP address, stop; that is not a lab.

## Portfolio projects

1. **Home lab build guide.** A README with a network diagram, VM inventory, isolation rules, snapshot policy, and a short troubleshooting log. This proves you can operate the environment every other project depends on.
2. **Vulnerability assessment report.** Test one deliberately vulnerable VM and produce a professional report with five findings, CVSS scores, evidence, and fixes. Redact host identifiers if you publish it.
3. **Web lab casebook.** Twelve PortSwigger labs documented with the root cause, the exact request that demonstrated the issue, the impact, and the defensive fix. Group them by OWASP category rather than by lab number.
4. **Attack-to-detection map.** Pick one lab attack and map it to MITRE ATT&CK techniques, then list the log sources and event fields a defender would need to detect it. This artifact is unusually strong for blue-team interviews.

## Milestones and self-assessment

Use these as evidence checks, not as a calendar. Tick a box only when the artifact exists and someone else could inspect it.

**Months 0–3**

- [ ] I built an isolated lab and documented its network diagram and isolation rules.
- [ ] I can explain DNS, TCP, TLS, and HTTP without notes.
- [ ] I completed Bandit levels 0–20 and wrote up the problems I solved.

**Months 3–6**

- [ ] I wrote a working Python script that parses a log file and produces a summary.
- [ ] I deployed a deliberately vulnerable web application locally and tested it.
- [ ] I can enumerate a lab host with Nmap and justify each flag.

**Months 6–9**

- [ ] I completed three lab machines without walkthroughs.
- [ ] I wrote three lab reports with scope, evidence, impact, and remediation.
- [ ] I completed a full mock assessment report and had it reviewed.

**Months 9–15**

- [ ] I chose a specialization and completed one starter artifact in it.
- [ ] My portfolio has three redacted, inspectable artifacts.
- [ ] I can explain the legal and ethical boundaries of testing to a non-technical person.
- [ ] I applied to roles with a tailored resume and a portfolio link.

## Certifications

Certifications are optional signals, not proof of ability. Every exam below costs money; the study material is often free. Check the provider's current exam objectives and terms before paying, because versions and prices change. No price is listed here on purpose.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Certified in Cybersecurity (CC)](https://www.isc2.org/certifications/cc) | ISC2 | Beginner | Official self-study material and candidate resources | Paid exam | A vocabulary-level entry credential; useful for career changers, not a substitute for labs |
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer videos, official objectives, community notes | Paid exam | Widely recognized baseline for IT and security roles |
| [Network+](https://www.comptia.org/certifications/network) | CompTIA | Beginner | Free video courses and objectives | Paid exam | Helpful if networking is your weakest area; not required for testing |
| [eJPT](https://ine.com/security/certifications/ejpt-certification) | INE | Beginner–intermediate | Some free INE content; check current access | Paid exam | Practical and approachable; verify the current exam format |
| [PNPT](https://certifications.tcm-sec.com/) | TCM Security | Intermediate | TCM's free YouTube course covers much of the material | Paid exam | Report-heavy and close to real assessment work |
| [OSCP](https://www.offsec.com/courses/pen-200/) | OffSec | Advanced | Official syllabus and lab documentation; course is paid | Paid exam and lab access | Respected practical credential; expensive and time-consuming, not an entry requirement |
| [HTB CPTS](https://academy.hackthebox.com/) | Hack The Box | Intermediate–advanced | Some free Academy modules | Paid path and exam | Structured and practical; useful if you already use the HTB ecosystem |

A certificate can open a conversation, but interviewers ask what you built and what you wrote. If you must choose between an exam voucher and six months of lab time, take the lab time first.

## Common detours and mistakes

- **Tool collecting instead of method.** Installing every Kali tool feels productive but teaches nothing about when a tool is appropriate. Learn the workflow first, then the tool that serves it.
- **Skipping networking.** You cannot troubleshoot an unexplained scan result or understand a proxy without TCP/IP, DNS, and HTTP. The foundation stage is not optional.
- **Watching without doing.** Video courses create familiarity, not skill. For every hour of video, spend at least two hours in a lab.
- **Testing real systems "for practice".** Scanning a public site or a friend's server without written permission is unauthorized access, even if you find nothing.
- **Chasing certifications before evidence.** A stack of entry certificates with no portfolio is weaker than two solid reports and a working lab.
- **Breadth without depth.** Ten half-finished specializations produce no employable skill. Finish one path far enough to build something real.
- **No documentation.** If you cannot reproduce your own work a month later, you did not learn it. Notes are part of the exercise.

## Next steps

1. Read [ETHICS.md](../ETHICS.md) and [01-home-lab.md](../practical-projects/01-home-lab.md), then build the lab before starting any tool.
2. Pick one specialization after Stage 4. Continue with [network penetration testing](network-pentester.md), [web security](web-security-specialist.md), [cloud security](cloud-security-engineer.md), [SOC analysis](soc-analyst.md), or [digital forensics](digital-forensics.md).
3. Start the [PortSwigger apprentice labs](https://portswigger.net/web-security/all-labs) and keep a casebook from day one.
4. Schedule fixed study blocks in a calendar and protect them; consistency beats intensity.
5. Use the [exercises](../exercises/README.md) and [checklists](../checklists/README.md) to add structure when you finish a stage.

## References

- [NIST SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final)
- [Penetration Testing Execution Standard (PTES)](https://www.pentest-standard.org/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [FIRST CVSS specification](https://www.first.org/cvss/)
- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [NCSC penetration testing guidance](https://www.ncsc.gov.uk/guidance/penetration-testing)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
