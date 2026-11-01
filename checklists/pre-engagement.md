# Pre-Engagement Checklist: Authorization, Scope, and Rules of Engagement

[Home](../README.md) / [Checklists](README.md) / Pre-engagement

Use this checklist before any penetration test, web assessment, red-team exercise, cloud review, or social-engineering simulation. The goal is to make authority, boundaries, communications, and data handling explicit before a single packet is sent.

> **No authorization, no testing.** If written authorization is missing, ambiguous, expired, or does not cover the target, stop. Do not "test first and ask later", do not rely on a verbal approval, and do not use a finding to justify access that was never granted. Escalate to the engagement owner and document the pause.

**Engagement ID:** `[ENG-YYYY-NNN]`
**Prepared by:** `[Name, role]`
**Date:** `[YYYY-MM-DD]`
**Version:** `[0.1 draft / 1.0 signed]`

## Scope reminder

- Authorization must come from someone with authority over the target, not only from a project sponsor who cannot approve testing.
- Every target must be identifiable: hostnames, IP ranges, applications, APIs, cloud accounts, repositories, physical sites, or people.
- Out-of-scope systems must be named explicitly, especially shared hosting, third-party APIs, identity providers, and production databases.
- The time window, source addresses, test accounts, and prohibited techniques belong in the rules of engagement.
- A signed document does not remove the need to stop when actual impact exceeds what was approved.

## 1. Engagement identity and document control

- [ ] Engagement name, ID, and version are recorded. — Owner: ___; Evidence: ___
- [ ] Client legal entity and testing entity are named exactly as they appear in the contract. — Owner: ___; Evidence: ___
- [ ] The signatory's name, title, and authority to approve testing are documented. — Owner: ___; Evidence: ___
- [ ] The authorization start and end dates, including time zone, are recorded. — Owner: ___; Evidence: ___
- [ ] A distribution list for the final report is agreed. — Owner: ___; Evidence: ___
- [ ] Document classification (for example, confidential) and handling rules are set. — Owner: ___; Evidence: ___

## 2. Authorization and authority

- [ ] A written authorization or statement of work is signed by an authorized representative. — Owner: ___; Evidence: ___
- [ ] The authorization explicitly permits the planned techniques and targets. — Owner: ___; Evidence: ___
- [ ] The authorization covers testing from the agreed source networks and accounts. — Owner: ___; Evidence: ___
- [ ] Third-party hosting, SaaS, API, or cloud-provider permission requirements are identified. — Owner: ___; Evidence: ___
- [ ] Reseller, managed-service, or supply-chain constraints are documented. — Owner: ___; Evidence: ___
- [ ] Insurance, indemnity, and liability terms have been reviewed by the responsible owner. — Owner: ___; Evidence: ___
- [ ] Any conflict of interest is declared and accepted in writing. — Owner: ___; Evidence: ___
- [ ] If any item above is incomplete, testing is paused rather than started. — Owner: ___; Evidence: ___

## 3. Scope definition

- [ ] In-scope domains, subdomains, IP ranges, and ports are listed. — Owner: ___; Evidence: ___
- [ ] In-scope applications, APIs, mobile apps, and repositories are listed with versions or environments. — Owner: ___; Evidence: ___
- [ ] In-scope cloud accounts, subscriptions, projects, and regions are listed. — Owner: ___; Evidence: ___
- [ ] In-scope identity providers, email systems, and collaboration tools are listed, if applicable. — Owner: ___; Evidence: ___
- [ ] Physical sites, wireless networks, and people are listed only if the engagement explicitly includes them. — Owner: ___; Evidence: ___
- [ ] Out-of-scope assets are named, including shared infrastructure and third-party services. — Owner: ___; Evidence: ___
- [ ] Production data, regulated data, and safety-critical systems have explicit handling constraints. — Owner: ___; Evidence: ___
- [ ] Test accounts and their privileges are defined and approved. — Owner: ___; Evidence: ___
- [ ] Source IP addresses and testing infrastructure are registered with the client's security team. — Owner: ___; Evidence: ___
- [ ] Scope changes require a written amendment, not an email aside. — Owner: ___; Evidence: ___

## 4. Rules of engagement

- [ ] Testing window, blackout periods, and change freezes are recorded. — Owner: ___; Evidence: ___
- [ ] Permitted techniques are listed, including whether exploitation, password attacks, or persistence are allowed. — Owner: ___; Evidence: ___
- [ ] Prohibited techniques are listed, such as denial of service, destructive actions, social engineering, or data exfiltration. — Owner: ___; Evidence: ___
- [ ] The maximum acceptable impact and rollback expectations are agreed. — Owner: ___; Evidence: ___
- [ ] Handling of discovered credentials, secrets, and personal data is defined before collection. — Owner: ___; Evidence: ___
- [ ] Evidence capture, storage, encryption, and destruction requirements are agreed. — Owner: ___; Evidence: ___
- [ ] The client's incident response process and "is this you?" verification method are documented. — Owner: ___; Evidence: ___
- [ ] Emergency stop procedure and code word are agreed. — Owner: ___; Evidence: ___
- [ ] Communication channels and response times for critical findings are agreed. — Owner: ___; Evidence: ___
- [ ] Any use of automated scanners, load, or fuzzing is explicitly approved and rate-limited. — Owner: ___; Evidence: ___

