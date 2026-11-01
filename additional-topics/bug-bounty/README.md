[Home](../../README.md) / [Additional topics](../README.md) / Bug Bounty

# Bug Bounty

Bug bounty programs pay independent researchers for vulnerabilities they find in defined scope, following published rules. The model works because it channels curiosity into a legal, structured relationship: organizations get diverse testing, researchers get recognition or payment, and users get safer products. It is also competitive, unpredictable, and easy to do badly.

This guide is for developers and security learners who want to try bug bounty work without wasting a year on automated noise. It covers program selection, recon, manual testing, duplicate avoidance, severity, reporting, and the practical realities of being paid. It does not teach exploitation recipes; the labs and platforms linked below do that in authorized environments.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Beginner-friendly entry, but earning consistently is intermediate to advanced |
| Realistic time | 3-6 months of structured practice before a first valid report is realistic; income is not guaranteed |
| Cost | Free to start; a Burp Suite Community or Caido free tier is enough; paid tools are optional |
| Prerequisites | HTTP, web fundamentals, authentication, access control, basic scripting, careful note-taking |
| Lab requirement | Essential. PortSwigger Web Security Academy and Hacker101 labs before touching a live program |

## Why this field matters

Bug bounty is one of the few security activities where a motivated beginner can practice against real production systems legally. That realism is valuable: real applications have messy authentication, legacy endpoints, business logic, and third-party integrations that no lab reproduces exactly. A researcher who learns to read a program's scope carefully, test a hypothesis, and write a clear report has skills that transfer directly to application security engineering.

For organizations, bounty programs surface issues that scanners miss and provide a pipeline of external perspective. For researchers, the work builds a public track record through disclosed reports and reputation. But the field also attracts get-rich-quick promises. Most researchers earn little or nothing in their first year, and the difference between a productive researcher and a frustrated one is usually methodology and writing, not tooling.

## What you will learn

- How bounty programs are structured and how payouts, duplicates, and disclosure actually work.
- How to select a program that matches your skills and risk tolerance.
- How to read scope and rules so you stay legal and avoid wasted effort.
- A repeatable reconnaissance methodology that respects rate limits and privacy.
- How to test manually and prioritize high-impact bug classes.
- How to avoid duplicates and demonstrate unique impact.
- How to score severity with CVSS and explain business impact.
- How to write reports that get triaged quickly and paid fairly.
- The legal, tax, and ethical practicalities of earning bounty income.

## Prerequisites and honest expectations

You should understand HTTP requests and responses, cookies and sessions, same-origin policy, and the difference between authentication and authorization. You should be comfortable with browser developer tools and a proxy such as Burp Suite or Caido. Basic JavaScript reading and Python or Bash scripting help with recon and automation.

Be honest about the economics. Public programs receive many reports; duplicates are common; triage can take weeks. A first valid finding might take months. Treat bounty work as a supplement to learning, not a replacement for income, until you have a track record. The skills you build are valuable even if the payouts are not immediate.

## Core concepts

### 1. Program types and economics

A vulnerability disclosure program (VDP) accepts reports but does not pay. A bug bounty program pays for valid findings, often with a severity-based range. Programs may be public (anyone can participate), private (invitation only), or time-boxed. Some organizations run their own program; others use a platform such as HackerOne, Bugcrowd, Intigriti, or YesWeHack.

Payouts are usually set by severity and impact, not by effort. A critical remote code execution may pay far more than a complex business logic flaw that took twice as long to find. Duplicates are typically awarded to the first valid report, so speed matters at the margin, but accuracy matters more. Read the program's policy on duplicate handling, out-of-scope vulnerabilities, and payment thresholds before you start.

### 2. Selecting a program

Choose programs where you can add value. Factors: scope size and asset types, program maturity, average time to first response, payout history if published, competition level, and whether the technology matches your skills. A large public web program with thousands of researchers is a hard place to start; a smaller program with a clear API or mobile scope may be more productive.

