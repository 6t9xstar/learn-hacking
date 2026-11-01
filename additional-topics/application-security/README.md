[Repository home](../../README.md) / Additional topics / Application security

# Application Security

Application security (AppSec) is the discipline of making software behave securely under adversarial conditions. It spans secure design, threat modeling, security requirements, code review, testing, and the programmatic work of helping teams ship fixes. This guide is for developers who want to review code with a security lens, testers moving toward product security, and AppSec engineers who need a repeatable method rather than a bag of payloads.

AppSec is less about memorizing vulnerabilities than about tracing trust. Every request crosses boundaries — browser to API, service to database, user to admin — and every boundary needs authentication, authorization, validation, and logging. Once you can follow data and authority through a system, most findings become visible.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Intermediate; advanced for program design and cryptography review |
| Realistic time | 120–180 hours to review a small application competently |
| Cost | Free with local vulnerable apps and open-source tools |
| Prerequisites | HTTP, one backend language, HTML/JavaScript, basic databases |
| Lab requirement | Locally hosted deliberately vulnerable apps; authorized scopes only |
| Best for | Developers, QA engineers, AppSec analysts, bug bounty learners |

## Why this field matters

Almost every breach starts with an application-level weakness: a missing authorization check, an injection flaw, a leaked secret, or an authentication bypass. Infrastructure hardening cannot save an API that returns any user's records to anyone who changes an identifier. Attackers prefer the application because it is exposed by design and changes constantly.

Defensively, AppSec is where security has the most leverage. A single design review can remove a class of bugs from an entire product line. A secure code review catches the issue before it ships. A well-run bug bounty program turns external researchers into an extension of your testing team. The work is technical, but its output is measured in risk reduced, not vulnerabilities found.

## What you will learn

- Apply secure design principles and threat modeling to a real feature.
- Write security requirements and verify them against OWASP ASVS.
- Review authentication, authorization, session, and input-handling code.
- Identify and fix injection, SSRF, deserialization, and file-upload flaws.
- Assess API security, including object-level and function-level authorization.
- Perform a structured secure code review and produce actionable findings.
- Hand a finding to a bug bounty program or internal team without friction.
- Build lightweight AppSec program elements such as security champions and metrics.

## Prerequisites and honest expectations

You should understand HTTP requests and responses, cookies, status codes, and at least one server-side framework. You should be able to read code in the language you are reviewing; security review is not pattern matching from the outside. Familiarity with SQL, templating, and identity protocols helps.

Expect to read a lot of code and write very few exploits. Most findings are ordinary mistakes in authorization, error handling, or configuration. You will also need to explain risk to people who are busy, which is a communication skill as much as a technical one. Tools will help you find candidates, but the judgment is yours.

## Core concepts

### Secure design principles

Security starts with structure. Least privilege means each component gets only the access it needs. Complete mediation means every access is checked, not just the first one. Fail-safe defaults mean a missing decision denies rather than allows. Economy of mechanism favors simple designs with fewer places to make a mistake. Separation of duties prevents one compromised account from completing a sensitive action alone.

Other useful principles include minimizing attack surface, not trusting the client, and designing for secure recovery. These are not slogans; they translate into review questions. Does this service account really need write access to the whole bucket? What happens if the authorization service is unavailable? Can one admin both create a payment and approve it?

### Threat modeling with STRIDE

Threat modeling is a structured conversation about what can go wrong. Draw a data-flow diagram with processes, data stores, external entities, and trust boundaries. Then apply STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege.

For each credible threat, record the asset, the attack path, the existing control, and the residual risk. Rank by impact and likelihood, not by how clever the attack is. A threat model is useful when it changes a design decision; if it produces a document nobody reads, simplify it until it does.

### Security requirements and ASVS

Security requirements turn vague goals into testable statements. "The application must be secure" is not a requirement. "Every API request must be authorized against the authenticated subject and tenant, and unauthorized requests return 403 without data" is.

The OWASP Application Security Verification Standard (ASVS) provides a catalog of verifiable requirements across authentication, session management, access control, validation, cryptography, and more. Choose a level appropriate to the application's risk, map requirements to tests, and record evidence. ASVS is also a useful structure for procurement and third-party assessment.

### Authentication

Authentication proves identity. Passwords must be stored with a memory-hard algorithm such as Argon2id, or a well-configured bcrypt/scrypt, never with a fast hash or encryption. Enforce rate limits and breached-password checks, and support multi-factor authentication. Session fixation, credential stuffing, and account enumeration are common failures.

