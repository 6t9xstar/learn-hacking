# Windows foundations

[Home](../../README.md) / Foundations / Windows

Windows dominates the corporate desktop and a large share of enterprise servers, and most ransomware incidents you read about end on a Windows host or in an Active Directory domain. Understanding how Windows represents identity, controls access, records events, and manages configuration is therefore core defensive knowledge, not a niche skill.

This guide explains the operating system from a security perspective: how a logon becomes a token, how that token is checked against files and services, where configuration and evidence live, and why Active Directory is both indispensable and dangerous. It assumes you can use Windows but have never administered it.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner to intermediate. Active Directory adds real complexity. |
| Realistic time | 6–8 weeks at 5–7 hours per week, including a two-VM lab. |
| Cost | Free. Evaluation editions are free; a paid licence is only needed for production use. |
| Prerequisites | Comfort with a desktop OS and a command line; networking basics help. |
| Lab requirement | Two VMs for a domain controller and a client, with host-only networking. |
| Evidence of learning | A domain diagram, an audit-policy baseline, and a logon timeline. |

## Why this field matters

Most organisations authenticate people and services through Active Directory, then authorise access through group membership, NTFS permissions, and Group Policy. A single over-privileged service account or a misconfigured delegation setting can give an attacker a path from a help-desk account to domain administrator. Defenders need to see those paths before an adversary walks them.

Windows also produces some of the richest endpoint telemetry available: security event logs, Sysmon, PowerShell script blocks, and Defender detections. The difference between a fast investigation and a week of guesswork is usually knowing which event ID records which action and how long the evidence is retained.

## What you will learn

- Explain the Windows architecture, the registry, and the difference between a user, a token, and a privilege.
- Describe how local and domain authentication work, including NTLM and Kerberos at a conceptual level.
- Read NTFS and share permissions, calculate effective access, and explain inheritance and ownership.
- Navigate Active Directory structure, Group Policy, trusts, and privileged groups.
- Enable and interpret security auditing, Sysmon, and PowerShell logging.
- Use Sysinternals tools to investigate processes, autoruns, and network connections.
- Apply endpoint hardening and explain what each control actually protects.

## Prerequisites and honest expectations

You need a machine with enough RAM to run two Windows VMs (8 GB is tight, 16 GB is comfortable) and the ability to download evaluation images from Microsoft. A domain lab is the single highest-value exercise in this guide; do not skip it because it looks inconvenient.

- Active Directory terminology is dense. Draw the structure before you try to remember it.
- Many security settings only make sense after you have seen the default behaviour, so observe first, then change.
- Windows changes between versions. Note the edition and build when you record evidence.
- You do not need a paid course to learn this, but you do need to read Microsoft's documentation carefully.

## Core concepts

### Architecture, services, and the object model

Windows separates user-mode processes from kernel-mode code. Applications run in user mode and request services through documented interfaces; the kernel, drivers, and the security reference monitor run in kernel mode. Services are long-running user-mode processes managed by the Service Control Manager, often running as dedicated accounts rather than as the logged-in user. Sessions group processes belonging to an interactive logon, which is why a service running in session 0 cannot show a window on a user's desktop.

Windows exposes many resources as objects with security descriptors: files, registry keys, services, processes, and named pipes. A process receives a handle to an object, and the handle carries the access rights that were granted. This is why "the user is an administrator" is not the same as "this process can write to that file"; the token, the object's security descriptor, and the requested access all matter.

### The registry

The registry is a hierarchical configuration database organised into hives: `HKLM` for machine-wide settings, `HKCU` for the current user, and volatile hives for hardware. Keys contain values of various types, and access is controlled by ACLs just like files. Critical hives include `SAM` (local account hashes), `SECURITY` (security policy), and `SYSTEM` (services and drivers).

The registry matters defensively because it is both configuration and persistence. Run keys, services, scheduled tasks, and COM hijacking all live in or reference the registry. Autoruns collects these locations so you can review them deliberately rather than guessing. Registry permissions are also a privilege boundary: a user who can modify a service's `ImagePath` can often execute code as that service's account.

### Identity, SIDs, and access tokens

