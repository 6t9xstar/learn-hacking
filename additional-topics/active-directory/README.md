[Home](../../README.md) / [Additional topics](../README.md) / Active Directory

# Active Directory and Windows Server Security

Active Directory Domain Services (AD DS) is Microsoft's directory service and the identity backbone of most Windows enterprise networks. It stores users, computers, groups, and policy, and it decides who can log on to what. When AD is compromised, the attacker usually inherits the organization. That is why identity is now the front line of enterprise defense.

This guide covers AD architecture, authentication, delegation, certificate services, logging, attack-path analysis, and hardening, plus the Windows Server baseline work that protects the domain controllers themselves. It explains how attacks work conceptually so defenders can recognize them, but it does not provide credential-dumping or exploitation instructions.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Intermediate to advanced; comfortable Windows administration is a prerequisite |
| Realistic time | 3-6 months of lab work to understand design, operations, and defensive monitoring |
| Cost | Free tools and documentation; Windows Server evaluation licenses are free for 180 days |
| Prerequisites | Windows Server administration, DNS, TCP/IP, authentication basics, PowerShell |
| Lab requirement | Essential. At least one domain controller, one member server, and one workstation in an isolated network |

## Why this field matters

Almost every large organization depends on AD for authentication and authorization. A single misconfigured group, an over-privileged service account, or an unmonitored certificate template can create a path from an ordinary workstation to Tier 0. Attackers know this; identity-based intrusions dominate ransomware and espionage cases.

Defenders who understand AD can close those paths before they are used. They can design a tiered administration model, remove legacy authentication, monitor Kerberos anomalies, and audit directory permissions. Windows Server hardening is part of the same job: a domain controller with unpatched services, weak protocols, or excessive local administrators undermines every identity control above it.

## What you will learn

- How domains, forests, sites, organizational units, and domain controllers relate.
- How Kerberos and NTLM authenticate users and services, and where they fail.
- How group membership, ACLs, and tokens produce effective permissions.
- How Group Policy applies and how to use it for hardening.
- What Tier 0 means and how to design privileged access that resists compromise.
- How AD Certificate Services and delegation create both convenience and risk.
- Which Windows events and directory telemetry answer security questions.
- How to audit and harden a domain using BloodHound, PingCastle, Purple Knight, and Microsoft baselines.

## Prerequisites and honest expectations

You should be able to install Windows Server, promote a domain controller, join a workstation, create users and groups, and read Event Viewer. You should understand DNS well enough to troubleshoot SRV records, and you should be comfortable with PowerShell. Familiarity with Linux helps because many lab and analysis tools run there.

Expect a lot of terminology and a lot of interdependencies. Do not try to memorize every event ID; learn the authentication flow and the events follow logically. Also expect to break your lab. Snapshots and a documented rebuild procedure are part of the skill, not evidence of failure.

## Core concepts

### 1. Domains, forests, trees, and sites

A domain is an administrative and replication boundary with its own directory database. A forest is the security boundary: all domains in a forest share a schema, configuration, and global catalog, and they trust each other by default. A tree is a set of domains that share a contiguous DNS namespace. Sites map physical network topology to replication and client logon behavior.

Domain controllers (DCs) hold the directory and authenticate principals. The global catalog holds a partial replica of every object in the forest for cross-domain searches. Flexible Single Master Operations (FSMO) roles handle operations that cannot be multi-master, such as schema changes and RID allocation. Know which DC holds which role before an incident; losing a FSMO holder changes the recovery plan.

### 2. Identity objects and effective access

Users, computers, groups, and service accounts are security principals identified by a security identifier (SID). Groups can nest, and a user's access token contains the SIDs of all groups, including nested ones, plus special identities such as Domain Admins and Everyone. Access is decided by comparing the token to the discretionary access control list (DACL) on an object.

Effective access is often surprising. An account may be a member of a group nested inside a privileged group, or may hold write permissions on an object that lets it grant itself more access. Permissions on OUs, GPOs, and the domain object matter as much as group membership. Auditing "who is an admin" is not enough; you must audit "who can become an admin".

### 3. Kerberos authentication