Modern applications often delegate authentication to an identity provider using OpenID Connect, with OAuth 2.0 for delegated authorization. Be precise about the distinction: OAuth grants access to resources; OIDC authenticates the user. Validate tokens properly — signature, issuer, audience, expiry — and never trust a user ID or role supplied in a request body when the token already carries it.

### Authorization

Authorization decides what an authenticated subject may do. Broken access control is consistently the top web risk because it is easy to miss and devastating when found. Insecure direct object references (IDOR) occur when an endpoint accepts an identifier and returns the object without checking ownership. Function-level flaws occur when an admin endpoint relies on the UI hiding the button.

Enforce authorization server-side on every request, close to the data. Prefer deny-by-default policies and centralize decisions in a policy layer rather than scattering `if` statements. Test horizontally (same role, different user) and vertically (different role). For multi-tenant systems, make tenant isolation explicit in the query, not just in the session.

### Input handling and output encoding

Input validation reduces the range of accepted data; output encoding prevents that data from being interpreted as code. They are not interchangeable. Use allowlists for structured fields, canonicalize before validating, and reject unexpected types. Parameterize SQL queries, use safe template engines, and avoid string-built commands.

Output encoding must match the context: HTML entity encoding for HTML bodies, attribute encoding for attributes, JavaScript encoding for script contexts, URL encoding for URLs, and CSS encoding for styles. Content Security Policy adds defense in depth against cross-site scripting but does not replace encoding. Never build HTML by concatenating untrusted strings.

### Sessions, cookies, and CSRF

Sessions carry identity across requests. Cookies should be `HttpOnly`, `Secure`, and scoped with `SameSite`; use the `__Host-` prefix where appropriate. Rotate the session identifier after login, expire idle sessions, and revoke on logout. Avoid putting sensitive data in client-side storage where script access is possible.

Cross-site request forgery tricks a logged-in browser into sending a state-changing request. Defenses include anti-CSRF tokens bound to the session, `SameSite` cookies, origin and referer checks, and avoiding state changes on GET. APIs using bearer tokens in headers are generally not CSRF-vulnerable, but cookie-based APIs are.

### Cryptography in applications

Use vetted libraries and protocols. TLS 1.2 or 1.3 with proper certificate validation protects data in transit. For data at rest, use authenticated encryption such as AES-GCM or ChaCha20-Poly1305, with keys managed by a KMS or HSM. Generate randomness with a cryptographically secure generator, not `Math.random()` or a timestamp.

Do not invent cryptographic protocols, reuse IVs or nonces, or encrypt passwords (hash them instead). Store secrets outside source control and rotate them. If you must implement something, use high-level constructions such as libsodium's sealed boxes rather than raw primitives. Review key lifecycle: generation, distribution, rotation, revocation, and destruction.

### SSRF, deserialization, and file handling

Server-side request forgery occurs when an application fetches a URL supplied by a user. Attackers target internal services and cloud metadata endpoints. Defend with an allowlist of destinations, block link-local and private ranges, disable redirects or revalidate them, and isolate egress. Resolve DNS and check the resolved address, not just the hostname.

Insecure deserialization turns untrusted bytes into objects and sometimes code execution. Avoid native serialization formats for untrusted data; prefer JSON with strict schemas. If you must deserialize complex objects, sign the payload and allowlist types. File uploads need content-type and extension checks, size limits, storage outside the web root, generated filenames, and malware scanning; also guard against path traversal and zip-slip.

### API security

APIs concentrate authorization and data exposure risk. The OWASP API Security Top 10 highlights broken object-level authorization, broken authentication, broken object-property-level authorization, unrestricted resource consumption, broken function-level authorization, and business-flow abuse. Every endpoint needs an explicit auth model, schema validation, rate limits, and response filtering.

Mass assignment occurs when a client can set fields it should not, such as `role` or `isAdmin`. Use explicit input models rather than binding the whole request body. Avoid excessive data exposure by returning purpose-built response objects. Version APIs deliberately and keep an inventory; shadow APIs are a common cause of breaches.

### Secure code review

A secure code review is a focused reading of a change for security-relevant behavior. Start with the purpose of the change and the data it touches. Identify sources of untrusted input, sinks of dangerous operations, and the authorization checks in between. Look at error handling, logging, secrets, and configuration, not just the happy path.

Use tools to find candidates, then verify manually. Semgrep is good for custom patterns and fast feedback; CodeQL supports deeper queries. Check that tests cover abuse cases, not just expected behavior. Write findings with file and line, a concrete attack scenario, impact, and a specific fix. A finding the developer cannot act on is only half a finding.

