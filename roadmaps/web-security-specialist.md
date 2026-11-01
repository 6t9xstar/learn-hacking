# Web Security Specialist Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 9–15 months**

[Home](../README.md) › [Roadmaps](README.md) › Web security specialist

Web security specialists find and fix weaknesses in web applications and APIs. The work combines curiosity about how software is built with disciplined manual testing: reading requests, understanding sessions and access control, tracing data from input to dangerous sink, and writing a finding that developers can act on. This roadmap treats web security as an engineering discipline, not a list of payloads. It covers HTTP, browser behaviour, server-side code, the OWASP Top 10, API testing, code review, and the reporting skills that make bug bounty or application security work possible.

Read [ETHICS.md](../ETHICS.md) first. Testing a live site without permission is unauthorized access, even if the weakness is obvious and the data is public. Use the labs in this roadmap, your own applications, and programs with an explicit scope.

## At a glance

| Item | Detail |
|---|---|
| Target role | Web application security analyst, junior application security engineer, web penetration tester, bug bounty hunter (later) |
| Realistic duration | 9–15 months at 8–10 hours per week; 5–8 months if you already build web applications professionally |
| Cost | Free core path; optional paid labs, Burp Suite Pro, and certification exams |
| Lab needs | A laptop that can run Docker and a browser; 8–16 GB RAM; local Juice Shop, DVWA, and crAPI instances |
| Difficulty | Moderate to high; the hard part is understanding application logic, not memorizing payloads |
| Main output | A lab casebook, an API assessment, a code review report, and a polished vulnerability report |

This is a map, not a race. Developers often move faster through the server-side stage and slower through exploitation; career changers usually need more time on JavaScript and reading code. Neither group should skip the reporting stage.

## Who this is for

This roadmap suits developers who want to move into security, QA and support engineers who test applications, and self-taught learners who have completed the [beginner roadmap](beginner-to-ethical-hacker.md) and want depth in web rather than networks.

Honest prerequisites:

- **HTML, CSS, and JavaScript basics.** You can read a page, use the developer console, and understand an event handler.
- **One server-side language.** PHP, Python, Node.js, Java, or C# is enough; you need to read code, not write production systems.
- **HTTP familiarity.** Methods, status codes, headers, cookies, and the request/response cycle.
- **Linux and the command line.** Enough to run Docker containers and read logs.
- **Patience for detail.** Web bugs often hide in a single missing authorization check.

You do not need to be a senior developer, but you cannot test what you cannot read. If code still looks like magic, spend four to six weeks building a small CRUD application before continuing.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| HTTP and browser fluency | Explain cookies, CORS, same-origin policy, caching, and redirects from evidence | Annotated requests and a written explanation of a session flow |
| Access control analysis | Test horizontal and vertical authorization, not just authentication | Findings showing two accounts and the missing check |
| Injection understanding | Trace untrusted data to SQL, template, command, or deserialization sinks | A lab finding with root cause and a parameterized fix |
| Client-side security | Understand XSS contexts, DOM sinks, CSP, and clickjacking defences | Lab notes across reflected, stored, and DOM XSS |
| API testing | Enumerate endpoints, test object-level authorization, and inspect schemas | An API assessment with authorization findings |
| Code review | Identify risky patterns in source and confirm them dynamically | A code review report with file and line references |
| Reporting | Write reproducible findings with impact and developer-ready fixes | A report reviewed by a developer or peer |
| Scope discipline | Stay inside program rules and handle user data responsibly | A signed-off methodology and redaction checklist |

Typical entry-level tasks:

- Review a login and password-reset flow for logic flaws and session weaknesses.
- Test an API for broken object-level authorization using two test accounts.
- Triage SAST or scanner output and confirm which findings are real.
- Write a finding that includes a minimal reproduction and a code-level fix.
- Verify a developer's patch and document residual risk.

## Learning sequence

The sequence alternates between building and breaking. Each stage produces notes that feed the final casebook.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Web platform and HTTP foundations | 6–8 weeks | Annotated HTTP and browser security notes |
| 2 | Server-side code and data handling | 8–10 weeks | A small application and a code-reading log |
| 3 | OWASP Top 10 and manual testing | 12–14 weeks | Thirty-lab casebook with root causes |
| 4 | APIs, code review, and automation | 8–10 weeks | API assessment and code review report |
| 5 | Reporting, bug bounty bridge, and portfolio | 6–8 weeks | Public casebook and mock disclosure report |

