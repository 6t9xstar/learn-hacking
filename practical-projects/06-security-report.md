# Project 06 — Write a Professional Vulnerability Assessment Report

Finding a vulnerability is half the job. The other half is convincing someone with budget and deadlines to fix it. In this project you turn the findings register from project 05 into a report that an executive can act on and an engineer can implement: scoped, evidence-backed, consistently rated, and honest about limitations. You will write one finding completely, build the summary and remediation sections around it, and review the result as if a client were paying for it.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Estimated time | 4–6 hours |
| Cost | $0 |
| Prerequisites | Project 05 complete, with a findings register and evidence pack; basic Markdown editing |
| Safety and scope | Use only lab findings and sanitized evidence; no client names, real credentials, or live tokens in the report |

`Last reviewed: 2026-10-31`

> **Safety and scope.** A report is a durable artifact that may be forwarded, archived, and read out of context. Write it for the lab, keep every claim traceable to evidence, and redact credentials and tokens even when they are fake. Do not name a real organization as the subject, do not imply an engagement that did not happen, and do not include exploitation details that would help someone attack a different system.

## Objective

- Structure an assessment report that serves executive, engineering, and remediation audiences at once.
- Write a complete finding with reproduction steps, impact, CVSS rationale, and a specific fix.
- Apply CVSS v3.1 consistently and explain the difference between technical severity and business risk.
- Build a prioritized remediation roadmap with owners, effort, and verification.
- Review and export a polished PDF with a consistent evidence trail.

## Why this project matters

Security work is judged by the decisions it enables. A report that says "critical vulnerability found" without context creates panic; one that says "an unauthenticated user can obtain an administrative session, which allows access to all customer orders; fix by parameterizing the login query and rotate the affected credentials" creates a plan. The difference is not writing talent. It is structure, evidence discipline, and the ability to translate technical facts into consequences.

This project also teaches you to defend your work. When a developer pushes back on a finding, the report either has a reproducible request and a clear impact statement, or it does not. Reviewers notice which one they are reading within the first page.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Markdown editor | Write the report in plain text with version control | <https://code.visualstudio.com/> | Free |
| Pandoc | Convert Markdown to PDF or DOCX | <https://pandoc.org/> | Free, open source |
| FIRST CVSS calculator | Compute and verify scores from vectors | <https://www.first.org/cvss/calculator/3-1> | Free |
| OWASP WSTG | Cite test methodology consistently | <https://owasp.org/www-project-web-security-testing-guide/> | Free |
| LibreOffice | Open and check exported documents | <https://www.libreoffice.org/> | Free, open source |
| draw.io | Simple architecture and data-flow diagrams | <https://www.drawio.com/> | Free tier |
| `jq` and `curl` | Re-verify evidence while writing | <https://jqlang.github.io/jq/> | Free, open source |

## Setup

1. Create a report workspace beside the assessment evidence and copy, never move, the source material:

```bash
mkdir -p ~/assessments/juice-shop/report/{images,export}
cp ~/assessments/juice-shop/findings.csv ~/assessments/juice-shop/report/findings.csv
cp ~/assessments/juice-shop/zap/baseline.html ~/assessments/juice-shop/report/export/zap-baseline.html
```

2. Start the report from a fixed outline. Keeping the outline in a fenced block rather than as live headings lets you reuse it without duplicating section names.

```text
1. Cover page
2. Document control and distribution
3. Executive summary
4. Scope and objectives
5. Methodology and standards
6. Risk rating approach
7. Findings summary
8. Detailed findings
9. Remediation roadmap
10. Limitations and assumptions
11. Retest and closure
12. Appendices: evidence index, tool versions, glossary
```

3. Create the document control table before writing prose. It forces decisions about audience, classification, and versioning.

```markdown
| Field | Value |
| --- | --- |
| Title | Juice Shop Lab Vulnerability Assessment |
| Version | 1.0 |
| Date | 2026-10-31 |
| Author | <your name> |
| Reviewer | <peer or self-review> |
| Classification | Internal — lab training |
| Distribution | Lab owner and project portfolio reviewers |
| Related evidence | findings.csv, evidence/, zap/baseline.html |
```

