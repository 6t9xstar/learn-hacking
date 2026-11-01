# Practical Projects

Reading about security produces recognition; building, breaking, and defending something produces skill. This track is twelve self-contained projects that each end in an artifact another person can inspect: a lab design, a hardening baseline, a detection rule, a vulnerability report, an incident timeline, a forensic analysis, a malware behavior report, a cloud review, and a hardened application. Every project runs on free software in a home lab and stays inside systems you own or are explicitly authorized to test.

`Last reviewed: 2026-10-31`

## How to use this track

- Start with projects 01 and 02 even if you already know the tools. They establish the network boundary, snapshot discipline, and note-taking habits every later project depends on.
- Read the entire project before touching a terminal. The safety and scope section is part of the exercise, not boilerplate.
- Keep one lab notebook from day one. Use [the lab notes template](../templates/lab-notes.md) and record commands, raw output, timestamps, decisions, and dead ends while you work. Notes reconstructed after the fact are obvious and less credible.
- Timebox each session to two or three hours. Stop at a checkpoint, write down where you are, and snapshot the VM before the next step.
- Finish and publish three projects well instead of starting all twelve. Depth is the signal; a half-finished project with a screenshot is not.
- Rebuild at least one environment from your own notes. If the notes are insufficient to reproduce the lab, they are not finished.

## Safety, authorization, and scope

The projects use deliberately vulnerable applications, public training images, synthetic logs, and infrastructure you create. That is the whole point: you get realistic practice without creating victims.

- **Write a scope note for every project, including your own lab.** It takes five minutes and forces you to define targets, time window, permitted techniques, and stop conditions. Keep it in the project folder.
- **Isolate by default.** Vulnerable services live on a host-only or internal virtual network, never bridged to your home LAN, and never exposed to the internet through port forwarding.
- **Use synthetic or public data only.** Do not copy employer logs, customer records, mailboxes, or production disk images into a lab. The forensic projects use public training images and generated evidence for this reason.
- **Do not test systems you do not own.** "It is just a scan" is still unauthorized access in most jurisdictions. Curiosity is not authorization.
- **Stop and report if you find something real.** If a lab mistake exposes a real service, or you stumble on a vulnerability in a system you use, stop testing, preserve what you saw, and report it to the owner through a coordinated disclosure channel.
- **Keep credentials fake.** Use placeholder secrets such as `CHANGEME-lab-only` and never commit real keys, tokens, or passwords, even in a private repository that might later become public.

A scope note you can copy and adapt:

```text
Project:            <project number and name>
Owner:              <your name>
Authorization:      Self-owned lab; no third-party systems in scope
Targets:            192.168.56.0/24 only (lab-ubuntu, lab-kali, lab-target)
Out of scope:       Home LAN 192.168.1.0/24, employer systems, public internet hosts
Time window:        <date> <start> to <date> <end>
Permitted:          Enumeration, authenticated testing of lab apps, log injection, snapshots
Prohibited:         Bridged networking, real credentials, denial-of-service, data exfiltration
Stop conditions:    Unexpected outbound traffic, host instability, any real data encountered
Data handling:      Synthetic only; screenshots redacted before publishing
```

## Project index