Read recent disclosed reports and program updates. If a program has not paid a bounty in a year, or has a reputation for disputing valid findings, that is useful information. Avoid programs whose scope is vague or whose rules conflict with the platform's terms. A good first target is a program with a well-defined scope, a responsive team, and vulnerabilities you already know how to test.

### 3. Scope, rules, and safe harbor

Scope is the legal boundary. It lists in-scope domains, IP ranges, mobile apps, APIs, and sometimes source code, plus explicit exclusions such as third-party services, marketing sites, or certain vulnerability classes. Wildcards require care: `*.example.com` may or may not include `api.example.com` hosted by a third party, and it rarely includes acquisitions or sibling brands.

Rules also define testing constraints: no denial of service, no automated scanning beyond a rate limit, no social engineering, no accessing other users' data, no testing with real accounts you do not own, and no public disclosure before a fix. Safe harbor language protects good-faith research, but it is not unlimited: violating privacy law or causing harm can fall outside it. When a rule is ambiguous, ask the program before testing.

### 4. Reconnaissance methodology

Recon builds an inventory of assets and a model of how they connect. Start passive: certificate transparency, DNS records, search engines, the organization's own documentation, mobile app store listings, and job postings that mention technology. Then move to active discovery only where the scope and rules allow it.

Useful categories: root domains and subdomains, IP ranges and ASNs, cloud storage buckets, API endpoints discovered from JavaScript, mobile app backends, and acquisition brands. Keep a spreadsheet or database with source, timestamp, and confidence. Screenshot services help you spot forgotten admin panels and staging environments. The goal is not a giant list; it is a shortlist of assets worth understanding.

### 5. Manual testing and hypothesis-driven work

Automated scanners find known patterns. Bounties increasingly come from understanding an application's logic. Pick one feature, map its states and roles, and ask what the developer assumed. Can a low-privilege user reach an admin function by changing an identifier? Does the password reset flow leak whether an email exists? Can a coupon be applied twice? Does an API trust a client-supplied price?

Learn the common high-impact classes: broken access control (including IDOR), authentication flaws, injection, server-side request forgery, race conditions, business logic errors, and sensitive data exposure. Practice each in a lab until the testing pattern is automatic, then apply it slowly and deliberately to one feature at a time.

### 6. Duplicate avoidance and uniqueness

Duplicates happen when many researchers test the same obvious endpoint with the same payload. Reduce the risk by choosing less-traveled assets, chaining low-severity issues into a higher-impact scenario, and demonstrating a concrete consequence rather than a theoretical one. A reflected cross-site scripting finding on a page with no session and no sensitive action may be marked informational; the same bug in an authenticated admin workflow may be paid.

Before reporting, search the program's disclosed reports and public write-ups for the same endpoint and bug class. Check whether the behavior is already documented as accepted risk. If you find a duplicate, you can still add value by showing a different exploitation path or a related asset that was missed, but do not spam the same issue across subdomains.

### 7. Severity, CVSS, and business impact

CVSS provides a standardized base score from exploitability and impact metrics, but it does not capture business context. A SQL injection on a marketing site with no data may score high and pay little; a subtle authorization flaw exposing payroll data may score medium and pay a lot. Read the program's severity policy, which may use CVSS, the Bugcrowd Vulnerability Rating Taxonomy, or its own matrix.

Write the impact in business terms: whose data, what action, what scale, what detection, what regulatory exposure. If you claim critical severity, show the path from the vulnerability to the consequence. Avoid inflating scores; triagers see it constantly and it damages credibility. If you are unsure, state the assumptions behind your score.

### 8. Report writing

A good report is easy to reproduce and hard to misunderstand. Structure: title, summary, affected asset, prerequisites, numbered reproduction steps, expected versus actual behavior, evidence (redacted requests and responses, screenshots), impact, severity rationale, remediation advice, and any limitations.

