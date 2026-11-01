# Project 05 — Web Vulnerability Assessment in a Local Lab

A vulnerability assessment is a scoped, evidence-driven hunt for weaknesses, not a scanner report. In this project you assess OWASP Juice Shop running in your isolated lab, combining a passive automated scan with manual tests mapped to the OWASP Web Security Testing Guide. You finish with a findings register that another tester could reproduce and a remediation list that a developer could act on.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Estimated time | 6–10 hours |
| Cost | $0 |
| Prerequisites | Project 01; Juice Shop running on `192.168.56.30:3000`; comfort with HTTP, cookies, and browser developer tools |
| Safety and scope | Deliberately vulnerable app in your own lab only; bind to the host-only address; never point these tests at a real site |

`Last reviewed: 2026-10-31`

> **Safety and scope.** Juice Shop is intentionally insecure, and some tests below use real injection syntax. They are safe only because the target is a disposable app on an isolated network that you own. Do not reuse these requests against any other host, do not test a site because it "looks like a lab", and do not paste live session tokens or passwords into notes. If you want to practice on a public target, use the vendor-hosted Juice Shop demo or an authorized training platform, and read its rules first.

## Objective

- Write a scope note and test plan before touching the application.
- Fingerprint the app and map its attack surface without brute force.
- Execute at least eight WSTG-aligned test cases across configuration, authentication, authorization, session management, input handling, and business logic.
- Run a passive automated scan and triage its output instead of pasting it into a report.
- Record reproducible findings with evidence, severity, and remediation, then retest after a fix where possible.

## Why this project matters

Most junior security work starts with assessment: a known scope, a limited window, and a need to produce something useful for people who own the system. The technical tests matter, but the professional skills are scoping, evidence handling, false-positive rejection, and clear writing. A tester who reports twenty scanner warnings without triage creates work; a tester who reports five verified issues with reproduction steps and fixes creates progress.

Juice Shop is ideal because it contains a wide range of deliberate flaws without requiring you to exploit a real victim. You can make mistakes safely, reset the environment, and compare your results with the app's built-in challenge tracking as a feedback loop.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| OWASP Juice Shop | Deliberately vulnerable target application | <https://owasp.org/www-project-juice-shop/> | Free, open source |
| OWASP ZAP | Passive and active web scanning | <https://www.zaproxy.org/> | Free, open source |
| Burp Suite Community | Manual interception and repeater (alternative) | <https://portswigger.net/web-security> | Free Community edition; some features limited |
| OWASP WSTG | Test case methodology | <https://owasp.org/www-project-web-security-testing-guide/> | Free |
| curl | Reproducible HTTP requests | <https://curl.se/> | Free, open source |
| jq | Parsing JSON API responses | <https://jqlang.github.io/jq/> | Free, open source |
| Docker Engine | Runs Juice Shop | <https://docs.docker.com/engine/install/ubuntu/> | Free |

## Setup

1. Confirm the target from project 01 is running and reachable only from the lab:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://192.168.56.30:3000/
docker ps --filter name=juice-shop --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

2. Create a case directory and a scope note. The scope note is the first artifact of the assessment, not an afterthought.

```bash
mkdir -p ~/assessments/juice-shop/{evidence,zap,reports,notes}
cd ~/assessments/juice-shop
```

```text
Assessment:      Juice Shop lab vulnerability assessment
Tester:          <your name>
Authorization:   Self-owned lab, target is a deliberately vulnerable container
Target:          http://192.168.56.30:3000 (host-only network)
Out of scope:    All other hosts, the Docker host OS, denial of service, social engineering
Window:          2026-10-31 14:00-18:00 UTC
Techniques:      Manual HTTP testing, passive ZAP baseline, limited active checks
Data:            Two synthetic accounts; no real personal data
Stop conditions: Container crash, host disk pressure, any request leaving the lab network
```

3. Create two lab accounts and record them in a local secrets file that is never published: `alice.lab@example.com` and `bob.lab@example.com`, each with a unique throwaway password. Register them through the UI or `/api/Users`. These accounts make authorization tests possible; a single account cannot prove horizontal access control failures.

4. Capture a baseline response and headers:

```bash
curl -sS -D evidence/baseline-headers.txt -o evidence/baseline-body.html http://192.168.56.30:3000/
curl -sS http://192.168.56.30:3000/robots.txt -o evidence/robots.txt
head -n 30 evidence/baseline-headers.txt
```

5. Run the ZAP baseline scan. It is passive, reasonably fast, and safe for a lab. Use host networking so the container can reach the lab subnet.

