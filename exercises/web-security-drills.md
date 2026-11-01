# Web Security Drills: OWASP Top 10 in Local Labs

[Home](../README.md) / [Exercises](README.md) / Web security drills

These 22 drills turn the OWASP Top 10 from a list into a repeatable testing habit: observe behavior, state a hypothesis, validate it safely, explain the root cause, propose remediation, and preserve evidence. Every drill runs against a local OWASP Juice Shop instance or an assigned PortSwigger Web Security Academy lab. Nothing here targets a production site, a shared lab instance, or another learner.

> **Authorized targets only.** Use `127.0.0.1` Juice Shop or the exact lab instance PortSwigger assigns to your account. Do not test the PortSwigger marketing site, other learners' instances, or any host you do not own. Stop immediately if you encounter real personal data, real credentials, or a system outside the lab boundary.

## Lab setup

### Local Juice Shop

Juice Shop is an intentionally vulnerable application maintained by OWASP. Run it locally and bind it to loopback so it is not exposed to your network.

```bash
docker run --rm --name juice-shop -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```

Open the local application in your browser at port 3000. Create accounts only with synthetic addresses such as `learner-a@example.test`. The container is disposable: stop it and start a fresh one to reset all data. If Docker is unavailable, follow the official project instructions for a local Node.js install.

### PortSwigger Web Security Academy

Create a free account, open the specific lab named in the drill, and use only the instance assigned to you. Labs are free; an account is required to track progress. Use the lab's reset button when you finish, and do not run automated scanners against the platform. The Academy is a teaching environment, not a target for load testing.

### Evidence habits

For each drill, save the HTTP request and response, the browser console or screenshot if relevant, a short analysis, and the remediation note. Redact cookies, bearer tokens, passwords, and any real-looking data. A finding without a reproducible request is an anecdote.

## Drill map

| ID | OWASP category | Drill |
| --- | --- | --- |
| WEB-01 | A01 Broken Access Control | Object-level authorization on a basket API |
| WEB-02 | A01 Broken Access Control | Forced browsing to an admin route |
| WEB-03 | A01 Broken Access Control | Path traversal in a file parameter |
| WEB-04 | A02 Cryptographic Failures | Credentials exposed on an HTTP path |
| WEB-05 | A02 Cryptographic Failures | Session material in browser storage |
| WEB-06 | A03 Injection | SQL injection in a login form |
| WEB-07 | A03 Injection | Reflected cross-site scripting |
| WEB-08 | A03 Injection | Stored cross-site scripting |
| WEB-09 | A03 Injection | OS command injection |
| WEB-10 | A04 Insecure Design | Client-controlled checkout logic |
| WEB-11 | A04 Insecure Design | Password-reset identity confusion |
| WEB-12 | A05 Security Misconfiguration | Verbose error handling |
| WEB-13 | A05 Security Misconfiguration | Permissive CORS |
| WEB-14 | A05 Security Misconfiguration | Banners, metadata, and missing headers |
| WEB-15 | A06 Vulnerable and Outdated Components | Component fingerprinting and advisory matching |
| WEB-16 | A08 Software and Data Integrity Failures | Subresource integrity and artifact hashing |
| WEB-17 | A07 Identification and Authentication Failures | Credential stuffing and rate-limit behavior |
| WEB-18 | A07 Identification and Authentication Failures | Logout and token replay |
| WEB-19 | A08 Software and Data Integrity Failures | JWT signature and claim trust |
| WEB-20 | A09 Security Logging and Monitoring Failures | Reconstructing activity from application logs |
| WEB-21 | A09 Security Logging and Monitoring Failures | Designing an access-control alert |
| WEB-22 | A10 Server-Side Request Forgery | Server-side fetch to lab-internal targets |

## WEB-01 — Object-level authorization on a basket API

**Goal.** Determine whether the server checks that the authenticated user owns the requested basket.

**Prerequisites.** Local Juice Shop; two synthetic accounts; browser developer tools or `curl`; a way to read your own bearer token.

**Observation.** After login, the basket API returns an object with a numeric identifier. The client sends that identifier on subsequent basket requests, and the identifier is small and predictable.

**Hypothesis.** The API authorizes the request by requiring a valid token but does not verify that the basket belongs to the token's user. This is broken object-level authorization (BOLA), a form of broken access control.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Log in as account A and capture the `GET /rest/basket/<id>` request, including the `Authorization: Bearer` header.
2. Create account B and add one item to its basket so the basket is non-empty.
3. With account A's token, request account B's basket ID using `GET` only. Do not modify or delete anything.
4. Compare the response with account B's own view of the basket.

```bash
# Replace the token and IDs with values from your local lab.
curl -s -H 'Authorization: Bearer <ACCOUNT_A_TOKEN>' \
  http://127.0.0.1:3000/rest/basket/<ACCOUNT_B_BASKET_ID>
```

