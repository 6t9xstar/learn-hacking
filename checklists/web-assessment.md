# Web Assessment Checklist: Scoping Through Retest

[Home](../README.md) / [Checklists](README.md) / Web assessment

Use this checklist for an authorized web application or API assessment. It follows a practical sequence: confirm authority, define scope, map the attack surface, test authentication and authorization, examine input handling and APIs, preserve evidence, report, and retest.

> **Authorized environments only.** Test only applications you own or have explicit written permission to assess. A public login page is not permission. Stop if a target, third-party integration, or data set falls outside the signed scope.

**Engagement ID:** `[ENG-YYYY-NNN]`
**Application / API:** `[Name and environment]`
**Assessment window:** `[Start and end, time zone]`
**Lead assessor:** `[Name]`

## Scope reminder

- Name every hostname, API base URL, mobile backend, and environment (development, staging, production).
- List excluded paths, tenants, integrations, and destructive tests.
- Confirm test accounts, roles, and data sets.
- Confirm whether automated scanning, fuzzing, file upload, and state-changing tests are allowed.
- Record source IPs and notify the application owner and monitoring team.

## 1. Preconditions

- [ ] Signed authorization covers this application, environment, and time window. — Owner: ___; Evidence: ___
- [ ] Rules of engagement list permitted and prohibited techniques. — Owner: ___; Evidence: ___
- [ ] Emergency contact and stop procedure are known to every tester. — Owner: ___; Evidence: ___
- [ ] A rollback or restore point exists for any state-changing test. — Owner: ___; Evidence: ___
- [ ] Test accounts and roles are provisioned with minimum necessary privilege. — Owner: ___; Evidence: ___
- [ ] Data handling rules for screenshots, tokens, and personal data are agreed. — Owner: ___; Evidence: ___

## 2. Scoping and architecture

- [ ] Application type, framework, and hosting model are documented from the owner, not only from banners. — Owner: ___; Evidence: ___
- [ ] User roles and business-critical workflows are listed. — Owner: ___; Evidence: ___
- [ ] Authentication methods (password, SSO, MFA, API keys, OAuth/OIDC) are documented. — Owner: ___; Evidence: ___
- [ ] Data flows and trust boundaries are sketched. — Owner: ___; Evidence: ___
- [ ] Third-party services, CDNs, payment providers, and identity providers are identified. — Owner: ___; Evidence: ___
- [ ] Regulatory or contractual data restrictions are recorded. — Owner: ___; Evidence: ___
- [ ] Out-of-scope functionality is listed and visible to every tester. — Owner: ___; Evidence: ___

## 3. Reconnaissance

- [ ] Public DNS, certificate transparency, and subdomain data are reviewed within scope. — Owner: ___; Evidence: ___
- [ ] `robots.txt`, sitemaps, and public documentation are reviewed. — Owner: ___; Evidence: ___
- [ ] JavaScript bundles and source maps are inspected for routes and API endpoints. — Owner: ___; Evidence: ___
- [ ] API specifications, OpenAPI/Swagger, and GraphQL schemas are located if public. — Owner: ___; Evidence: ___
- [ ] Technology fingerprinting is recorded with the evidence source. — Owner: ___; Evidence: ___
- [ ] Directory or content discovery is rate-limited and limited to approved scope. — Owner: ___; Evidence: ___
- [ ] No scanner is pointed at a host outside the allowlist. — Owner: ___; Evidence: ___

## 4. Authentication

- [ ] Login, logout, registration, and account recovery flows are mapped. — Owner: ___; Evidence: ___
- [ ] Password policy and account lockout behavior are tested with synthetic accounts. — Owner: ___; Evidence: ___
- [ ] MFA enrollment, bypass, and recovery paths are reviewed. — Owner: ___; Evidence: ___
- [ ] SSO/OAuth flows are checked for state, redirect URI, and token handling issues. — Owner: ___; Evidence: ___
- [ ] Username enumeration is tested with consistent, low-volume requests. — Owner: ___; Evidence: ___
- [ ] Default or weak credentials are checked only on accounts created for testing. — Owner: ___; Evidence: ___
- [ ] Authentication events are checked for useful logging without recording secrets. — Owner: ___; Evidence: ___

