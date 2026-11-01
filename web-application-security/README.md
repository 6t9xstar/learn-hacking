# Web application security

[Home](../README.md) / Web application security

Web applications are where most organisations expose their business logic, their customer data, and their identity systems. They are also the most common target for automated scanning, opportunistic exploitation, and bug bounty research. Understanding how a request becomes a session, a query, and a permission check is the core skill of web security.

This guide covers HTTP architecture, authentication and authorisation, the OWASP Top 10, API security, injection families, secure coding, and testing methodology. It is written for someone who knows basic programming and networking and wants to test or build web applications defensibly.

> Test only applications you own or have explicit permission to assess. A bug bounty programme authorises only the assets in its scope, under its rules.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Intermediate. Requires HTTP, programming, and database basics. |
| Realistic time | 4–6 months of part-time study and lab practice. |
| Cost | Free-first. PortSwigger labs, Juice Shop, ZAP, and Burp Community cost nothing. |
| Prerequisites | [Networking](../foundations/networking/README.md), [Programming](../foundations/programming/README.md), and basic HTML/JavaScript. |
| Lab requirement | A local vulnerable app and a proxy; no public targets. |
| Evidence of learning | A validated assessment report, a fixed vulnerability with tests, and an API review. |

## Why this field matters

A web application is a direct, authenticated path into an organisation's data. One missing authorisation check can expose every customer record; one injection flaw can lead to full database access; one SSRF can reach cloud metadata and credentials. These are not exotic bugs. They appear in the OWASP Top 10 year after year because they are easy to introduce and hard to eradicate.

Web security is also where defensive and offensive skills meet. Developers who understand output encoding and parameterised queries build safer systems; testers who understand the same primitives write findings that engineers can actually fix.

## What you will learn

- Explain the HTTP request-response model, intermediaries, cookies, and browser security boundaries.
- Distinguish authentication from authorisation and test both systematically.
- Describe session management and the failure modes of tokens, cookies, and JWTs.
- Explain the OWASP Top 10 (2021) categories with causes and fixes.
- Identify SQL injection, XSS, CSRF, and SSRF at the code level and remediate them.
- Review an API against the OWASP API Security Top 10 (2023).
- Use Burp Suite Community, ZAP, and Semgrep as part of a documented methodology.
- Write a vulnerability report with reproduction, impact, and a tested fix.

## Prerequisites and honest expectations

You should be able to read HTML and JavaScript, write a small Python or Node script, and explain what a database query does. You do not need to be a full-stack developer, but you will struggle to assess code you cannot read.

- Most real findings come from understanding business logic, not from scanner output.
- Browser behaviour matters. Same-origin policy, CORS, and cookie rules explain many apparent anomalies.
- You will spend more time mapping an application than exploiting it.
- Lab applications are intentionally simple; production applications have years of accumulated exceptions.

## Core concepts

### HTTP architecture and the browser boundary

HTTP is a stateless request-response protocol. A client sends a method, target, headers, and optional body; a server returns a status, headers, and body. Proxies, CDNs, load balancers, and API gateways sit in between, and each can rewrite headers, cache responses, or terminate TLS. Security decisions depend on which component actually enforces them.

The browser is a security boundary. The same-origin policy prevents scripts from one origin reading responses from another, and CORS lets a server relax that rule for specific origins. Cookies are attached by the browser according to domain, path, and flags. Content Security Policy restricts which scripts may execute. These controls are enforced by the browser, so they fail open if a server sends the wrong headers.

### Application architecture and attack surface

Modern applications mix server-rendered pages, single-page front ends, mobile clients, and public APIs. Each adds attack surface: hidden API endpoints, GraphQL schemas, file uploads, webhooks, admin panels, and third-party integrations. Feature flags and staging environments frequently expose functionality that production hides.

Map the application before testing it. Identify entry points, data flows, authentication boundaries, roles, and third-party services. A data-flow diagram with trust boundaries is more useful than a list of URLs, because it shows where input crosses from an untrusted zone into a privileged one.

### Authentication

Authentication proves identity. Passwords must be stored with a slow, salted hash such as Argon2id or bcrypt, never with a fast general-purpose hash. Multi-factor authentication should be phishing-resistant where possible, using passkeys or hardware keys rather than push approvals that can be fatigued. OAuth 2.0 and OpenID Connect delegate authentication to an identity provider, but redirect URI validation, state and nonce handling, token audience, and scope minimisation all matter. JSON Web Tokens are not encrypted by default, are hard to revoke, and are frequently misused with weak secrets or missing algorithm validation; prefer server-side sessions unless there is a specific reason not to.

