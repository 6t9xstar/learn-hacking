# Penetration Test Report Template

[Home](../README.md) / [Templates](README.md) / Penetration test report

Use this template for a complete authorized engagement. It separates commercial context from technical detail, records scope and limitations, tells the attack story without inflating it, and gives the client a remediation roadmap they can own.

> **Confidentiality and authorization.** Reports contain sensitive information. Store them encrypted, limit distribution to the agreed list, and do not publish client material without written permission. Do not include working exploit code, live credentials, or personal data that the client does not need.

**Report ID:** `[PT-YYYY-NNN]`
**Engagement ID:** `[ENG-YYYY-NNN]`
**Client:** `[Legal entity]`
**Assessment window:** `[Start and end, time zone]`
**Classification:** `[Confidential]`
**Version:** `[0.9 draft / 1.0 final]`

## 1. Cover

| Field | Value |
| --- | --- |
| Report title | `[External / Internal] Penetration Test Report` |
| Client | `[Legal entity]` |
| Prepared by | `[Firm or team, lead tester]` |
| Report date | `[YYYY-MM-DD]` |
| Engagement type | `[Web / network / cloud / red team / combined]` |
| Environments tested | `[Production / staging / lab]` |
| Report version | `[1.0]` |

## 2. Confidentiality statement

This report is confidential and intended solely for `[client name]` and the named recipients. It may contain information about security weaknesses, business processes, and data flows. Do not forward, publish, or reuse it outside the agreed distribution without written permission. Handle it according to the classification above and the contract's data-handling terms.

## 3. Document control

| Version | Date | Author | Reviewer | Change |
| --- | --- | --- | --- | --- |
| `[0.9]` | `[Date]` | `[Name]` | `[Name]` | Draft for technical review |
| `[1.0]` | `[Date]` | `[Name]` | `[Name]` | Final after client comments |

**Distribution list.** Record every approved recipient.

- `[Name, role, organization]`
- `[Name, role, organization]`

## 4. Table of contents

Generate the table of contents after the final edit. Confirm that section numbers, page numbers, and appendix labels match the exported document.

## 5. Scope and objectives

### 5.1 Objectives

- `[Objective 1: validate resistance to external attack]`
- `[Objective 2: assess a specific application or business flow]`
- `[Objective 3: test detection and response]`

### 5.2 In scope

| Asset | Type | Environment | Notes |
| --- | --- | --- | --- |
| `[Host, URL, API, account]` | `[Web / API / host / cloud]` | `[Prod / stage]` | `[Constraints]` |

### 5.3 Out of scope

- `[Third-party services, shared infrastructure, physical sites, social engineering]`
- `[Destructive tests, denial of service, data exfiltration]`
- `[Accounts or tenants explicitly excluded]`

### 5.4 Constraints and assumptions

- Testing window: `[Start and end, time zone]`
- Source networks: `[Addresses or ranges]`
- Test accounts: `[Roles and count]`
- Change freezes or blackout periods: `[Dates]`
- Assumptions: `[What the client confirmed about the environment]`
- Limitations: `[What could not be tested and why]`

## 6. Methodology

Describe the approach in enough detail that a reader can judge coverage.

| Phase | Activities | Evidence produced |
| --- | --- | --- |
| Scoping and authorization | Review scope, rules, contacts, data handling | Signed scope and rules of engagement |
| Reconnaissance | Passive and authorized active discovery | Asset inventory and service map |
| Vulnerability analysis | Manual testing plus targeted tooling | Reproducible requests and observations |
| Exploitation | Validate impact within the rules of engagement | Screenshots, transcripts, hashes |
| Post-exploitation | Assess access, lateral movement, and data reach within scope | Attack narrative and evidence |
| Reporting | Consolidate, assign severity, and review | Final report |
| Retest | Verify fixes and residual risk | Retest table and evidence |

