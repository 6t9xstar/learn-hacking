# Security ethics and law

[Home](../../README.md) / Foundations / Security ethics

Every technical skill in this curriculum is constrained by a simple rule: you may only test what you are authorised to test (authorization in US spelling). Ethics is not a soft add-on to security work. It is the operating licence that separates a professional from a trespasser, and it is tested in practice by contracts, audits, and courtrooms.

This guide covers the judgement and paperwork that surround technical work: authorisation, scope, consent, privacy, disclosure, evidence handling, and professional conduct. It is written for beginners and assumes no legal training. It is not legal advice; when real systems or real people are involved, consult a qualified lawyer in the relevant jurisdiction.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner. The hard part is judgement, not terminology. |
| Realistic time | 3–4 weeks at 3–5 hours per week, alongside technical study. |
| Cost | Free. |
| Prerequisites | None, though basic familiarity with IT and networking helps. |
| Lab requirement | No target systems needed; exercises use fictional clients and local labs. |
| Evidence of learning | A signed-style rules of engagement, a disclosure report, and a privacy assessment. |

## Why this field matters

A single unauthorised action can end a career. Accessing a system without permission is a criminal offence in many countries even when nothing is damaged, and "I was only testing" is not a defence. Organisations also carry legal duties to protect personal data, which means a tester who copies a database or pastes client data into a public tool creates a breach.

Ethics also protects the work itself. Clients buy assurance, and assurance depends on trust: trust that you will stay in scope, report honestly, protect their data, and not leave surprises behind. The technical community enforces the same norms through disclosure expectations, platform bans, and reputation.

## What you will learn

- Explain why written authorisation, scope, and rules of engagement are non-negotiable.
- Identify who can legally authorise testing of a system you do not own.
- Describe the main computer-misuse and privacy laws at a high level, without treating them as legal advice.
- Handle client data lawfully: minimise, secure, retain briefly, and redact.
- Run a responsible disclosure process and write a clear vulnerability report.
- Evaluate bug bounty scope and safe-harbour terms before touching a target.
- Apply professional codes and recognise conflicts of interest, dual-use risks, and AI-related pitfalls.

## Prerequisites and honest expectations

You do not need to memorise statutes. You do need to understand that laws differ by country and that ignorance is not a defence. This guide gives you the questions to ask, not the answers for every jurisdiction.

- Read the actual law or a lawyer's summary for your country; do not rely on forum folklore.
- Contracts and terms of service are not the same as criminal law. Violating either can have consequences.
- "Publicly accessible" does not mean "authorised to test". A login page you can reach is not an invitation.
- Ethical decisions are often made under time pressure. Decide your limits before you are in the situation.

## Core concepts

### Authorisation is the foundation

Authorisation is a documented grant of permission from someone with the legal authority to give it. It should identify the systems, domains, IP ranges, applications, and people in scope; the permitted techniques; the testing window; the data-handling rules; and the escalation contacts. Verbal permission is not enough, and permission from someone who does not own the system is worthless.

The practical rule is blunt: if it is not in scope, it is out of scope. If you discover an adjacent system that looks interesting, stop and ask for written approval before touching it. Scope documents protect both sides: they let the tester work confidently and give the client a clear record of what was agreed.

### Rules of engagement

Rules of engagement (RoE) translate authorisation into operational detail. A good RoE states what is prohibited as clearly as what is allowed: no denial-of-service testing, no social engineering, no production data exfiltration, no persistence, no testing of third-party services, no destructive payloads. It also names an emergency contact and a stop condition, such as "if you reach patient data, stop and notify".

Include the boring details: time zone, testing windows, source IP addresses the client should expect, whether the client's SOC knows the test is happening, and how findings are communicated. NIST SP 800-115 discusses these agreements in its planning phase, and most professional templates follow the same structure.

### Consent, ownership, and third parties

You almost never own the entire path between you and a target. A web application may run on a cloud provider, sit behind a CDN, use a third-party payment processor, and store data in a managed database. The client can authorise testing of its own application, but may not be able to authorise testing of the provider's infrastructure or another company's service.