**Expected result.** A `200` response containing account B's items indicates missing object-level authorization. A `401` or `403`, or a response scoped to account A, indicates a control is present. Do not treat an unguessable ID as authorization; test the server's decision, not the difficulty of guessing.

**Remediation.** Enforce ownership on every object read and write, server-side, using the authenticated subject. Prefer deny-by-default policy checks in a central authorization layer. Log denied attempts with subject, object, and action, and add regression tests for cross-account access.

**Evidence.** Save both requests and responses with tokens and basket contents redacted. Record the status codes and the exact object IDs used.

**Reflect.** Why is an unpredictable identifier not an access control? How would you retest the fix without modifying another user's data?

## WEB-02 — Forced browsing to an admin route

**Goal.** Test whether hiding a route in the user interface is the only protection around administrative functionality.

**Prerequisites.** Local Juice Shop; a normal synthetic account; browser developer tools.

**Observation.** The client-side application contains routes and JavaScript bundles that reference administrative screens. A normal user's menu does not show them.

**Hypothesis.** The admin route is protected only by client-side rendering logic. The underlying API may still enforce roles, or it may rely on the UI.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. While signed in as a normal user, navigate directly to the admin route in the browser address bar.
2. Observe whether the screen renders, whether it shows data, and which API calls the browser makes.
3. Repeat the API calls with the normal user's token using `GET`. Do not attempt state-changing admin actions.
4. Check whether the response is a denial, an empty result, or real administrative data.

**Expected result.** A rendered screen with no data may mean the API denied the request. A `200` response with administrative data means the UI was the only barrier. A `401` or `403` is the desired behavior. Client-side route guards are not a security boundary.

**Remediation.** Enforce role and permission checks in the API for every administrative action. Deny by default, return consistent errors, and avoid shipping unnecessary admin code to unprivileged clients. Log privilege decisions.

**Evidence.** Save the route, the API request, the response status, and a screenshot of what rendered. Do not save real user records.

**Reflect.** Why does removing a menu item not remove an attack path? What is the difference between authentication and authorization in this scenario?

## WEB-03 — Path traversal in a file parameter

**Goal.** Test whether a file-serving parameter can escape its intended directory.

**Prerequisites.** A PortSwigger Web Security Academy account and the file-path-traversal lab assigned to you. Use only that instance.

**Observation.** An image or file endpoint accepts a filename parameter and returns file contents. The parameter appears to be joined to a server-side directory path.

**Hypothesis.** The application does not canonicalize the resolved path or restrict it to an allowed directory, so traversal sequences can reach files outside the intended folder.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Request a legitimate file through the endpoint and record the response.
2. Using the lab's stated objective, try a relative traversal that stays inside the lab container and reads a known, non-secret system file.
3. Stop at the first confirmation. Do not enumerate other files, read application secrets, or attempt to write files.
4. Reset the lab when finished.

**Expected result.** If the response contains the target file's contents, the lab is solved and the traversal is confirmed. A `400`, `404`, or normalized path indicates a control. The lesson is the missing canonicalization and allowlist, not the specific string.

**Remediation.** Resolve the path with a canonicalization function, then verify it is inside an allowlisted base directory. Prefer opaque file identifiers mapped server-side to stored objects. Run the file service with least privilege and without access to secrets.

**Evidence.** Save the legitimate request, the traversal request, and the first line of the returned file only. Note the lab instance and reset time.

**Reflect.** Why is stripping `../` once often insufficient? How does an allowlist of file identifiers remove the traversal class entirely?

## WEB-04 — Credentials exposed on an HTTP path

**Goal.** Demonstrate why transport encryption is a confidentiality control, not a checkbox.

**Prerequisites.** Local Juice Shop; `tcpdump`; a synthetic account; sudo for loopback capture.

**Observation.** Juice Shop listens on plain HTTP at `127.0.0.1:3000`. The login form submits a JSON body containing an email and password.

**Hypothesis.** Anyone who can observe the network path can read the credentials and the bearer token. On loopback the observer is you, but the same weakness applies to any unencrypted hop.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Start a bounded capture on loopback for the Juice Shop port.

   ```bash
   sudo timeout 20 tcpdump -i lo -s 0 -A -c 30 'tcp port 3000' -w ~/lab-data/web04-login.pcap &
   cap_pid=$!
   ```

2. Log in with the synthetic account in the browser.
3. Wait for the capture to finish.

   ```bash
   wait "$cap_pid" || true
   ```

4. Inspect the HTTP POST body.

   ```bash
   sudo tcpdump -nr ~/lab-data/web04-login.pcap -A | grep -A 5 -i 'POST /rest/user/login' | head -n 20
   ```

