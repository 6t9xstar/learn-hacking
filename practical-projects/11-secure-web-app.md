# Project 11 — Secure Web Application with Requirements, Tests, and CI Evidence

A secure application is not one with a security page bolted on at the end. It is an application whose requirements name the threats, whose code enforces the boundaries, and whose tests prove that the boundaries still hold after a change. In this project you build a small private note-taking application, derive its security requirements from OWASP ASVS, model the threats with STRIDE, and produce CI evidence for authentication, authorization, input handling, session security, and supply-chain checks.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate–Advanced |
| Estimated time | 8–12 hours |
| Cost | $0 |
| Prerequisites | Project 01; basic JavaScript, HTTP, SQL, and Git; comfort running commands in a terminal |
| Safety and scope | Local development only; bind to `127.0.0.1`; never expose the development server to the internet or store real user data |

`Last reviewed: 2026-10-31`

> **Safety and scope.** This is a learning application, not a production service. Run it on your own machine or an isolated lab VM, use synthetic accounts and notes, and keep it off public networks. A passing test suite does not prove that an application is secure; it proves that the behaviours you thought to test still hold. State that limitation in your portfolio.

## Objective

- Write security requirements before writing application code.
- Build a private note-taking app with registration, login, logout, and owner-scoped note CRUD.
- Apply authentication, session, authorization, validation, encoding, CSRF, and header controls.
- Model threats with STRIDE and map each mitigation to a requirement and a test.
- Add automated security tests that fail when a control is removed.
- Run static analysis, dependency checks, secret scanning, and a CI pipeline.
- Produce an evidence pack with requirements, tests, CI results, and residual risk.

## Why this project matters

Most application security work happens in code review, design review, and CI: the places where a missing ownership check or an unescaped template becomes a regression. A candidate who can show a small app with a threat model, an ASVS mapping, and a test that proves Alice cannot read Bob's note is more credible than one who lists frameworks.

The project also teaches the difference between a control and a claim. "We use Helmet" is a claim. "The response includes `Content-Security-Policy: default-src 'self'`, and an integration test fails if the header disappears" is evidence. Build the evidence.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Node.js 22 LTS | Application runtime | <https://nodejs.org/> | Free, open source |
| Express | HTTP server and routing | <https://expressjs.com/> | Free, open source |
| EJS | Server-side templates with HTML escaping | <https://ejs.co/> | Free, open source |
| better-sqlite3 | Local SQLite database with prepared statements | <https://github.com/WiseLibs/better-sqlite3> | Free, open source |
| Argon2 | Password hashing | <https://github.com/P-H-C/phc-winner-argon2> | Free, open source |
| Helmet | Security-related HTTP headers | <https://helmetjs.github.io/> | Free, open source |
| Zod | Runtime input validation | <https://zod.dev/> | Free, open source |
| Vitest and Supertest | Unit and HTTP integration tests | <https://vitest.dev/> | Free, open source |
| OWASP ASVS | Verification requirements | <https://owasp.org/www-project-application-security-verification-standard/> | Free |
| OWASP WSTG | Test-case methodology | <https://owasp.org/www-project-web-security-testing-guide/> | Free |
| Gitleaks | Secret scanning | <https://github.com/gitleaks/gitleaks> | Free, open source |
| Semgrep | Static analysis | <https://github.com/semgrep/semgrep> | Free, open source |
| Trivy | Dependency and filesystem scanning | <https://trivy.dev/> | Free, open source |

## Setup

1. Create a project directory and initialize the Node.js package:

```bash
mkdir -p ~/labs/secure-notes
cd ~/labs/secure-notes
npm init -y
npm pkg set type=module
npm install express ejs better-sqlite3 argon2 helmet express-rate-limit zod express-session connect-sqlite3
npm install --save-dev vitest supertest eslint prettier
```

2. Create the directory layout:

```text
secure-notes/
├── data/
├── src/
│   ├── app.js
│   ├── db.js
│   ├── security.js
│   └── views/
│       ├── login.ejs
│       ├── notes.ejs
│       └── note.ejs
├── test/
│   └── security.test.js
├── .env.example
├── .gitignore
└── package.json
```

3. Create `.gitignore` before the first commit:

```text
node_modules/
.env
data/
*.db
*.db-shm
*.db-wal
coverage/
```

4. Create `.env.example` with placeholders, never real secrets:

```text
NODE_ENV=development
PORT=3000
SESSION_SECRET=replace-with-at-least-32-random-bytes
DB_PATH=./data/notes.db
```

5. Generate a local secret and put it in `.env`, which is ignored by Git:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

