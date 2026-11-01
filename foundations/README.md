# Foundations

Security is applied systems knowledge. You cannot reliably find a flaw in a protocol, operating system, or application that you do not understand. These six tracks build the shared base for every roadmap in the repository.

## Start in this order

```text
Cybersecurity fundamentals + Security ethics
                    ↓
        Networking + Linux + Windows
                    ↓
          Programming and automation
                    ↓
         Choose a specialization
```

You do not have to finish every track perfectly before starting a lab. Aim for working fluency, then deepen the foundation as your specialization demands.

## Tracks

| Track | What you learn | Start with | Evidence of completion |
|---|---|---|---|
| [Cybersecurity fundamentals](cybersecurity-fundamentals/README.md) | CIA triad, risk, threats, vulnerabilities, controls, defense in depth, zero trust | The [learning guide](../LEARNING-GUIDE.md) | A one-page risk explanation for a real or imagined system |
| [Security ethics](security-ethics/README.md) | Authorization, scope, law, disclosure, privacy, professional judgment | [ETHICS.md](../ETHICS.md) | A signed-style personal lab rules-of-engagement document |
| [Networking](networking/README.md) | TCP/IP, DNS, HTTP, TLS, routing, firewalls, packet analysis | [Network+ style fundamentals](networking/README.md#structured-learning-path) | Annotated packet capture and network diagram |
| [Linux](linux/README.md) | Shell, filesystem, permissions, processes, services, logs, hardening | OverTheWire Bandit and a lab VM | Hardened Linux VM with before/after evidence |
| [Windows](windows/README.md) | NTFS, registry, identity, event logs, PowerShell, Active Directory basics | Microsoft Learn and a lab VM | Windows event timeline and hardening checklist |
| [Programming](programming/README.md) | Python, Bash, JavaScript, SQL, HTTP APIs, testing | One language, then security automation | A tested log parser or small secure API client |

## How much is enough?

Before selecting a specialization, you should be able to:

- explain what happens between typing a URL and seeing a page, including DNS, TCP, TLS, HTTP, and rendering;
- navigate a Linux system, read permissions, inspect processes and logs, and use SSH;
- explain Windows authentication basics and find common event IDs;
- write a small script that reads a file, makes an HTTP request, handles errors, and avoids hard-coded secrets;
- distinguish a vulnerability, a threat, a risk, and an exploit;
- describe authorization and know when to stop.

You do not need to memorize every port number or command flag. Learn how to find the answer in documentation.

## A note on free labs

Use [beginner training grounds](../resources/training-grounds/beginner.md) for guided practice. Build an isolated lab with [Project 1](../practical-projects/01-home-lab.md) before running potentially disruptive exercises. Read [ETHICS.md](../ETHICS.md) first.

## Next steps

- [Choose a roadmap](../roadmaps/README.md)
- [Free courses](../resources/free-courses/README.md)
- [Drills](../exercises/README.md)
- [Glossary](../glossary/README.md)

---

[Back to repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Contributing](../CONTRIBUTING.md)