### Bug bounty handoff and disclosure

A bug bounty program is a controlled channel for external reports. Before testing, read the scope, rules, and safe-harbor language. Stay within the listed assets, use test accounts, avoid privacy violations, and never run denial-of-service or automated exploitation against production. Report the minimum evidence needed to reproduce.

A good report states the affected asset, preconditions, steps, observed versus expected behavior, impact, and a remediation suggestion. Redact personal data and secrets. Be responsive to triage questions and respectful of duplicate findings. If the program is unresponsive and the issue is serious, follow the organization's security contact or a coordinated disclosure process rather than publishing immediately.

## A repeatable review method

Ad hoc review misses things. Use the same six passes on every feature, and write down what you checked so another reviewer can continue.

1. **Understand the purpose.** Read the product docs, the pull request description, and the tests. Identify users, roles, data classification, and the action that would be catastrophic if abused.
2. **Map the surface.** List routes, parameters, headers, file inputs, background jobs, and third-party callbacks. Mark which are authenticated and which are public.
3. **Trace trust.** For each entry point, follow data from source to sink. Note every authorization decision, validation step, encoding operation, and database query.
4. **Probe behavior.** Use two accounts at different privilege levels. Try changing identifiers, omitting fields, replaying requests, and sending unexpected content types.
5. **Verify and minimize.** Reproduce the issue with the smallest request. Distinguish a real impact from a theoretical one, and record the exact preconditions.
6. **Report and retest.** Write the finding with evidence and a fix, then verify the fix and check for regressions in adjacent code.

The method scales from a single endpoint to an entire product. For a large review, time-box each pass and prioritize the paths that touch money, identity, or personal data.

## The AppSec program

Individual reviews do not scale. A program adds security requirements, training, champions, metrics, and a path for exceptions. OWASP SAMM provides a maturity model across governance, design, implementation, verification, and operations; use it to choose a few improvements rather than chasing a perfect score.

Security champions are developers who act as the first security contact for their team. Give them time, training, and a direct line to AppSec, and recognize their work. Track outcomes such as the percentage of services with threat models, time to remediate critical findings, and the ratio of design reviews to post-release findings. Avoid measuring the number of vulnerabilities found; it rewards noise.

## Legal and safe practice

> Test only applications you own or are explicitly authorized to assess. A public URL is not permission, and a bug bounty scope is a contract with limits.

Use local instances of deliberately vulnerable applications for practice. When testing a real program, respect scope, rate limits, and data-handling rules. Do not access other users' data to prove impact; use two test accounts you control. Do not run destructive payloads, persistence, or denial-of-service tests unless the program explicitly allows them.