5. Redact the password before saving any excerpt.

**Expected result.** The capture contains the login JSON with the synthetic email and password, and later requests may contain the bearer token. This is expected on HTTP. If the app were served over TLS, the same capture would show only encrypted records and handshake metadata.

**Remediation.** Serve the application over TLS with a valid certificate, redirect HTTP to HTTPS, enable HSTS after confirming all subdomains support HTTPS, mark cookies `Secure`, and never place secrets in URLs or logs.

**Evidence.** Save the pcap, its SHA-256 hash, and a redacted excerpt. State the capture interface, filter, and packet count.

**Reflect.** Why does TLS not protect data after it reaches the application? Which logging practices can accidentally recreate this exposure?

## WEB-05 — Session material in browser storage

**Goal.** Evaluate where the application stores session material and what that means for script access and revocation.

**Prerequisites.** Local Juice Shop; browser developer tools.

**Observation.** After login, the application stores a token in browser storage or a cookie. The storage location determines whether JavaScript can read it and whether it is sent automatically.

**Hypothesis.** A bearer token in `localStorage` is readable by any script running in the origin, so a single cross-site scripting flaw can exfiltrate it. The token may also remain valid after logout.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Open developer tools, sign in, and inspect Application storage for cookies, `localStorage`, and `sessionStorage`.
2. Record the key names, not the values. For a JWT, decode only the header and payload locally and record `alg`, `exp`, and claim names with values redacted.
3. Check cookie attributes if cookies are used: `HttpOnly`, `Secure`, `SameSite`, `Path`, and expiry.
4. Do not copy a live token into notes, screenshots, or a third-party site.

**Expected result.** Juice Shop-style SPAs commonly keep a bearer token in `localStorage`, which is readable by JavaScript and has no `HttpOnly` protection. Cookie-based sessions with `HttpOnly` are not readable by script but still need `Secure` and `SameSite`.

**Remediation.** Prefer short-lived, rotated session tokens in `HttpOnly`, `Secure`, `SameSite` cookies for browser sessions. Keep access tokens in memory where feasible, use refresh-token rotation, validate on the server, and make logout revoke or denylist the token.

**Evidence.** Save a table of storage location, key name, flags, and expiry with all values redacted. Explain the XSS impact in two sentences.

**Reflect.** What does `HttpOnly` prevent, and what does it not prevent? Why is a long-lived token in browser storage a bigger risk than a short-lived one?

## WEB-06 — SQL injection in a login form

**Goal.** Determine whether a login query is built with unsafe string concatenation.

**Prerequisites.** Local Juice Shop; a synthetic account; browser developer tools or `curl`.

**Observation.** The login request sends an email and password as JSON. A single quote in the email field may produce a different error or response than a normal invalid login.

**Hypothesis.** The application concatenates the email into a SQL query instead of using a parameterized statement, allowing the query's logic to be altered.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Attempt a normal login with a wrong password and record the response.
2. Submit an email containing a single quote, such as `learner-a'@example.test`, and compare the error or timing.
3. In the local lab only, use the classic boolean bypass to test whether the query can be made true, and stop once you have confirmed authentication.

   ```text
   Email: ' OR 1=1--
   Password: any non-empty value
   ```

4. Do not dump tables, extract password hashes, or use the access to change data. Reset the container afterward.

**Expected result.** A successful login without valid credentials confirms the injection. A generic failure for both inputs suggests parameterization or robust error handling. The lab challenge may report success; record the request and response, not just the flag.

**Remediation.** Use parameterized queries or a safe ORM API for every query. Apply least privilege to the database account, avoid detailed SQL errors in responses, and add input validation as defense in depth, not as the primary fix.

**Evidence.** Save the normal request, the quote probe, and the successful bypass request with the session token redacted. Explain why the payload changed the query's truth value.

**Reflect.** Why is escaping quotes a fragile fix compared with parameters? What is the difference between SQL injection and cross-site scripting in terms of where the code executes?

## WEB-07 — Reflected cross-site scripting

**Goal.** Test whether user input is reflected into HTML without contextual output encoding.

**Prerequisites.** A PortSwigger account and the assigned reflected XSS lab.

**Observation.** A search term or error message is included in the response body. The response shows the input in an HTML context.

**Hypothesis.** The application writes the input into the page without encoding, so browser-executable markup can be injected and runs in the victim's origin.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Submit a unique benign marker such as `WEB07_MARKER` and locate it in the response.
2. Determine the context: HTML text, attribute, JavaScript string, or URL.
3. In the assigned lab only, use a minimal proof that executes `alert(document.domain)`. Do not attempt cookie theft, keylogging, or requests to a real external collector.
4. Confirm execution with a screenshot and the exact request, then reset the lab.