Use a dedicated test account and clearly label it. Redact other users' data, tokens, and internal identifiers. Include the exact URL, parameter, and payload, but do not include a weaponized exploit that could harm the service. If the issue is time-sensitive, say so. A concise, precise report often gets triaged faster than a long narrative.

### 9. Disclosure ethics and legal boundaries

Report privately first and follow the program's disclosure timeline. Never use a finding to pressure an organization for more money; that can resemble extortion and may be illegal. Do not access data beyond what is needed to prove the issue, do not download customer records, and stop testing once you have a proof of concept.

Respect privacy laws and platform terms. Do not test third-party services that are out of scope even if a target uses them. Do not use real users' accounts or personal data. If you accidentally access sensitive data, stop, document what happened, and notify the program immediately. Good-faith behavior protects you legally and professionally.

### 10. Tax, contracts, and practicalities

Bounty income is generally taxable in many jurisdictions, but rules differ. Keep records of reports, payments, platform fees, and expenses. Platforms may issue tax forms in some countries; in others you must self-report. Some programs require you to be an individual, others allow companies; sanctions and export rules may restrict who can participate. Consult a qualified accountant or lawyer in your jurisdiction rather than relying on forum advice.

Read the platform's terms on payment timing, currency conversion, and dispute resolution. Understand whether you are an independent contractor and what that means for registration and insurance. Keep your payout account separate from personal accounts for easier bookkeeping. None of this is legal advice; it is a list of questions to ask a professional.

### 11. Automation with judgment

Automation is useful for discovery and repetitive checks, not for spraying payloads at every endpoint. Tools such as subfinder, Amass, httpx, and nuclei help enumerate and test known patterns, but their output needs human validation. A scanner hit is a lead, not a finding. Rate limits exist to protect services; exceeding them can get you banned and may violate the rules.

Build small, auditable scripts that log what they do. Keep a clear separation between passive collection and active testing. Never run aggressive fuzzing against production without explicit permission. The most valuable automation is often a checklist or a note-taking template, not a payload launcher.

### 12. The learning loop and resilience

Track every session: what you tested, what you learned, what you would try next. Review your reports and triage feedback. When a report is marked duplicate or informational, ask why and update your methodology. Follow disclosed reports in your target technology stack; they are free lessons in what programs accept.

Rejection is normal. Burnout is a real risk when income is uncertain. Set time boxes, take breaks, and do not tie self-worth to a triage decision. The researchers who last are the ones who treat bounty work as deliberate practice with a feedback loop, not a lottery.

## Legal and safe practice

Only test assets explicitly listed as in scope, within the stated rules and time window. Authorization comes from the program's published policy or a signed agreement, not from the fact that a site is public. Do not test out-of-scope subsidiaries, third-party providers, or employees.

Never access, modify, or exfiltrate data beyond the minimum needed for a proof of concept. Do not run denial-of-service tests, do not use real user accounts, and do not perform social engineering unless the program explicitly permits it. Stop and report immediately if you encounter sensitive personal data, credentials, or evidence of a real breach.

