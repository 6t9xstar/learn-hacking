# The learn-hacking Learning Guide

This guide explains how to use the repository as a curriculum rather than a bookmark folder. It covers choosing a path, building a lab, studying effectively, producing evidence, and knowing when you are ready to move on.

## Table of contents

- [Start with a destination](#start-with-a-destination)
- [The learning loop](#the-learning-loop)
- [Choose one primary path](#choose-one-primary-path)
- [Build your lab before you need it](#build-your-lab-before-you-need-it)
- [Use free resources without drowning](#use-free-resources-without-drowning)
- [A 12-week starter curriculum](#a-12-week-starter-curriculum)
- [Produce evidence, not just notes](#produce-evidence-not-just-notes)
- [Study techniques that survive contact with reality](#study-techniques-that-survive-contact-with-reality)
- [Reading a new topic](#reading-a-new-topic)
- [Knowing when you are ready](#knowing-when-you-are-ready)
- [Avoiding burnout and unethical shortcuts](#avoiding-burnout-and-unethical-shortcuts)
- [Accessibility and different starting points](#accessibility-and-different-starting-points)

## Start with a destination

"Learn cybersecurity" is too broad to act on. Pick a role-shaped destination and a first milestone. Examples:

| Destination | First real milestone | Roadmap |
|---|---|---|
| SOC analyst | Triage 10 alerts and write clear case notes | [SOC analyst](roadmaps/soc-analyst.md) |
| Web security tester | Complete 30 PortSwigger labs and write 3 findings | [Web security](roadmaps/web-security-specialist.md) |
| Cloud security engineer | Review an intentionally misconfigured cloud lab and propose fixes | [Cloud security](roadmaps/cloud-security-engineer.md) |
| Digital forensics investigator | Build a defensible timeline from a public training image | [Digital forensics](roadmaps/digital-forensics.md) |
| Ethical hacker / generalist | Complete foundations, one specialization, and a supervised-style report | [Beginner to ethical hacker](roadmaps/beginner-to-ethical-hacker.md) |

A destination can change. What matters is that each study session has a target and an artifact.

## The learning loop

Use a repeatable loop for every topic:

1. **Orient (15-30 minutes).** Read the guide's introduction, core concepts, and one authoritative overview. Write down five questions you cannot yet answer.
2. **Learn one layer (60-90 minutes).** Study the smallest useful slice. For HTTP, do not study "the web"; study request methods, status codes, and headers. Pause to explain it aloud in plain language.
3. **Practice (60-120 minutes).** Do a lab, reproduce a concept, inspect a capture, write a query, or break a deliberately vulnerable app in your lab. Work without copying a walkthrough first.
4. **Struggle, then get help (15-30 minutes).** Read documentation, then a targeted hint, then a walkthrough. Record what you missed and why.
5. **Produce evidence (30-60 minutes).** Write a short note, finding, diagram, detection rule, or report section. Explain observation, interpretation, and limitation.
6. **Revisit (20 minutes, later).** Redo a small part from memory. Update your notes with a correction.

A reasonable weekly rhythm for a working adult is 6-10 focused hours: two weeknight sessions and one longer weekend lab. Consistency beats heroic weekends.

## Choose one primary path

It is tempting to study web, cloud, malware, and red teaming at once. Breadth feels productive and produces shallow knowledge. Choose one primary roadmap and allow one supporting foundation at a time.

A practical combination:

- **Primary:** web application security.
- **Supporting:** networking and Linux.
- **Maintenance:** one blue-team exercise every two weeks so you understand defenders.

After you can demonstrate primary-path competence, add a second domain. The [cybersecurity engineer roadmap](roadmaps/cybersecurity-engineer.md) is the broadest path; it intentionally builds across systems, network, cloud, and governance.

## Build your lab before you need it

You need a place where breaking things is allowed. Minimum viable lab:

- A computer with at least 16 GB of RAM if possible, virtualization enabled, and 100 GB free disk.
- A hypervisor: VirtualBox, VMware Workstation/Fusion, Hyper-V, or Proxmox on a dedicated host.
- An attack VM such as Kali Linux, and intentionally vulnerable targets such as OWASP Juice Shop or a deliberately vulnerable VM.
- A host-only or internal network so lab traffic does not touch your home network.
- Snapshots before experiments and a documented teardown process.
- A notebook with date, objective, environment, commands, observations, and cleanup.

For malware, forensics, and Active Directory labs, isolation requirements increase. Follow [Project 1: Build a Home Lab](practical-projects/01-home-lab.md) and the [home lab checklist](checklists/home-lab.md).

## Use free resources without drowning

There are thousands of free courses, videos, labs, and write-ups. More is not better. Use this filter:

1. **Authority.** Does the source maintain the material and cite primary documentation?
2. **Currency.** Was it updated recently enough for the technology? HTTP/2 may still be relevant; a 2014 "complete hacking course" is not a substitute for current docs.
3. **Practice.** Can you do something with it, or only watch someone else?
4. **Cost clarity.** Is it actually free, or a free trial that ends before the useful lab?
5. **Fit.** Does it match your current milestone, not your aspiration for next year?

The [resource catalog](resources/README.md) labels cost and access. When a platform is freemium, use the free portion deliberately and do not pay for a subscription until you have exhausted a smaller free lab path.

## A 12-week starter curriculum

This is an example, not a race. At 8-10 hours per week, it builds enough foundation to choose a specialization.

| Week | Focus | Study | Lab / evidence |
|---|---|---|---|
| 1 | Orientation and ethics | Repository guide, [ETHICS.md](ETHICS.md), CIA triad, risk vocabulary | Write a personal lab rules-of-engagement document |
| 2 | Networking I | OSI/TCP-IP, addressing, DNS, HTTP basics | Capture and annotate a DNS lookup and HTTP request |
| 3 | Networking II | TLS, routing, NAT, firewall concepts, segmentation | Draw your home network and a lab network with trust boundaries |
| 4 | Linux I | Filesystem, permissions, processes, package management | Complete 10 OverTheWire Bandit levels and explain each command |
| 5 | Linux II | Services, logs, SSH, users, cron, systemd | Harden a lab VM and produce a before/after checklist |
| 6 | Windows and identity | Users, NTFS, registry, event logs, Active Directory concepts | Analyze 5 synthetic Windows events and write a timeline |
| 7 | Programming and automation | Python/Bash basics, HTTP client, file parsing | Write a safe log parser or API client with tests |
| 8 | Web fundamentals | HTTP, cookies, sessions, same-origin policy, authn vs authz | Map a local Juice Shop request flow |
| 9 | Web vulnerabilities | OWASP Top 10 concepts, safe validation, remediation | Complete 10 beginner PortSwigger labs and write 2 findings |
| 10 | Defensive security | SIEM, log sources, MITRE ATT&CK, alert triage | Triage 5 sample alerts; write detection hypotheses |
| 11 | Cloud and DevSecOps awareness | Shared responsibility, IAM, IaC and CI/CD risks | Review a deliberately misconfigured local lab |
| 12 | Integrate and present | Pick a specialization | Publish a sanitized portfolio project and a 90-day next plan |

Change the order to fit your target. A SOC-focused learner should swap week 9 for more log analysis; a cloud learner should spend two weeks on identity.

## Produce evidence, not just notes

A portfolio is a collection of evidence that you can do work. Weak evidence: "completed TryHackMe room." Strong evidence:

- a scoped lab report with methodology, evidence, impact, and remediation;
- a detection rule with test data and false-positive analysis;
- a forensic timeline with hashes, artifacts, and limitations;
- a threat model with trust boundaries and mitigations;
- a hardened configuration and verification output;
- a cloud review showing before/after policy and cost controls;
- a clean write-up of a CTF challenge you solved independently, with lessons learned.

Sanitize all public artifacts. Never publish client data, live credentials, internal hostnames, personal information, or an unremediated vulnerability in someone else's system.

Use the [report templates](templates/README.md), [lab notebook](templates/lab-notes.md), and [practical projects](practical-projects/README.md).

## Study techniques that survive contact with reality

- **Active recall.** Close the tutorial and reconstruct the concept, command, or attack path on a blank page.
- **Spaced review.** Revisit notes after one day, one week, and one month. Schedule 20-minute reviews.
- **Interleaving.** Mix related problem types after you understand each one. For SQL injection, alternate between reading code, testing a lab, and writing a fix.
- **Explain to a peer.** If you cannot explain why a control exists, you probably memorized a label.
- **Keep an error log.** Record assumptions that turned out wrong. This is more valuable than a collection of successful walkthroughs.
- **Timebox.** If stuck for 30 minutes, write down the exact question and seek a hint. Do not spend four hours fighting a typo.
- **Use documentation first.** Learn to read RFCs, vendor docs, man pages, and source code. Tutorials expire; primary references age better.

## Reading a new topic

Use the "three passes" method:

1. **Map pass.** Skim headings, diagrams, and glossary terms. Identify the system boundary and the core vocabulary.
2. **Mechanism pass.** Read slowly enough to explain how data, identity, or control flows. Draw it.
3. **Failure pass.** Ask where trust boundaries are, what input is attacker-controlled, what happens when a component fails, and how you would detect abuse.

For every control, ask: what does it prevent, what does it detect, what does it not cover, and how would an operator verify it?

## Knowing when you are ready

Do not wait for a certificate to say you are ready, and do not assume a certificate means you are ready. Use exit criteria:

- You can complete a representative task without following a step-by-step walkthrough.
- You can explain your decisions and name their limitations.
- You can find and use primary documentation.
- You can produce a deliverable another professional could review.
- You can work within scope and stop when something is out of bounds.
- You can describe basic remediation, not only exploitation.

Each roadmap includes milestones and exit criteria. Use them honestly.

## Avoiding burnout and unethical shortcuts

- Comparison is not a curriculum. Other learners' GitHub streaks say nothing about your understanding.
- Do not buy expensive "guaranteed job" bootcamps without checking outcomes, refund terms, and independent reviews.
- Do not use exam dumps. They undermine competence and can violate certification agreements.
- Do not copy other people's reports or CTF write-ups as your own. Learn from them, then reproduce and cite.
- Do not chase "advanced" offensive techniques before you can explain the underlying protocol.
- Take breaks. Sleep, exercise, and human contact are part of sustainable learning.
- If the material starts to feel like a competition to access others' systems, revisit [ETHICS.md](ETHICS.md).

## Accessibility and different starting points

You do not need a powerful computer to begin. Browser-based labs, free cloud tiers, and low-resource Linux VMs can take you far. You can start with:

- a modest laptop and browser-based PortSwigger or TryHackMe rooms;
- a Raspberry Pi or old desktop for Linux and networking practice;
- free documentation and public CTF archives when hardware is limited;
- captions, transcripts, and text tutorials when video is not accessible;
- community study groups for accountability.

If English is not your first language, use the glossary and translate concepts into your own words. Contributions of translations are welcome under [CONTRIBUTING.md](CONTRIBUTING.md).

---

[Back to repository home](README.md) · [Roadmaps](roadmaps/README.md) · [Resources](resources/README.md) · [FAQ](FAQ.md)
