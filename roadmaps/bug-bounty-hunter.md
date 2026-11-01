# Bug Bounty Hunter Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 6–12 months to a first valid report; 12–24 months to consistent income, if ever**

[Home](../README.md) › [Roadmaps](README.md) › Bug bounty hunter

Bug bounty hunting is independent security testing against programs that have published a scope and agreed to receive reports. It rewards the same skills as professional web security, plus self-direction, careful reading of program rules, and clear writing. It is not a shortcut around fundamentals and it is not a reliable income. Most people who start never earn a bounty; many who do earn small amounts irregularly. Treat it as a way to practice on real targets with permission, not as a plan to quit your job.

Read [ETHICS.md](../ETHICS.md) and the program's policy before you send a single request. Scope, safe-harbour terms, and disclosure rules are binding. Testing outside scope can be illegal and will get you banned from platforms.

## At a glance

| Item | Detail |
|---|---|
| Target role | Independent bug bounty hunter; the same skills support junior web penetration tester and application security analyst roles |
| Realistic duration | 6–12 months of consistent practice to a first valid report; longer, and never guaranteed, for meaningful income |
| Cost | Free to start; Burp Suite Community is free; optional Burp Pro, VPS, and tooling subscriptions |
| Lab needs | A laptop, browser, Burp Suite, a local vulnerable app, and a notes system; a VPS is optional |
| Difficulty | Moderate to high; competition is intense and report quality decides outcomes |
| Main output | Redacted reports, a methodology, a recon workflow, and a target-selection log |

This is a map, not a race. Prior web development or QA experience shortens the learning curve. Income is not a milestone you can schedule; skill and report quality are.

## Who this is for

This roadmap suits web developers, QA engineers, students, and self-taught learners who have basic web knowledge and want to test real systems legally. It also suits junior pentesters who want more practice with modern applications.

Honest prerequisites:

- **HTTP and browser fundamentals.** Requests, responses, cookies, headers, and the developer console.
- **JavaScript literacy.** Enough to read front-end code and understand DOM behaviour.
- **A local practice environment.** Juice Shop, DVWA, or PortSwigger labs.
- **Burp Suite basics.** Intercepting, repeating, and comparing requests.
- **Writing ability.** A clear report is the product. Poor writing loses valid findings.
- **Patience with duplicates.** Someone may find the same issue first. That is normal and not a reflection of your ability.

You do not need to be a full-stack developer, but you must be able to understand how an application is supposed to work before you can tell when it does not.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Scope interpretation | Read a policy and know exactly what is allowed, excluded, and rate-limited | A scope summary for three programs |
| Attack surface mapping | Enumerate domains, subdomains, APIs, and features systematically | A recon report for a domain you own |
| Manual testing | Test access control, authentication, injection, and business logic by hand | Ten documented test cases with results |
| Impact demonstration | Prove a bug with the minimum necessary action and no real harm | A redacted report with a safe proof |
| Report writing | Write steps, impact, and remediation clearly enough to reproduce | Three complete reports |
| Triage communication | Respond professionally to questions, duplicates, and disagreements | A mock triage exchange |
| Program selection | Choose programs by scope, maturity, and fit rather than payout alone | A target-selection log with rationale |
| Ethics and law | Stay in scope, protect data, and follow disclosure rules | A personal rules-of-engagement checklist |

Typical entry-level tasks:

- Read a program policy and list in-scope assets, exclusions, and testing limits.
- Map a small application's features and identify the roles and data flows.
- Test one feature for broken access control using two accounts you created.
- Write a report with a title, summary, steps, impact, and remediation.
- Verify a fix after a program patches the issue.

## Learning sequence

The sequence prioritizes fundamentals, then recon, then manual testing, then reporting. Bounty hunting is a market; the hunters who succeed are usually the ones with the best methodology and writing, not the largest tool stack.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Web fundamentals and a local lab | 6–8 weeks | Lab casebook and Burp notes |
| 2 | Recon and attack surface mapping | 6–8 weeks | Recon workflow and report |
| 3 | Manual testing methodology | 10–12 weeks | Fifteen tested cases |
| 4 | Reporting and program navigation | 6–8 weeks | Three reports and a scope summary |
| 5 | Specialization and sustainable practice | 6–8 weeks | Niche methodology and portfolio |