4. Re-run one test from project 05 and capture a fresh request and response. Writing from stale memory produces vague reproduction steps. Keep the raw pair in `report/images/` or an appendix and redact the token before it enters the report.

## Step-by-step tasks

1. **Write the audience analysis first.** In three short paragraphs, state what the executive needs (risk, priority, cost), what the engineering lead needs (root cause, affected component, fix), and what the remediation owner needs (steps, acceptance criteria, retest). If you cannot name what each reader will do after reading, the report will serve none of them.

2. **Write the scope and methodology section.** State what was assessed, from where, during which window, with which accounts, and against which standard. Include explicit exclusions: denial of service, social engineering, production data, and any host outside the lab. Methodology should reference WSTG test IDs, not just tool names.

```markdown
## Scope and methodology

The assessment covered the Juice Shop instance at `http://192.168.56.30:3000` from
2026-10-31 14:00 to 18:00 UTC. Testing used two synthetic accounts and was performed
from the isolated `192.168.56.0/24` lab network. The OWASP Web Security Testing Guide
was used to select test cases; manual HTTP testing was performed with curl and a
browser, and a passive ZAP baseline scan covered configuration and information
disclosure. Denial of service, social engineering, and all hosts outside the lab were
out of scope. No real user data was present.
```

3. **Build the findings summary table before the details.** A reader should understand the shape of the risk in ten seconds. Order by severity, keep one row per root cause, and make the titles specific.

| ID | Finding | Severity | CVSS | Affected component | Status |
| --- | --- | --- | --- | --- | --- |
| F-01 | Authentication bypass via SQL injection in login | Critical | 9.8 | `/rest/user/login` | Open |
| F-02 | Basket accessible across user accounts | Medium | 6.5 | `/rest/basket/{id}` | Open |
| F-03 | No anti-automation on authentication endpoint | Medium | 5.3 | `/rest/user/login` | Open |
| F-04 | JavaScript source maps exposed | Low | 3.7 | `/main.js.map` | Open |
| F-05 | Missing defensive security headers | Low | 3.1 | All responses | Open |

4. **Write one finding completely, using a fixed template.** The template is the quality control: if a field is empty, the finding is not finished.

```text
Title:            Specific, observable, and free of jargon where possible
ID and status:    F-01, Open
Affected asset:   URL, component, and version where known
Severity / CVSS:  Critical, 9.8, vector with metric rationale
Description:      What the weakness is, in two or three sentences
Reproduction:     Numbered steps and the exact request
Evidence:         File names and a redacted response excerpt
Impact:           What an attacker gains, in business terms
Likelihood:       Preconditions, skill, and exposure
Remediation:      Specific change, with code or configuration where useful
Verification:     How the fix will be tested
References:       Standard, advisory, or documentation
```

5. **Write F-01 end to end.** This is the model other findings will follow. Include the request, a redacted response, the CVSS rationale, and a fix that addresses the root cause rather than the symptom.

```http
POST /rest/user/login HTTP/1.1
Host: 192.168.56.30:3000
Content-Type: application/json

