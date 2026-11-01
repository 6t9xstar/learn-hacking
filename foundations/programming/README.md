# Programming foundations

[Home](../../README.md) / Foundations / Programming

Security work is software work. Attackers exploit code, defenders automate analysis with code, and every control you configure is ultimately implemented by code. You do not need a computer science degree, but you do need to read a program and predict what it will do, then write small tools that save you from repeating yourself.

This guide teaches programming as a security skill: enough Python, shell, JavaScript, SQL, and engineering practice to automate tasks, review code for obvious flaws, and understand why vulnerabilities happen. It is not a full software engineering curriculum, but it points to one.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner. Consistent practice matters more than prior maths. |
| Realistic time | 10–12 weeks at 6–8 hours per week, including small projects. |
| Cost | Free. Every recommended course and tool has a free path. |
| Prerequisites | Basic computer literacy and willingness to debug your own mistakes. |
| Lab requirement | A local development environment; no internet-facing services. |
| Evidence of learning | Three working scripts, a code review, and a clean static-analysis run. |

## Why this field matters

Most breaches start with a software flaw: an injection bug, a missing authorisation check, a dependency with a known vulnerability, or a secret committed to a repository. Understanding how code is written is how you recognise those flaws beyond a scanner's signature.

Automation is the other half. A security analyst who can parse ten thousand log lines with a script, or enrich indicators against an API, is dramatically more effective than one who copies and pastes. Programming also makes you harder to fool: you can verify a tool's claim instead of trusting its output.

## What you will learn

- Read and modify small programs in Python, Bash, and JavaScript.
- Structure code with functions, data structures, error handling, and tests.
- Automate file parsing, HTTP requests, and report generation responsibly.
- Explain injection, unsafe deserialisation, and secret leakage at the code level.
- Use static analysis and dependency scanning as part of a normal workflow.
- Review someone else's code and write findings that include a fix.
- Use Git and pull requests without leaking secrets or breaking history.

## Prerequisites and honest expectations

You need a computer where you can install Python and an editor, and the willingness to type code rather than only read it. No advanced mathematics is required for the material here.

- Expect to be confused by error messages. Reading tracebacks is the skill; copy-pasting fixes is not.
- Expect to write bad code first. Refactoring is part of programming, not evidence of failure.
- Do not start with exploit development. Learn to build and test ordinary software before studying how it breaks.
- AI assistants can explain code, but they also invent APIs. Verify everything against documentation and tests.

## Core concepts

### Fundamentals that transfer between languages

Every language gives you variables and types, control flow, functions, collections, and some way to handle errors. The important mental models are state (what changes over time), scope (where a name is visible), and data flow (where input enters and where it leaves). If you can trace those in a twenty-line program, you can learn a new language's syntax in a week.

Complexity matters too. A loop inside a loop over a million records is a denial-of-service bug waiting to happen, and unbounded recursion can crash a parser. Security review often starts by asking what happens with empty input, huge input, malicious input, and concurrent input.

### Python as the security lingua franca

Python is readable, has libraries for nearly every protocol and file format, and is the default language for security tooling and automation. Learn the standard library first: `pathlib`, `json`, `csv`, `argparse`, `logging`, `subprocess`, `sqlite3`, and `http.client`. Then add `requests` for HTTP and a parsing library only when the standard one is insufficient.

Use virtual environments and pinned dependencies for every project. Type hints and a linter catch mistakes before runtime. Learn to read a traceback from the bottom up: the last line names the exception, and the frames above show the path that caused it.

### Bash, shell, and Python together

Bash and the POSIX shell are excellent for orchestrating commands, moving files, and gluing tools together. Python is better for parsing structured data, handling errors precisely, and building anything with tests. A common pattern is a small shell wrapper that sets up the environment and a Python program that does the real work.

When Python calls external commands, pass an argument list and avoid `shell=True` with untrusted input; shell interpolation turns data into commands. Check return codes, capture stderr, set timeouts, and never log secrets that appear in a command line.

### JavaScript and the browser

JavaScript runs in a sandboxed browser environment with access to the DOM, network requests, storage, and user input. Modern applications fetch JSON from APIs and render it client-side, which means much of the application logic is visible and modifiable by the user. Client-side validation is a usability feature, never a security control.

The same-origin policy is the browser's core boundary: scripts from one origin cannot read responses from another unless the server explicitly allows it with CORS. Learn how `fetch`, promises, and async/await work, and learn where user-controlled data reaches dangerous sinks such as `innerHTML`. Node.js lets JavaScript run server-side, where the same injection and authorisation mistakes appear in a different runtime.

### Data formats and safe parsing

JSON, YAML, CSV, and line-oriented logs are the formats you will parse most. Use a real parser rather than regular expressions for structured data, validate the shape of the data before using it, and set limits on size and nesting depth so a malicious file cannot exhaust memory.