**Expected result.** An alert showing the lab's domain confirms script execution. If the marker is encoded as `&lt;` or rendered inert, the control is working. A payload that only changes the page's text is not proof of script execution.

**Remediation.** Apply context-appropriate output encoding at render time, use framework auto-escaping, avoid `innerHTML` with untrusted data, and add a restrictive Content Security Policy as defense in depth. Do not rely on blocklists.

**Evidence.** Save the request, the relevant response fragment, the browser console output, and a screenshot of the alert. Redact cookies.

**Reflect.** Why is the execution context essential to choosing an encoding? What does a CSP add, and what can it not fix?

## WEB-08 — Stored cross-site scripting

**Goal.** Test whether persisted user content is rendered without encoding and affects other viewers.

**Prerequisites.** A PortSwigger account and the assigned stored XSS lab.

**Observation.** A comment, profile field, or review is saved and later displayed to other users or to an administrator.

**Hypothesis.** The application stores the input and renders it into HTML without encoding, so the payload persists and executes for every viewer.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Post a benign marker in the lab's comment or profile field and confirm it persists after reload.
2. In the assigned lab only, submit a minimal `alert(document.domain)` payload, then view the page that renders the stored content.
3. Do not target a real administrator, exfiltrate a session, or leave the payload in place. Reset the lab.

**Expected result.** The alert fires when the stored content is rendered, confirming persistence and execution. If the content is displayed as text or encoded, no execution occurs.

**Remediation.** Encode on output for the correct context, sanitize rich text with a maintained allowlist library when HTML is a requirement, use a strong CSP, and consider isolating untrusted content in a separate origin.

**Evidence.** Save the submission request, the stored value, the rendered response, and a screenshot. Record the time and the lab instance.

**Reflect.** Why is stored XSS often more severe than reflected XSS? What is the difference between sanitizing input and encoding output?

## WEB-09 — OS command injection

**Goal.** Determine whether a server-side feature passes user input to a shell.

**Prerequisites.** A PortSwigger account and the assigned OS command injection lab.

**Observation.** A feature such as a stock checker accepts a product or store identifier and returns output that appears to come from a system command.

**Hypothesis.** The application builds a shell command with unvalidated input, so command separators can append a second command.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Submit a normal value and record the response.
2. In the assigned lab only, append a benign command that prints the current user, using a separator appropriate to the lab's context. Do not use reverse shells, downloaders, or persistence.
3. Confirm the output, then stop. Do not read environment secrets or modify files.
4. Reset the lab.

**Expected result.** Output such as the web user's name in the response confirms command execution. A validation error or a response that treats the separator as data suggests the input is not reaching a shell.

**Remediation.** Avoid shell invocation entirely; use language APIs or argument-vector process calls. Allowlist accepted values, run the component with least privilege, isolate it in a container, and log command execution.

**Evidence.** Save the normal request, the injected request, and only the first line of command output. Note why the output proves execution.

**Reflect.** Why is an allowlist more robust than escaping shell metacharacters? How would a blind command injection be confirmed safely in a lab?

## WEB-10 — Client-controlled checkout logic

**Goal.** Test whether the server trusts prices, quantities, or totals supplied by the client.

**Prerequisites.** Local Juice Shop; a synthetic account; browser developer tools.

**Observation.** The checkout flow sends basket items and quantities to the server. The client displays a total, and the request may include values the user can edit.

**Hypothesis.** The server calculates the order from client-supplied quantities or prices, or accepts values that violate business invariants such as a positive quantity and a non-negative total.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Add one low-cost item to the basket and proceed to checkout.
2. Intercept the checkout request and record every field.
3. In the local lab only, change one quantity to zero or a negative value and observe whether the server accepts it and how the total changes.
4. Do not complete a real payment; Juice Shop's checkout is simulated. Reset the container afterward.

**Expected result.** If the server accepts an invalid quantity or a total that does not match the items, the business logic is client-trusted. A `400` with a validation message is the desired behavior.

**Remediation.** Recalculate all prices and totals server-side from trusted product data, validate quantity and amount ranges, enforce idempotency and replay protection, and log order anomalies for review.

**Evidence.** Save the original request, the modified request, the response, and the resulting order total. Redact tokens.

**Reflect.** Why is server-side recalculation a design control rather than an input-validation rule? What business impact could a negative quantity create?

## WEB-11 — Password-reset identity confusion

**Goal.** Test whether a password-reset flow binds the reset token to the intended account.

**Prerequisites.** A PortSwigger account and the assigned password-reset lab; one synthetic lab account.

**Observation.** The reset flow sends a token or hidden identifier through the browser. The request that sets a new password includes a user identifier.

