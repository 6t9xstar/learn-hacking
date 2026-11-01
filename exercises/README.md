# Exercises: Evidence-Based Cybersecurity Drills

[Home](../README.md) / Exercises

This directory contains practice drills, not quizzes. Each drill gives you a small, bounded task, the commands or reasoning steps to attempt it, guidance on what a correct observation looks like, and an artifact you must produce to count the drill as complete. The artifacts are the point: a screenshot of a terminal is weak evidence, while a timestamped command transcript, a parsed log extract, and three sentences of analysis are strong evidence.

The drills assume a disposable lab virtual machine (VM) that you own and can rebuild. They are written for Debian/Ubuntu-style Linux and a local deliberately vulnerable web application, with notes where commands differ on other systems. Read [the ethics policy](../ETHICS.md) before you begin any offensive-adjacent exercise.

> **Responsible use.** Every command and technique here is for systems you own or have explicit written permission to test. Unauthorized access, scanning, credential use, or data access is illegal in most jurisdictions and violates this repository's rules. When in doubt, stop and get written authorization.

## How to use this collection

1. Choose one drill set and read its introduction before running anything.
2. Take a VM snapshot or confirm you can rebuild the VM in under ten minutes.
3. Work through one drill in a single sitting. Most take 30 to 90 minutes.
4. Record commands as you go, including failures. Failures are often the most instructive evidence.
5. Write the "Prove it" artifact before moving on. If you cannot artifact it, you did not complete it.
6. Answer the reflection questions in your own words, then compare with the expected observation.

The drill identifiers (`LX`, `NET`, `WEB`, `BT`) are stable. Cite them in your notebook and in portfolio write-ups so a reviewer can see exactly what you practiced.

## Drill sets at a glance

| Set | Identifier range | Focus | Typical lab requirement |
| --- | --- | --- | --- |
| [Linux drills](linux-drills.md) | LX-01 to LX-24 | CLI fluency, permissions, processes, logs, host hardening | One Linux VM with sudo |
| [Networking drills](networking-drills.md) | NET-01 to NET-24 | Addressing, DNS, HTTP/TLS, capture, segmentation, firewall reasoning | Two Linux VMs or network namespaces |
| [Web security drills](web-security-drills.md) | WEB-01 to WEB-22 | OWASP Top 10 classes against local vulnerable apps | Local Juice Shop and/or PortSwigger labs |
| [Blue team drills](blue-team-drills.md) | BT-01 to BT-22 | Log analysis, triage, detection, ATT&CK mapping, tabletops | Synthetic logs or an isolated SIEM |

## What every drill contains

- **ID and title.** A stable reference such as `LX-05`.
- **Goal.** The capability being practiced, stated as an outcome.
- **Prerequisites.** Tools, access, and prior drills needed.
- **Steps.** Commands or reasoning tasks with context, not copy-paste magic.
- **Expected observation or answer guidance.** What correct looks like, including common false starts.
- **Prove it.** A specific artifact to save.
- **Reflection.** Questions that turn activity into understanding.

## Evidence-based completion

Use this rubric for every drill. Be honest; the rubric is for your learning, not for grading someone else.

| Level | What it looks like | Can you claim completion? |
| --- | --- | --- |
| Not yet | Commands were run, but no artifact and no explanation | No |
| Developing | Artifact exists, but you cannot explain an unexpected result | No |
| Complete | Artifact exists, commands are reproducible, reflection answers the questions | Yes |
| Strong | Complete, plus a limitation, a false-positive analysis, or a safer alternative | Yes, and portfolio-ready |

### Evidence naming convention

Save evidence under a single folder with a predictable name:

```text
~/cyberlab-evidence/
  YYYY-MM-DD_lx-05_suid-audit.txt
  YYYY-MM-DD_lx-05_suid-audit.sha256
  YYYY-MM-DD_lx-05_reflection.md
```

Include the drill ID, the date, and a short slug. If an artifact contains a screenshot, pair it with a text transcript so the content is searchable and accessible.

### What counts as evidence

| Strong evidence | Weak evidence | Not evidence |
| --- | --- | --- |
| Timestamped command transcript with exit codes | A single screenshot with no context | "I read the drill" |
| Redacted configuration diff | A screenshot of a dashboard with no query | A quiz answer copied from elsewhere |
| Log extract with the query that produced it | A claim that a log "looked suspicious" | An AI-generated summary you cannot explain |
| Hash manifest of captured files | A file copied without provenance | A file of unknown origin |