| # | Project | Focus | Difficulty | Time | Cost | Key artifact |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [Build a safe home lab](01-home-lab.md) | Virtualization, segmentation, documentation | Beginner–Intermediate | 6–10 h | $0 | Lab charter, topology, connectivity matrix |
| 02 | [Linux hardening baseline](02-linux-hardening.md) | Host hardening, verification | Intermediate | 6–8 h | $0 | Before/after Lynis report, verification script |
| 03 | [Network monitoring](03-network-monitoring.md) | Zeek, Suricata, Wireshark | Intermediate | 8–12 h | $0 | Custom rules, pcap analysis memo |
| 04 | [Log analysis and SIEM](04-log-analysis-siem.md) | Wazuh, detection, triage | Intermediate–Advanced | 8–12 h | $0 | Detection rules, triage report |
| 05 | [Web vulnerability assessment](05-web-vuln-assessment.md) | OWASP WSTG, ZAP, Juice Shop | Intermediate | 6–10 h | $0 | Findings register, evidence pack |
| 06 | [Security report](06-security-report.md) | Professional reporting, CVSS | Intermediate | 4–6 h | $0 | Assessment report with remediation plan |
| 07 | [Incident investigation](07-incident-investigation.md) | Identity incident, timeline | Intermediate–Advanced | 8–12 h | $0 | Timeline, incident report, detection gaps |
| 08 | [Forensic timeline](08-forensics-timeline.md) | Autopsy, TSK, plaso, Volatility | Advanced | 10–16 h | $0 | Super-timeline, forensic report |
| 09 | [Malware behavior report](09-malware-analysis-report.md) | Safe static and dynamic analysis | Intermediate–Advanced | 8–12 h | $0 | Behavior report, YARA and Sigma rules |
| 10 | [Cloud security review](10-cloud-security-review.md) | Terraform, LocalStack, Trivy, Prowler | Intermediate | 6–9 h | $0 | Findings, remediated IaC, teardown log |
| 11 | [Secure web application](11-secure-web-app.md) | ASVS, threat modeling, security tests | Intermediate–Advanced | 8–12 h | $0 | Requirements, tests, CI evidence |
| 12 | [Security portfolio](12-security-portfolio.md) | Sanitization, publishing, narrative | Beginner–Intermediate | 5–8 h | $0 | Public portfolio and three write-ups |

Total effort is roughly 90–120 focused hours. The range is honest: a first virtual machine build, a first Autopsy ingest, or a first SIEM deployment can each consume an evening on their own.

## Learning paths

The projects form a sequence, but they also cluster into roles. Pick a path if you are preparing for a specific job family; do the safety-critical foundations first regardless.

| Path | Sequence | What you can demonstrate at the end |
| --- | --- | --- |
| Blue team and SOC | 01 → 02 → 04 → 07 → 08 | Triage, detection authoring, timeline reconstruction |
| Offensive and AppSec | 01 → 05 → 06 → 11 → 12 | Scoped testing, evidence handling, remediation advice |
| Detection engineering | 01 → 03 → 04 → 07 → 09 | Rules that fire on behavior, not just signatures |
| Cloud and DevSecOps | 01 → 10 → 11 → 12 | IaC review, secure SDLC, cost-safe labs |
| DFIR and malware | 01 → 08 → 09 → 07 | Disk, memory, and behavior analysis with clean evidence |

## Difficulty, time, and scheduling

Difficulty reflects the number of unfamiliar tools, not the value of the project. A beginner can finish project 08 with enough patience, and an experienced analyst can finish project 01 in an afternoon.

| Pace | Schedule | Realistic outcome |
| --- | --- | --- |
| Steady | 2 sessions per week, 2–3 h each | All twelve projects in about four months |
| Intensive | 1 project per week | Portfolio-ready in twelve weeks, thin on reflection |
| Portfolio sprint | 01, 05, 06, 11, 12 | A credible AppSec story in five weeks |
| Blue team sprint | 01, 04, 07, 08, 12 | A credible SOC/DFIR story in six weeks |

Do not compress projects 01 and 02. Every later hour is cheaper when the network boundary and snapshots are correct.

## Prerequisites

You need curiosity, a computer you control, and the willingness to read error messages. Specific baseline skills:

- Comfort with a command line on Windows, macOS, or Linux: changing directories, reading files, editing text.
- Basic networking vocabulary: IP address, subnet, port, DNS, HTTP.
- Ability to install software and reboot your own machine.
- Enough disk for three or four virtual machines. Plan on 80–120 GB free and 16 GB of RAM for comfort; 8 GB works if you run one VM at a time.

Helpful but not required: a second monitor, a GitHub account for publishing sanitized write-ups, and a free account on one training platform for the forensic project.

## Evidence standard

Every project in this track asks for the same underlying evidence, presented differently. Reviewers trust artifacts that show the work, including the parts that failed.

- **Scope and environment:** what was tested, from where, with which tool versions, under which authorization.
- **Reproducible commands:** the actual command line, not a summary.
- **Raw output:** terminal captures, log excerpts, or exported reports, with timestamps.
- **Analysis:** what the output means, alternative explanations you ruled out, and confidence.
- **Limitations:** what you could not see, what the lab could not reproduce, and what you would do with more time.
- **Remediation and retest:** the fix, who owns it, and how you verified it.
- **Reflection:** two or three sentences on what you would change next time.