Some parsers are dangerous by design. Python's `pickle` can execute code during deserialisation, and YAML has loaders that construct arbitrary objects; use `yaml.safe_load` unless you truly control the input. Treat archives as hostile too: validate paths to prevent zip-slip and cap decompressed size to prevent bombs.

### HTTP APIs and automation

Most automation eventually talks to an API. Learn the request-response model, authentication headers, status codes, pagination, rate limits, and retries with backoff. Always set timeouts; a script that hangs forever is an outage waiting to happen. Make write operations idempotent where possible, and never retry a non-idempotent request blindly.

Secrets belong in environment variables or a secret manager, never in source code or shell history. Log the request identifier and outcome, not the token. When an API returns an error, preserve the body for debugging but redact credentials before sharing logs.

### SQL and data access

Relational databases store most business data, and SQL is how applications read it. Learn `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, and indexes well enough to understand what a query does and why it might be slow. Understand transactions and least-privilege database accounts.

The security lesson is parameterisation. Building a query by concatenating strings mixes code and data, which is the root cause of SQL injection. Use parameterised queries or an ORM that does it correctly, and never let user input choose table or column names without an allowlist.

### Secure coding principles

Validate input on the server, using allowlists where possible. Encode output for the context where it will appear (HTML, attribute, JavaScript, URL, SQL). Enforce authorisation on every request, not just in the UI. Fail securely: deny by default when a check cannot be completed. Keep secrets out of code and logs. Avoid dangerous constructs such as `eval`, `exec`, unsafe deserialisation, and shell interpolation.

These principles are not language features. They are habits that must survive deadlines, which is why code review, tests, and automated checks matter more than good intentions.

### Dependencies and supply chain

Modern applications are mostly other people's code. Use lockfiles, pin versions, and review what a new dependency actually does. Run a software composition analysis tool in CI, watch for typosquatted package names, and prefer packages with active maintenance and provenance.

Adding a dependency is a trust decision: it runs with your privileges and can execute at install time. Vendoring, private registries, and reproducible builds reduce risk for high-value projects. Remove unused dependencies; every one is an unpatched vulnerability you have not met yet.

### Testing, static analysis, and review

Tests prove behaviour and protect refactors. Write unit tests for parsing and authorisation logic, integration tests for API flows, and a few end-to-end tests for critical paths. Fuzzing feeds random or mutated input to a parser to find crashes; even simple fuzzing catches missing bounds checks.

Static analysis finds patterns without running the code. Semgrep supports custom rules, Bandit targets Python security issues, and linters catch ordinary bugs. Treat findings as leads, not verdicts: confirm exploitability, then fix the root cause rather than silencing the warning.

### Git and collaboration

Git records history, enables review, and is now part of the attack surface. Learn branches, commits, diffs, merges, and pull requests. Never commit secrets; use `.gitignore`, secret scanning, and environment files. If a secret does leak, rotate it first, because history rewrites do not unshare what was already cloned.

Signed commits and protected branches raise the cost of tampering. Review diffs, not just descriptions. A pull request that changes an authorisation check deserves more scrutiny than one that reformats a README.

## Legal and safe practice

Write code that helps people defend systems. Do not write malware, credential stealers, or tools whose primary purpose is unauthorised access, and do not test exploits against systems you do not own.

- Keep vulnerable applications local and deliberately isolated; never expose a development server to the internet.
- Use synthetic data in examples and tests. Never commit real customer data, tokens, or internal hostnames.
- If you find a vulnerability in someone else's project, report it privately and give the maintainer time to fix it.
- Respect licences and terms of service when using APIs, datasets, and code.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Basics | Complete an introductory Python or JavaScript course and write 20 small programs. | A repository of exercises with comments |
| 1 | Files and data | Parse CSV, JSON, and log files; handle errors and bad input. | A CLI that summarises a log file |
| 2 | HTTP | Call a public API with timeouts, pagination, and secret handling. | A script plus a README explaining design choices |
| 3 | Databases | Model a small schema and write parameterised queries. | Schema diagram and query examples |
| 4 | Quality | Add tests, a linter, and static analysis to a project. | CI output showing tests and scans passing |
| 5 | Review | Review a deliberately vulnerable application and write fixes. | Code review report with patches |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CS50x](https://cs50.harvard.edu/x/) | Harvard University | Beginner | Free | Problem sets | Rigorous foundations in programming and computer science |
| [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/) | Al Sweigart | Beginner | Free to read online; print edition paid | Exercises | Practical Python for files, web, and spreadsheets |
| [Python for Everybody](https://www.py4e.com/) | Charles Severance | Beginner | Free | Exercises | Friendly introduction with data-focused examples |
| [The Odin Project](https://www.theodinproject.com/) | The Odin Project | Beginner | Free | Projects | Full-stack JavaScript and web foundations |
| [freeCodeCamp](https://www.freecodecamp.org/) | freeCodeCamp | Beginner | Free | Interactive challenges | Web development and scripting practice |
| [The Missing Semester](https://missing.csail.mit.edu/) | MIT | Beginner | Free | Exercises | Shell, Git, debugging, and tooling habits |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [Python documentation](https://docs.python.org/3/) | Python Software Foundation | Language reference, standard library, and tutorials |
| [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Mozilla | The practical reference for JavaScript and browser APIs |
| [Pro Git](https://git-scm.com/book/en/v2) | Scott Chacon and Ben Straub | Free, thorough book on version control |
| [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/) | OWASP | A checklist you can apply during code review |
| [CWE Top 25](https://cwe.mitre.org/top25/) | MITRE | The most dangerous software weaknesses, ranked |
| [Semgrep documentation](https://semgrep.dev/docs/) | Semgrep | Writing and running static analysis rules |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [Exercism](https://exercism.org/) | Exercism | Free | Language tracks with mentor feedback |
| [Advent of Code](https://adventofcode.com/) | Advent of Code | Free | Daily parsing and algorithm puzzles |
| [freeCodeCamp](https://www.freecodecamp.org/) | freeCodeCamp | Free | Interactive web and scripting projects |
| [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) | OverTheWire | Free | Shell scripting under constraints |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Applying scripts in guided security labs |

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| VS Code | Editor with debugging, Git, and language support | [code.visualstudio.com](https://code.visualstudio.com/) |
| Python | General-purpose language for security automation | [python.org](https://www.python.org/) |
| Git | Version control and collaboration | [git-scm.com](https://git-scm.com/) |
| Semgrep | Fast, rule-based static analysis across languages | [semgrep.dev](https://semgrep.dev/) |
| Bandit | Security-focused static analysis for Python | [bandit.readthedocs.io](https://bandit.readthedocs.io/) |
| pip-audit | Check Python dependencies for known vulnerabilities | [pip-audit](https://pypi.org/project/pip-audit/) |

Tools do not replace methodology. A static analyser reports patterns; a human decides whether the pattern is exploitable in context. Write the test that proves the bug before you celebrate the finding.

## Practical projects and exercises

**Project 1: Log summariser CLI.**
Objective: practise parsing, error handling, and tests. Setup: write a Python tool that reads an authentication log, counts failures per source address, flags bursts above a threshold, and outputs CSV. Handle malformed lines, missing files, and timezone differences. Deliverable: the tool, tests, a README with usage, and a sample report.

**Project 2: API client with secret handling.**
Objective: automate a real workflow safely. Setup: build a script that calls a public API with a token from an environment variable, sets timeouts and retries, paginates results, and writes a redacted log. Deliverable: the script plus a short threat note explaining what could leak and how you prevented it.

**Project 3: Secure code review (portfolio-worthy).**
Objective: demonstrate that you can find and fix, not just flag. Setup: run a deliberately vulnerable application locally, pick three issues, write a Semgrep rule for one of them, and fix all three with tests. Deliverable: a review report with reproduction, impact, patch, and verification, plus the custom rule.

## Common mistakes and misconceptions

- **Tutorial hell.** Watching courses feels productive; only building something without a guide creates skill.
- **Copying code without understanding.** Every copied line is a line you cannot debug or secure.
- **Trusting client-side checks.** Anything running in the browser can be changed by the user.
- **Hardcoding secrets.** Repositories are copied, indexed, and scanned; rotate and remove immediately.
- **Using `eval`, `pickle`, or `shell=True` on untrusted input.** These turn data into code execution.
- **Ignoring dependencies.** Most of your attack surface is code you did not write.
- **Fixing the symptom.** Escaping one character does not fix a missing output-encoding strategy.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Security automation engineer | Scripting or IT operations | Tools that save time, with tests and documentation |
| Application security engineer | Software development | Code review findings with patches and threat models |
| Penetration tester | Programming plus labs | Custom tooling and reproducible proof of concept |
| Detection engineer | Scripting plus logs | Rules, parsing pipelines, and false-positive analysis |

Programming is the common language between security and engineering. It is also the easiest skill to demonstrate publicly: a small, well-documented repository says more than a certificate.

## Next steps

1. Finish one beginner course and rebuild three of its exercises from memory.
2. Ship the log summariser with tests and a README, then ask for a code review.
3. Read the OWASP Secure Coding Practices checklist and apply it to your own project.
4. Continue to [Web application security](../../web-application-security/README.md) to see these flaws in context.
5. Use the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md) and [exercises](../../exercises/README.md) to plan practice.

## References

- Python Software Foundation, *Python documentation*, <https://docs.python.org/3/>
- Mozilla, *MDN Web Docs: JavaScript*, <https://developer.mozilla.org/en-US/docs/Web/JavaScript>
- OWASP, *Secure Coding Practices Quick Reference Guide*, <https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/>
- MITRE, *CWE Top 25*, <https://cwe.mitre.org/top25/>
- Scott Chacon and Ben Straub, *Pro Git*, <https://git-scm.com/book/en/v2>
- Semgrep, *Documentation*, <https://semgrep.dev/docs/>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)