Map the dependencies before you start. Ask whether shared infrastructure is involved, whether the provider's acceptable-use policy permits security testing, and whether another party's written consent is required. For multi-tenant systems, a test that affects other tenants is out of scope even if the client owns one tenant.

### Computer-misuse law

Most countries criminalise unauthorised access to computer systems. In the United States, the Computer Fraud and Abuse Act (18 U.S.C. § 1030) is the best-known federal statute, supplemented by state laws. In the United Kingdom, the Computer Misuse Act 1990 covers unauthorised access, unauthorised acts, and unauthorised modification. Other jurisdictions have equivalents, and some apply extraterritorially.

The details vary enormously: what counts as "authorisation", whether exceeding authorised access is a crime, and what penalties apply. This is why written scope matters. It is evidence of authorisation, and it defines the boundary of permissible conduct. For any real engagement, have a lawyer review the agreement under the relevant law.

### Privacy and data protection

Privacy law governs how personal data is collected, used, stored, and shared. The EU General Data Protection Regulation (GDPR) is the most influential model: it requires a lawful basis, purpose limitation, data minimisation, accuracy, storage limitation, integrity and confidentiality, and accountability. It grants rights to individuals and requires breach notification, typically within 72 hours of becoming aware, and data protection impact assessments for high-risk processing.

Testers encounter personal data constantly, often more of it than the engagement requires. Collect only what you need to prove a finding, redact it in reports, store it encrypted, restrict access, and delete it on an agreed schedule. If you accidentally access more than intended, stop, document what happened, and notify the client promptly. Other regimes, such as California's privacy laws and national implementations around the world, impose similar obligations with different details.

### Responsible disclosure

Responsible or coordinated disclosure means reporting a vulnerability privately to the party that can fix it, then agreeing on a timeline for remediation and publication. A useful report includes a clear summary, affected versions, reproduction steps, impact, supporting evidence, and suggested remediation. Avoid drama, exaggeration, and demands.

Many programmes use a 90-day window before public disclosure, but that is a norm, not a law; the right timeline depends on risk, complexity, and the vendor's responsiveness. Standards such as ISO/IEC 29147 (vulnerability disclosure) and ISO/IEC 30111 (vulnerability handling) describe the process. If a vendor is unresponsive, escalate carefully through a coordinator or regulator rather than publishing exploit details.

### Bug bounty rules and safe harbour

A bug bounty programme is a public offer of payment for qualifying findings within a defined scope. The programme rules define in-scope assets, prohibited techniques, duplicate handling, disclosure policy, and legal safe harbour. Read them before you test. A safe-harbour clause is the programme's promise not to pursue legal action for good-faith testing that follows the rules; it does not authorise anything outside the programme.

Bounties are not guaranteed income, and most reports are duplicates or out of scope. Treat the platform's terms, the programme's scope, and your local law as separate checks. A finding on an asset you were not authorised to test is not made legitimate by the fact that the company runs a bounty programme.

### Evidence, confidentiality, and retention

Evidence must be accurate, attributable, and protected. Record timestamps with time zones, hash important files, keep a chain-of-custody note for anything you transfer, and store data encrypted with access limited to the engagement team. Screenshots should show enough context to be credible without exposing unrelated personal data.

Confidentiality obligations usually survive the engagement. Do not reuse client data in portfolios, training sets, or blog posts. If you need examples, recreate them with synthetic data. Retention should be defined in the contract: keep what is required for the report and retest, then destroy the rest and confirm destruction in writing.

### Professional codes and conduct

Professional bodies publish codes that describe expected behaviour. The ACM Code of Ethics emphasises honesty, avoiding harm, respecting privacy, and contributing to society. The (ISC)² code asks members to protect society, act honourably, provide diligent and competent service, and advance the profession. These codes are not law, but they are used in disciplinary proceedings and they give you a vocabulary for refusing unethical requests.

Competence is part of ethics. Do not accept work beyond your skill without supervision, disclose conflicts of interest, and report findings honestly even when they are embarrassing to you. Never install unapproved backdoors or persistence, never exfiltrate more data than necessary, and never surprise the client with an action they did not approve.

### Dual-use knowledge and the limits of curiosity

