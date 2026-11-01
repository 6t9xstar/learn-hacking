# Templates: Reports, Notebooks, and Safe Reuse

[Home](../README.md) / Templates

These templates give you a consistent structure for vulnerability reports, penetration test reports, incident reports, and lab notebooks. They are starting points, not finished documents. A template becomes useful only when you replace the prompts with verified observations, cite evidence, and adapt the language to your organization's policy and local law.

> **Sanitize before you share.** Templates invite copy-paste. Copy-paste is how tokens, customer names, internal hostnames, and personal data leak into portfolios and public repositories. Redact first, then review, then share.

## Template index

| Template | Use it for | Minimum review before delivery |
| --- | --- | --- |
| [Vulnerability report](vulnerability-report.md) | One finding, with evidence and retest | Technical peer review and severity check |
| [Penetration test report](penetration-test-report.md) | A full engagement with scope and narrative | Technical, editorial, and client-confidentiality review |
| [Incident report](incident-report.md) | A security incident with timeline and response | Incident commander, legal/privacy, and communications review |
| [Lab notes](lab-notes.md) | A reproducible exercise or experiment | Self-review against the evidence checklist |

## Placeholder conventions

- `[UPPER CASE IN BRACKETS]` marks a required field.
- `[Optional: ...]` marks content to include only when it applies.
- `TBD` is not acceptable in a delivered report. Resolve it or state why it is unknown.
- Replace sample text, do not leave it in the final document.
- Delete instructional notes such as this one before publishing.

## How to use a template

1. Copy the template into the engagement or incident folder.
2. Fill in metadata first: ID, date, owner, classification, and distribution.
3. Write the finding or timeline from evidence, not memory.
4. Separate facts, inferences, and recommendations.
5. Have a second person review scope claims, severity, and redactions.
6. Export to the required format and verify that metadata and links survived.
7. Store the final version with the evidence record.

## Sanitization workflow

- [ ] Remove credentials, API keys, session tokens, and private keys.
- [ ] Replace customer names, employee names, and email addresses with roles or synthetic values.
- [ ] Replace internal hostnames, IP addresses, account IDs, and file paths with documentation ranges or redacted labels.
- [ ] Remove screenshots that show personal data, browser tabs, notifications, or unrelated windows.
- [ ] Check metadata: author, company, comments, and revision history.
- [ ] Search the final file for `password`, `token`, `secret`, `BEGIN`, and `@`.
- [ ] Have a second reviewer check the redactions.
- [ ] Record what was redacted and why in the document control section.

## Severity and scoring

Use a documented method consistently. CVSS base scores describe technical severity, not business risk; environmental and threat context matter. Do not invent a score to support a narrative, and do not claim a compliance result from a template. See [FIRST CVSS](https://www.first.org/cvss/) for the official specification and calculator.

## Evidence standards

Strong reports share four traits:

- A reproducible request or command, with the account and environment named.
- The observed result, including status codes or log lines, not just a conclusion.
- A clear statement of impact and the conditions required to exploit it.
- A remediation that an owner can implement and a retest that can prove it.

## Confidentiality and legal review

Mark drafts and finals with the correct classification. Limit distribution to the agreed list. Do not publish client reports without written permission. Incident reports may be subject to legal privilege, privacy law, or regulatory retention requirements; involve qualified counsel before sharing them.

## Compliance caveat

These templates do not guarantee compliance with NIST, ISO/IEC 27001, PCI DSS, HIPAA, GDPR, or any other framework. They are documentation aids. Adapt them to your organization's policies, contractual obligations, and applicable law, and have the appropriate reviewer approve the final version.

## References

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — reporting and methodology guidance.
- [FIRST CVSS](https://www.first.org/cvss/) — severity scoring specification.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response context.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — risk-management framing.

---

**Related:** [Repository home](../README.md) · [Checklists](../checklists/README.md) · [Exercises](../exercises/README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md) · [Security policy](../SECURITY.md)

Last reviewed: 2026-10-31