Every security principal has a security identifier (SID). Local accounts get SIDs from the machine's SAM database; domain accounts get SIDs from the domain. Well-known SIDs identify built-in principals such as `SYSTEM` (S-1-5-18) and the local Administrators group. When a user logs on, the Local Security Authority builds an access token containing the user's SID, group SIDs, and privileges.

User Account Control (UAC) gives administrators a filtered token for normal work and a full token only after elevation. Integrity levels add another check: a medium-integrity process cannot write to a high-integrity object even if the user is an administrator. Service accounts such as `LocalSystem`, `NetworkService`, and group managed service accounts have different privileges and network identities; using a domain user for a service is a common and avoidable risk.

### Authentication: NTLM and Kerberos

Local logons are validated against the SAM database. Domain logons are validated by a domain controller. NTLM uses a challenge-response exchange based on a password-derived hash, which is why stealing the hash can be as useful as stealing the password. Kerberos, the default in modern domains, issues a ticket-granting ticket after authentication, then service tickets for specific resources; service principal names identify those resources.

Both protocols are targets. Password spraying avoids lockout by trying a few common passwords across many accounts; credential dumping targets memory where secrets are cached; relay attacks abuse authentication that is not bound to the channel. Defences are architectural: strong unique passwords, phishing-resistant MFA, protected users, credential guard, SMB and LDAP signing, channel binding, and removing unnecessary NTLM.

### Authorisation: NTFS, shares, and privileges

NTFS permissions are stored in discretionary access control lists (DACLs) made of access control entries. Each entry grants or denies specific rights to a trustee, and inheritance propagates entries from parent folders. Share permissions form a second, coarser check for network access, and the effective permission is the more restrictive combination. Ownership matters because an owner can always change permissions.

Privileges are different from permissions: `SeDebugPrivilege` lets a process open other processes, `SeBackupPrivilege` bypasses some read checks, and `SeImpersonatePrivilege` allows acting as another user. Administrators hold many of these by default, which is why local admin is a serious boundary and why service accounts should not be local admins by habit.

### Active Directory structure and Group Policy

A forest contains one or more domains that share a schema and configuration. Domains contain organisational units (OUs), which hold users, groups, computers, and other objects. Sites map to network locations and control replication. Domain controllers replicate directory data and authenticate logons; DNS is a hard dependency because clients locate domain services through service records.

Group Policy applies settings to sites, domains, and OUs, and it is a major security control surface: password policy, audit policy, firewall rules, software restriction, and endpoint protection settings all flow through it. Privileged groups such as Domain Admins, Enterprise Admins, and Schema Admins are high-value targets, and the `krbtgt` account is critical because its key protects the tickets that underpin domain authentication. Tiered administration, separate administrative accounts, and just-in-time access reduce the blast radius of a stolen credential.

### Event logs and auditing

Windows records events in channels such as Security, System, Application, and PowerShell. Security events depend on audit policy: if logon auditing is not enabled, there is no 4624 to investigate. Useful identifiers include 4624 (successful logon), 4625 (failed logon), 4672 (special privileges assigned), 4688 (process creation), 4720 (user created), and 7045 (service installed). Sysmon adds process, network, file, and registry telemetry that native logs do not provide.

Logs are only useful if they are retained and centralised. Windows Event Forwarding can ship events to a collector, and a SIEM can correlate across hosts. Time synchronisation matters more than most people expect: a timeline built from clocks that disagree is not a timeline. Check retention before an incident, not during one.

### PowerShell and scripting

PowerShell passes objects through a pipeline rather than text, which makes it powerful for administration and for attackers who live off the land. Execution policy is a usability setting, not a security boundary; it can be bypassed trivially. Security comes from application control, constrained language mode, and logging.

Enable PowerShell script block logging (event 4104), module logging, and transcription where policy allows. These records capture code that ran even when the script was not saved to disk. For defensive work, learn to read PowerShell rather than fear it: most enterprise automation uses it, and "PowerShell ran" is not a finding by itself.

### Endpoint protection and hardening

Microsoft Defender provides antivirus, attack surface reduction rules, and exploit protection. Windows Firewall applies profiles for domain, private, and public networks. BitLocker encrypts volumes, Credential Guard isolates derived credentials, and Windows LAPS manages local administrator passwords. AppLocker and WDAC restrict which binaries may run.