**Hypothesis.** The server trusts a user-controlled identifier in the reset request and does not verify that the token belongs to that user, allowing one user's reset token to change another user's password.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Request a reset for your own lab account and capture the reset request.
2. Inspect which fields identify the user and which identify the token.
3. In the assigned lab only, follow the lab objective by changing the identifier in your own reset request and observe whether the password change applies to the other lab account.
4. Do not use real accounts or real email addresses. Reset the lab.

**Expected result.** If the reset succeeds for an account you do not control, the token is not bound to the identity. A rejection or a token bound to the session indicates a control.

**Remediation.** Generate high-entropy, single-use tokens bound to the user and stored hashed with a short expiry. Do not accept a user identifier from the reset form as authoritative. Invalidate tokens after use, notify the account owner, and rate-limit reset requests.

**Evidence.** Save the reset request, the modified request, and the response, with tokens and email addresses redacted.

**Reflect.** Why is a reset token in a URL a logging and referrer risk? How would you test expiry and single-use behavior without attacking a real account?

## WEB-12 — Verbose error handling

**Goal.** Determine whether malformed input produces stack traces, framework details, or internal paths.

**Prerequisites.** Local Juice Shop; `curl`.

**Observation.** Normal errors return a short JSON message. Malformed JSON or unexpected types may produce a different response.

**Hypothesis.** Debug mode or default error handling leaks implementation details that help an attacker map the application and its dependencies.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Send a malformed JSON body to a login endpoint in the local lab.

   ```bash
   curl -s -i -X POST http://127.0.0.1:3000/rest/user/login \
     -H 'Content-Type: application/json' \
     --data '{bad json'
   ```

2. Send a valid JSON body with an unexpected type, such as an object where a string is expected.
3. Compare status codes and response bodies. Do not attempt to trigger a crash loop or resource exhaustion.

**Expected result.** A generic `400` or `500` with a short message is acceptable. A stack trace, SQL error, file path, framework version, or internal hostname is a misconfiguration finding. Absence of detail is a control, but it does not prove the absence of bugs.

**Remediation.** Return generic error messages with a correlation ID, log details server-side, disable debug mode in production, and ensure error pages do not reveal framework or dependency versions.

**Evidence.** Save the malformed request and the full response, plus the correlation ID if present. Redact any internal path.

**Reflect.** Why is a detailed error both a usability feature and a security risk? What should a user see versus what should an operator see?

## WEB-13 — Permissive CORS

**Goal.** Test whether cross-origin resource sharing allows an untrusted origin to read authenticated responses.

**Prerequisites.** A PortSwigger account and the assigned CORS lab.

**Observation.** The application returns `Access-Control-Allow-Origin` and possibly `Access-Control-Allow-Credentials`. The value may reflect the request's `Origin` header.

**Hypothesis.** The server reflects any origin while allowing credentials, so a malicious site can make authenticated requests and read the responses.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Send a request with a benign `Origin` header from the lab's provided exploit domain and inspect the CORS headers.
2. Compare the response for an allowed origin and a random origin.
3. In the assigned lab only, use the lab's exploit server to make a simple authenticated request and read a non-sensitive response. Do not exfiltrate real data.
4. Reset the lab.

**Expected result.** `Access-Control-Allow-Origin: <attacker origin>` together with `Access-Control-Allow-Credentials: true` is the dangerous combination. A fixed allowlist value or no CORS headers for untrusted origins indicates a control.

**Remediation.** Allowlist exact trusted origins, never combine a wildcard with credentials, validate `Origin` server-side, and keep sensitive endpoints behind additional authorization. Do not rely on the browser to enforce business rules.

**Evidence.** Save both requests and responses, highlighting the `Origin`, `Access-Control-Allow-Origin`, and credentials headers. Use a benign marker, not real data.

**Reflect.** Why is CORS a browser control rather than a server authentication mechanism? What other request types can bypass a simple CORS check?

## WEB-14 — Banners, metadata, and missing headers

**Goal.** Inventory the information the application volunteers and the browser protections it omits.

**Prerequisites.** Local Juice Shop; `curl`.

**Observation.** Response headers, `robots.txt`, API documentation routes, and client bundles may reveal software, versions, or intended-hidden paths.

**Hypothesis.** Unnecessary metadata lowers the attacker's cost, and missing security headers increase the impact of other flaws. Neither is a vulnerability by itself.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Capture response headers.

   ```bash
   curl -sI http://127.0.0.1:3000/ | tee ~/lab-data/web14-headers.txt
   ```

2. Read `robots.txt` and check for a public API documentation route.

   ```bash
   curl -s http://127.0.0.1:3000/robots.txt | head -n 20
   curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/api-docs/
   ```

3. List missing headers from the set you understand: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and frame protection.

**Expected result.** You may see `X-Powered-By`, `Server`, a permissive `robots.txt`, or a documentation endpoint. Missing headers are common. Record each item with its actual impact rather than labeling everything "critical".