Kerberos is the default authentication protocol in AD. The client sends an Authentication Service request (AS-REQ) to the Key Distribution Center on a DC and receives a Ticket Granting Ticket (TGT) encrypted with the client's key. When the client needs a service, it sends a Ticket Granting Service request (TGS-REQ) for a service principal name (SPN) and receives a service ticket.

The service ticket contains a Privilege Attribute Certificate (PAC) describing the user's group membership. Service accounts decrypt tickets with their own keys, which is why service-account password strength matters. Kerberos is sensitive to time skew (usually five minutes), DNS, and SPN registration. Common defensive concerns include weak service-account passwords, unconstrained delegation, and tickets with anomalous encryption types or lifetimes.

### 4. NTLM and legacy authentication

NTLM is a challenge-response protocol still used for compatibility. The server sends a challenge, the client returns a response derived from a password hash, and the server validates it. NTLM does not provide mutual authentication in the same way Kerberos does and is vulnerable to relay attacks when message signing and channel binding are not enforced.

Most mature environments are reducing NTLM, but legacy applications, appliances, and hard-coded service configurations keep it alive. Audit NTLM usage before disabling it. Monitor for NTLM authentication where Kerberos should be used; it can indicate misconfiguration or an attempt to bypass modern controls.

### 5. Group Policy

Group Policy Objects (GPOs) apply configuration to users and computers. Processing order is local policy, site, domain, then organizational unit, with lower-level settings generally winning unless enforced. Security filtering and WMI filters narrow which principals receive a GPO. Loopback processing changes how user policy applies on shared computers.

GPOs are a powerful hardening tool: password and lockout policy, audit policy, restricted groups, Windows Defender settings, SMB signing, LDAP signing, and firewall rules. They are also a privilege-escalation target, because whoever can edit a GPO linked to a privileged OU can configure code or settings that affect privileged users. Treat GPO editing rights as Tier 0 access and monitor changes to `gPLink` and GPO contents.

### 6. Privileged access and the tier model

The tier model separates administration by the sensitivity of the systems being managed. Tier 0 includes the forest, domain controllers, AD CS, and identity systems. Tier 1 includes enterprise servers and applications. Tier 2 includes user workstations and devices. Credentials for a higher tier must never be exposed on a lower-tier system.

Practical controls: dedicated privileged access workstations (PAWs), jump servers, separate admin accounts, credential Guard where supported, Local Administrator Password Solution (LAPS) for local accounts, and time-bound elevation. Microsoft's Enterprise Access Model and "securing privileged access" guidance describe the target state. The goal is not to eliminate administrators; it is to ensure that compromising a laptop does not yield domain-wide credentials.

### 7. AD Certificate Services and PKI

AD Certificate Services (AD CS) issues certificates for authentication, encryption, and device identity. A certification authority (CA) has a CA certificate and private key; templates define who may enroll and what the certificate can do. Misconfigured templates or enrollment permissions can let a low-privileged user obtain a certificate that authenticates as a privileged account.

From a defensive perspective: inventory every CA and template, review enrollment permissions and subject-name settings, require manager approval where appropriate, retire legacy templates, and monitor certificate issuance. Treat CA private keys and CA servers as Tier 0. This guide does not describe exploitation steps; the goal is to recognize risky configuration and fix it.

### 8. Delegation and trusts

Delegation allows a service to act on behalf of a user. Unconstrained delegation gives the service the user's TGT and is dangerous; constrained delegation limits the service to specific target services; resource-based constrained delegation moves control to the target resource. Modern designs prefer constrained or resource-based delegation and avoid unconstrained delegation except on tightly controlled Tier 0 systems.

Trusts connect domains and forests. A forest trust allows authentication across forests with configurable direction and transitivity. SID filtering, selective authentication, and quarantine settings limit what can cross a trust. Trust relationships are often overlooked during incidents; map them and verify that a compromise in one forest cannot silently extend into another.

### 9. Logging and detection