6. Create the SQLite schema with owner-scoped notes:

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS notes_owner_idx ON notes(owner_id, updated_at DESC);
```

## Step-by-step tasks

1. **Define the scope and data model.** Write a one-page scope note that states the app's purpose, the data it stores, the actors, and the trust boundaries. The only data should be a synthetic email, a password hash, and note content. State explicitly that notes are private to their owner and that there is no sharing feature. Checkpoint: a data-flow diagram showing browser, Express, SQLite, and the local filesystem, with every trust boundary labelled.

2. **Derive security requirements from ASVS.** Create `requirements.md` with one row per requirement: identifier, requirement, ASVS area, design decision, verification method, and status. Cover at least these areas:

| Area | Requirement | Verification |
| --- | --- | --- |
| Authentication | Passwords are hashed with Argon2id; login errors do not reveal whether an account exists | Code review plus integration test |
| Authentication | Login is rate-limited and generic | Test the eleventh attempt returns 429 |
| Session | Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production | Inspect `Set-Cookie` and test production config |
| Session | A new session identifier is issued at login and destroyed at logout | Integration test compares cookies |
| Access control | Every note query includes `owner_id`; cross-user access returns 404 | Two-account integration test |
| Validation | All input is validated with allowlists and length limits | Unit tests for valid and invalid payloads |
| Output encoding | Templates escape note content by default; no raw HTML rendering | XSS test checks for escaped output |
| CSRF | Every state-changing request requires a per-session token | Missing and wrong-token tests return 403 |
| Transport | Secure cookies and HSTS are enabled behind TLS in production | Header test and deployment note |
| Logging | Logs record security events without passwords, tokens, or note bodies | Log review and test fixture |
| Supply chain | CI runs dependency, static, and secret scans | CI run attached as evidence |

Do not copy requirement numbers from a standard you have not read. Use the ASVS category names and cite the project root, or record the exact version and requirement text you used.

3. **Build a STRIDE threat model.** Keep it short and specific:

| Threat | Example in this app | Mitigation | Test |
| --- | --- | --- | --- |
| Spoofing | Credential stuffing against login | Argon2id, rate limit, generic errors | Login rate-limit test |
| Tampering | Cross-site request forges a note deletion | Per-session CSRF token | Missing-token test |
| Repudiation | No record of a failed login | Structured security event without PII | Log fixture review |
| Information disclosure | Alice requests `/notes/42`, which belongs to Bob | Owner-scoped query and 404 response | IDOR test |
| Denial of service | Repeated password guesses | Rate limiter and request size limits | 429 test |
| Elevation of privilege | A logged-in user reaches another user's note | Authentication plus ownership checks | Two-account test |

Checkpoint: every threat has a mitigation and a test, or an explicit accepted risk with a reason.

4. **Configure sessions and password hashing.** Use `express-session` with a server-side store, not the default memory store. The following is the core configuration; adapt names to your code:

```js
import session from "express-session";
import SQLiteStore from "connect-sqlite3";
import argon2 from "argon2";

const SQLiteSessionStore = SQLiteStore(session);

app.set("trust proxy", 1);
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteSessionStore({ db: "sessions.db", dir: "./data" }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

const DUMMY_HASH = await argon2.hash("dummy-password-for-timing-only");

async function verifyPassword(password, storedHash) {
  return argon2.verify(storedHash ?? DUMMY_HASH, password);
}
```

Use `argon2id` explicitly when hashing; the default may change across versions. Record the parameters you chose in `decisions.md` and explain the memory and time trade-off. Never log a password, a hash, a session identifier, or a CSRF token.

5. **Implement authentication with session regeneration.** Registration normalizes the email, validates the password length, hashes it, and inserts the user. Login verifies the hash, regenerates the session, stores only the user identifier, and saves the session before redirecting. Logout destroys the session and clears the cookie. Checkpoint: the login response sets a new `sid` value, and the old value no longer authenticates.

6. **Enforce authorization on every note operation.** The ownership check belongs in the SQL predicate, not in a separate `if` that a future route might forget:

```js
const getOwnedNote = db.prepare(
  "SELECT id, title, body, updated_at FROM notes WHERE id = ? AND owner_id = ?",
);

app.get("/notes/:id", requireUser, (req, res) => {
  const note = getOwnedNote.get(req.params.id, req.session.userId);
  if (!note) return res.status(404).render("not-found");
  res.render("note", { note });
});
```

Use the same predicate for update and delete. Return 404 for another user's note so the response does not confirm that the note exists. Checkpoint: an integration test with Alice and Bob proves that Alice receives 404 for Bob's note on read, update, and delete.

7. **Validate input and encode output.** Use a schema at every boundary:

```js
import { z } from "zod";

const credentials = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(12).max(128),
});