**Remediation.** Remove unnecessary banners, restrict documentation to authorized users, disable directory listing, and add headers that match the application's architecture. Treat headers as defense in depth, not as fixes for access-control or injection flaws.

**Evidence.** Save the header dump and a table of item, evidence, impact, and recommended action.

**Reflect.** Why is a version banner not proof of exploitability? Which missing header would most reduce the impact of an XSS flaw in this app?

## WEB-15 — Component fingerprinting and advisory matching

**Goal.** Build a component inventory and determine whether any version matches a known advisory, without overclaiming.

**Prerequisites.** Local Juice Shop; browser developer tools or `curl`; access to official vendor security advisories.

**Observation.** The HTML loads JavaScript bundles, and the responses may include framework names or version strings. Some components are visible in the page source; others are bundled and minified.

**Hypothesis.** At least one component is outdated relative to its official release history, which may expose a known vulnerability if the vulnerable feature is reachable.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Save the page source and list script and stylesheet references.

   ```bash
   curl -s http://127.0.0.1:3000/ -o ~/lab-data/web15-index.html
   grep -oE '(src|href)="[^"]+"' ~/lab-data/web15-index.html | head -n 30
   ```

2. Identify version strings from filenames, headers, or a local package manifest if you have the source.
3. For each component, check the official project's release notes or security advisories. Match the exact version range, not just the product name.
4. Record "not affected", "possibly affected", or "confirmed by advisory" with a link to the vendor source.

**Expected result.** A component inventory with versions and advisory status. A version match is a lead, not a confirmed exploit; reachability and configuration determine actual risk. Do not invent a CVE identifier or copy a score from an unrelated product.

**Remediation.** Maintain a software bill of materials, subscribe to vendor advisories, patch or replace unsupported components, remove unused libraries, and add dependency scanning to the build pipeline.

**Evidence.** Save the component table with name, version, source of version, advisory reference, and reachability note. Include the exact HTML or manifest line that supports each version.

**Reflect.** Why is "uses jQuery" not a finding? What evidence would you need before claiming a component is exploitable?

## WEB-16 — Subresource integrity and artifact hashing

**Goal.** Demonstrate how an integrity attribute detects a modified script and how hashing supports artifact verification.

**Prerequisites.** A local static file server; `openssl` or `sha256sum`; a browser.

**Observation.** Third-party scripts loaded without an `integrity` attribute will execute whatever the origin serves. A local script can be changed after the page is written.

**Hypothesis.** Without subresource integrity or a signed artifact, a compromised file or CDN can change client-side behavior silently.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Create a local script and compute its SHA-384 hash.

   ```bash
   mkdir -p ~/lab-data/sri && cd ~/lab-data/sri
   printf 'document.body.dataset.demo = "integrity-ok";\n' > app.js
   hash=$(openssl dgst -sha384 -binary app.js | openssl base64 -A)
   printf '<!doctype html><html><body><script src="app.js" integrity="sha384-%s"></script></body></html>\n' "$hash" > index.html
   cat index.html
   ```

