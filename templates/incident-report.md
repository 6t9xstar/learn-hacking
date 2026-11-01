# Incident Report Template

[Home](../README.md) / [Templates](README.md) / Incident report

Use this template to record a security incident in a way that supports technical review, legal and privacy assessment, and organizational learning. Complete it from evidence and contemporaneous notes. Do not rewrite history to make the response look cleaner.

> **Legal and privacy caution.** Incident reports can contain personal data, regulated data, and legally privileged analysis. Limit distribution, follow the organization's retention policy, and involve legal and privacy owners before sharing outside the response team. This template does not determine notification obligations.

**Incident ID:** `[INC-YYYY-NNN]`
**Classification:** `[Confidential / Legally privileged / Internal]`
**Report version:** `[0.1 draft / 1.0 final]`
**Incident commander:** `[Name]`

## 1. Document control

| Field | Value |
| --- | --- |
| Incident title | `[Short, factual title]` |
| Incident type | `[Malware / unauthorized access / data exposure / denial of service / insider / supply chain / other]` |
| Severity | `[SEV1 / SEV2 / SEV3 / SEV4]` |
| Status | `[Open / Contained / Eradicated / Recovered / Closed]` |
| Detection source | `[Alert, user report, third party, audit]` |
| Date detected | `[YYYY-MM-DD HH:MM UTC]` |
| Date declared | `[YYYY-MM-DD HH:MM UTC]` |
| Date contained | `[YYYY-MM-DD HH:MM UTC or TBD]` |
| Date recovered | `[YYYY-MM-DD HH:MM UTC or TBD]` |
| Report author | `[Name, role]` |
| Reviewers | `[Names and roles]` |
| Distribution | `[Named recipients only]` |

## 2. Executive summary

Write four to six sentences:

- What happened, without speculation.
- Which business services and data were affected.
- What the response team did.
- The current status and residual risk.
- The most important decisions or notifications still pending.

## 3. Classification and severity

**Incident category:** `[Category]`
**Severity:** `[SEV1–SEV4]`
**Rationale:** `[Business impact, scope, data sensitivity, safety, regulatory exposure]`

| Dimension | Assessment |
| --- | --- |
| Confidentiality impact | `[None / Low / Moderate / High]` |
| Integrity impact | `[None / Low / Moderate / High]` |
| Availability impact | `[None / Low / Moderate / High]` |
| Safety impact | `[None / Low / Moderate / High]` |
| Data types involved | `[Personal, financial, health, credentials, intellectual property]` |
| Estimated scope | `[Accounts, hosts, tenants, records, customers]` |
| Current confidence | `[Confirmed / Likely / Suspected]` |

## 4. Timeline

All times in UTC. Include the source of each entry and whether it is confirmed or inferred.

