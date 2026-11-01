# Incident Response Checklist: NIST SP 800-61r3 Aligned

[Home](../README.md) / [Checklists](README.md) / Incident response

This checklist supports preparation, detection, response, recovery, and improvement for a security incident. It is organized around the six functions of the NIST Cybersecurity Framework 2.0 used by [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final): Govern, Identify, Protect, Detect, Respond, and Recover.

SP 800-61r3 treats incident response as part of cybersecurity risk management rather than a single sequential procedure. Use this checklist as a decision aid, adapt it to your organization's plan, and follow your legal and privacy obligations. It is not a substitute for an incident response plan, legal advice, or regulatory guidance.

> **Real incidents need authority.** Do not isolate, delete, or reconfigure a production system in a real incident unless your role and the incident plan authorize it. Preserve evidence and escalate. This checklist is also used in tabletop exercises, where no real systems should be changed.

**Incident ID:** `[INC-YYYY-NNN]`
**Incident commander:** `[Name]`
**Start time (UTC):** `[YYYY-MM-DD HH:MM]`
**Current severity:** `[SEV1 / SEV2 / SEV3 / SEV4]`

## Scope reminder

- Record the systems, accounts, data, and business services currently believed to be affected.
- State what is confirmed, suspected, and unknown. Do not let a hypothesis become a fact in the record.
- Define the evidence sources and who can access them.
- Identify the legal, privacy, contractual, and regulatory owners before notifications are sent.
- Set a review cadence and a single source of truth for decisions.

## 1. Govern

- [ ] An incident response policy exists, is approved, and names its owner. — Owner: ___; Evidence: ___
- [ ] Roles are assigned: incident commander, operations lead, communications lead, legal/privacy lead, scribe. — Owner: ___; Evidence: ___
- [ ] A deputy exists for each critical role. — Owner: ___; Evidence: ___
- [ ] The incident classification and severity scheme is documented. — Owner: ___; Evidence: ___
- [ ] Authority to isolate systems, disable accounts, and contact executives is explicit. — Owner: ___; Evidence: ___
- [ ] Communication channels and out-of-band contact methods are tested. — Owner: ___; Evidence: ___
- [ ] Legal, privacy, regulatory, and law-enforcement contacts are current. — Owner: ___; Evidence: ___
- [ ] Third-party providers and their escalation paths are recorded. — Owner: ___; Evidence: ___
- [ ] Insurance and contractual notification requirements are known. — Owner: ___; Evidence: ___
- [ ] Metrics (time to detect, time to contain, time to recover) are defined. — Owner: ___; Evidence: ___

## 2. Identify

- [ ] Asset inventory and ownership are current enough to scope the incident. — Owner: ___; Evidence: ___
- [ ] Data classification and business-critical services are documented. — Owner: ___; Evidence: ___
- [ ] Identity providers and privileged accounts are mapped. — Owner: ___; Evidence: ___
- [ ] Network, cloud, endpoint, and application log sources are inventoried. — Owner: ___; Evidence: ___
- [ ] Dependencies on suppliers and third parties are documented. — Owner: ___; Evidence: ___
- [ ] Risk assessment identifies likely incident scenarios and impacts. — Owner: ___; Evidence: ___
- [ ] Incident declaration criteria are agreed, including who can declare. — Owner: ___; Evidence: ___
- [ ] A contact list for asset owners and business owners is available offline. — Owner: ___; Evidence: ___

## 3. Protect

- [ ] Critical systems are hardened against the organization's baselines. — Owner: ___; Evidence: ___
- [ ] Logging is enabled, time-synchronized, and protected from tampering. — Owner: ___; Evidence: ___
- [ ] Backups are isolated, immutable where possible, and tested for restore. — Owner: ___; Evidence: ___
- [ ] Privileged access uses MFA and least privilege. — Owner: ___; Evidence: ___
- [ ] Endpoint and email protections are deployed and monitored. — Owner: ___; Evidence: ___
- [ ] Incident response playbooks exist for priority scenarios. — Owner: ___; Evidence: ___
- [ ] Staff receive phishing and incident-reporting training. — Owner: ___; Evidence: ___
- [ ] A tabletop or simulation was run in the last 12 months. — Owner: ___; Evidence: ___

## 4. Detect and analyze

- [ ] Monitoring covers identity, endpoint, network, cloud, and application layers. — Owner: ___; Evidence: ___
- [ ] Alerts have owners, severity, and runbooks. — Owner: ___; Evidence: ___
- [ ] Triage validates the alert against raw telemetry, not only the alert text. — Owner: ___; Evidence: ___
- [ ] The initial timeline records first known activity, detection, and declaration. — Owner: ___; Evidence: ___
- [ ] Affected accounts, hosts, and data are scoped with evidence. — Owner: ___; Evidence: ___
- [ ] A hypothesis and alternative explanation are recorded. — Owner: ___; Evidence: ___
- [ ] Severity is assigned using the organization's scheme. — Owner: ___; Evidence: ___
- [ ] Evidence is preserved before remediation changes volatile data. — Owner: ___; Evidence: ___
- [ ] The incident is declared and escalated to the named owners. — Owner: ___; Evidence: ___