### Stage 1 — Web platform and HTTP foundations

| Element | Detail |
|---|---|
| Goal | Understand exactly what the browser sends, what the server returns, and where trust boundaries sit. |
| Topics | HTTP methods, status codes, headers, and caching; cookies and session identifiers; same-origin policy, CORS, and CSP; TLS; browser storage; proxies and Burp Suite Community; URL encoding. |
| Free learning | [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP), [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn), [PortSwigger Web Security Academy](https://portswigger.net/web-security), [Burp Community](https://portswigger.net/burp/communitydownload). |
| Labs | Intercept and modify requests in Burp. Map a login flow end to end. Compare a request with and without cookies. Reproduce a CORS misconfiguration in a local app. |
| Deliverable | An annotated HTTP notebook explaining one full authentication and session flow. |
| Exit criteria | You can predict how a browser will treat a cookie, a redirect, and a cross-origin request, and verify your prediction in Burp. |

### Stage 2 — Server-side code and data handling

| Element | Detail |
|---|---|
| Goal | Read application code well enough to find where input reaches a dangerous operation. |
| Topics | Routing and controllers; templating; SQL and ORMs; file handling; authentication and password storage; session management; authorization models; secrets management; common frameworks in PHP, Node.js, and Python. |
| Free learning | [PHP manual](https://www.php.net/manual/en/), [Node.js learn](https://nodejs.org/en/learn), [javascript.info](https://javascript.info/), [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/). |
| Labs | Build a small CRUD application with login and one role. Break it deliberately, then fix it. Read an open-source application's authentication code and log every risky pattern. |
| Deliverable | A working application plus a code-reading log with ten observations and proposed fixes. |
| Exit criteria | Given a feature, you can list its trust boundaries, inputs, and likely failure points before testing. |

### Stage 3 — OWASP Top 10 and manual testing

| Element | Detail |
|---|---|
| Goal | Test the major web vulnerability classes methodically and explain each root cause. |
| Topics | Broken access control; authentication failures; injection including SQL, command, and template injection; XSS contexts; insecure deserialization; SSRF; security misconfiguration; vulnerable components; logging failures; business logic flaws. |
| Free learning | [PortSwigger all labs](https://portswigger.net/web-security/all-labs), [OWASP Top 10](https://owasp.org/www-project-top-ten/), [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/), [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/). |
| Labs | Complete every PortSwigger apprentice lab and at least half of the practitioner labs. Run Juice Shop locally and solve its scoreboard challenges without copying walkthroughs. |
| Deliverable | A casebook of 30 labs, each with the vulnerable request, root cause, impact, and fix. |
| Exit criteria | You can choose a test based on how the application works, not based on a payload list. You can explain why a payload succeeded. |

### Stage 4 — APIs, code review, and automation

| Element | Detail |
|---|---|
| Goal | Extend testing to JSON APIs and source code, and automate only what you understand. |
| Topics | REST and GraphQL basics; OpenAPI schemas; object and function-level authorization; mass assignment; rate limits; SAST and secret scanning; dependency analysis; Semgrep rules; Burp extensions. |
| Free learning | [OWASP API Security Top 10](https://owasp.org/www-project-api-security/), [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/), [Semgrep documentation](https://semgrep.dev/docs/), [OWASP crAPI](https://github.com/OWASP/crAPI). |
| Labs | Deploy crAPI and test it with two accounts. Write three Semgrep rules for patterns you found manually. Review an open-source project and report one issue responsibly. |
| Deliverable | An API assessment with at least three authorization findings and a short code review report. |
| Exit criteria | You can find an API endpoint from the UI, test it with two identities, and prove impact without accessing another real user's data. |

Ethics reminder: when testing APIs, use accounts and data you created. Stop at the first proof. Do not download, retain, or publish other users' data, and follow the program's disclosure rules. See [ETHICS.md](../ETHICS.md).

### Stage 5 — Reporting, bug bounty bridge, and portfolio

| Element | Detail |
|---|---|
| Goal | Present findings professionally and decide whether bug bounty, application security engineering, or consulting is the next step. |
| Topics | Finding structure; CVSS and business impact; remediation examples; disclosure etiquette; duplicate avoidance; program selection; portfolio redaction; interview case studies. |
| Free learning | [Hacker101](https://www.hacker101.com/), [HackerOne hacktivity](https://www.hackerone.com/), [FIRST CVSS](https://www.first.org/cvss/), [bug bounty roadmap](bug-bounty-hunter.md). |
| Labs | Write three full reports from your casebook. Submit one responsibly to an open-source project or a program with a clear scope. Practice a 30-minute finding walkthrough. |
| Deliverable | A public portfolio with a redacted casebook, one API report, and one code review artifact. |
| Exit criteria | A developer can reproduce and fix your top finding from the report alone. You understand the program's scope and disclosure terms before testing. |

## Sequence diagram

```text
Stage 1  Web + HTTP foundations
  browser | cookies | CORS | Burp
        |
        v
Stage 2  Server-side code + data
  routing | auth | SQL | templating | authorization
        |
        v
Stage 3  OWASP Top 10 + manual testing
  access control -> injection -> XSS -> SSRF -> logic
        |
        +-----------------------+
        v                       v
Stage 4  APIs + code review     Bug bounty track
  schemas | authz | SAST          scope -> recon -> manual test -> report
        |                       |
        +-----------+-----------+
                    v
Stage 5  Reporting + portfolio
  findings -> fixes -> disclosure -> interviews
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner–advanced | Free; optional account | Yes | The best structured web lab progression available |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | OWASP | Beginner–intermediate | Free | No | Shared vocabulary for risk categories |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No | A complete testing methodology |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Intermediate–advanced | Free | No | Requirements to test applications against |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Beginner–intermediate | Free, open source | Yes | A deliberately vulnerable modern web app |
| [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) | Mozilla | Beginner | Free | No | Accurate browser and HTTP behaviour |
| [javascript.info](https://javascript.info/) | javascript.info | Beginner–intermediate | Free | Exercises | JavaScript depth for DOM and client-side bugs |
| [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) | OWASP | Intermediate | Free | No | API-specific risk categories |
| [OWASP Code Review Guide](https://owasp.org/www-project-code-review-guide/) | OWASP | Intermediate | Free | No | How to review source for security defects |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free videos and CTF | Yes | Bug bounty basics and a safe CTF |
| [Semgrep documentation](https://semgrep.dev/docs/) | Semgrep | Intermediate | Free CLI and open-source rules; paid platform tier | Yes | Writing and running static analysis rules |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Intercept and replay a login flow | Local app or Juice Shop | HTTP, sessions, Burp | Free |
| 2 | Build and break a small CRUD app | Local | Code reading and authorization | Free |
| 3 | PortSwigger apprentice labs | PortSwigger Academy | Core vulnerability classes | Free |
| 4 | Juice Shop scoreboard | Local Docker | Independent web testing | Free |
| 5 | Practitioner labs in three categories | PortSwigger Academy | Depth and payload context | Free |
| 6 | crAPI assessment | Local Docker | API authorization and business logic | Free |
| 7 | Code review of an open-source app | Local clone | Source-to-sink analysis | Free |
| 8 | Responsible disclosure exercise | Open-source project | Scope, reporting, etiquette | Free |

Safe-lab caveat: run Juice Shop, DVWA, and crAPI on localhost or an isolated Docker network. Do not test a public site because it "looks like a lab". For open-source code review, report privately to the maintainers first and follow their security policy. Never include real user data, live tokens, or unredacted personal information in a portfolio. If a target has no published scope or permission, it is out of scope.

## Portfolio projects

1. **Web casebook.** Thirty lab entries grouped by vulnerability class, each with request/response evidence, root cause, impact, and a fix. Quality matters more than count; a reviewer should learn something from every entry.
2. **API assessment report.** A crAPI or self-built API review covering broken object-level authorization, mass assignment, and rate limiting, with two test accounts and redacted evidence.
3. **Code review report.** An open-source application reviewed against the OWASP ASVS, with file and line references, severity, and a suggested patch. Coordinate disclosure before publishing.
4. **Secure coding fix.** Take one finding from your own application, implement the fix, and write a before/after explanation with a regression test.
5. **Bug bounty readiness pack.** A methodology checklist, scope-evaluation rubric, report template, and a list of five programs you have read the policies for. No submissions required.

## Milestones and self-assessment

**Months 0–3**

- [ ] I can explain cookies, CORS, CSP, and same-origin policy without notes.
- [ ] I intercepted and modified a request in Burp and explained the result.
- [ ] I built a small application with login and role-based access.
- [ ] I can read a route handler and identify its inputs and trust boundaries.

**Months 3–7**

- [ ] I completed all PortSwigger apprentice labs in at least six categories.
- [ ] I solved ten Juice Shop challenges without a walkthrough.
- [ ] I wrote ten casebook entries with root cause and fix.
- [ ] I can demonstrate a missing authorization check with two accounts.

**Months 7–11**

- [ ] I completed at least fifteen practitioner labs across injection, XSS, and SSRF.
- [ ] I assessed an API and found an object-level authorization issue.
- [ ] I wrote three Semgrep rules based on manual findings.
- [ ] I produced a code review report with file and line references.

**Months 11–15**

- [ ] I wrote three full vulnerability reports and had one reviewed.
- [ ] My portfolio has a redacted casebook, API report, and code review artifact.
- [ ] I read and can summarize the scope and disclosure rules of three bug bounty programs.
- [ ] I completed a mock interview walkthrough of one finding in under ten minutes.

## Certifications

Certifications are optional. The labs and reports above matter more for most application security roles. Every exam listed is paid; free study material is noted where it genuinely exists.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | Baseline vocabulary, not web depth |
| [Burp Suite Certified Practitioner](https://portswigger.net/web-security/certification) | PortSwigger | Intermediate–advanced | Academy labs are free; exam is paid | Paid practical exam | Directly aligned with manual web testing |
| [OSWA](https://www.offsec.com/courses/web-200/) | OffSec | Intermediate | Syllabus and community write-ups | Paid course and exam | Practical web assessment credential |
| [OSWE](https://www.offsec.com/courses/web-300/) | OffSec | Advanced | Syllabus and public research | Paid course and exam | Source-code review and advanced exploitation |
| [eWPT](https://ine.com/security/certifications/ewpt-certification) | INE | Intermediate | Some free INE material | Paid exam | Web testing fundamentals; verify current format |
| [HTB CWES](https://academy.hackthebox.com/) | Hack The Box | Advanced | Some free Academy modules | Paid path and exam | Practical web exploitation in the HTB ecosystem |
| [GWAPT](https://www.giac.org/certifications/web-application-penetration-tester-gwapt/) | GIAC | Intermediate–advanced | SANS posters and whitepapers; course is paid | Paid exam | Recognized in some enterprises; expensive |

## Common detours and mistakes

- **Payload memorization.** Payloads change with context. Learn how input reaches a sink and why a specific encoding works.
- **Skipping JavaScript.** Modern applications put authorization and data flow in the browser. If you cannot read JS, you will miss bugs.
- **Ignoring business logic.** Many high-impact findings are valid-function misuse, not injection. Think about what the feature is supposed to prevent.
- **Testing out of scope.** A public site without a program is not a target. Unauthorized testing can be prosecuted and will get you banned from platforms.
- **Scanner dependence.** Automated tools find some classes well and miss authorization and logic entirely. Use them to support manual work.
- **Report dumping.** A raw HTTP request and a CVSS score are not a finding. Explain impact, prerequisites, and the fix.
- **Chasing bounties before fundamentals.** Bug bounty is a market, not a curriculum. Build skills in labs first.
- **Publishing without consent.** Disclosing an unpatched issue or a client's data can cause real harm. Follow coordinated disclosure.

## Next steps

1. Create a local lab with Juice Shop, DVWA, and crAPI, then work through [01-home-lab.md](../practical-projects/01-home-lab.md).
2. Start [PortSwigger Academy](https://portswigger.net/web-security) at the apprentice level and keep the casebook from the first lab.
3. Read the [web application security guide](../web-application-security/README.md) for concept depth and the [exercises](../exercises/README.md) for drills.
4. If bug bounty appeals, continue with the [bug bounty hunter roadmap](bug-bounty-hunter.md); for consulting, see the [network pentester roadmap](network-pentester.md).
5. Use the [lab notes template](../templates/lab-notes.md) so evidence is consistent across every project.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN HTTP documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [PortSwigger research](https://portswigger.net/research)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