| Time (UTC) | Event | Source | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| `[YYYY-MM-DD HH:MM]` | First known activity | `[Log, alert, report]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Detection | `[SIEM, EDR, user]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Incident declared | `[Ticket, call]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Containment action | `[Change, ticket]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Eradication action | `[Change, ticket]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Recovery validated | `[Test, monitoring]` | `[Ref]` | `[Confirmed]` |
| `[YYYY-MM-DD HH:MM]` | Incident closed | `[Review]` | `[Ref]` | `[Confirmed]` |

**Timeline gaps.** `[What periods are missing data, and how does that limit the conclusions?]`

## 5. Affected assets and data

| Asset | Type | Owner | Role in incident | Current status | Evidence |
| --- | --- | --- | --- | --- | --- |
| `[Host / account / service]` | `[Endpoint, server, cloud, SaaS]` | `[Team]` | `[Initial access, lateral movement, data store]` | `[Isolated, rebuilt, clean]` | `[Ref]` |

**Data assessment.** Record the following facts.

- Categories of data potentially accessed: `[Types]`
- Volume or record count: `[Estimate and method]`
- Identifiers involved: `[Names, emails, financial, health, credentials]`
- Encryption or other protections: `[At rest, in transit, tokenized]`
- Evidence of exfiltration: `[Confirmed / suspected / none found, with basis]`

## 6. Detection and analysis

**Detection mechanism.** `[How the incident was noticed and why it was not noticed earlier]`

**Initial hypothesis.** `[What the team believed at the time]`

**Analysis performed.** `[Log queries, endpoint triage, network analysis, interviews, malware analysis]`

**What was confirmed.** `[Facts supported by evidence]`

**What remains uncertain.** `[Open questions and their impact on conclusions]`

**Root cause.** `[The technical or process failure that allowed the incident]`

**Contributing factors.** `[Detection gaps, access design, training, supplier issues, configuration]`

Do not label a person as the root cause. Describe the conditions and decisions that allowed the incident.

## 7. Containment

| Action | Time (UTC) | Owner | Approval | Effect | Evidence |
| --- | --- | --- | --- | --- | --- |
| `[Isolate host]` | `[Time]` | `[Name]` | `[Ticket]` | `[Contained]` | `[Ref]` |
| `[Revoke sessions and rotate credentials]` | `[Time]` | `[Name]` | `[Ticket]` | `[Contained]` | `[Ref]` |
| `[Block indicator]` | `[Time]` | `[Name]` | `[Ticket]` | `[Blocked]` | `[Ref]` |

**Short-term containment rationale.** `[Why this method, and what business impact it caused]`

**Evidence preserved before containment.** `[Volatile data, disk images, logs, cloud audit exports]`

**Containment verification.** `[How the team confirmed the threat could not continue]`

## 8. Eradication

| Action | Owner | Completed | Verification | Evidence |
| --- | --- | --- | --- | --- |
| `[Remove persistence]` | `[Name]` | `[Date]` | `[Scan, audit]` | `[Ref]` |
| `[Patch vulnerability]` | `[Name]` | `[Date]` | `[Version check]` | `[Ref]` |
| `[Rebuild host]` | `[Name]` | `[Date]` | `[Baseline check]` | `[Ref]` |

**Why the root cause is addressed.** `[Control change, not just indicator removal]`

**Residual persistence risk.** `[What might remain and how it will be monitored]`

## 9. Recovery

- Recovery criteria: `[What must be true before restoring service]`
- Restoration source: `[Backup, rebuild, failover]`
- Data integrity checks: `[Method and result]`
- Service owner approval: `[Name, date]`
- Heightened monitoring period: `[Dates and focus]`
- User communication: `[Channel, date, key messages]`
- Recovery verification: `[Tests performed and results]`

## 10. Indicators of compromise

Share indicators only with recipients who need them. Neutralize links and addresses in written reports where appropriate.

| Type | Value | Context | Confidence | First seen | Action |
| --- | --- | --- | --- | --- | --- |
| Domain | `telemetry.example[.]test` | Beacon destination | `[High]` | `[Time]` | `[Block, monitor]` |
| IP | `203.0.113[.]66` | C2 address | `[Medium]` | `[Time]` | `[Block, hunt]` |
| Hash (SHA-256) | `[Hash]` | Dropper | `[High]` | `[Time]` | `[Block, hunt]` |
| File path | `[Path]` | Persistence | `[Medium]` | `[Time]` | `[Hunt]` |
| Account | `[Account]` | Compromised identity | `[High]` | `[Time]` | `[Disable, rotate]` |

**Indicator caveats.** `[Which indicators are unique, which are commodity, and which may cause false positives]`

## 11. Impact

- **Business services:** `[Downtime, degraded service, manual workaround]`
- **Financial:** `[Known and estimated costs, with method]`
- **Customers and partners:** `[Impact and communication]`
- **Regulatory and contractual:** `[Potential obligations, pending legal review]`
- **Reputation:** `[Public exposure, media, customer trust]`
- **Safety:** `[Any physical or environmental impact]`

Separate confirmed impact from estimate. Do not speculate about attribution.

## 12. Notification considerations

- [ ] Legal counsel has assessed notification obligations. — Owner: ___; Evidence: ___
- [ ] Privacy owner has assessed personal-data impact. — Owner: ___; Evidence: ___
- [ ] Contractual notification requirements are identified. — Owner: ___; Evidence: ___
- [ ] Regulatory deadlines are confirmed with qualified advice, not guessed. — Owner: ___; Evidence: ___
- [ ] Law-enforcement engagement is a documented decision. — Owner: ___; Evidence: ___
- [ ] Customer and partner communications are approved. — Owner: ___; Evidence: ___
- [ ] Insurer notification requirements are reviewed. — Owner: ___; Evidence: ___
- [ ] Public statements avoid speculation and unverified attribution. — Owner: ___; Evidence: ___

## 13. Lessons learned

| Finding | Type | Corrective action | Owner | Due date | Success measure |
| --- | --- | --- | --- | --- | --- |
| `[Detection took 36 hours]` | `[Detection gap]` | `[Add and test rule]` | `[Team]` | `[Date]` | `[Alert fires in test]` |
| `[Shared admin account]` | `[Access design]` | `[Named accounts and MFA]` | `[Team]` | `[Date]` | `[Account inventory]` |

**What worked.** `[Controls, people, or processes that reduced impact]`

**What did not.** `[Gaps without blaming individuals]`

**Root cause versus contributing factors.** `[Separate the two]`

## 14. Evidence and appendices

- **Appendix A — Evidence index:** item, source, collector, timestamp, hash, storage location.
- **Appendix B — Query log:** queries used for analysis and their time ranges.
- **Appendix C — Affected asset detail:** configuration, baseline, and rebuild record.
- **Appendix D — Communications log:** time, audience, channel, message owner.
- **Appendix E — Regulatory and legal notes:** restricted access.

## 15. Quality review

- [ ] Timeline entries have sources and confidence levels. — Owner: ___; Evidence: ___
- [ ] Confirmed facts and hypotheses are clearly separated. — Owner: ___; Evidence: ___
- [ ] Affected data and individuals are assessed with privacy input. — Owner: ___; Evidence: ___
- [ ] Indicators are neutralized and contextualized. — Owner: ___; Evidence: ___
- [ ] Notification statements are reviewed by legal counsel. — Owner: ___; Evidence: ___
- [ ] Corrective actions have owners and due dates. — Owner: ___; Evidence: ___
- [ ] The report avoids blame and unsupported attribution. — Owner: ___; Evidence: ___

## References

- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response recommendations.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — risk and response functions.
- [MITRE ATT&CK](https://attack.mitre.org/) — technique mapping for the timeline.
- [CIS Controls](https://www.cisecurity.org/controls) — safeguards that inform corrective actions.

---

**Related:** [Template index](README.md) · [Incident response checklist](../checklists/incident-response.md) · [Blue team drills](../exercises/blue-team-drills.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