```bash
docker run --rm --network host \
  -v "$HOME/assessments/juice-shop/zap:/zap/wrk:rw" \
  -t zaproxy/zap-stable \
  zap-baseline.py -t http://192.168.56.30:3000 -r baseline.html -J baseline.json
```

If the container cannot reach the target, see the troubleshooting section before changing anything else.

## Step-by-step tasks

1. **Fingerprint the application without brute force.** Read the headers, the HTML, and the JavaScript bundle names. Check for an exposed API documentation page, a version endpoint, and source maps.

```bash
curl -sS -D - -o /dev/null http://192.168.56.30:3000/ | tee evidence/headers.txt
curl -sS http://192.168.56.30:3000/rest/admin/application-version | tee evidence/version.json
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' http://192.168.56.30:3000/main.js.map
curl -sS http://192.168.56.30:3000/api/Products | jq '.[0]' | tee evidence/product-sample.json
```

Checkpoint: you can name the front-end framework, the API base path, and at least one informational exposure. Record each observation with the command that produced it, even if you later decide it is not a finding.

2. **Review security headers and CORS.** Compare the responses with what a hardened app should send: a Content-Security-Policy, `X-Content-Type-Options: nosniff`, a frame-ancestors directive, a Referrer-Policy, and a strict CORS allowlist. Do not report a missing header as High without explaining the concrete impact.

```bash
grep -iE 'content-security-policy|x-content-type-options|x-frame-options|referrer-policy|strict-transport-security|access-control-allow-origin' evidence/headers.txt || true
curl -sS -D - -o /dev/null -H 'Origin: http://192.0.2.77' http://192.168.56.30:3000/rest/user/whoami | grep -i 'access-control' || true
```

Checkpoint: a written verdict for each header, with the value observed and the risk it creates. Missing HSTS on a plain-HTTP lab instance is expected; explain that instead of scoring it as a critical flaw.

3. **Test authentication for injection and enumeration.** Use only the lab accounts. In the login request, test whether the email field is concatenated into a query by submitting a quoted payload and observing the error behavior. Then compare the responses for a valid and an invalid account.

```bash
curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"lab-test@example.com","password":"not-the-password"}' | tee evidence/login-invalid.json

curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"' OR 1=1--\",\"password\":\"x\"}" | tee evidence/login-sqli.json

curl -sS -X POST http://192.168.56.30:3000/api/Users \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice.lab@example.com","password":"CHANGEME-lab-only"}' | tee evidence/duplicate-user.json
```

Then check anti-automation by submitting twenty wrong passwords and counting the response codes. A wall of identical `401` responses with no `429`, delay, or lockout is evidence that the login endpoint has no rate limiting.

```bash
for i in $(seq 1 20); do
  curl -sS -o /dev/null -w '%{http_code}\n' -X POST http://192.168.56.30:3000/rest/user/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"alice.lab@example.com","password":"wrong-password"}'
done | sort | uniq -c | tee evidence/login-loop.txt
```

Checkpoint: a finding either way for the injection, the enumeration behavior, and the anti-automation test. If the injection succeeds, you have an authentication bypass and must document the exact request and response. If it fails, record the defensive behavior and move on. Never continue testing with a token you obtained through bypass unless the scope explicitly covers post-authentication testing; here it does, because you own the lab.

4. **Test horizontal authorization with a second account.** Log in as Alice and Bob, capture each token, and try to read the other user's basket by changing the object identifier. This is the classic broken object-level authorization test.

```bash
ALICE_TOKEN=$(curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice.lab@example.com","password":"CHANGEME-lab-only"}' | jq -r '.authentication.token')

BOB_TOKEN=$(curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"bob.lab@example.com","password":"CHANGEME-lab-only"}' | jq -r '.authentication.token')

curl -sS -H "Authorization: Bearer $ALICE_TOKEN" http://192.168.56.30:3000/rest/basket/2 | jq . | tee evidence/basket-idor.json
```

Checkpoint: compare the basket owner in the response with Alice's user ID. If the server returns Bob's basket to Alice, that is a verified IDOR. If it returns 401 or 403, record the control. Do not publish the tokens.

5. **Inspect session and token handling.** Decode the JWT, check the algorithm, expiry, and claims, and verify that a tampered signature is rejected. This is a review, not a forgery exercise.