Enable advanced audit policy through GPO: logon/logoff, account management, directory service access, privilege use, and process creation with command line where appropriate. High-value Security events include 4624 (successful logon), 4625 (failed logon), 4648 (explicit credentials), 4662 (directory object access), 4672 (special privileges), 4720 (account created), 4728 and 4732 (group membership changes), 4768 (TGT request), 4769 (service ticket request), 4771 (Kerberos pre-authentication failure), and 4776 (NTLM validation).

Event 4662 is noisy and depends on SACLs; configure directory object auditing deliberately. Windows event forwarding or an agent should ship logs to a SIEM promptly, because attackers often clear logs or disable services. Correlate authentication events with endpoint process telemetry and network flows; directory logs alone rarely tell the whole story.

### 10. Attack-path analysis

Attack-path tools model relationships between principals and privileged targets. BloodHound collects directory and session data and visualizes paths such as "user is member of a group that has GenericAll on an OU that contains a server where a Domain Admin is logged on". PingCastle and Purple Knight perform configuration risk assessments with concrete findings and scores.

These tools are defensive as well as offensive. Run them with written authorization, scope them to the directory, and treat the output as a remediation backlog. The most common findings are excessive group membership, stale accounts, unconstrained delegation, weak ACLs, and legacy protocols. Fix the paths, then re-run to verify.

### 11. Hardening Windows Server and domain controllers

Baseline every server, then apply stricter controls to DCs. Priorities: patch promptly, minimize installed roles, remove unnecessary services, enforce SMB signing and LDAP signing with channel binding, disable SMBv1 and NTLMv1, require Kerberos, restrict local administrators, enable Windows Defender and attack surface reduction rules, configure the firewall, and enable PowerShell logging.

Use Microsoft security baselines and CIS Benchmarks as starting points, but test changes in a lab. Back up DCs with system state backups, verify restore procedures, and protect backup infrastructure as Tier 0. Restrict who can log on locally to a DC, disable cached credential exposure where feasible, and monitor for changes to security policy and audit configuration.

### 12. Designing an isolated lab and recovering it

A useful AD lab has at least one DC, one member server, and one workstation, all on a host-only network with no route to the internet. Use evaluation media from Microsoft, snapshot every stage, and keep a build script or checklist so you can rebuild quickly. Synthetic users and deliberately vulnerable settings are fine in the lab; never replicate them in production.

Test recovery, not just backup. Promote an additional DC, simulate failure, and practice seizing FSMO roles. A domain that cannot be restored is a business continuity problem regardless of how well it is hardened.

## Legal and safe practice

Active Directory testing is intrusive. Only enumerate, query, or modify a domain you own or have explicit written authorization to assess. Running BloodHound or PingCastle against a client domain without permission can violate computer misuse and privacy laws, even if the tools only read data.

Keep labs isolated. Do not connect a deliberately vulnerable domain to your home network or the internet. Do not use real employee credentials or production data in a lab. If you discover a genuine compromise during an assessment, stop, preserve evidence, and notify the engagement lead and client according to the agreed escalation path.