### Stage 1 — Web fundamentals and a local lab

| Element | Detail |
|---|---|
| Goal | Understand web applications well enough to test them and build a practice environment. |
| Topics | HTTP, cookies, sessions, CORS, CSP; JavaScript and the DOM; authentication and authorization; Burp Suite; local vulnerable apps; note-taking; safe testing habits. |
| Free learning | [PortSwigger Web Security Academy](https://portswigger.net/web-security), [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn), [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), [Hacker101](https://www.hacker101.com/). |
| Labs | Install Burp Community and Juice Shop. Complete the apprentice labs. Solve ten Juice Shop challenges. Keep notes with request, response, and reasoning. |
| Deliverable | A lab casebook with ten entries and an annotated Burp workflow. |
| Exit criteria | You can explain a session flow and find a missing authorization check in a lab app. |

### Stage 2 — Recon and attack surface mapping

| Element | Detail |
|---|---|
| Goal | Build an accurate picture of a target's public surface without touching out-of-scope assets. |
| Topics | Scope parsing; subdomain enumeration; certificate transparency; DNS; HTTP probing; content discovery; JavaScript analysis; API discovery; screenshots; asset inventories; rate limits and etiquette. |
| Free learning | [ProjectDiscovery documentation](https://docs.projectdiscovery.io/), [crt.sh](https://crt.sh/), [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/), [SecLists](https://github.com/danielmiessler/SecLists). |
| Labs | Build a recon workflow and run it against a domain you own. Document every tool, flag, and output. Compare active and passive techniques and their risks. |
| Deliverable | A recon report for your own domain with an asset inventory and a reproducible workflow. |
| Exit criteria | You can distinguish an in-scope asset from an ambiguous one and stop when the scope is unclear. |

### Stage 3 — Manual testing methodology

| Element | Detail |
|---|---|
| Goal | Test common and high-impact vulnerability classes by hand, with evidence and minimal harm. |
| Topics | Broken access control and IDOR; authentication and session flaws; injection; XSS contexts; SSRF; business logic; race conditions; API authorization; information disclosure; file upload; GraphQL basics. |
| Free learning | [PortSwigger all labs](https://portswigger.net/web-security/all-labs), [OWASP Top 10](https://owasp.org/www-project-top-ten/), [OWASP API Security Top 10](https://owasp.org/www-project-api-security/), [HackerOne hacktivity](https://www.hackerone.com/). |
| Labs | Complete at least twenty practitioner labs. Test a local API with two accounts. Practice writing a minimal proof for each finding. |
| Deliverable | Fifteen tested cases with requests, results, impact, and a proposed fix. |
| Exit criteria | You can choose a test based on application behaviour and explain why a finding matters. |

### Stage 4 — Reporting and program navigation

| Element | Detail |
|---|---|
| Goal | Turn a finding into a report that gets triaged and learn how programs actually operate. |
| Topics | Report structure; title and summary; reproduction steps; impact statements; CVSS; severity disagreement; duplicates; triage etiquette; disclosure policy; safe harbour; payout models; taxes and record-keeping. |
| Free learning | [Hacker101](https://www.hacker101.com/), [Bugcrowd LevelUp](https://www.bugcrowd.com/resources/levelup/), [HackerOne disclosure guidelines](https://www.hackerone.com/), [FIRST CVSS](https://www.first.org/cvss/). |
| Labs | Write three full reports for lab findings. Exchange one with a peer for review. Write a scope summary for three real programs without testing them. |
| Deliverable | Three complete reports and a target-selection log with scope, maturity, and rationale. |
| Exit criteria | A reviewer can reproduce each report and understands the impact without asking questions. |

Ethics reminder: only test assets explicitly in scope. Stop at the first proof; do not access other users' data, pivot into internal systems, or run denial-of-service tests. Follow the program's disclosure timeline. If you find a serious issue, report it privately and do not publish details before remediation.

### Stage 5 — Specialization and sustainable practice

| Element | Detail |
|---|---|
| Goal | Choose a niche and build a repeatable practice that does not depend on luck. |
| Topics | Niche selection (API, mobile, cloud, business logic, GraphQL); automation with judgment; note systems; time tracking; avoiding burnout; continuous learning; transitioning to a security job. |
| Free learning | [PortSwigger research](https://portswigger.net/research), [ProjectDiscovery documentation](https://docs.projectdiscovery.io/), [web security roadmap](web-security-specialist.md), [exercises](../exercises/README.md). |
| Labs | Run a four-week focused practice on one niche. Track hours, findings, duplicates, and report quality. Write a methodology document. |
| Deliverable | A niche methodology and a portfolio with three redacted reports. |
| Exit criteria | You can explain your niche, your process, and how you measure improvement. |

## Sequence diagram

```text
Stage 1  Web fundamentals + lab
  HTTP | JS | sessions | Burp | Juice Shop
        |
        v
Stage 2  Recon + attack surface
  scope -> subdomains -> probing -> JS analysis -> inventory
        |
        v
Stage 3  Manual testing
  access control -> auth -> injection -> SSRF -> logic -> APIs
        |
        v
Stage 4  Reporting + programs
  steps -> impact -> severity -> triage -> disclosure
        |
        v
Stage 5  Specialization
  niche -> methodology -> measured practice -> portfolio
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner–advanced | Free; optional account | Yes | Structured labs across web vulnerability classes |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free videos and CTF | Yes | Bug bounty fundamentals and practice |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No | A testing methodology to follow |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Beginner–intermediate | Free, open source | Yes | A realistic vulnerable application |
| [HackerOne](https://www.hackerone.com/) | HackerOne | Beginner–intermediate | Free account; programs vary | Live programs | Real scope, reports, and triage |
| [Bugcrowd LevelUp](https://www.bugcrowd.com/resources/levelup/) | Bugcrowd | Beginner–intermediate | Free resources | Some | Program navigation and hunter education |
| [ProjectDiscovery documentation](https://docs.projectdiscovery.io/) | ProjectDiscovery | Intermediate | Free tools and docs; paid cloud platform | Yes | Recon and vulnerability scanning workflow |
| [crt.sh](https://crt.sh/) | Sectigo | Intermediate | Free | Yes | Certificate transparency for subdomain discovery |
| [SecLists](https://github.com/danielmiessler/SecLists) | Daniel Miessler | Beginner–intermediate | Free, open source | Wordlists | Content discovery and testing lists |
| [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) | OWASP | Intermediate | Free | No | API-specific risk categories |
| [FIRST CVSS](https://www.first.org/cvss/) | FIRST | Intermediate | Free | No | Consistent severity scoring |
| [PortSwigger research](https://portswigger.net/research) | PortSwigger | Advanced | Free | Some | Current web attack techniques |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Burp and Juice Shop setup | Local | Interception and basic testing | Free |
| 2 | Apprentice labs in five categories | PortSwigger | Core vulnerability classes | Free |
| 3 | Hacker101 CTF | Online | Flag-based practice | Free |
| 4 | Recon workflow on your own domain | Local plus public sources | Asset discovery and scope | Free |
| 5 | Practitioner labs | PortSwigger | Depth and evidence | Free |
| 6 | Two-account API test | Local crAPI or Juice Shop | Authorization testing | Free |
| 7 | Report writing and peer review | Local | Communication | Free |
| 8 | Mock triage exchange | Peer | Professional communication | Free |

Safe-lab caveat: only test systems you own or assets explicitly listed as in scope. Read the program policy for exclusions, rate limits, and prohibited techniques. Do not run automated scanners against live programs unless the policy allows it. Stop at the first proof and never access, modify, or exfiltrate real user data. If a program's scope is ambiguous, ask before testing.

## Portfolio projects

1. **Three redacted reports.** One access control, one injection or XSS, and one business logic finding, each with a clear proof and impact. Remove program names and user data.
2. **Recon workflow.** A documented pipeline with tools, flags, outputs, and a decision log, run against a domain you own.
3. **Niche methodology.** A focused document on API or business logic testing, with test cases, tooling, and lessons learned.
4. **Target-selection log.** Ten programs evaluated by scope, maturity, competition, and fit, with the reasoning recorded before testing.
5. **Learning log.** A four-week record of hours, tests, findings, duplicates, and report quality scores. This demonstrates discipline, which is the actual job.

## Milestones and self-assessment

**Months 0–3**

- [ ] I can explain cookies, sessions, CORS, and CSP.
- [ ] I set up Burp and Juice Shop and completed ten challenges.
- [ ] I completed all PortSwigger apprentice labs in three categories.
- [ ] I wrote ten casebook entries with requests and reasoning.

**Months 3–6**

- [ ] I built a recon workflow and ran it on a domain I own.
- [ ] I can distinguish in-scope from ambiguous assets.
- [ ] I completed fifteen practitioner labs.
- [ ] I found and documented a missing authorization check with two accounts.

**Months 6–9**

- [ ] I wrote three complete reports and had one reviewed.
- [ ] I read the policies of five programs and summarized their scope.
- [ ] I submitted at least one report to a program within its rules.
- [ ] I can explain a finding's impact in two sentences.

**Months 9–12**

- [ ] I chose a niche and wrote a methodology for it.
- [ ] I tracked four weeks of practice with hours and outcomes.
- [ ] My portfolio has three redacted reports and a recon workflow.
- [ ] I have a realistic income plan that does not depend on bounties.

## Certifications

No certification is required to hunt bounties, and none guarantees results. If you want a structured credential, the options below are paid; free study material exists through the providers' public labs.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Burp Suite Certified Practitioner](https://portswigger.net/web-security/certification) | PortSwigger | Intermediate–advanced | Academy labs are free | Paid practical exam | Closest to the skills bounty hunting uses |
| [OSWA](https://www.offsec.com/courses/web-200/) | OffSec | Intermediate | Syllabus and community write-ups | Paid course and exam | Practical web assessment credential |
| [eWPT](https://ine.com/security/certifications/ewpt-certification) | INE | Intermediate | Some free INE material | Paid exam | Web testing fundamentals |
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | General baseline; not needed for bounty work |
| [HTB CWES](https://academy.hackthebox.com/) | Hack The Box | Advanced | Some free modules | Paid path and exam | Practical web exploitation practice |

## Common detours and mistakes

- **Automation spam.** Running scanners across every subdomain produces noise, duplicates, and sometimes out-of-scope traffic. Automate discovery, not judgment.
- **Not reading the policy.** Scope, exclusions, and prohibited tests are not suggestions. Violating them can be illegal and gets accounts banned.
- **Chasing only XSS.** Easy classes are crowded. Access control, business logic, and API authorization often pay better and are less duplicated.
- **Low-quality reports.** "XSS on example.com" without steps or impact gets closed. Write for the triager.
- **Testing out of scope.** A related domain or a third-party service is not automatically in scope. Ask.
- **Ignoring duplicates.** Duplicates are normal. Learn from them and move on; do not argue without evidence.
- **Quitting your job too early.** Bounty income is irregular. Keep a stable income while you build skill and a report history.
- **Publishing without permission.** Premature disclosure can harm users and end your program access.

## Next steps

1. Complete the [web security specialist roadmap](web-security-specialist.md) foundations if any stage feels weak.
2. Practice on [PortSwigger](https://portswigger.net/web-security) and [Hacker101](https://www.hacker101.com/) before submitting to live programs.
3. Read the scope and disclosure policy of every program you consider, and write a one-page summary before testing.
4. Use the [exercises](../exercises/README.md) and [lab notes template](../templates/lab-notes.md) to build a repeatable process.
5. Keep your day job and measure progress by reports and skill, not by payouts.

## References

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [Hacker101](https://www.hacker101.com/)
- [HackerOne](https://www.hackerone.com/)
- [Bugcrowd LevelUp](https://www.bugcrowd.com/resources/levelup/)
- [FIRST CVSS](https://www.first.org/cvss/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