Hardening is about reducing paths, not collecting settings. Remove unnecessary local admin rights, disable legacy protocols, restrict PowerShell for non-administrators where feasible, enable tamper protection, and monitor the controls you deploy. A baseline nobody verifies decays within weeks.

### Sysinternals and troubleshooting

Sysinternals is a suite of free Microsoft tools that expose what Windows is actually doing. Process Explorer shows process trees, handles, and loaded modules; Autoruns lists persistence locations; TCPView shows network connections; Process Monitor records file, registry, process, and network activity; PsExec runs commands on remote systems and is therefore also a lateral-movement tool that defenders should monitor.

Use these tools to answer specific questions: which process owns this connection, what launched this child process, which service points to this binary, what changed just before the failure. The value is in the question, not in running every tool once.

### Patching and vulnerability management

Microsoft publishes security updates through the Microsoft Security Response Center and Windows Update. Most enterprises stage updates through rings or WSUS, which means exposure windows depend on policy, not on the day a patch is released. Legacy systems that cannot be patched need compensating controls: network isolation, application allow-listing, and enhanced monitoring.

Prioritise by exploitation evidence and exposure, not by severity alone. An internet-facing service with a known exploited vulnerability is urgent; a local privilege escalation on a segmented, monitored kiosk may wait for the normal cycle.

## Legal and safe practice

Build your lab from evaluation images and keep it on a host-only network. Active Directory labs are powerful and can be dangerous if they touch a real network.