Credential theft and dumping are harmful and illegal outside authorized testing. This guide intentionally omits those procedures. Defenders should focus on preventing credential exposure, reducing privileged attack paths, and detecting anomalous authentication.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Administration | Build and operate a domain | Install a DC, create OUs, users, groups, and a member server | A working lab diagram and build checklist |
| 2. Authentication | Kerberos and NTLM | Trace a logon with Event Viewer and network capture in the lab | A written explanation of the ticket flow with observed events |
| 3. Policy and hardening | GPO and baselines | Apply a Microsoft or CIS baseline and document deviations | A hardening report with before/after settings |
| 4. Attack paths | Directory analysis | Run BloodHound, PingCastle, and Purple Knight in the lab | A risk register with owners and remediation steps |
| 5. Detection | Audit policy and SIEM | Forward DC logs and write five authentication detections | A detection pack with tests and false-positive notes |
| 6. Recovery | Backup and restore | Back up a DC, simulate failure, and restore or seize roles | A tested recovery runbook with timings |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Microsoft Learn training](https://learn.microsoft.com/training/) | Microsoft | Beginner to advanced | Free; some labs require an account | Some | Official Windows Server and identity learning paths |
| [TryHackMe Active Directory rooms](https://tryhackme.com/) | TryHackMe | Beginner to intermediate | Freemium; some rooms free, paths require subscription | Yes | Guided AD enumeration and defense labs |
| [Game of Active Directory](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Intermediate to advanced | Free, self-hosted | Yes | A realistic multi-host vulnerable AD lab for practice |
| [The Hacker Recipes](https://www.thehacker.recipes/) | Community project | Intermediate to advanced | Free | No | Detailed notes on AD concepts and enterprise attack paths |
| [BloodHound documentation](https://bloodhound.specterops.io/) | SpecterOps | Intermediate | Free | Yes, with a lab | Graph-based attack-path analysis and collection guidance |
| [Purple Knight](https://www.purple-knight.com/) | Semperis | Intermediate | Free community tool | Yes | A configuration risk assessment with actionable findings |

## Official documentation and standards

- [Active Directory Domain Services overview](https://learn.microsoft.com/windows-server/identity/ad-ds/active-directory-domain-services) — the starting point for architecture and deployment.
- [Best practices for securing Active Directory](https://learn.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory) — Microsoft's defensive baseline for AD.
- [Securing privileged access](https://learn.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access) — the tier model, PAWs, and credential hygiene.
- [Active Directory Certificate Services overview](https://learn.microsoft.com/windows-server/identity/ad-cs/active-directory-certificate-services-overview) — PKI design and operational guidance.
- [Windows security baselines](https://learn.microsoft.com/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines) — Microsoft's recommended settings for Windows Server and clients.
- [Kerberos authentication overview](https://learn.microsoft.com/windows-server/security/kerberos/kerberos-authentication-overview) and [NTLM overview](https://learn.microsoft.com/windows-server/security/kerberos/ntlm-overview) — protocol behavior and limitations.
- [Windows Security auditing reference](https://learn.microsoft.com/windows/security/) — event and policy documentation for detection work.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [Game of Active Directory](https://github.com/Orange-Cyberdefense/GOAD) | Vulnerable multi-host AD range | Free, self-hosted | Isolated network only; intentionally insecure |
| [DetectionLab](https://github.com/clong/DetectionLab) | Monitored AD environment | Free, self-hosted | Build with no route to production |
| [BadBlood](https://github.com/davidprowe/BadBlood) | AD data generator for lab enrichment | Free | Fills a lab domain with realistic objects; lab only |
| [TryHackMe](https://tryhackme.com/) | Guided AD rooms | Freemium | Platform-hosted targets only |
| [Hack The Box Pro Labs](https://www.hackthebox.com/hacker/pro-labs) | Enterprise-style ranges | Paid | Authorized platform; stay inside the range |
| [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) | Windows Server evaluation media | Free, time-limited | Use for building your own isolated lab |

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| BloodHound | Graph analysis of directory relationships and attack paths | [bloodhound.specterops.io](https://bloodhound.specterops.io/) |
| PingCastle | AD security assessment and risk scoring | [pingcastle.com](https://www.pingcastle.com/) |
| Purple Knight | Community AD and Entra ID exposure assessment | [purple-knight.com](https://www.purple-knight.com/) |
| DSInternals | Directory and credential-related research utilities for authorized testing | [github.com/MichaelGrafnetter/DSInternals](https://github.com/MichaelGrafnetter/DSInternals) |
| Active Directory Explorer | Read-only directory browsing and snapshot comparison | [Microsoft Sysinternals](https://learn.microsoft.com/sysinternals/downloads/adexplorer) |
| LAPS | Local administrator password management built into Windows | [LAPS overview](https://learn.microsoft.com/windows-server/identity/laps/laps-overview) |

## Practical projects and exercises

### Exercise 1: Build and document a small AD forest

Objective: create an isolated lab with one forest, one domain, two OUs, a domain controller, a member server, and a workstation.

Constraints: host-only networking, evaluation media, snapshots before each major change, no internet-facing services.

Deliverable: a build runbook with IP plan, DNS configuration, OU design, group design, GPO links, snapshot names, and a tested restore procedure. Include a table of FSMO role holders and a diagram of trust and replication relationships.

### Exercise 2: Attack-path assessment and remediation plan

Objective: assess your lab domain with BloodHound, PingCastle, and Purple Knight, then prioritize fixes.

Constraints: run tools only against your lab; do not ingest production data; capture findings before remediation.

Deliverable: a risk register with finding, evidence, affected principals, business impact, remediation, owner, and verification step. Re-run the tools after remediation and include a before/after comparison. This is a strong portfolio artifact for identity or blue team roles.

### Exercise 3: Authentication detection pack

Objective: enable advanced audit policy, generate benign authentication events in the lab, and build five detections.

Constraints: use synthetic accounts; do not simulate destructive attacks; test both positive and negative cases.

Deliverable: five Sigma or SIEM rules covering failed logon bursts, Kerberos pre-authentication failures, service ticket anomalies, privileged group changes, and directory object access. Include the query, test evidence, false positives, and a short incident response note for each.

## Common mistakes and misconceptions

1. **Treating Domain Admins as the only privileged group.** Account Operators, Backup Operators, GPO editors, AD CS officers, and delegated OU admins can often reach Tier 0 indirectly.
2. **Focusing on servers and ignoring workstations.** A compromised workstation with a cached privileged session is a common path into the domain.
3. **Leaving legacy protocols enabled for convenience.** NTLMv1, SMBv1, unsigned LDAP, and unconstrained delegation are recurring root causes.
4. **Believing BloodHound is only an attacker tool.** It is one of the most effective defensive remediation tools when run with authorization.
5. **Auditing group membership but not ACLs.** Permissions on OUs and objects can grant effective control that group reports miss.
6. **Ignoring AD CS until it is abused.** Certificate templates and CA permissions are Tier 0 assets and need continuous review.
7. **Applying hardening baselines without testing.** A baseline can break applications, replication, or authentication; pilot and document exceptions.
8. **Assuming backups are enough.** An untested restore is a hope, not a recovery capability.

## Career paths and roles

Entry points include Windows Server administrator, identity and access management (IAM) analyst, and SOC analyst with an identity focus. Specializations include Active Directory security engineer, identity architect, penetration tester, and incident responder. Cloud identity (Entra ID) is a natural extension; hybrid identity is where many organizations need help.

What employers value: hands-on directory administration, evidence of hardening and recovery work, familiarity with AD CS and delegation, and the ability to explain risk to both engineers and executives. Certifications can help with fundamentals, but a documented lab assessment and a tested recovery runbook are stronger signals.

Be realistic: pure "AD security" roles are often titled identity engineer, security consultant, or Windows infrastructure engineer. Build adjacent skills in PowerShell, logging, and cloud identity to broaden the path.

## Next steps

1. Build the lab in Exercise 1 and keep a build notebook with screenshots and decisions.
2. Run the assessment in Exercise 2 and fix the top three findings.
3. Write the detection pack in Exercise 3 and test it with benign activity.
4. Read the [SOC analyst roadmap](../../roadmaps/soc-analyst.md) if detection is your focus, or the [red team operator roadmap](../../roadmaps/red-team-operator.md) for authorized adversary emulation.
5. Review the [ethics policy](../../ETHICS.md) and [intermediate training grounds](../../resources/training-grounds/intermediate.md) before expanding the lab.

## References

1. Microsoft, [Active Directory Domain Services overview](https://learn.microsoft.com/windows-server/identity/ad-ds/active-directory-domain-services).
2. Microsoft, [Best practices for securing Active Directory](https://learn.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory).
3. Microsoft, [Securing privileged access](https://learn.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access).
4. Microsoft, [Active Directory Certificate Services overview](https://learn.microsoft.com/windows-server/identity/ad-cs/active-directory-certificate-services-overview).
5. Microsoft, [Windows security baselines](https://learn.microsoft.com/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines).
6. Microsoft, [Kerberos authentication overview](https://learn.microsoft.com/windows-server/security/kerberos/kerberos-authentication-overview).
7. Microsoft, [NTLM overview](https://learn.microsoft.com/windows-server/security/kerberos/ntlm-overview).
8. SpecterOps, [BloodHound documentation](https://bloodhound.specterops.io/).
9. CIS, [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