Most security knowledge can be used for good or harm. The difference is context: a port scan of your own lab is learning; a port scan of a stranger's server is unauthorised access in many jurisdictions. Terms of service may prohibit scanning even where criminal law is unclear, and "I did not know" does not restore trust.

Know your own limits. If a request feels like it is asking you to test without authorisation, harm availability, or hide activity from the client's own defenders, stop and escalate. Document the concern and ask for written clarification. A reputation for careful, honest work is worth more than any single finding.

### AI-assisted work and new pitfalls

AI assistants can speed up reporting, code review, and research, but they introduce new ethical duties. Do not paste client data, credentials, or proprietary code into a service that may retain it. Verify every generated finding: models invent vulnerabilities, misread code, and produce confident but wrong remediation. Disclose material AI assistance where your client, employer, or publication requires it, and keep a human accountable for the final report.

## Legal and safe practice

Treat this whole guide as a pre-engagement checklist. Before any test, confirm authorisation, scope, the people who can approve changes, data-handling rules, and your emergency contact.

- Get written authorisation from the system owner before testing, and keep it accessible during the engagement.
- Use only the techniques and targets listed in the scope; ask before expanding.
- Prefer synthetic or test data; never take more real data than a finding requires.
- Protect evidence with encryption, access control, and a documented retention period.
- Report vulnerabilities privately and in good faith; never threaten, extort, or publish exploit details before remediation.
- If in doubt, stop and ask. A delayed test is recoverable; an unauthorised action may not be.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Norms | Read the ACM and (ISC)² codes and summarise them in your own words. | One-page personal code of conduct |
| 1 | Authorisation | Draft an authorisation letter and a rules of engagement for a fictional client. | Signed-style documents with scope and stop conditions |
| 2 | Law | Read the computer-misuse and privacy summaries for your jurisdiction. | A jurisdiction brief with open questions for a lawyer |
| 3 | Disclosure | Write a vulnerability report for a flaw in a local lab application. | Report plus a disclosure email and timeline |
| 4 | Privacy | Complete a small data protection impact assessment for a fictional app. | Data map, risks, and mitigations |
| 5 | Capstone | Present an engagement plan to a reviewer and defend every boundary. | Reviewed plan with sign-off checklist |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CS50's Introduction to Cybersecurity](https://cs50.harvard.edu/cybersecurity/) | Harvard University | Beginner | Free | Projects | Security, privacy, and law in one coherent course |
| [Cyber Security Base](https://cybersecuritybase.mooc.fi/) | University of Helsinki | Beginner | Free | Exercises | Security foundations with an ethics and law module |
| [Cybersecurity for Everyone](https://www.coursera.org/learn/cybersecurity-for-everyone) | University of Maryland via Coursera | Beginner | Free to audit; certificate paid | No labs | Policy, incentives, and organisational context |
| [Introduction to Cyber Security](https://www.open.edu/openlearn/) | The Open University | Beginner | Free | No labs | Structured introduction with assessments |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free | Video lessons and CTF | Bug bounty workflow and disclosure norms |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [ACM Code of Ethics](https://www.acm.org/code-of-ethics) | ACM | A widely used professional code for computing work |
| [(ISC)² Code of Ethics](https://www.isc2.org/ethics) | ISC2 | The canons expected of certified security professionals |
| [Computer Fraud and Abuse Act](https://www.law.cornell.edu/uscode/text/18/1030) | Cornell LII | The US federal computer-misuse statute, with commentary |
| [Computer Misuse Act 1990](https://www.legislation.gov.uk/ukpga/1990/18/contents) | UK Government | The UK statute on unauthorised access and modification |
| [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | European Union | The reference data-protection regulation |
| [Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html) | OWASP | Practical guidance for reporting and disclosure |

## Hands-on labs and training grounds

Ethics is practised through documentation and decision-making, then tested in safe environments. Use these labs to rehearse the full workflow: authorisation, testing, evidence, report, disclosure.

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| Local VM lab | You | Free | Testing only systems you own, with snapshots and notes |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free | Find and document flaws in a deliberately vulnerable app |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Guided labs with defined targets and rules |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Freemium | Structured paths that model professional workflow |

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| GnuPG | Encrypt evidence and sign reports and emails | [gnupg.org](https://gnupg.org/) |
| OpenSSL | Hash files and inspect certificates | [openssl.org](https://www.openssl.org/) |
| coreutils | Generate SHA-256 checksums for evidence integrity | [GNU coreutils](https://www.gnu.org/software/coreutils/) |
| VeraCrypt | Encrypted containers for client data at rest | [veracrypt.fr](https://www.veracrypt.fr/) |
| Git | Version reports and preserve an audit trail of changes | [git-scm.com](https://git-scm.com/) |

Tools do not replace judgement. Encryption protects stored evidence only if the key is protected and access is logged. A signed report means little if the findings inside it are exaggerated.

## Practical projects and exercises

**Project 1: Rules of engagement and authorisation letter.**
Objective: practise the documents that make testing lawful. Setup: invent a client with a small e-commerce site, a staging environment, and a third-party payment provider. Draft an authorisation letter and RoE covering scope, exclusions, windows, prohibited techniques, data handling, escalation, and sign-off. Deliverable: a complete pack with a scope table and a stop-condition checklist.

**Project 2: Responsible disclosure simulation.**
Objective: rehearse the disclosure conversation. Setup: find a low-risk issue in a local Juice Shop instance, document it with reproduction and impact, and write the initial vendor email, a follow-up, and a disclosure timeline. Deliverable: a private report and a disclosure plan with dates and escalation criteria.

**Project 3: Privacy impact assessment (portfolio-worthy).**
Objective: show that you can reason about data, not just systems. Setup: choose a fictional app that stores customer records, map the data flows, identify lawful basis and retention, list risks to individuals, and propose mitigations. Deliverable: a short DPIA-style document with a data-flow diagram and a risk table.

## Common mistakes and misconceptions

- **Verbal permission is enough.** It is not evidence, and it rarely covers the systems people assume it covers.
- **Public means authorised.** Reachability is not consent; testing a public site without permission can still be a crime.
- **A bug bounty covers everything the company owns.** Scope is explicit, and out-of-scope assets are out of bounds.
- **Disclosing immediately is brave.** Publishing before remediation can endanger users and breach trust.
- **Client data makes a great portfolio.** It is a confidentiality breach; recreate examples with synthetic data.
- **Local law does not apply to me because the server is abroad.** Jurisdictions overlap, and both parties' laws may apply.
- **Ethics is someone else's job.** The person with hands on the keyboard carries the responsibility.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Security consultant | Technical foundations plus communication | Clean scoping documents, evidence discipline, and reports |
| Penetration tester | Labs plus methodology | Scope adherence and professional conduct under pressure |
| GRC or privacy analyst | Policy or legal interest | Clear control mapping and data-protection reasoning |
| Bug bounty researcher | Web skills and patience | Scope discipline and high-quality disclosure reports |

Trust is the currency of this field. A tester who is careful, honest, and pleasant to work with gets repeat engagements; one who goes out of scope does not.

## Next steps

1. Write your own one-page code of conduct and keep it with your engagement notes.
2. Draft the rules of engagement project and have someone review it for missing boundaries.
3. Read the computer-misuse and privacy summaries for your country, and note what needs a lawyer.
4. Continue to [Ethical hacking](../../ethical-hacking/README.md) to see these rules applied across an engagement.
5. Use the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md) to place ethics study in the wider plan.

## References

- ACM, *Code of Ethics and Professional Conduct*, <https://www.acm.org/code-of-ethics>
- ISC2, *Code of Ethics*, <https://www.isc2.org/ethics>
- Cornell Law School, *18 U.S.C. § 1030*, <https://www.law.cornell.edu/uscode/text/18/1030>
- UK Government, *Computer Misuse Act 1990*, <https://www.legislation.gov.uk/ukpga/1990/18/contents>
- European Union, *General Data Protection Regulation*, <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- OWASP, *Vulnerability Disclosure Cheat Sheet*, <https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html>
- NIST, *SP 800-115: Technical Guide to Information Security Testing and Assessment*, <https://csrc.nist.gov/pubs/sp/800/115/final>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)