{"email":"' OR 1=1--","password":"x"}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"authentication":{"token":"<REDACTED>","bid":1,"umail":"<REDACTED>"}}
```

| CVSS metric | Value | Rationale |
| --- | --- | --- |
| Attack vector | Network | Reachable over HTTP from the lab network |
| Attack complexity | Low | A single crafted request, no special conditions |
| Privileges required | None | The login endpoint is unauthenticated |
| User interaction | None | No victim action required |
| Scope | Unchanged | The vulnerable component is the authorization boundary |
| Confidentiality | High | A session for another account exposes its data |
| Integrity | High | The session permits state-changing actions |
| Availability | High | An administrative session can alter or disable data |
| Base score | 9.8 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |

The remediation should name the root cause: string-concatenated SQL. Show a parameterized query and note that input validation is defense in depth, not a substitute. Also recommend rotating credentials that may have been exposed, reviewing database permissions, and adding a regression test that submits the payload and expects a generic authentication failure.

6. **Rate every remaining finding with the same rigor.** Compute the score with the official calculator, record the vector, and write one sentence per non-obvious metric. If a finding has no direct security impact, mark it Informational rather than inflating it. Checkpoint: every score in the table reproduces from its vector in the calculator.

7. **Separate severity from business risk.** Add a short paragraph explaining that CVSS measures technical severity in a generic deployment, while business risk also depends on data sensitivity, exposure, compensating controls, and detection. Give one concrete example from the lab: F-02 is Medium by CVSS, but if baskets contain personal data, the business risk could be High. Do not silently change the score; explain the context instead.

8. **Write the executive summary.** Three paragraphs, no jargon, no tool names unless necessary. Paragraph one: what was assessed and when. Paragraph two: the most important result and its consequence. Paragraph three: what you recommend and what decision you need. Here is a model to adapt, not copy:

```text
We assessed the lab Juice Shop instance between 14:00 and 18:00 UTC on 31 October
2026, using two synthetic accounts and a methodology based on the OWASP Web Security
Testing Guide. The most significant issue is an authentication bypass in the login
endpoint. An unauthenticated user can obtain a valid session for another account with
a single crafted request, and the resulting session can read and modify that account's
data. We rate this Critical.

The assessment also identified a cross-account data access flaw, missing anti-automation
controls on login, and two low-severity information exposures. None of the findings
require specialized tooling to exploit, and the two most serious can be addressed in
the login and basket handlers without architectural change.

We recommend fixing the authentication bypass and rotating any credentials that may
have been exposed before the next release, then addressing the authorization check and
login throttling within thirty days. A retest of the top three findings is included in
the remediation plan. The testing was limited to the lab instance and did not include
denial of service or social engineering.
```

9. **Build the remediation roadmap.** Group by urgency rather than by finding number, assign an owner role, estimate effort, and define acceptance criteria. A roadmap without verification is a wish list.

| Priority | Action | Findings | Owner role | Effort | Acceptance criteria |
| --- | --- | --- | --- | --- | --- |
| Immediate | Parameterize login query; rotate exposed credentials | F-01 | Backend lead | 1–2 days | Payload returns a generic 401; regression test passes |
| 30 days | Enforce object ownership on basket reads | F-02 | Backend lead | 1 day | Cross-account request returns 403; test added |
| 30 days | Add login throttling and alerting | F-03 | Platform team | 2–3 days | 429 after threshold; alert fires in staging |
| 90 days | Remove source maps from production builds | F-04 | Build engineer | Hours | Artifact absent from release bundle |
| 90 days | Add CSP, nosniff, frame-ancestors, referrer policy | F-05 | Web lead | 1 day | Headers present; app functions under CSP report-only first |

10. **Write limitations and assumptions.** State what the assessment did not cover, what could change the results, and what you assumed about the environment. "The lab instance was configured with default settings; a production deployment may differ" is honest and useful. Limitations are not weaknesses in the report; hiding them is.

11. **Add the retest and closure section.** For each fixed finding, describe the exact check and the expected result. Include a closure table with date, tester, evidence, and status. If nothing has been fixed yet, say so and define the trigger for a retest.

12. **Review the report against a checklist, then export.** Read it once for logic, once for evidence, and once for redaction. Export to PDF and inspect every page for broken tables, clipped code, missing images, and font substitutions.

```bash
pandoc report.md -o export/report.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=2cm \
  -V fontsize=10pt \
  --toc