### Sanitizing evidence before sharing

Remove or replace hostnames, usernames, IP addresses outside documentation ranges, tokens, cookies, email addresses, and anything that identifies a real person or employer. Replace secrets with `[REDACTED]` and note that you did so. Never publish a real customer dataset, even a "small sample". See [the report templates](../templates/README.md) for a sanitization workflow.

## Safe-lab rules

- [ ] I own the VM or have written authorization for the environment.
- [ ] The lab network is isolated from production and from untrusted networks.
- [ ] I have a snapshot or rebuild path before changing configuration.
- [ ] I know how to stop the exercise and who to contact if something escapes the lab.
- [ ] I will not scan, exploit, or authenticate against public internet hosts.
- [ ] I will use only synthetic or deliberately vulnerable data.
- [ ] I will not install real malware, steal credentials, or test evasion against third parties.

### Network ranges reserved for documentation

Use these ranges in notes, configs, and examples. They are not routable on the public internet.

| Range | Purpose |
| --- | --- |
| `192.0.2.0/24` | Documentation and examples (TEST-NET-1) |
| `198.51.100.0/24` | Documentation and examples (TEST-NET-2) |
| `203.0.113.0/24` | Documentation and examples (TEST-NET-3) |
| `2001:db8::/32` | Documentation IPv6 |

### Destructive commands

Some drills use `rm`, `ip link delete`, `nft flush`, or service restarts. They are marked with a warning like this:

> **Destructive — lab VM only.** This removes the scratch directory. Confirm the path first with `realpath` and never run it against a path you did not create.

If a command is not marked, it should still be treated as a change to your lab. Snapshot first.

### Stop conditions

Stop the drill and ask for help if any of the following happens:

- A command targets an address you cannot confirm is in your lab.
- You discover real personal data, credentials, or customer records.
- A service becomes reachable from outside the isolated lab network.
- You feel pressure to continue past a boundary to "see if it works".
- You cannot explain what a command will change before running it.

## Suggested learning sequences

| Your goal | Suggested order |
| --- | --- |
| General foundations | LX-01 to LX-08, NET-01 to NET-08, then WEB-01 to WEB-04 |
| Junior SOC analyst | BT-01, BT-02, BT-03, BT-04, BT-10, BT-14, BT-15 |
| Web application tester | WEB-01 to WEB-10, NET-07 to NET-13, then WEB-11 to WEB-22 |
| Host hardening | LX-03 to LX-07, LX-11 to LX-21, then checklists/home-lab.md |
| Incident responder | BT-05 to BT-11, BT-18 to BT-22, then checklists/incident-response.md |

## Build your evidence folder

Run this once per VM. It creates the folder structure and a manifest you can extend.

```bash
mkdir -p ~/cyberlab-evidence/{linux,network,web,blue-team,notes}
chmod 700 ~/cyberlab-evidence
cd ~/cyberlab-evidence
find . -type f -print0 | sort -z | xargs -0 sha256sum > manifest.sha256
```

Record the VM image name, operating system version, and snapshot name in `notes/environment.md`. Reproducibility starts with knowing what you ran.

## Common mistakes

1. **Collecting screenshots instead of data.** A screenshot proves you saw something once; a transcript proves what you ran and what it returned.
2. **Skipping the hypothesis.** Without a prediction, you cannot tell an anomaly from an expected result.
3. **Testing an entire subnet.** Start with one host, one port, one request, and expand only with authorization.
4. **Publishing unsanitized evidence.** Cookies, tokens, and internal hostnames leak easily. Sanitize before sharing.
5. **Confusing a tool's output with an answer.** `nmap` reports open ports; you still have to explain why they matter.
6. **Ignoring negative results.** "No finding" with a reproducible test is a valid, valuable result.

## References

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — test categories and methodology.
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free labs mapped to vulnerability classes.
- [MITRE ATT&CK](https://attack.mitre.org/) — adversary tactics and techniques used in the blue team drills.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response recommendations aligned to CSF 2.0.
- [SANS SIFT Workstation](https://www.sans.org/tools/sift-workstation/) — free forensic analysis environment.

---

**Related:** [Repository home](../README.md) · [Beginner-to-ethical-hacker roadmap](../roadmaps/beginner-to-ethical-hacker.md) · [Training grounds for beginners](../resources/training-grounds/beginner.md) · [Practical projects](../practical-projects/README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md) · [Security policy](../SECURITY.md)

Last reviewed: 2026-10-31