```bash
echo "$ALICE_TOKEN" | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null | jq . | tee evidence/jwt-claims.json
TAMPERED="${ALICE_TOKEN%?}x"
curl -sS -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $TAMPERED" \
  http://192.168.56.30:3000/rest/user/whoami
```

Checkpoint: the claims, the expiry, and the server's response to the tampered token are recorded. A token that never expires, or one accepted after tampering, is a finding; a correctly rejected token is evidence of a working control.

6. **Test input handling and output encoding.** Attempt a benign cross-site scripting probe in the search feature and in a stored field such as a product review. Use a harmless payload that would display a marker, and check whether it is encoded, blocked, or executed.

```bash
curl -sS -G --data-urlencode "q=<img src=x onerror=alert('lab-xss')>" \
  http://192.168.56.30:3000/rest/products/search | tee evidence/search-xss.json
```

Open the app in a browser, use the search box with the same marker, and inspect the DOM rather than relying on the visual result. Checkpoint: a finding with the exact input, the encoding context, and a screenshot or DOM excerpt. If the app encodes or sanitizes the payload, say so and note which control handled it.

7. **Test error handling and information disclosure.** Send malformed JSON and unexpected types to the login endpoint, then inspect the response body for stack traces, SQL errors, file paths, or framework versions.

```bash
curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' -d '{"email":' | tee evidence/malformed-json.txt
curl -sS -X POST http://192.168.56.30:3000/rest/user/login \
  -H 'Content-Type: application/json' -d '{"email":[],"password":{}}' | tee evidence/wrong-types.json
```

Checkpoint: record whether the error is generic or leaks internals. A verbose stack trace is Low or Medium depending on what it reveals; a database error that confirms injection is part of the injection finding, not a separate one.

8. **Test business logic.** Try a negative quantity in the basket, reuse a coupon, and attempt to access an administrative function with a normal user token. Business logic flaws rarely appear in scanners because they require understanding the intended workflow.

```bash
curl -sS -X PUT -H "Authorization: Bearer $ALICE_TOKEN" -H 'Content-Type: application/json' \
  -d '{"quantity":-10}' http://192.168.56.30:3000/api/Baskets/1 | tee evidence/negative-quantity.json
curl -sS -H "Authorization: Bearer $BOB_TOKEN" http://192.168.56.30:3000/rest/admin/application-version | tee evidence/admin-access.json
```

Checkpoint: a verdict for each attempt with the observed status code and body. If a negative quantity reduces the total, that is a verified logic flaw; if the API rejects it, document the validation.

9. **Run the automated scan and triage it.** Open the ZAP HTML report, list every alert, and classify each as confirmed, false positive, informational, or out of scope. For each confirmed item, reproduce it manually and add it to the findings register.

```bash
ls -lh zap/baseline.html zap/baseline.json
jq -r '.site[0].alerts[] | [.riskcode, .name, (.instances | length)] | @tsv' zap/baseline.json 2>/dev/null | sort
```

Checkpoint: at least three scanner alerts independently triaged, with a reason for each rejection. "ZAP said so" is not evidence; a request and response is.

10. **Consolidate and rate the findings.** Deduplicate symptoms that share one root cause, assign a CVSS v3.1 vector where the finding has a security impact, and separate severity from business risk. A test plan, a findings register, and an evidence index are the minimum.

```csv
id,title,wstg_ref,severity,cvss_vector,endpoint,evidence_path,status
F-01,Authentication bypass via SQL injection,WSTG-INPV-05,Critical,CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H,/rest/user/login,evidence/login-sqli.json,Open
F-02,Basket object accessible across users,WSTG-ATHZ-01,Medium,CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N,/rest/basket/2,evidence/basket-idor.json,Open
F-03,No anti-automation on login,WSTG-ATHN-07,Medium,CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N,/rest/user/login,evidence/login-loop.txt,Open
F-04,Source maps exposed in production build,WSTG-INFO-05,Low,CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N,/main.js.map,evidence/source-map.txt,Open
```

11. **Test reproducibility.** Pick one finding, reset the container, and reproduce it from the commands in your notes alone. Checkpoint: the finding reproduces without memory of the earlier session. If it does not, fix the steps before calling it verified.

12. **Write the evidence index and retest plan.** Map every finding to its evidence files, the command or browser action that produced them, and the retest step. If a fix is available, apply it in a copy of the container and record the retest result; otherwise describe what the developer should change and how you would verify it.

## Expected results