Handle findings confidentially. Do not publish a working exploit before a fix, and do not include personal data in screenshots. If you find a vulnerability outside a program's scope, report it through the vendor's security contact and stop testing. Read [ETHICS.md](../../ETHICS.md) before any assessment.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Web fundamentals | HTTP, cookies, same-origin policy, frameworks | A small app you can trace request to database |
| 2. Core weaknesses | Injection, access control, authentication, XSS | Ten lab exercises with root-cause notes |
| 3. Secure design | Threat modeling, requirements, ASVS | A threat model and requirement checklist |
| 4. Code review | Data flow, authorization, tooling | A reviewed pull request with findings and fixes |
| 5. Program and disclosure | Champions, metrics, bug bounty | A triage report and a remediation plan |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner to advanced | Free account | Yes | The best structured lab progression for web vulnerabilities |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Beginner to intermediate | Free, self-hosted | Yes | An intentionally insecure app with a built-in challenge tracker |
| [OWASP WebGoat](https://owasp.org/www-project-webgoat/) | OWASP | Beginner | Free, self-hosted | Yes | Guided lessons on common application flaws |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No | A comprehensive testing methodology and checklist |
| [OWASP SAMM](https://owaspsamm.org/) | OWASP | Intermediate | Free | No | A maturity model for building an AppSec program |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | OWASP | The shared baseline for web application risk |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Verifiable security requirements for applications |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | A structured testing guide with test cases |
| [OWASP SAMM](https://owaspsamm.org/) | OWASP | Program-level maturity guidance |
| [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) | OWASP | A practical, lightweight modeling method |
| [NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) | NIST | Secure development practices that connect to delivery |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Free account | Hosted lab instances; stay within the provided targets |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free, self-hosted | Run locally or in an isolated container; never expose it publicly |
| [OWASP WebGoat](https://owasp.org/www-project-webgoat/) | OWASP | Free, self-hosted | Local teaching application; use only the bundled lessons |
| [DVWA](https://github.com/digininja/DVWA) | DVWA project | Free, self-hosted | Deliberately vulnerable PHP app; keep it on a host-only network |
| [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/) | OWASP | Free | Modeling lab: build a data-flow diagram for an app you own |

## Essential open-source tools

Tools find candidates; reviewers establish impact. A scanner report is the beginning of an assessment, not the end.

| Tool | Purpose | Link |
| --- | --- | --- |
| Semgrep | Custom static analysis for security patterns | [semgrep.dev](https://semgrep.dev/) |
| CodeQL | Semantic code analysis with queryable databases | [codeql.github.com](https://codeql.github.com/) |
| OWASP ZAP | Dynamic scanning and manual request testing | [zaproxy.org](https://www.zaproxy.org/) |
| OWASP Threat Dragon | Threat modeling with data-flow diagrams | [owasp.org](https://owasp.org/www-project-threat-dragon/) |
| OWASP Dependency-Check | Known-vulnerable dependency detection | [owasp.org](https://owasp.org/www-project-dependency-check/) |
| Burp Suite Community | Intercepting proxy for manual testing | [portswigger.net](https://portswigger.net/burp/communitydownload) |

## Practical projects and exercises

### Project 1: Threat model, code review, and remediation

Objective: take a small application you wrote or a deliberately vulnerable app, model its threats, review the code, and fix the highest-risk issue.

Constraints: pick three trust boundaries and at least five endpoints. Review authentication, authorization, input handling, and logging. Write a failing test that demonstrates each finding before fixing it.

Deliverable: a threat model, a code review report with severity and evidence, and a pull request that fixes at least two findings with tests. The before-and-after diff is the portfolio artifact; it shows you can both find and fix.

### Project 2: ASVS assessment of a real feature

Objective: assess one feature against a defined ASVS level and produce evidence.

Constraints: choose a feature with authentication, authorization, and data storage. Map at least fifteen requirements, mark each pass, fail, or not applicable, and cite the test or code that supports the decision. Do not test systems you do not own.

Deliverable: a spreadsheet or Markdown matrix with requirement, status, evidence, and remediation owner, plus a one-page executive summary. This is directly useful in AppSec and compliance work.

### Project 3: Bug bounty triage and handoff pack

Objective: practice the reporting side of security by writing a submission-quality report for a lab finding.

Constraints: use a deliberately vulnerable app, not a live program. Include scope, reproduction, impact, evidence, and a fix. Write a second version redacted for public release.

Deliverable: a report in the format a program expects, a triage checklist, and a short reflection on what you would do if the report were marked duplicate or informative. Communication quality is often what separates a paid report from a closed one.

## Common mistakes and misconceptions

- Relying on client-side validation or hidden UI for authorization.
- Believing HTTPS makes an application secure; it protects transport, not logic.
- Concatenating user input into SQL, HTML, shell commands, or templates despite using a framework.
- Checking authentication but not authorization on every object access.
- Hashing passwords with SHA-256 or encrypting them instead of using a password hash.
- Treating SAST output as a complete review and missing business-logic flaws.
- Testing outside a bug bounty scope because "it was publicly accessible."
- Publishing a finding before the vendor has a chance to fix it.

## Career paths and roles

Application security engineers review code, run threat models, and build controls. Product security engineers embed with product teams and own the security roadmap for a product line. Security champions are developers with additional security responsibility. Penetration testers and bug bounty researchers specialize in finding vulnerabilities, while code auditors focus on deep review. Security architects connect AppSec to system design.

Entry points include software development, QA automation, and SOC analysis. A portfolio with a threat model, a code review, and a remediation pull request is more convincing than a list of labs. Expect interviews to include a code review exercise, a design discussion, and a question about how you would handle a disagreement with a developer.

## Next steps

- Complete ten PortSwigger labs and write a root-cause note for each.
- Threat model a feature you built and identify three controls you would add.
- Review an open-source project's authentication code and report a documentation or hardening suggestion respectfully.
- Map five ASVS requirements to tests in a small app.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and [practical projects](../../practical-projects/README.md).

## References

- OWASP, [Top 10](https://owasp.org/www-project-top-ten/).
- OWASP, [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/).
- OWASP, [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/).
- OWASP, [SAMM](https://owaspsamm.org/).
- OWASP, [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).
- NIST, [Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