Use dedicated test accounts and label your traffic so the target can distinguish you from an attacker. Keep evidence secure and redacted. Follow the disclosure timeline and do not publish details before the fix is deployed. If a program asks you to stop, stop.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Web fundamentals | HTTP, sessions, access control | Complete PortSwigger Academy beginner topics | Twenty solved labs with notes on the underlying flaw |
| 2. Guided practice | Common vulnerability classes | Finish Hacker101 and OWASP WSTG readings; solve labs across all major classes | A personal checklist mapping bug class to test method |
| 3. Recon | Asset discovery | Build a recon workflow against your own domain or a permissive program | An asset inventory with sources, screenshots, and confidence |
| 4. First reports | Triage feedback | Report two findings from labs or a VDP; ask for feedback | Two well-structured reports, including one rejected and revised |
| 5. Live programs | Scoped testing | Choose two programs and test one feature area deeply | A testing journal and at least one submitted report |
| 6. Specialization | Depth and reputation | Focus on a technology or bug class; publish sanitized write-ups | A public portfolio and a repeatable personal methodology |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free; account required for CTF progress | Yes | Video lessons and CTF levels covering the core web bug classes |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner to advanced | Free; account optional for progress | Yes | The best structured free lab curriculum for web security |
| [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No, methodology reference | A comprehensive testing methodology and reporting checklist |
| [YesWeHack Dojo](https://dojo-yeswehack.com/) | YesWeHack | Beginner to intermediate | Free account | Yes | Challenge-based practice aligned with bounty skills |
| [PentesterLab](https://pentesterlab.com/) | PentesterLab | Beginner to advanced | Freemium; some exercises free, full access paid | Yes | Focused exercises with badges and explanation |
| [HackerOne Hacktivity](https://hackerone.com/hacktivity) | HackerOne | Intermediate | Free to browse | No | Real disclosed reports showing what gets accepted and paid |

## Official documentation and standards

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — the reference methodology for web application testing.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — the most common web risk categories and their business context.
- [CVSS](https://www.first.org/cvss/) — the scoring standard, including the current specification and calculator.
- [CWE](https://cwe.mitre.org/) — a common weakness taxonomy for consistent finding descriptions.
- [Bugcrowd Vulnerability Rating Taxonomy](https://bugcrowd.com/vulnerability-rating-taxonomy) — a practical severity mapping used by many programs.
- [HackerOne disclosure guidelines](https://www.hackerone.com/disclosure-guidelines) — expectations for coordinated disclosure.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | Browser-based labs | Free | Authorized lab instances only |
| [Hacker101 CTF](https://www.hacker101.com/) | CTF levels | Free | Platform-hosted targets |
| [YesWeHack Dojo](https://dojo-yeswehack.com/) | Challenges | Free account | Platform-hosted targets |
| [PentesterLab](https://pentesterlab.com/) | Guided exercises | Freemium | Platform-hosted targets |
| [TryHackMe](https://tryhackme.com/) | Guided rooms | Freemium | Use only provided machines |
| [Hack The Box](https://www.hackthebox.com/) | Retired machines and challenges | Freemium | Authorized platform targets; retired boxes are best for learning |

## Essential open-source tools

Tools do not replace methodology. A proxy and a notebook outperform a folder of scanners when the bug depends on business logic.

| Tool | Purpose | Official link |
| --- | --- | --- |
| Burp Suite Community Edition | Intercepting proxy and manual testing workbench | [portswigger.net/burp/communitydownload](https://portswigger.net/burp/communitydownload) |
| Caido | Lightweight web security testing proxy with a free tier | [caido.io](https://caido.io/) |
| subfinder | Passive subdomain discovery from public sources | [github.com/projectdiscovery/subfinder](https://github.com/projectdiscovery/subfinder) |
| Amass | Attack surface mapping and asset discovery | [github.com/owasp-amass/amass](https://github.com/owasp-amass/amass) |
| Nuclei | Template-based scanner for known patterns and checks | [github.com/projectdiscovery/nuclei](https://github.com/projectdiscovery/nuclei) |
| ffuf | Fast content and parameter discovery | [github.com/ffuf/ffuf](https://github.com/ffuf/ffuf) |
| ProjectDiscovery toolkit | Recon and testing utilities with documentation | [projectdiscovery.io](https://projectdiscovery.io/) |

## Practical projects and exercises

### Exercise 1: Program selection dossier

Objective: compare three live bounty programs and recommend one for your first month of testing.

Constraints: use only public program pages and disclosed reports; do not test any target yet.

Deliverable: a decision memo with a comparison table (scope size, asset types, payout range if public, response time, competition signals, skill match), a risk assessment, and a ranked shortlist with reasoning. This exercise trains the judgment that prevents wasted months.

### Exercise 2: Recon inventory on a permitted target

Objective: build an asset inventory for a program that allows reconnaissance, or for a domain you own.

Constraints: passive sources first; respect rate limits; do not access non-public systems; redact anything sensitive.

Deliverable: a spreadsheet or database with asset, type, discovery source, first seen, confidence, and screenshot reference. Add a one-page analysis of which three assets you would investigate first and why. If you use a live program, verify its rules permit the techniques you use.

### Exercise 3: End-to-end finding and report

Objective: find a vulnerability in PortSwigger Academy or Hacker101, then write a bounty-quality report.

Constraints: use a lab instance, not a live third-party site; keep the proof of concept minimal; do not include real user data.

Deliverable: a report with title, summary, affected asset, prerequisites, numbered steps, expected versus actual behavior, evidence, CVSS vector and score, business impact, remediation, and a retest plan. Ask a peer to reproduce it from the report alone; revise until they can.

## Common mistakes and misconceptions

1. **Spray-and-pray automation.** Running scanners across every asset produces noise, duplicates, and bans. Use automation for discovery and validate manually.
2. **Testing out of scope.** A public site is not permission. Out-of-scope testing can be illegal and can end your platform account.
3. **Ignoring the rules until after testing.** Read rate limits, prohibited techniques, and account requirements before sending a single request.
4. **Reporting without impact.** "This header is missing" rarely pays. Connect the weakness to a concrete consequence for the organization.
5. **Chasing duplicates.** Testing the most obvious endpoint with the most common payload is a race you will often lose. Go deeper into one feature.
6. **Overclaiming severity.** Inflated CVSS scores and dramatic language damage credibility with triagers.
7. **Exfiltrating data to prove a point.** Accessing more data than necessary is harmful and may be unlawful, even in a bounty context.
8. **Poor reproduction steps.** If a triager cannot reproduce the issue, it may be closed as informational regardless of severity.
9. **Quitting after a few rejections.** Bounty work has a long feedback loop. Track lessons and adjust rather than measuring yourself by payouts.

## Career paths and roles

Bug bounty is a activity, not a job title at most companies. It can lead to application security engineer, penetration tester, security consultant, or product security roles. Some researchers build independent careers, but income is variable and requires business skills beyond testing.

What employers value: a portfolio of disclosed or sanitized reports, evidence of methodical testing, clear writing, and an understanding of remediation. A public HackerOne or Bugcrowd profile helps, but a well-written report on a lab finding can be just as persuasive for a junior role. Certifications are optional; practical evidence matters more.

Realistic entry: junior appsec or QA-adjacent security work while building bounty experience. Adjacent roles include secure code review, security automation, and vulnerability management. Expect to explain your findings to developers; empathy for the fix is part of the job.

## Next steps

1. Complete the PortSwigger Academy access control and authentication labs before testing any live program.
2. Build the program selection dossier and pick one target for a month.
3. Write the end-to-end report in Exercise 3 and have a peer reproduce it.
4. Read the [bug bounty hunter roadmap](../../roadmaps/bug-bounty-hunter.md) and the [ethics policy](../../ETHICS.md).
5. Explore [intermediate training grounds](../../resources/training-grounds/intermediate.md) when the beginner labs feel easy.

## References

1. OWASP, [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/).
2. OWASP, [Top 10](https://owasp.org/www-project-top-ten/).
3. FIRST, [CVSS specification and calculator](https://www.first.org/cvss/).
4. MITRE, [Common Weakness Enumeration](https://cwe.mitre.org/).
5. Bugcrowd, [Vulnerability Rating Taxonomy](https://bugcrowd.com/vulnerability-rating-taxonomy).
6. HackerOne, [disclosure guidelines](https://www.hackerone.com/disclosure-guidelines).
7. HackerOne, [Hacker101](https://www.hacker101.com/).
8. PortSwigger, [Web Security Academy](https://portswigger.net/web-security).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