```

If LaTeX is not installed, export to DOCX and convert with LibreOffice, or use the HTML export and print to PDF. Checkpoint: page numbers, table of contents, and code blocks are readable in the exported file.

## Expected results

- A report with a cover, document control, executive summary, scope, methodology, findings, roadmap, limitations, and appendices.
- One fully written finding that another tester could reproduce from the document alone.
- A findings summary whose scores all reproduce from their CVSS vectors.
- A prioritized remediation plan with owners, effort, and acceptance criteria.
- A PDF that renders correctly and contains no credentials or live tokens.
- A review checklist signed off before publication.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `report.md` | Markdown | Single source of truth, versioned, with consistent finding IDs |
| `report.pdf` | PDF | Readable layout, working TOC, redacted evidence |
| `executive-summary.md` | Markdown | Three paragraphs, no jargon, clear recommendation |
| `findings.csv` | CSV | Matches the report exactly; no orphan IDs |
| `remediation-roadmap.csv` | CSV | Priority, owner role, effort, acceptance criteria, target date |
| `evidence-index.csv` | CSV | Finding ID to evidence file, with capture time and hash |
| `review-checklist.md` | Markdown | Completed quality and redaction checks |

## Skills gained

- Structuring a technical document for multiple audiences.
- Writing reproducible findings with evidence and root-cause remediation.
- Applying CVSS v3.1 consistently and explaining the metrics.
- Separating technical severity from business risk.
- Building a prioritized remediation plan with verification criteria.
- Reviewing and exporting a document that survives forwarding and archival.

## Stretch improvements

1. Produce a two-page executive brief in addition to the full report and compare what you had to leave out.
2. Create a slide deck with one slide per top finding and present it to a friend in ten minutes.
3. Map every finding to an OWASP ASVS requirement and add the mapping as an appendix.
4. Add a data-flow diagram showing where the vulnerable component sits and what data it can reach.
5. Write a fictional but realistic management response and revise the report's recommendations based on it.
6. Run a peer review with someone who did not perform the assessment and record every question they asked; those are your report's gaps.

## Troubleshooting

### The CVSS score does not match the vector

Use the official calculator rather than a mental model, and check the metric values one at a time. The most common errors are marking `Privileges Required: None` for an authenticated test, using `Scope: Changed` without justification, and treating a missing header as `Confidentiality: High`. Record the rationale next to each metric so a reviewer can challenge the reasoning rather than guess at it.

### The report reads like a scanner dump

Scanner output lists symptoms; a report explains root causes. Deduplicate alerts that share one cause, drop informational noise, and rewrite each finding as "because the application does X, an attacker can Y, which affects Z". If a finding cannot be reproduced by hand, it is not ready for the report.

### Reproduction steps fail on a second run

The app state changed, a token expired, or the container was reset. Re-run the test from a clean state, capture fresh evidence, and include the preconditions (account, token, container version) in the steps. Number the steps and avoid "use the token from earlier"; show how to obtain it.

### The PDF has broken tables, clipped code, or missing images

Long code lines and wide tables are the usual culprits. Wrap code at a readable width, split wide tables, and reference images with relative paths that exist from the report directory. Try `--pdf-engine=xelatex` with a font that supports your characters, or export to DOCX and inspect in LibreOffice. Always inspect the exported pages, not just the Markdown preview.

### The report contains a token you meant to redact

Treat it as a disclosure even if the token is fake. Remove it from the Markdown, the PDF, the evidence copy, and the version history if you use git. Replace it with `<REDACTED>` and note in the evidence index that the original is stored privately. Then check every screenshot for address bars, cookies, and terminal history.

## Portfolio presentation

Publish the PDF, the executive summary, and the findings summary table, with the lab context stated in the first paragraph. A sanitized report is one of the best portfolio artifacts available because it demonstrates judgment, not just tool use. Keep the structure and the reasoning; remove tokens, cookies, personal names, and any detail that identifies an employer or a real system. If you publish the Markdown source, check that images and relative links resolve in the rendered view. Do not present the work as a paid engagement or use a real company's name.

## References

1. FIRST CVSS v3.1 specification and calculator — <https://www.first.org/cvss/>
2. OWASP Web Security Testing Guide — <https://owasp.org/www-project-web-security-testing-guide/>
3. OWASP Top 10 — <https://owasp.org/www-project-top-ten/>
4. NIST SP 800-115, Technical Guide to Information Security Testing and Assessment — <https://csrc.nist.gov/pubs/sp/800/115/final>
5. Pandoc user's guide — <https://pandoc.org/MANUAL.html>
6. OWASP Application Security Verification Standard — <https://owasp.org/www-project-application-security-verification-standard/>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