## 5. Session management

- [ ] Cookie attributes (`Secure`, `HttpOnly`, `SameSite`, `Path`, expiry) are recorded. — Owner: ___; Evidence: ___
- [ ] Token storage location and lifetime are documented. — Owner: ___; Evidence: ___
- [ ] Session fixation, rotation on login, and invalidation on logout are tested. — Owner: ___; Evidence: ___
- [ ] Concurrent sessions and token replay are tested within the lab accounts. — Owner: ___; Evidence: ___
- [ ] CSRF protections are verified for state-changing requests. — Owner: ___; Evidence: ___
- [ ] Cache-control behavior for authenticated responses is checked. — Owner: ___; Evidence: ___

## 6. Access control

- [ ] Horizontal access is tested between two test accounts of the same role. — Owner: ___; Evidence: ___
- [ ] Vertical access is tested from a low-privilege account to admin functions. — Owner: ___; Evidence: ___
- [ ] Object identifiers are tested for missing ownership checks, using `GET` where possible. — Owner: ___; Evidence: ___
- [ ] Client-side route guards are compared with server-side enforcement. — Owner: ___; Evidence: ___
- [ ] HTTP method and content-type overrides are tested for authorization bypass. — Owner: ___; Evidence: ___
- [ ] Tenant isolation is tested if the application is multi-tenant. — Owner: ___; Evidence: ___
- [ ] Authorization failures are checked for consistent, non-enumerating responses. — Owner: ___; Evidence: ___

## 7. Input handling

- [ ] Every input point is classified: query, body, path, header, cookie, file, and WebSocket. — Owner: ___; Evidence: ___
- [ ] Injection classes are tested with minimal, non-destructive proof. — Owner: ___; Evidence: ___
- [ ] Reflected output is tested for context-appropriate encoding. — Owner: ___; Evidence: ___
- [ ] Stored content is tested for persistence and cross-user impact. — Owner: ___; Evidence: ___
- [ ] File upload type, size, name, and storage handling are reviewed. — Owner: ___; Evidence: ___
- [ ] Server-side template, command, and expression injection are tested only if in scope. — Owner: ___; Evidence: ___
- [ ] XML/JSON parsers are checked for unsafe configuration where applicable. — Owner: ___; Evidence: ___

## 8. APIs

- [ ] API inventory and authentication scheme are documented. — Owner: ___; Evidence: ___
- [ ] Object-level and function-level authorization are tested per endpoint. — Owner: ___; Evidence: ___
- [ ] Mass assignment and excessive data exposure are checked with test accounts. — Owner: ___; Evidence: ___
- [ ] Rate limiting, pagination, and resource limits are reviewed. — Owner: ___; Evidence: ___
- [ ] GraphQL introspection, batching, and query depth are tested if applicable. — Owner: ___; Evidence: ___
- [ ] Error responses are checked for internal detail and stack traces. — Owner: ___; Evidence: ___
- [ ] API versioning and deprecated endpoints are reviewed for weaker controls. — Owner: ___; Evidence: ___

## 9. Business logic

- [ ] Critical workflows and invariants are documented. — Owner: ___; Evidence: ___
- [ ] Price, quantity, coupon, and refund logic are tested for client trust. — Owner: ___; Evidence: ___
- [ ] Race conditions and replay are tested with non-destructive requests. — Owner: ___; Evidence: ___
- [ ] Workflow step skipping and approval bypass are tested. — Owner: ___; Evidence: ___
- [ ] Limits on invitations, exports, and bulk actions are reviewed. — Owner: ___; Evidence: ___

## 10. Cryptography and transport