const noteInput = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().max(10_000),
});
```

Use prepared statements with bound parameters. In EJS, render note content with `<%= note.body %>`, never `<%- note.body %>`. Add `white-space: pre-wrap` in CSS if you need to preserve line breaks. Checkpoint: a note containing `<script>alert(1)</script>` is displayed as text, and the response does not contain an executable script element.

8. **Add CSRF protection for state-changing requests.** Implement a per-session token and compare it with `crypto.timingSafeEqual`:

```js
import crypto from "node:crypto";

export function issueCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

export function verifyCsrf(req, res, next) {
  const sent = String(req.body?._csrf ?? req.get("x-csrf-token") ?? "");
  const expected = String(req.session.csrfToken ?? "");
  const a = Buffer.from(sent);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(403).send("Invalid CSRF token");
  }
  next();
}
```

Put a hidden `<input name="_csrf" value="<%= csrfToken %>">` in every form. Apply `verifyCsrf` to POST, PUT, PATCH, and DELETE routes after body parsing. Checkpoint: a request without a token and a request with a token from another session both return 403.

9. **Set headers and a restrictive content security policy.** Start with Helmet, then make the policy explicit and test it:

```js
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
      },
    },
    hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: false },
    referrerPolicy: { policy: "no-referrer" },
  }),
);
```

Do not add `'unsafe-inline'` to make a template work. Move inline scripts and styles into files instead. In development over plain HTTP, `Secure` cookies and HSTS will not behave as they do in production; test those settings with `NODE_ENV=production` behind a local TLS proxy or record the limitation.

10. **Handle errors and logs without leaking data.** Use one error handler that returns a generic page and a request identifier. Log the event, the route, the status, and the identifier, but never the password, cookie, CSRF token, note body, or full email address. Checkpoint: a forced exception returns a generic 500 page and the server log contains no secret values.

11. **Write security tests that fail when controls are removed.** Use Vitest and Supertest with an isolated database. Extract the CSRF token from the form for each agent:

| ID | Test | Expected result |
| --- | --- | --- |
| AUTH-01 | Unauthenticated `GET /notes` | Redirect to `/login` |
| AUTH-02 | Wrong password | 401 with a generic message |
| AUTH-03 | Successful login | New session cookie; old cookie rejected |
| AUTHZ-01 | Alice reads Bob's note | 404 |
| AUTHZ-02 | Alice updates or deletes Bob's note | 404 |
| CSRF-01 | POST without a token | 403 |
| CSRF-02 | POST with another session's token | 403 |
| XSS-01 | Note containing a script tag | Escaped text; no script element |
| SQLI-01 | Login with `' OR 1=1 --` | 401; no authentication bypass |
| HEADERS-01 | Response headers | CSP, `X-Content-Type-Options`, and `Referrer-Policy` present |
| RATE-01 | Eleven login attempts | The eleventh returns 429 |

Run the suite with `npm test`. Checkpoint: temporarily remove the `owner_id` predicate or the CSRF middleware and confirm that the relevant test fails. Restore the control and record the result in `security-tests.md`.

12. **Add CI and supply-chain checks.** A minimal workflow should install from the lockfile, run tests, and scan:

```yaml
name: security
on:
  push:
  pull_request:

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm audit --audit-level=high
      - uses: gitleaks/gitleaks-action@v2
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: fs
          severity: HIGH,CRITICAL
          exit-code: 1
      - uses: semgrep/semgrep-action@v1
        with:
          config: auto
```

Pin actions to reviewed versions in a real repository, and keep the workflow permissions minimal. If an action requires a token or licence, document it in the repository README rather than committing a secret. Checkpoint: a pull request shows the test and scan results, and a deliberately introduced secret or vulnerable dependency is caught.

13. **Write the evidence pack and retest.** Assemble `requirements.md`, `threat-model.md`, `security-tests.md`, `decisions.md`, `residual-risk.md`, and the CI run link or exported logs. For each control, include the requirement, the code location, the test, and the result. Retest after any fix and record the before-and-after result. Checkpoint: a reviewer can reproduce the tests from the README without asking you for missing steps.

## Expected results

- A working local app with registration, login, logout, and owner-scoped note CRUD.
- A written ASVS-based requirements table and a STRIDE threat model.
- Passing integration tests for authentication, authorization, CSRF, XSS, SQL injection, headers, and rate limiting.
- A CI pipeline that runs tests, dependency audit, secret scanning, static analysis, and filesystem scanning.
- A documented decision log and a residual-risk statement.
- Evidence that removing a critical control causes a test to fail.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `requirements.md` | Markdown | Requirement, standard area, design decision, test, status |
| `threat-model.md` | Markdown | Data-flow diagram, trust boundaries, STRIDE table with tests |
| `src/` | Node.js | Small, readable app with security controls in named modules |
| `test/security.test.js` | JavaScript | Repeatable tests using two users and isolated state |
| `security-tests.md` | Markdown | Test matrix, observed result, and the mutation check |
| `decisions.md` | Markdown | Argon2id parameters, session settings, CSP trade-offs |
| `residual-risk.md` | Markdown | Accepted risks, limitations, and next controls |
| `ci-evidence.md` | Markdown | Workflow run link or exported results, with date |
| `README.md` | Markdown | Setup, test, and scope instructions for a reviewer |

