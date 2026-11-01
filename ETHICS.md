# Ethics, Law, and Responsible Practice

> **The short version:** If you do not own the system or have explicit, written permission from someone who does, do not test it. Curiosity is not authorization.

This repository teaches how systems fail and how to defend them. That knowledge is powerful. Using it safely requires more than technical skill: it requires judgment, written authorization, respect for privacy, and a willingness to stop.

This document explains the standards expected of learners and contributors. It is educational guidance, not legal advice. Laws differ by country, state, and industry. When a real engagement matters, consult a qualified lawyer and your organization's policies.

## Table of contents

- [Authorization is the boundary](#authorization-is-the-boundary)
- [Scope is a technical control](#scope-is-a-technical-control)
- [Laws you should know exist](#laws-you-should-know-exist)
- [Responsible disclosure](#responsible-disclosure)
- [Privacy and data minimization](#privacy-and-data-minimization)
- [Safe laboratory practice](#safe-laboratory-practice)
- [Professional conduct](#professional-conduct)
- [Prohibited uses](#prohibited-uses)
- [If something goes wrong](#if-something-goes-wrong)
- [Reporting a problem in this repository](#reporting-a-problem-in-this-repository)
- [References](#references)

## Authorization is the boundary

Authorization must be **explicit**, **current**, and **specific**. It should come from a person or organization with the legal authority to grant it. It should be in writing and should identify:

- the systems, domains, IP ranges, applications, accounts, and cloud tenancies in scope;
- the testing window, including time zone;
- permitted and prohibited techniques;
- emergency stop and escalation contacts;
- data handling and confidentiality requirements;
- what happens if testing causes an outage or exposes sensitive data.

A public bug bounty page can be authorization for a defined program, but only within its published scope and rules. "It was on the internet" is not permission. A friend saying "try my website" is weaker than a signed agreement and may not cover the hosting provider, third-party APIs, or shared infrastructure.

Stop immediately if:

- you discover you are touching a system outside scope;
- testing could affect availability or safety;
- you encounter real user data you did not expect;
- the client asks you to hide a material risk;
- you are unsure whether an action is authorized.

## Scope is a technical control

Scope is not a legal formality. Translate it into allow-lists, hosts files, proxy rules, network segmentation, and budget limits. Use a dedicated testing machine and a separate browser profile. Record every target you contact.

For cloud work, scope includes account IDs, regions, services, and whether production data may be accessed. For wireless work, scope includes physical premises and spectrum regulations. For social engineering, scope must explicitly include the people, pretexts, and communications allowed. For physical testing, scope must include property, safety, and insurance considerations.

## Laws you should know exist

You do not need to memorize statutes, but you should understand that unauthorized access and interference can be criminal or civil offenses. Examples include:

- **United States:** Computer Fraud and Abuse Act (CFAA) and state computer crime laws. The U.S. Department of Justice maintains a [CFAA enforcement policy](https://www.justice.gov/jm/jm-9-48000-computer-fraud).
- **United Kingdom:** Computer Misuse Act 1990, available on [legislation.gov.uk](https://www.legislation.gov.uk/ukpga/1990/18/contents).
- **European Union:** Directive 2013/40/EU on attacks against information systems, available via [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2013/40/oj).
- **International:** The Council of Europe [Budapest Convention on Cybercrime](https://www.coe.int/en/web/cybercrime/the-budapest-convention) and its protocols.
- **Data protection:** the EU [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), UK GDPR, and national privacy laws may apply to personal data you encounter during testing, even when access was authorized.

Other relevant areas include export controls, sanctions, telecommunications and radio regulations, consumer protection, breach notification, and sector rules for health, finance, and critical infrastructure. Ignorance is not a reliable defense.

## Responsible disclosure

If you find a vulnerability, do not publish exploitable details before the vendor has had a reasonable opportunity to fix it. A practical disclosure process:

1. **Stop and preserve minimal evidence.** Do not download personal data or pivot further than necessary to prove impact.
2. **Identify the correct contact.** Use the vendor's `security.txt`, bug bounty program, PSIRT page, or coordinated disclosure policy.
3. **Report privately.** Include affected asset, version, reproduction steps, observed impact, and a safe proof of concept. Avoid including real user data.
4. **Agree on a timeline.** Many organizations target 90 days, but complexity and active exploitation may change it. Keep communication professional.
5. **Coordinate public disclosure.** Publish only after a fix or an agreed deadline, and sanitize details that could harm users.
6. **Do not demand payment.** Extortion is a crime. Bug bounty rewards are governed by the program, not by threats.

Useful references include the [CISA Coordinated Vulnerability Disclosure process](https://www.cisa.gov/coordinated-vulnerability-disclosure-process), [disclose.io](https://disclose.io/), and [HackerOne's disclosure guidelines](https://www.hackerone.com/disclosure-guidelines).

## Privacy and data minimization

Security work often exposes information that was never meant for you. Treat it as radioactive:

- Collect the minimum evidence needed to demonstrate a finding.
- Redact names, emails, tokens, health data, financial data, and private messages.
- Do not reuse credentials or personal data for unrelated testing.
- Store evidence encrypted, with access limited to the engagement team.
- Delete data according to the engagement agreement and applicable retention requirements.
- Never publish screenshots containing real personal data, internal hostnames, or secrets.
- Avoid uploading client data to random online scanners or AI tools without written permission.

## Safe laboratory practice

Potential hazards include malware, vulnerable services, malicious documents, RF transmissions, and hardware connected to mains power. Reduce risk:

- Use isolated virtual machines, a dedicated lab network, and snapshots.
- Do not bridge a malware lab to your home LAN.
- Use synthetic or deliberately vulnerable data, not real client data.
- Disable shared folders, clipboard sharing, and USB passthrough unless required.
- Verify the source of training samples. Do not download live malware outside a controlled, legitimate training environment.
- Keep hypervisors, guest tools, and analysis tools patched.
- Label lab systems clearly and tear them down when finished.
- For hardware, use current-limited supplies, ESD protection, and never probe mains circuits.

See the [home lab checklist](checklists/home-lab.md) and [Project 1: Build a Home Lab](practical-projects/01-home-lab.md).

## Professional conduct

Competence is only half of trust. Professionals:

- decline work they are not qualified to perform safely;
- document findings honestly, including uncertainty and limitations;
- protect client confidentiality and avoid conflicts of interest;
- do not use access to gain personal advantage;
- communicate risk in business terms, not just CVE IDs;
- treat help-desk staff, developers, and administrators with respect;
- test accessibility and safety, not just "cool" exploits;
- report accidental exposure instead of hiding it.

## Prohibited uses

This repository must not be used to:

- access, damage, or disrupt systems without authorization;
- stalk, harass, dox, or surveil people;
- steal credentials, data, money, or services;
- deploy malware, ransomware, or persistent backdoors on other people's systems;
- evade detection for malicious purposes;
- bypass licensing, paywalls, or access controls for non-security purposes;
- attack critical infrastructure, healthcare, or safety systems;
- distribute pirated courses, exam dumps, or stolen data;
- conduct "security research" as a pretext for abuse.

Contributions that facilitate these uses will be removed.

## If something goes wrong

If you accidentally access data beyond scope, cause a service issue, or suspect a real compromise:

1. Stop testing.
2. Preserve logs and evidence without copying sensitive content unnecessarily.
3. Notify the authorized contact immediately, using the agreed emergency channel.
4. Follow their containment instructions and document the timeline.
5. Do not delete evidence or post about the incident.
6. Seek legal and management guidance.

Prompt, honest reporting is almost always better than concealment.

## Reporting a problem in this repository

If a page contains an unsafe instruction, a malicious link, or material that could cause harm, follow [SECURITY.md](SECURITY.md). Do not test third-party systems to demonstrate the issue. For ordinary content corrections, open an issue using the repository templates.

## References

- [CISA: Cyber Essentials Toolkit](https://www.cisa.gov/resources-tools/resources/cyber-essentials-toolkits)
- [CISA: Coordinated Vulnerability Disclosure](https://www.cisa.gov/coordinated-vulnerability-disclosure-process)
- [Council of Europe: Budapest Convention](https://www.coe.int/en/web/cybercrime/the-budapest-convention)
- [disclose.io: Vulnerability disclosure terms](https://disclose.io/)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [OWASP: Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [U.S. DOJ: CFAA enforcement policy](https://www.justice.gov/jm/jm-9-48000-computer-fraud)

---

[Back to repository home](README.md) · [Learning guide](LEARNING-GUIDE.md) · [Contribution rules](CONTRIBUTING.md)