## 5. Communications and escalation

| Role | Name | Phone | Alternate channel | When to contact |
| --- | --- | --- | --- | --- |
| Engagement sponsor | `[Name]` | `[Number]` | `[Email/chat]` | Scope, approval, contract |
| Technical owner | `[Name]` | `[Number]` | `[Email/chat]` | Access, outages, target questions |
| Security operations | `[Team]` | `[Number]` | `[Ticket/chat]` | Suspected incident, alerts |
| Emergency stop contact | `[Name]` | `[Number]` | `[Email/chat]` | Safety or scope breach |
| Legal/privacy contact | `[Name]` | `[Number]` | `[Email]` | Data exposure, notification |

- [ ] The contact table is complete and tested before kickoff. — Owner: ___; Evidence: ___
- [ ] The client knows the tester's source addresses and user agents. — Owner: ___; Evidence: ___
- [ ] A daily or milestone status cadence is agreed. — Owner: ___; Evidence: ___
- [ ] Critical findings are reported within the agreed time, without waiting for the final report. — Owner: ___; Evidence: ___
- [ ] The escalation tree names a decision-maker for after-hours events. — Owner: ___; Evidence: ___

## 6. Legal, insurance, and contractual awareness

- [ ] The contract defines deliverables, acceptance criteria, and payment terms. — Owner: ___; Evidence: ___
- [ ] Confidentiality, data processing, and subcontractor terms are reviewed. — Owner: ___; Evidence: ___
- [ ] Applicable privacy and computer-misuse laws have been considered with qualified advice. — Owner: ___; Evidence: ___
- [ ] Insurance coverage and exclusions for security testing are understood. — Owner: ___; Evidence: ___
- [ ] Notification obligations for a real incident or data exposure are identified. — Owner: ___; Evidence: ___
- [ ] The client's legal counsel has had the opportunity to review the scope and rules of engagement. — Owner: ___; Evidence: ___
- [ ] No one has been asked to conceal a finding or bypass an approval requirement. — Owner: ___; Evidence: ___

This checklist is not legal advice. Local law, sector regulation, and contract terms can be stricter than this document. Involve qualified counsel when obligations are unclear.

## 7. Data handling and privacy

- [ ] Data classification and minimum-necessary collection are agreed. — Owner: ___; Evidence: ___
- [ ] Evidence storage is encrypted at rest and access-controlled. — Owner: ___; Evidence: ___
- [ ] A retention period and destruction method are defined. — Owner: ___; Evidence: ___
- [ ] Secrets and tokens are redacted from shared reports. — Owner: ___; Evidence: ___
- [ ] Personal data is not copied into notes, screenshots, or chat. — Owner: ___; Evidence: ___
- [ ] A data breach or accidental exposure procedure is documented. — Owner: ___; Evidence: ___
- [ ] Return or destruction of client data is confirmed in writing at closeout. — Owner: ___; Evidence: ___

## 8. Access and logistics

- [ ] Test accounts are created with the minimum privileges needed. — Owner: ___; Evidence: ___
- [ ] Multi-factor authentication enrollment is handled without sharing personal devices or secrets. — Owner: ___; Evidence: ___
- [ ] VPN, jump host, and network access are tested before the window opens. — Owner: ___; Evidence: ___
- [ ] Tooling is installed and licensed for the engagement. — Owner: ___; Evidence: ___
- [ ] A rollback or rebuild plan exists for any host that will be changed. — Owner: ___; Evidence: ___
- [ ] A communication channel that does not depend on the target environment is available. — Owner: ___; Evidence: ___

## 9. Kickoff and sign-off

- [ ] Kickoff covered scope, rules, contacts, data handling, and stop conditions. — Owner: ___; Evidence: ___
- [ ] The client confirmed that the targets are live and ready for testing. — Owner: ___; Evidence: ___
- [ ] The client confirmed that monitoring teams were notified and will not treat testing as an incident without verification. — Owner: ___; Evidence: ___
- [ ] The tester confirmed that no scope item is ambiguous. — Owner: ___; Evidence: ___
- [ ] Both parties signed the final rules of engagement. — Owner: ___; Evidence: ___
- [ ] The signed version is stored in the engagement record and referenced in the report. — Owner: ___; Evidence: ___

## Stop conditions

Stop immediately and contact the engagement owner if:

- A target resolves to an asset outside the approved scope.
- A test causes an outage, data corruption, or safety impact.
- You find real personal data, live secrets, or regulated data beyond the agreed plan.
- A third party is affected or a shared service is at risk.
- The client asks you to continue without the required approval or to hide a finding.
- You cannot verify that the person giving instructions is authorized.
- The emergency stop procedure is triggered.

**Stop decision record:** time `[HH:MM TZ]`, reason `[ ]`, who was notified `[ ]`, next action `[ ]`.

## References

- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident handling context for escalation and evidence.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — governance and risk framing.
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — engagement and reporting practices.
- [CIS Controls](https://www.cisecurity.org/controls) — control context for scoping.

---

**Related:** [Checklist index](README.md) · [Web assessment](web-assessment.md) · [Incident response](incident-response.md) · [Engagement report template](../templates/penetration-test-report.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md)

Last reviewed: 2026-10-31