- A scoped assessment with a documented window, accounts, and permitted techniques.
- A fingerprint and attack-surface map of the lab instance.
- At least eight executed test cases, each with a result, not just a checklist tick.
- A findings register with severity, CVSS vector where relevant, evidence, and remediation.
- One verified finding reproduced from notes after a container reset.
- A triaged ZAP report with false positives explained.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `scope.md` | Markdown | Targets, exclusions, window, data rules, stop conditions |
| `test-plan.md` | Markdown table | WSTG reference, test, tool, expected evidence, status |
| `findings.csv` | CSV | One row per root cause, with vector, endpoint, evidence, status |
| `evidence/` | Directory | Headers, request/response bodies, screenshots, DOM excerpts, tokens removed |
| `zap/baseline.html` | HTML | Raw scan output preserved, not edited |
| `zap-triage.md` | Markdown | Each alert classified with a reason |
| `test-log.md` | Markdown | Timestamped actions, including failed attempts |
| `retest.md` | Markdown | Steps and results for at least one finding |

## Skills gained

- Planning an assessment from a standard rather than from a tool menu.
- Manual HTTP testing with `curl`, `jq`, cookies, and bearer tokens.
- Authentication, authorization, session, input handling, and business logic test design.
- Running and critically triaging a passive web scan.
- Writing reproducible findings and separating severity from business risk.
- Handling credentials and evidence so they do not leak into a portfolio.

## Stretch improvements

1. Run an authenticated ZAP scan by configuring a context with a login request and a token-based session, then compare coverage with the unauthenticated baseline.
2. Add a second target, DVWA at `192.168.56.30:8080`, and compare how the same test cases behave in a PHP application with a different architecture.
3. Map every finding to an OWASP Top 10 category and to an ASVS verification requirement.
4. Write a small Python script that logs in, exercises the basket API, and asserts the expected authorization behavior, then run it before and after a fix.
5. Work through a PortSwigger Web Security Academy lab on the same vulnerability class and note which skills transferred.
6. Have a peer review your findings register and try to reproduce one item without your help.

## Troubleshooting

### Juice Shop is not reachable from the assessment VM

Check the container status on the target with `docker ps` and `docker logs juice-shop`. Juice Shop takes ten to twenty seconds to start. Confirm the port publication includes the host-only address, and test from the target itself with `curl http://127.0.0.1:3000`. If the target works locally but not remotely, the app is bound to loopback or a firewall is blocking the port.

### The ZAP container cannot connect to the lab address

On Linux, `--network host` lets the container use the host's routes. Test connectivity from a container first: `docker run --rm --network host curlimages/curl -sI http://192.168.56.30:3000`. On Docker Desktop for Windows or macOS, host networking behaves differently; run ZAP inside the Ubuntu VM instead of on the desktop. Also check that the target is on a network the VM can route to.

### The scan reports only passive findings

The baseline script does not attack the app, so it cannot find injection or access control flaws. That is expected. Use it for headers, cookies, and information disclosure, then do the manual tests. If you run the full scan, expect it to be slower and to modify data; reset the container afterward.

### A test returns 401 or 403 because the token is missing

Tokens expire and shell variables do not survive a new terminal. Re-run the login command and export `ALICE_TOKEN` again in the same shell. Confirm the header is exactly `Authorization: Bearer <token>` with a single space, and avoid copying a token with a trailing newline.

### The app state is inconsistent after testing

Juice Shop stores state in its container. Recreate it for a clean baseline with `docker rm -f juice-shop` followed by the original `docker run` command. Capture any evidence you still need first. Note that a reset also resets challenge progress, which is useful for reproducibility testing.

## Portfolio presentation

Publish the scope, methodology, findings register, one sanitized evidence example, and the retest result. This is one of the strongest portfolio projects because it shows the full assessment loop. State clearly that the target was a deliberately vulnerable application in an isolated lab. Remove tokens, cookies, passwords, and session identifiers from every screenshot and response body; replace them with `<REDACTED>` and keep the original in a private evidence folder. Do not publish a polished exploit chain aimed at a specific real product, and do not present Juice Shop findings as if they were a client engagement.

## References

1. OWASP Web Security Testing Guide — <https://owasp.org/www-project-web-security-testing-guide/>
2. OWASP Juice Shop project and documentation — <https://owasp.org/www-project-juice-shop/>
3. OWASP ZAP documentation — <https://www.zaproxy.org/docs/>
4. PortSwigger Web Security Academy, free labs and learning material — <https://portswigger.net/web-security>
5. OWASP Top 10 — <https://owasp.org/www-project-top-ten/>
6. FIRST CVSS specification and calculator — <https://www.first.org/cvss/>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