Reference the frameworks used, such as the [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) for web coverage and [MITRE ATT&CK](https://attack.mitre.org/) for technique mapping. State the severity method and cite [FIRST CVSS](https://www.first.org/cvss/) if CVSS is used. Do not claim that a methodology guarantees complete coverage.

## 7. Executive summary

Write for a business reader:

- Why the assessment was commissioned.
- What was tested and what was not.
- The headline risk in plain language.
- The most important three to five findings and their business impact.
- What the client should do first.
- How confident the team is in the results, and what limited the assessment.

Avoid a list of tool names. Avoid claiming that the environment is "secure" or "insecure" in absolute terms. State what was proven.

## 8. Risk overview

### 8.1 Findings dashboard

| Severity | Count | Fixed during test | Open |
| --- | --- | --- | --- |
| Critical | `[0]` | `[0]` | `[0]` |
| High | `[0]` | `[0]` | `[0]` |
| Medium | `[0]` | `[0]` | `[0]` |
| Low | `[0]` | `[0]` | `[0]` |
| Informational | `[0]` | `[0]` | `[0]` |

### 8.2 Severity and scoring note

Explain the client's severity scale and how CVSS was used. State clearly that a base score is not business risk and that asset criticality, exposure, data sensitivity, and compensating controls were considered.

## 9. Technical findings

Use one subsection per finding or reference the separate [vulnerability report](vulnerability-report.md) for full detail. Each finding should include:

- **ID and title.**
- **Affected assets.**
- **Severity and CVSS vector.**
- **Description and root cause.**
- **Reproduction and evidence.**
- **Impact and preconditions.**
- **Remediation and owner.**
- **Retest status.**

### 9.1 Finding summary

| ID | Title | Severity | Asset | Root cause | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `[F-001]` | `[Title]` | `[High]` | `[Asset]` | `[Control gap]` | `[Team]` | `[Open]` |

### 9.2 Finding detail template

**Finding F-001 — [Title].** Complete the fields below for this finding.

- **Asset:** `[Exact host, URL, API, account]`
- **CWE / OWASP mapping:** `[CWE-### / A0#:2021]`
- **Severity:** `[High]` — `[Rationale]`
- **CVSS:** `[Score]` — `[Vector]`

**Description.** `[Root cause and affected trust boundary]`

**Evidence.** `[Reference to the evidence index; redacted request and response]`

**Impact.** `[What an attacker could achieve, under what conditions]`

**Remediation.** `[Specific fix, compensating control, verification]`

**Retest.** `[Procedure and result]`

Repeat this block for each finding, or attach individual vulnerability reports and keep a summary here.

## 10. Attack narrative

Tell the story of the engagement in phases. Make clear what was simulated, what was proven, and where the team stopped.

| Phase | What was attempted | What succeeded | Evidence | ATT&CK mapping |
| --- | --- | --- | --- | --- |
| Initial access | `[Phishing simulation, exposed service, valid account]` | `[Yes/No/Partial]` | `[Ref]` | `[T####]` |
| Execution | `[Command or payload class, no weaponized code]` | `[Yes/No/Partial]` | `[Ref]` | `[T####]` |
| Privilege escalation | `[Local or cloud privilege path]` | `[Yes/No/Partial]` | `[Ref]` | `[T####]` |
| Lateral movement | `[Remote service or trust relationship]` | `[Yes/No/Partial]` | `[Ref]` | `[T####]` |
| Objective | `[Data access, domain control, detection test]` | `[Yes/No/Partial]` | `[Ref]` | `[T####]` |

**Narrative.** `[Three to six paragraphs describing the chain, the decisions, and the points where a control worked. State the limits of the simulation.]`

**Detection observations.** `[Which actions generated alerts, which did not, and what the client's team did with them.]`

## 11. Remediation roadmap

Prioritize by risk reduction and feasibility, not by severity count alone.

| Priority | Action | Findings addressed | Owner | Effort | Target date | Success measure |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `[Contain the highest-risk exposure]` | `[F-001]` | `[Team]` | `[Days]` | `[Date]` | `[Exposure closed]` |
| 30 days | `[Fix root causes]` | `[F-002, F-003]` | `[Team]` | `[Weeks]` | `[Date]` | `[Retest passes]` |
| 90 days | `[Design and process improvements]` | `[F-004]` | `[Team]` | `[Months]` | `[Date]` | `[Control measured]` |

Include dependencies, accepted risks, and items that need architecture work. Do not promise that a fix eliminates all risk.

## 12. Appendices

- **Appendix A — Evidence index:** file names, hashes, collector, timestamp, description.
- **Appendix B — Scope changes:** written amendments and their dates.
- **Appendix C — Tool output:** only relevant, sanitized excerpts; note versions and limits.
- **Appendix D — Glossary:** acronyms and client-specific terms.
- **Appendix E — Methodology detail:** test cases, coverage matrix, and exclusions.
- **Appendix F — Retest record:** date, tester, result, residual risk.

## 13. Sign-off

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Lead tester | `[Name]` | `[Signature]` | `[Date]` |
| Technical reviewer | `[Name]` | `[Signature]` | `[Date]` |
| Client acceptance | `[Name]` | `[Signature]` | `[Date]` |

**Client acceptance statement.** `[The client confirms receipt, understands the limitations, and accepts the distribution terms.]`

## 14. Quality review

- [ ] Scope, dates, and exclusions match the signed authorization. — Owner: ___; Evidence: ___
- [ ] Every finding has reproducible evidence and a severity rationale. — Owner: ___; Evidence: ___
- [ ] The executive summary does not overstate coverage or impact. — Owner: ___; Evidence: ___
- [ ] Credentials, tokens, personal data, and client identifiers are redacted. — Owner: ___; Evidence: ___
- [ ] Remediation actions have owners and dates. — Owner: ___; Evidence: ___
- [ ] The report states its limitations and does not guarantee compliance. — Owner: ___; Evidence: ___
- [ ] Distribution list and classification are correct. — Owner: ___; Evidence: ___

## References

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — web methodology.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — risk categories.
- [FIRST CVSS](https://www.first.org/cvss/) — severity scoring.
- [MITRE ATT&CK](https://attack.mitre.org/) — technique mapping.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response interface.

---

**Related:** [Template index](README.md) · [Pre-engagement checklist](../checklists/pre-engagement.md) · [Web assessment checklist](../checklists/web-assessment.md) · [Vulnerability report](vulnerability-report.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