- [ ] TLS configuration and certificate validity are checked. — Owner: ___; Evidence: ___
- [ ] HTTP-to-HTTPS behavior and HSTS are recorded. — Owner: ___; Evidence: ___
- [ ] Sensitive data in URLs, logs, and client storage is checked. — Owner: ___; Evidence: ___
- [ ] Password hashing and token generation are reviewed with the owner's documentation. — Owner: ___; Evidence: ___
- [ ] Randomness and crypto libraries are checked for deprecated or unsafe use. — Owner: ___; Evidence: ___
- [ ] No live secret is copied into the report. — Owner: ___; Evidence: ___

## 11. Configuration and headers

- [ ] Security headers are recorded with their actual values. — Owner: ___; Evidence: ___
- [ ] CORS policy is tested with trusted and untrusted origins. — Owner: ___; Evidence: ___
- [ ] Debug modes, verbose errors, and default pages are checked. — Owner: ___; Evidence: ___
- [ ] Directory listing, backup files, and exposed metadata are checked within scope. — Owner: ___; Evidence: ___
- [ ] Admin interfaces and documentation endpoints are reviewed for exposure. — Owner: ___; Evidence: ___
- [ ] Cloud storage or CDN misconfiguration is checked only on authorized assets. — Owner: ___; Evidence: ___

## 12. Logging and monitoring

- [ ] Authentication success and failure are logged with sufficient context. — Owner: ___; Evidence: ___
- [ ] Authorization denials are logged and routed to a monitored channel. — Owner: ___; Evidence: ___
- [ ] Sensitive values are not logged in plaintext. — Owner: ___; Evidence: ___
- [ ] Log retention and access control meet the engagement requirements. — Owner: ___; Evidence: ___
- [ ] A sample attack sequence can be reconstructed from logs. — Owner: ___; Evidence: ___

## 13. Evidence

- [ ] Each finding has a reproducible request, response, and timestamp. — Owner: ___; Evidence: ___
- [ ] Screenshots include the URL, account, and time where possible. — Owner: ___; Evidence: ___
- [ ] Tokens, cookies, passwords, and personal data are redacted. — Owner: ___; Evidence: ___
- [ ] Evidence files are hashed and stored in the agreed location. — Owner: ___; Evidence: ___
- [ ] Findings are reviewed for false positives before reporting. — Owner: ___; Evidence: ___

## 14. Reporting

- [ ] Executive summary explains business impact without technical overload. — Owner: ___; Evidence: ___
- [ ] Each finding includes description, evidence, affected assets, severity, and remediation. — Owner: ___; Evidence: ___
- [ ] CVSS or another severity method is applied with its limitations stated. — Owner: ___; Evidence: ___
- [ ] Positive controls and tested-but-not-vulnerable areas are noted. — Owner: ___; Evidence: ___
- [ ] Remediation advice is specific, feasible, and assigned to an owner. — Owner: ___; Evidence: ___
- [ ] The report is reviewed for client confidentiality and accurate scope claims. — Owner: ___; Evidence: ___

## 15. Retest

- [ ] The retest scope and date are agreed. — Owner: ___; Evidence: ___
- [ ] Each finding has a retest procedure and pass/fail criterion. — Owner: ___; Evidence: ___
- [ ] The fix is verified, not just the absence of the original payload. — Owner: ___; Evidence: ___
- [ ] Regression around related endpoints is checked. — Owner: ___; Evidence: ___
- [ ] The report records retest status, evidence, and residual risk. — Owner: ___; Evidence: ___

## Stop conditions

Stop and escalate if a test causes an outage, exposes real user data, affects a third party, requires destructive changes, or moves outside the approved host list. Record the time, the action, the impact, and who was notified.

## References

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — test methodology and reporting.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — risk categories for coverage mapping.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — safe local practice target.
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free labs for validation practice.

---

**Related:** [Checklist index](README.md) · [Pre-engagement](pre-engagement.md) · [Web drills](../exercises/web-security-drills.md) · [Vulnerability report template](../templates/vulnerability-report.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