Name files predictably, for example `2026-10-31-project-05-findings.csv` and `2026-10-31-project-05-evidence/`. Future you will thank present you.

## Portfolio guidance

The portfolio is not a folder of screenshots. It is a small set of artifacts that prove you can scope work, produce evidence, reason about risk, and communicate with people who do not share your vocabulary.

- Choose four to six projects, with two flagship pieces. For most people the strongest pair is a vulnerability assessment plus report (05 and 06) and a detection or DFIR investigation (04 or 07).
- Publish the sanitized artifact and a short narrative: context, constraints, decisions, outcome, what you would do differently. The narrative is what distinguishes a professional from someone following a tutorial.
- Remove or replace client names, real hostnames, public IPs, usernames, tokens, cookies, and personal data. Use documentation ranges such as 192.0.2.0/24 and domains under `example.com` when you need realistic-looking values.
- State the lab context plainly. "Tested against OWASP Juice Shop in an isolated VirtualBox lab" is more credible than implying a real engagement.
- Link the artifact, not just a description. A report nobody can open is a claim.
- Never publish material from a paid course, an active CTF, or an employer without permission.

Project 12 walks through sanitization, publishing, and the review checklist in detail.

## Assessment rubric

Grade yourself honestly after each project. A "3" is what a reviewer would call professional for a junior role.

| Criterion | 1 — Developing | 2 — Competent | 3 — Strong |
| --- | --- | --- | --- |
| Scope and ethics | Scope is vague or implied | Written scope with targets and limits | Scope, stop conditions, and data handling explicit |
| Methodology | Follows steps mechanically | Adapts steps and explains choices | Justifies method against a standard such as WSTG or ASVS |
| Evidence | Screenshots without context | Commands and output captured | Hashes, timestamps, and reproducible evidence trail |
| Analysis | Describes what happened | Explains why it matters | Weighs alternatives, confidence, and business impact |
| Communication | Tool output pasted into a document | Structured write-up | Executive summary plus technical detail for mixed readers |
| Remediation | Generic advice | Specific fix with verification | Prioritized, owned, retested, with residual risk |
| Reflection | Missing | Brief note | Specific changes to method or tooling next time |

## Repository conventions

- Lab notes follow [the template](../templates/lab-notes.md). Every project links back to it because the template is the minimum standard for evidence.
- Code and helper scripts that are small enough to inline live in the project page. Larger helpers belong in `scripts/` if you fork this repository for your own use.
- Tool links point to official project sites or documentation. If a link dies, prefer the vendor's documentation root over a mirror.
- Ethics expectations for all work are in [ETHICS.md](../ETHICS.md). Contribution rules, including the link policy, are in [CONTRIBUTING.md](../CONTRIBUTING.md).

## What this track is not

- It is not a certification and does not substitute for supervised professional practice.
- It does not teach evasion, credential theft, or access to systems you do not own. Those requests are out of scope by design.
- It is not a source of live malware. Project 09 uses a harmless behavior demo and the EICAR test string only.
- It is not a race. Rushing produces reports that fall apart under a single follow-up question.

## Next steps

1. Read [project 01](01-home-lab.md) and block out two sessions this week.
2. Copy the scope note above into `labs/scope.md` and fill it in before you install anything.
3. Open [the lab notes template](../templates/lab-notes.md) and start the first entry with today's date.
4. Skim [project 12](12-security-portfolio.md) now, so you collect publishable evidence from the first project instead of reconstructing it later.
5. When you finish three projects, ask one person who works in security to review the artifacts and tell you what is missing.

## References

1. OWASP Web Security Testing Guide — <https://owasp.org/www-project-web-security-testing-guide/>
2. OWASP Application Security Verification Standard — <https://owasp.org/www-project-application-security-verification-standard/>
3. MITRE ATT&CK knowledge base — <https://attack.mitre.org/>
4. FIRST CVSS specification and calculator — <https://www.first.org/cvss/>
5. NIST NICE workforce framework — <https://www.nist.gov/itl/applied-cybersecurity/nice>

---

**Navigation:** [Repository README](../README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