2. Serve the directory on loopback and load the page.

   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1 &
   server_pid=$!
   ```

3. Modify `app.js` without updating the hash, reload, and observe the browser console.
4. Stop the server and restore the original script.

   ```bash
   kill "$server_pid"
   ```

**Expected result.** With a correct hash the script loads; after modification the browser refuses to execute it and logs an integrity error. This proves detection of a changed artifact, not the trustworthiness of the original.

**Remediation.** Use SRI for third-party scripts, serve artifacts over TLS, sign releases, verify signatures before deployment, and pin dependencies with a lockfile. SRI does not protect same-origin scripts that an attacker can already modify.

**Evidence.** Save both versions of the script, the hash, the HTML, and a screenshot of the console error. Explain what the hash proves and what it does not.

**Reflect.** Why is SRI ineffective against a compromised origin that can also change the HTML? How does a signed artifact differ from a hash published on the same server?

## WEB-17 — Credential stuffing and rate-limit behavior

**Goal.** Observe how the application responds to repeated authentication failures and whether it slows or blocks guessing.

**Prerequisites.** Local Juice Shop; five synthetic accounts with known passwords; a short synthetic password list; `curl` or a browser.

**Observation.** The login endpoint returns a consistent response for invalid credentials. There may be no visible delay, lockout, or CAPTCHA.

**Hypothesis.** Without rate limiting, lockout, or risk-based controls, an attacker can test many username-password pairs. Credential stuffing uses breached pairs from other services; brute force guesses within one service.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Create five accounts with synthetic addresses and unique lab-only passwords.
2. Send ten failed logins for one account, then one correct login afterward. Record status codes and elapsed time.
3. Repeat across the five accounts with a small synthetic list. Do not use passwords from real breaches or real email addresses.
4. Observe whether responses differ for valid versus invalid usernames. Stop before causing load beyond the small test.

**Expected result.** Ten rapid failures followed by a successful login indicate no effective rate limiting. A `429`, increasing delay, CAPTCHA, or lockout indicates a control. Be careful: aggressive lockout can be abused for denial of service.

**Remediation.** Combine rate limiting per account and per source, breached-password checks, MFA for sensitive actions, risk-based challenges, and monitoring for distributed guessing. Avoid account enumeration and design lockout to resist abuse.

**Evidence.** Save a table of attempt number, account, status, and elapsed time. Do not save real credentials or tokens.

**Reflect.** Why is credential stuffing hard to detect with per-IP rate limits alone? What is the tradeoff between lockout and availability?

## WEB-18 — Logout and token replay

**Goal.** Determine whether logout invalidates the session token on the server or only removes it from the browser.

**Prerequisites.** Local Juice Shop; a synthetic account; `curl` or browser developer tools.

**Observation.** The client stores a bearer token. Logout clears the client-side token and redirects, but the token itself may remain valid until it expires.

**Hypothesis.** The application uses stateless JWTs and has no server-side revocation, so a copied token still works after logout.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Log in and copy the token into a local variable in your notes. Do not paste it into a third-party site.
2. Call an authenticated endpoint such as `GET /rest/user/whoami` with the token and confirm it works.
3. Log out in the browser.
4. Replay the same request with the old token and record the status.
5. Do not attempt to use another user's token or extend the token's lifetime.

**Expected result.** A `200` after logout means the token is still valid; logout is client-side only. A `401` indicates server-side invalidation. JWTs often remain valid until `exp`, which is a design tradeoff, not automatically a vulnerability.

**Remediation.** Keep access tokens short-lived, rotate refresh tokens, maintain a revocation or denylist for high-risk events, bind tokens to a session or device where appropriate, and invalidate all sessions on password change.

**Evidence.** Save the before-logout and after-logout requests with the token redacted, plus the timestamps.

**Reflect.** What is the security cost of server-side session state? How would you test token expiry without waiting for a production token to expire?

## WEB-19 — JWT signature and claim trust

**Goal.** Determine whether the server verifies the JWT signature and constrains the algorithm and claims.

**Prerequisites.** A PortSwigger account and the assigned JWT lab; the lab's JWT tools or a local decoder.

**Observation.** The token is a three-part base64url string. The header declares an algorithm, and the payload contains claims such as `sub`, `role`, or `exp`. The server may trust the payload without verifying the signature.

**Hypothesis.** The application accepts an unsigned or attacker-modified token, or it trusts a role claim that the client can change. This is an integrity failure in the authentication decision.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Decode the header and payload locally. Do not use an online decoder for a live token.
2. Identify the algorithm and the claim that determines identity or role.
3. In the assigned lab only, use the lab's intended method to modify the claim or algorithm and access the admin function. Do not target another learner or a real service.
4. Confirm the lab's result, then reset it.

**Expected result.** If a modified token is accepted, signature verification or claim authorization is missing. A rejected token with a clear error indicates a control. Never test `alg: none` against a production service.

**Remediation.** Verify the signature with an allowlisted algorithm, reject `none`, validate `iss`, `aud`, `exp`, and `nbf`, derive authorization from server-side data rather than client claims, and rotate keys with a documented process.

**Evidence.** Save the decoded header and payload with sensitive values redacted, the modified request, and the response status. Explain which check failed.

**Reflect.** Why is `alg: none` a server-side design failure rather than a client bug? Why should a role claim in a token not be the final authorization decision?

## WEB-20 — Reconstructing activity from application logs

**Goal.** Determine whether the application's logs are sufficient to reconstruct an authentication and access-control sequence.

**Prerequisites.** Local Juice Shop; Docker; `curl`.

**Observation.** The container logs requests to stdout. The detail may be limited to method, path, and status, without user identity or correlation IDs.

**Hypothesis.** The logs record that requests happened but not who made them or why authorization failed, so an investigator cannot distinguish a user error from an attack.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Note the current time, then perform a failed login, a successful login, and a request to an admin route with a normal user.
2. Read the container logs for that window.

   ```bash
   docker logs --since 10m juice-shop 2>&1 | tail -n 40
   ```

3. Try to answer: which account was targeted, which source, which request failed authorization, and what happened next.
4. Do not enable debug logging that records passwords or tokens.

**Expected result.** You will likely see request lines but not a complete security event. Missing fields may include authenticated subject, source address, decision, correlation ID, and user-agent. That gap is the finding, not the absence of any log line.

**Remediation.** Emit structured security events for authentication success and failure, authorization denials, session changes, and administrative actions. Include timestamp, subject, source, action, resource, decision, and correlation ID. Ship logs to a protected system with retention and access control.

**Evidence.** Save a redacted log excerpt and a table of questions the logs could and could not answer.

**Reflect.** Why is logging without monitoring only half a control? What would you redact before sending application logs to a SIEM?

## WEB-21 — Designing an access-control alert

**Goal.** Turn a log pattern into a testable detection with a threshold, false-positive analysis, and a response.

**Prerequisites.** WEB-20. A text editor and a shell.

**Observation.** A burst of `401` or `403` responses from one source against many object identifiers may indicate enumeration or broken access control probing. The same pattern can come from a broken client or a misconfigured integration.

**Hypothesis.** A threshold rule can surface sustained authorization failures, but it needs asset context and a suppression path to be useful.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Create a synthetic access log with documentation addresses and fictional users.

   ```text
   203.0.113.50 - - [30/Oct/2026:10:00:01 +0000] "GET /rest/basket/1 HTTP/1.1" 403 120
   203.0.113.50 - - [30/Oct/2026:10:00:02 +0000] "GET /rest/basket/2 HTTP/1.1" 403 120
   203.0.113.50 - - [30/Oct/2026:10:00:03 +0000] "GET /rest/basket/3 HTTP/1.1" 403 120
   198.51.100.20 - - [30/Oct/2026:10:00:04 +0000] "GET /rest/basket/1 HTTP/1.1" 200 540
   ```

2. Write a shell or pseudocode rule that counts `403` responses per source and path prefix in a five-minute window.
3. Set a threshold, define a suppression for known health checks, and describe the analyst's first three questions.
4. Test the rule against the synthetic log and against a benign baseline you create.

**Expected result.** A rule such as "more than 20 authorization failures from one source to one object family in five minutes" should fire on the synthetic burst and stay quiet on normal traffic. The exact threshold is environment-specific; document why you chose it.

**Remediation.** This drill produces a detection, not a product fix. Pair it with the authorization remediation from WEB-01 and WEB-02, and route alerts to an owner with a runbook.

**Evidence.** Save the synthetic log, the rule, the test output, and a one-page runbook with triage steps and escalation criteria.

**Reflect.** Why can a high threshold miss a slow, low-volume attack? What asset context would make this alert actionable?

## WEB-22 — Server-side fetch to lab-internal targets

**Goal.** Test whether a server-side URL fetch can reach destinations the client cannot, and whether egress is restricted.

**Prerequisites.** A PortSwigger account and the assigned SSRF lab. Use only the lab's internal target.

**Observation.** A feature accepts a URL and fetches it server-side, for example an image import or stock check. The response may include content from the fetched URL.

**Hypothesis.** The server does not restrict the destination, so it can be coerced into requesting internal services, including metadata endpoints or admin interfaces. That is server-side request forgery.

**Safe validation.** Use only the local or assigned lab, and stop at the first confirmation.

1. Provide a URL to a resource you control in the lab and confirm the server fetches it.
2. In the assigned lab only, point the fetch at the lab-provided internal address and retrieve a non-sensitive response.
3. Do not use `169.254.169.254`, cloud metadata endpoints, or any real internal service. Do not attempt to retrieve credentials.
4. Reset the lab.

**Expected result.** A response containing the internal resource confirms SSRF. A blocked request, allowlist rejection, or network error indicates a control. The lab's objective defines the exact target; do not improvise against real infrastructure.

**Remediation.** Allowlist destinations by scheme, host, and port; resolve and validate the destination after DNS; block link-local, loopback, and private ranges unless explicitly required; enforce network egress policy; require authentication for internal services; and harden metadata services.

**Evidence.** Save the request, the response, and a network diagram of the intended and actual flow. Redact any internal address that is not from the lab.

**Reflect.** Why is a blocklist of "localhost" insufficient? How does network egress control reduce SSRF impact even when input validation fails?

## Set review

Before moving on, confirm that you can:

- Explain the difference between authentication, authorization, and business logic.
- Map each drill to an OWASP Top 10 2021 category and a concrete control.
- Write a reproducible request, a hypothesis, and a remediation without inflating severity.
- Test safely with synthetic accounts and reset the lab afterward.
- Redact tokens and personal data from every artifact.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — the 2021 category structure used in this set.
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — detailed test procedures and reporting guidance.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — intentionally vulnerable local application.
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free labs and topic explanations.
- [OWASP](https://www.owasp.org/) — project hub and community resources.
- [FIRST CVSS](https://www.first.org/cvss/) — severity scoring, with the caveats in the vulnerability report template.

---

**Related:** [Exercise index](README.md) · [Networking drills](networking-drills.md) · [Blue team drills](blue-team-drills.md) · [Web assessment checklist](../checklists/web-assessment.md) · [Vulnerability report template](../templates/vulnerability-report.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