### Severity prompt

| Severity | Example criteria | Decision owner |
| --- | --- | --- |
| SEV1 | Confirmed widespread compromise, safety impact, or critical data loss | Executive/incident commander |
| SEV2 | Confirmed compromise of a business-critical system or privileged account | Incident commander |
| SEV3 | Limited compromise with a contained scope | Security lead |
| SEV4 | Suspicious activity requiring investigation | On-call analyst |

## 5. Respond

### Containment

- [ ] Short-term containment is approved and recorded. — Owner: ___; Evidence: ___
- [ ] Isolation method preserves needed evidence and business continuity. — Owner: ___; Evidence: ___
- [ ] Credentials and tokens that may be exposed are revoked or rotated. — Owner: ___; Evidence: ___
- [ ] Affected accounts are disabled or restricted with proper approval. — Owner: ___; Evidence: ___
- [ ] Third parties and customers are notified through approved channels. — Owner: ___; Evidence: ___
- [ ] Containment is verified, not assumed. — Owner: ___; Evidence: ___

### Eradication

- [ ] Root cause or initial access vector is identified with evidence. — Owner: ___; Evidence: ___
- [ ] Malicious accounts, persistence, and scheduled tasks are removed. — Owner: ___; Evidence: ___
- [ ] Vulnerabilities and misconfigurations are fixed or mitigated. — Owner: ___; Evidence: ___
- [ ] Re-imaging or rebuilding is chosen where trust cannot be restored. — Owner: ___; Evidence: ___
- [ ] Eradication is validated with independent checks. — Owner: ___; Evidence: ___

### Recovery

- [ ] Recovery criteria and business owner approval are documented. — Owner: ___; Evidence: ___
- [ ] Restoration uses known-good backups or rebuilt systems. — Owner: ___; Evidence: ___
- [ ] Monitoring is heightened during and after recovery. — Owner: ___; Evidence: ___
- [ ] Service health and data integrity are verified. — Owner: ___; Evidence: ___
- [ ] Users receive clear, approved guidance. — Owner: ___; Evidence: ___
- [ ] The incident is not closed until recovery is confirmed. — Owner: ___; Evidence: ___

## 6. Recover and improve

- [ ] A post-incident review is scheduled within the policy timeframe. — Owner: ___; Evidence: ___
- [ ] The timeline and decisions are reviewed for accuracy. — Owner: ___; Evidence: ___
- [ ] Root cause and contributing factors are separated. — Owner: ___; Evidence: ___
- [ ] Corrective actions have owners, due dates, and success measures. — Owner: ___; Evidence: ___
- [ ] Detection and response gaps are converted into backlog items. — Owner: ___; Evidence: ___
- [ ] Lessons learned are shared with the teams that need them. — Owner: ___; Evidence: ___
- [ ] The incident record is retained according to policy and law. — Owner: ___; Evidence: ___

## 7. Evidence and chain of custody

- [ ] Evidence sources and collection methods are documented. — Owner: ___; Evidence: ___
- [ ] A chain-of-custody log records who handled each item, when, and why. — Owner: ___; Evidence: ___
- [ ] Hashes are computed at collection and verified after transfer. — Owner: ___; Evidence: ___
- [ ] Storage is encrypted and access is limited to the incident team. — Owner: ___; Evidence: ___
- [ ] Personal data is minimized and handled under the privacy plan. — Owner: ___; Evidence: ___
- [ ] Evidence is retained or destroyed according to the approved schedule. — Owner: ___; Evidence: ___

## 8. Communications and notification considerations

- [ ] Internal status updates use a consistent template and cadence. — Owner: ___; Evidence: ___
- [ ] External communications are approved by legal and communications leads. — Owner: ___; Evidence: ___
- [ ] Notification obligations are assessed with qualified advice. — Owner: ___; Evidence: ___
- [ ] Regulators, customers, partners, and insurers are notified only through approved channels. — Owner: ___; Evidence: ___
- [ ] Law enforcement engagement is a documented decision, not an automatic action. — Owner: ___; Evidence: ___
- [ ] Public statements avoid speculation and unverified attribution. — Owner: ___; Evidence: ___

## Stop conditions

Pause and escalate if containment would destroy evidence, if a notification deadline may be missed, if the incident crosses into safety-critical systems, if legal privilege is unclear, or if an action exceeds your authority. Record the pause and the decision owner.

## References

- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response recommendations and CSF 2.0 alignment.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — Govern, Identify, Protect, Detect, Respond, Recover.
- [MITRE ATT&CK](https://attack.mitre.org/) — technique context for detection and analysis.
- [CIS Controls](https://www.cisecurity.org/controls) — safeguards that support preparation and recovery.

---

**Related:** [Checklist index](README.md) · [Pre-engagement](pre-engagement.md) · [Incident report template](../templates/incident-report.md) · [Blue team drills](../exercises/blue-team-drills.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