## Skills gained

- Turning a standard into application-specific security requirements.
- Threat modelling a small system without producing an unusable document.
- Implementing authentication, session management, and owner-scoped authorization.
- Preventing and testing CSRF, XSS, SQL injection, and IDOR.
- Building a restrictive CSP and security-header baseline.
- Writing security regression tests and running supply-chain checks in CI.
- Communicating residual risk without claiming that a lab app is production-ready.

## Stretch improvements

1. Add TOTP-based MFA and test that a valid password without the second factor cannot create an authenticated session.
2. Add a CSP nonce for one inline script and prove that the policy still blocks an injected script.
3. Add a tamper-evident audit log for login, note creation, and note deletion, with a retention rule.
4. Add a second role, such as read-only auditor, and test horizontal and vertical authorization separately.
5. Add a dependency-update workflow with Dependabot and a policy for reviewing major versions.
6. Run the app behind a local reverse proxy with TLS and verify `Secure` cookies and HSTS in a browser.
7. Add a small load test for the login endpoint and confirm that the rate limiter behaves under concurrency.
8. Ask a peer to review the threat model and attempt one abuse case you did not test.

## Troubleshooting

### Argon2 or better-sqlite3 fails to install

Both packages may need a compiler toolchain. On Ubuntu, install `build-essential` and `python3`; on Windows, use the current Node.js LTS installer and the Visual Studio Build Tools. Read the package's installation notes before changing Node versions. If native builds are not possible, document the limitation and use a maintained alternative rather than removing password hashing.

### The session cookie is missing after login

Check that `SESSION_SECRET` is set, that the session store directory exists and is writable, and that the response actually reaches the browser. In production, `Secure` cookies require HTTPS; over plain HTTP the browser will not store them. Confirm the cookie flags in the browser developer tools and in the raw `Set-Cookie` header.

### CSRF tests fail intermittently

The token is tied to the session. A new agent, a regenerated session, or a missing cookie produces a different token. Fetch the form with the same agent that submits it, and extract the token from the response body rather than reusing a token from another test. Do not disable CSRF in tests; that removes the behaviour you are trying to prove.

### A cross-user note request returns 403 instead of 404

A 403 confirms that the note exists, which is an information leak. Use a single owner-scoped query and return 404 when no row matches. The absence of a row and the absence of permission should be indistinguishable to the caller.

### The rate limiter blocks the test suite

Use a separate limiter configuration for tests or reset the limiter store between tests. Do not disable the limiter in production code. If the app runs behind a proxy, configure `trust proxy` correctly so the limiter does not treat every request as the same client.

### Semgrep or Trivy reports a finding you do not understand

Read the rule, reproduce the issue, and decide whether it is a true positive, a false positive, or an accepted risk. Record the decision and the reason. Do not suppress a rule globally to make CI green, and do not add `--exit-code 0` without documenting why.

## Portfolio presentation

Publish the code, the threat model, the requirements table, the security test matrix, and one CI run showing the checks. State that the app is a local learning project and name its limitations: no production deployment, no real user data, no independent penetration test. Remove `.env`, database files, session stores, and any test credentials. A reviewer should be able to run `npm ci && npm test` and see the same controls fail when removed.

## References

1. OWASP Application Security Verification Standard — <https://owasp.org/www-project-application-security-verification-standard/>
2. OWASP Web Security Testing Guide — <https://owasp.org/www-project-web-security-testing-guide/>
3. OWASP Cheat Sheet Series — <https://cheatsheetseries.owasp.org/>
4. NIST SP 800-218, Secure Software Development Framework — <https://csrc.nist.gov/pubs/sp/800/218/final>
5. CISA Secure by Design — <https://www.cisa.gov/securebydesign>
6. MDN Content Security Policy — <https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP>
7. GitHub secret scanning documentation — <https://docs.github.com/en/code-security/secret-scanning>
8. Gitleaks — <https://github.com/gitleaks/gitleaks>
9. TruffleHog — <https://github.com/trufflesecurity/trufflehog>
10. OWASP Juice Shop — <https://owasp.org/www-project-juice-shop/>

---

**Navigation:** [Practical projects index](README.md) · [Project 10](10-cloud-security-review.md) · [Project 12](12-security-portfolio.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md)