### Session management and cookies

A session ties requests to an authenticated user. Session identifiers must be unpredictable, transmitted only over TLS, rotated at login, and invalidated at logout. Cookies should set `Secure`, `HttpOnly`, and an appropriate `SameSite` value; those flags reduce exposure but do not replace server-side checks. Token storage is a trade-off: `HttpOnly` cookies resist script theft but need CSRF protection, while browser storage is accessible to JavaScript, so an XSS bug becomes token theft. Session lifetime, idle timeout, and concurrent session policy are security decisions, not defaults to accept.

### Authorisation and access control

Authorisation decides what an authenticated principal may do. Role-based access control is common but coarse; attribute-based and relationship-based models handle finer cases. Enforcement must happen on the server for every request, not just in the UI, and must cover both function-level access (can this user call this endpoint?) and object-level access (can this user read this record?). Broken access control is the top category in the OWASP Top 10 for a reason: insecure direct object references, missing tenant checks, and forced browsing are easy to introduce and devastating in effect. Test by creating two accounts at different privilege levels and attempting each other's actions and identifiers.

### SQL injection

SQL injection happens when user input is concatenated into a query and changes its structure. The fix is parameterised queries or a well-used ORM, which send code and data separately. Input validation helps but is not the primary control; output escaping is not the fix for SQL.

Defence in depth includes least-privilege database accounts, disabling stacked queries where possible, error handling that does not leak query details, and a WAF as a temporary mitigation. Review code for string-built queries, including `ORDER BY` and table names, which often cannot be parameterised and require allowlists.

### Cross-site scripting

XSS happens when untrusted data reaches an HTML, attribute, JavaScript, or URL context without correct encoding. Stored XSS persists in the application; reflected XSS comes back in a response; DOM XSS is created by client-side code that writes untrusted data into dangerous sinks such as `innerHTML` or `eval`.

The fix is context-aware output encoding, safe templating, and avoiding dangerous DOM APIs. Input validation and sanitisation libraries help for rich text, but they are not a substitute for encoding. Content Security Policy reduces impact, especially with nonces and no `unsafe-inline`, but it is a mitigation, not a repair.

### CSRF and SSRF

Cross-site request forgery tricks a logged-in browser into sending a state-changing request to another site. Defences include `SameSite` cookies, synchroniser tokens, and origin or referer checks. CSRF matters most for cookie-based sessions; token-based APIs with no automatic browser credentials have a different threat model.

Server-side request forgery makes the server fetch a URL chosen by the user. Attackers use it to reach internal services, cloud metadata endpoints, and localhost-only admin interfaces. Defences are destination allowlists, blocking link-local and metadata addresses, egress filtering, and not returning raw responses. Validate the resolved address after DNS, not just the URL string.

### The OWASP Top 10 (2021)

The Top 10 is an awareness document, not a checklist. It describes categories of risk and the patterns behind them.

| Category | What it means | Primary fix |
| --- | --- | --- |
| A01 Broken Access Control | Users act outside their intended permissions | Enforce server-side authorisation on every request and object |
| A02 Cryptographic Failures | Weak or missing protection of data | Use TLS, strong hashing, and proper key management |
| A03 Injection | Untrusted data changes command or query structure | Parameterise queries, encode output, avoid dynamic execution |
| A04 Insecure Design | Missing or ineffective control design | Threat modelling, abuse-case testing, secure patterns |
| A05 Security Misconfiguration | Unsafe defaults and exposed features | Hardened baselines, least functionality, reviewed headers |
| A06 Vulnerable and Outdated Components | Known flaws in dependencies | Inventory, patch, and remove unused components |
| A07 Identification and Authentication Failures | Weak login, session, or recovery flows | MFA, strong password handling, safe session lifecycle |
| A08 Software and Data Integrity Failures | Unsafe updates, deserialisation, or CI trust | Sign artefacts, verify integrity, avoid unsafe deserialisation |
| A09 Security Logging and Monitoring Failures | Attacks go unnoticed | Log security events, alert, and retain evidence |
| A10 Server-Side Request Forgery | Server fetches attacker-controlled destinations | Allowlists, egress control, metadata protection |

### API security and the OWASP API Top 10 (2023)

APIs expose objects and functions directly, so authorisation bugs are more visible and more common. The OWASP API Security Top 10 (2023) names the recurring failures: broken object level authorisation (API1), broken authentication (API2), broken object property level authorisation (API3), unrestricted resource consumption (API4), broken function level authorisation (API5), unrestricted access to sensitive business flows (API6), server-side request forgery (API7), security misconfiguration (API8), improper inventory management (API9), and unsafe consumption of third-party APIs (API10).