- Never run credential-access, relay, or persistence tools against a domain you do not own, including a school or employer domain.
- Treat lab snapshots as evidence: revert them after experiments and keep notes outside the VM.
- Do not install evaluation software in production or ignore licensing terms.
- If you find a real weakness during authorised work, report it through the agreed channel and do not test further without approval.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Navigation | Learn Computer Management, Event Viewer, registry basics, and PowerShell help. | A one-page map of where settings live |
| 1 | Identity | Create local users and groups, inspect tokens and UAC behaviour. | Notes comparing standard and elevated tokens |
| 2 | Permissions | Build a folder tree with inheritance, explicit denies, and share access. | Effective-access matrix with test results |
| 3 | Domain | Promote a domain controller, join a client, and create OUs and users. | Domain diagram and working logon |
| 4 | Detection | Enable audit policy, install Sysmon, and generate test events. | Event timeline with IDs and explanations |
| 5 | Hardening | Apply a baseline, verify it, and document exceptions. | Checklist mapped to the CIS benchmark |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Microsoft Learn training](https://learn.microsoft.com/training/) | Microsoft | Beginner | Free; optional certification exams are paid | Some sandbox exercises | Windows Server, identity, and security administration |
| [Windows security documentation](https://learn.microsoft.com/windows/security/) | Microsoft | Beginner to advanced | Free | No | Authoritative guidance on controls and baselines |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; several rooms free | Guided Windows labs | Windows fundamentals and enumeration |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Beginner to intermediate | Freemium; some modules free | Guided labs | Active Directory and Windows attack paths |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Intermediate | Freemium; some challenges free | Investigation challenges | Windows event analysis and triage |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [Windows security documentation](https://learn.microsoft.com/windows/security/) | Microsoft | Baselines, identity protection, and hardening guidance |
| [Sysinternals documentation](https://learn.microsoft.com/sysinternals/) | Microsoft | Reference for the toolkit used in investigations |
| [Active Directory Domain Services](https://learn.microsoft.com/windows-server/identity/ad-ds/active-directory-domain-services) | Microsoft | Design, deployment, and operations for AD DS |
| [PowerShell documentation](https://learn.microsoft.com/powershell/) | Microsoft | Language, cmdlets, remoting, and logging |
| [Registry documentation](https://learn.microsoft.com/windows/win32/sysinfo/registry) | Microsoft | How hives, keys, and values are structured |
| [Event Logging](https://learn.microsoft.com/windows/win32/eventlog/event-logging) | Microsoft | The native event log programming model |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| Two-VM domain lab | You, using Microsoft evaluation images | Free | Domain controller, client, OUs, GPO, and auditing |
| [GOAD](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Free, open source | A deliberately vulnerable AD lab for authorised practice |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Guided Windows and AD fundamentals |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Freemium | Structured Windows and AD modules |

Keep the domain controller on an isolated virtual network. A promoted domain controller that can reach the internet is a liability, and a misconfigured DNS service can break your host's name resolution.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Sysinternals Suite | Process, autorun, network, and system investigation | [Microsoft Sysinternals](https://learn.microsoft.com/sysinternals/) |
| PowerShell 7 | Cross-platform automation and administration | [PowerShell](https://github.com/PowerShell/PowerShell) |
| Sysmon | Deep endpoint telemetry for detection and hunting | [Sysmon](https://learn.microsoft.com/sysinternals/downloads/sysmon) |
| BloodHound | Map Active Directory relationships and attack paths | [BloodHound](https://bloodhound.readthedocs.io/) |
| PingCastle | Assess Active Directory security posture | [pingcastle.com](https://www.pingcastle.com/) |
| Event Viewer | Native log review and custom view creation | [Windows documentation](https://learn.microsoft.com/windows/security/) |

Tools do not replace methodology. BloodHound output is a map, not a finding: someone still has to judge which paths matter and whether the underlying permissions are intentional.

## Practical projects and exercises

**Project 1: Build a small domain.**
Objective: understand AD by operating it. Setup: promote a Windows Server evaluation VM to a domain controller, create an OU structure, add users and groups, join a client, and apply two GPOs. Deliverable: a domain diagram, a table of OUs and GPO links, and evidence that policy applied.

**Project 2: Logon timeline and detection.**
Objective: connect audit policy to evidence. Setup: enable logon and process auditing, generate failed and successful logons in the lab, install Sysmon, and collect events 4624, 4625, 4672, and 4688. Deliverable: a timeline with the fields that matter, plus three detection ideas and their false positives.

**Project 3: Endpoint hardening baseline (portfolio-worthy).**
Objective: produce a defensible configuration artefact. Setup: apply a Windows security baseline to the client, enable firewall profiles, ASR rules, LAPS, and PowerShell logging, then verify each setting from the command line. Deliverable: a checklist with setting, rationale, verification command, and rollback note.

## Common mistakes and misconceptions

- **Windows cannot be automated.** PowerShell and Group Policy automate almost everything; the GUI is optional.
- **Execution policy blocks malicious scripts.** It is a usability guard that any attacker can bypass.
- **Administrator means SYSTEM.** They are different principals with different privileges and network identities.
- **NTFS and share permissions are the same.** Effective access is the more restrictive combination.
- **Default audit policy records everything.** Many important events are off until you enable them.
- **Domain Admin everywhere is convenient.** It turns one compromised workstation into a domain-wide incident.
- **The registry is just settings.** It is configuration, persistence, and a permission boundary.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Windows systems administrator | Help desk or desktop support | AD operations, GPO design, and troubleshooting evidence |
| Active Directory engineer | Systems administration | Tiered administration, delegation, and migration work |
| SOC analyst | Windows plus networking | Event analysis, Sysmon, and host triage |
| DFIR analyst | Systems plus forensics interest | Timeline construction and artefact interpretation |

Windows and Active Directory skills are in demand in almost every sector, and they pair naturally with [Linux foundations](../linux/README.md) for hybrid environments. For authorised attack-path practice, continue to [Active Directory](../../additional-topics/active-directory/README.md).

## Next steps

1. Build the two-VM domain lab and take a snapshot of a working domain controller.
2. Enable audit policy and Sysmon, then generate and explain five events.
3. Apply one hardening baseline and verify every setting with a command.
4. Read [Cybersecurity fundamentals](../cybersecurity-fundamentals/README.md) to connect identity controls to risk.
5. Plan the next month with the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md) and [exercises](../../exercises/README.md).

## References

- Microsoft, *Windows security documentation*, <https://learn.microsoft.com/windows/security/>
- Microsoft, *Sysinternals*, <https://learn.microsoft.com/sysinternals/>
- Microsoft, *Active Directory Domain Services*, <https://learn.microsoft.com/windows-server/identity/ad-ds/active-directory-domain-services>
- Microsoft, *Registry*, <https://learn.microsoft.com/windows/win32/sysinfo/registry>
- Microsoft, *PowerShell documentation*, <https://learn.microsoft.com/powershell/>
- Center for Internet Security, *CIS Benchmarks*, <https://www.cisecurity.org/controls>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)