Practical API testing starts with an inventory: every endpoint, method, parameter, role, and data object. Then test horizontal access (another user's object), vertical access (admin function), property-level access (mass assignment, hidden fields), and rate limits. GraphQL adds query depth, introspection, and field-level authorisation concerns. Use the API Security Top 10 as a coverage map, not a scorecard.

### Secure coding and remediation

Secure design starts before code: threat-model the feature, define authorisation rules, and agree on data handling. During implementation, validate input on the server, encode output for its context, parameterise queries, enforce least privilege, keep secrets in a managed store, and fail closed when a check cannot complete.

Dependencies are part of your code. Pin versions, generate an SBOM where appropriate, scan for known vulnerabilities, and remove unused packages. Security headers such as HSTS, `X-Content-Type-Options: nosniff`, a restrictive `Content-Security-Policy`, and `Referrer-Policy` reduce exposure, but they do not fix injection or access control. Tests should cover authorisation denial, not just the happy path.

### Testing methodology and bug bounty basics

The OWASP Web Security Testing Guide organises testing into information gathering, configuration, identity, authentication, authorisation, session management, input validation, error handling, cryptography, business logic, and client-side testing. Follow a methodology so coverage is deliberate rather than accidental.

Manual testing with a proxy finds logic flaws that scanners miss; automation provides breadth and regression coverage. Burp Suite Community and ZAP both intercept and modify traffic; Burp Community throttles some automated features, which is fine for manual work. Semgrep adds static review. Report findings with reproduction steps, evidence, impact, and a remediation that a developer can implement.

Bug bounties are a supplement, not a substitute for an assessment. Read the scope, honour safe-harbour terms, avoid testing other customers' data, and never publicly disclose before the programme allows it. Payouts are not guaranteed, duplicates are common, and a rejected report is still practice.

## Legal and safe practice

Use local, deliberately vulnerable applications for practice. When working on a real programme, the programme's scope and rules are the authorisation.

- Test only assets listed in the scope, with the techniques the programme permits.
- Do not access, modify, or retain other users' data; use test accounts you created.
- Respect rate limits and avoid denial-of-service testing unless explicitly authorised.
- Report vulnerabilities privately and in good faith; do not publish exploit details before remediation.
- Keep evidence encrypted and redact personal data in reports.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | HTTP and browser | Learn requests, responses, cookies, SOP, and CORS with DevTools. | Annotated capture of a login flow |
| 1 | Proxy workflow | Install Burp Community or ZAP and map a local app. | Site map and request inventory |
| 2 | Authentication | Test registration, login, MFA, reset, and session lifecycle. | Auth test notes with edge cases |
| 3 | Authorisation | Create two accounts and test horizontal and vertical access. | Access-control matrix with results |
| 4 | Injection | Work through SQLi, XSS, CSRF, and SSRF labs locally. | Validated findings with fixes |
| 5 | APIs | Inventory and test a local API against the API Top 10. | API inventory and findings |
| 6 | Reporting | Write a full report for Juice Shop or crAPI. | Executive summary plus findings and retest |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner to advanced | Free | Interactive labs | The strongest structured web security practice |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Beginner to intermediate | Free | Full application | A realistic target for end-to-end assessment |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; several rooms free | Guided labs | Web fundamentals with hints and structure |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Beginner to advanced | Freemium; some modules free | Guided labs | Structured web and API modules |
| [PentesterLab](https://www.pentesterlab.com/) | PentesterLab | Beginner to intermediate | Freemium; some exercises free | Browser and VM labs | Focused exploitation and code review practice |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [OWASP Top 10](https://owasp.org/Top10/) | OWASP | The reference risk categories for web applications |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Test cases and methodology for assessments |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Verifiable requirements at increasing assurance levels |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | OWASP | Practical remediation guidance for specific topics |
| [OWASP API Security Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/) | OWASP | The API-specific risk categories for 2023 |
| [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security) | Mozilla | Browser security behaviour and headers |
| [CWE Top 25](https://cwe.mitre.org/top25/) | MITRE | The most dangerous software weakness patterns |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [PortSwigger labs](https://portswigger.net/web-security/all-labs) | PortSwigger | Free | Targeted vulnerabilities with clear goals |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free | A full modern application to assess end to end |
| [DVWA](https://github.com/digininja/DVWA) | DVWA project | Free | Classic vulnerabilities at adjustable difficulty |
| [OWASP crAPI](https://owasp.org/www-project-crapi/) | OWASP | Free | API-specific flaws mapped to the API Top 10 |

Run these applications locally with Docker or a VM, bind them to localhost, and never expose them to the internet. They are intentionally insecure.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Burp Suite Community | Intercept, inspect, and replay web traffic | [PortSwigger](https://portswigger.net/burp/communitydownload) |
| ZAP | Open-source proxy and scanner for authorised testing | [zaproxy.org](https://www.zaproxy.org/) |
| sqlmap | Demonstrate SQL injection in local, authorised labs only | [sqlmap.org](https://sqlmap.org/) |
| Semgrep | Static analysis for insecure code patterns | [semgrep.dev](https://semgrep.dev/) |
| curl | Reproduce and script HTTP requests precisely | [curl.se](https://curl.se/) |
| ffuf | Content and parameter discovery with rate control | [ffuf](https://github.com/ffuf/ffuf) |

Tools do not replace methodology. A scanner will not notice that a user can read another tenant's invoice, and a proxy will not tell you which finding matters to the business. Map, test, validate, then report.

## Practical projects and exercises

**Project 1: Full Juice Shop assessment (portfolio-worthy).**
Objective: demonstrate the complete workflow. Setup: run Juice Shop locally, build a WSTG-based test plan, test for at least two weeks of part-time work, and document eight to ten validated findings across access control, injection, authentication, and configuration. Deliverable: a report with executive summary, reproduction, evidence, severity rationale, and remediation for each finding.

**Project 2: Break it, then fix it.**
Objective: prove you can remediate, not just exploit. Setup: build a small Flask or Express app with a login, a record list, and a search feature; introduce three flaws on a branch, then fix them with parameterised queries, server-side authorisation, and output encoding. Deliverable: before-and-after code, tests that prove the fix, and a Semgrep rule that catches at least one pattern.

**Project 3: API security review.**
Objective: apply the API Top 10 to a real API codebase. Setup: run crAPI locally, inventory every endpoint, create two users, and test object-level, function-level, and property-level authorisation plus rate limits. Deliverable: an endpoint inventory, an access matrix, five validated findings, and a prioritised remediation plan.

## Common mistakes and misconceptions

- **Running a scanner and calling it a test.** Scanners find patterns; they do not understand business logic or authorisation.
- **Testing only as an administrator.** Privilege boundaries are where the real findings live.
- **Relying on client-side validation.** Anything in the browser can be changed.
- **Ignoring APIs and mobile clients.** They often bypass the controls added to the web UI.
- **Publishing a finding before remediation.** It can endanger users and breach programme rules.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Application security engineer | Software development | Threat models, code review, and fixes with tests |
| Web penetration tester | PortSwigger labs and reports | Methodology, validation, and clear business impact |
| Product security engineer | Backend or API development | Secure design reviews and dependency governance |
| Bug bounty researcher | Consistent lab practice | Scope discipline, report quality, and persistence |

Web security is one of the most accessible specialities because the labs are free and the feedback is immediate. A public portfolio of lab reports and a fixed open-source issue can open the first conversation.

## Next steps

1. Complete PortSwigger's apprentice labs and keep a written test log for each.
2. Run Juice Shop locally and practise the authorisation and injection categories first.
3. Read the OWASP WSTG structure and use it to plan your next assessment.
4. Continue to [Ethical hacking](../ethical-hacking/README.md) for the engagement lifecycle, or [API security](../additional-topics/application-security/README.md) for depth.
5. Use the [beginner roadmap](../roadmaps/beginner-to-ethical-hacker.md) and [training grounds](../resources/training-grounds/beginner.md) to plan practice.

## References

- OWASP, *Top 10 Web Application Security Risks*, <https://owasp.org/Top10/>
- OWASP, *Web Security Testing Guide*, <https://owasp.org/www-project-web-security-testing-guide/>
- OWASP, *Application Security Verification Standard*, <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP, *API Security Top 10 2023*, <https://api-security.owasp.org/editions/2023/en/0x11-t10/>
- OWASP, *Cheat Sheet Series*, <https://cheatsheetseries.owasp.org/>
- Mozilla, *MDN Web Security*, <https://developer.mozilla.org/en-US/docs/Web/Security>
- MITRE, *CWE Top 25*, <https://cwe.mitre.org/top25/>

---

Last reviewed: 2026-10-31

[Repository home](../README.md) · [Learning paths](../roadmaps/README.md) · [Free courses](../resources/free-courses/README.md) · [Contributing](../CONTRIBUTING.md)
