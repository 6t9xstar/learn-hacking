# Network penetration testing

[Home](../README.md) / Network penetration testing

Network penetration testing asks how far an attacker can get once they can reach a network, and what that access is worth. It covers external exposure, internal segmentation, identity protocols, and the paths between them. The goal is not a list of open ports; it is a defensible story about which paths are real and what they would cost the organisation.

This guide is written for someone who understands TCP/IP and operating systems and wants to test networks methodically and lawfully. Wireless testing is covered in a separate guide; this one treats wireless only as an entry point to the wired network.

> Test only networks you own or are written-authorised to test. Scanning public address space, a school network, or an employer without permission is unauthorised access in many jurisdictions.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Intermediate to advanced. Assumes solid networking and OS knowledge. |
| Realistic time | 4–6 months of part-time study and lab work after the foundations. |
| Cost | Free-first; a local hypervisor and open-source tools are sufficient. |
| Prerequisites | [Networking](../foundations/networking/README.md), [Linux](../foundations/linux/README.md), [Windows](../foundations/windows/README.md), and engagement basics. |
| Lab requirement | A segmented local lab with private addressing and no public exposure. |
| Evidence of learning | A network map, an attack-path narrative, validated findings, and a retest note. |

## Why this field matters

Most large breaches involve lateral movement: an initial foothold on a workstation becomes a domain controller because the network was flat, credentials were reused, and legacy protocols were still enabled. Network testing finds those paths and gives defenders concrete evidence for segmentation, protocol hardening, and detection.

It also validates the controls organisations believe they have. A firewall rule that looks restrictive in a diagram may allow far more than intended; a VLAN that is supposed to isolate guests may route into management. Testing turns assumptions into a reachability matrix.

## What you will learn

- Scope external, internal, and assumed-breach tests and explain what each can prove.
- Discover and inventory assets without touching out-of-scope systems.
- Interpret port-scan results correctly, including filtered ports, UDP, and IPv6.
- Enumerate common enterprise services and map versions to plausible vulnerabilities.
- Explain credential-focused and relay attacks conceptually, and the controls that stop them.
- Validate segmentation with an allowed-and-denied traffic matrix.
- Read packet captures and flow logs to explain what a scan or attack looked like.
- Report an attack path in business terms, with evidence and remediation.

## Prerequisites and honest expectations

You should be comfortable reading a routing table, capturing traffic, and using both Linux and Windows command lines. You should also have read the [ethical hacking guide](../ethical-hacking/README.md), because methodology and authorisation matter more here than tool speed.

- Network testing is slower than web testing. Waiting, coordinating, and documenting are normal.
- Enterprise networks are messy. Legacy devices, undocumented routes, and political boundaries will surprise you.
- A scan is not an assessment. Without validation and context, it is just noise with a timestamp.
- You will need permission for every segment, including "just a quick look" at a management VLAN.

## Core concepts

### Test types and scope

An external test targets what is reachable from the internet: VPN gateways, mail servers, web services, and cloud endpoints. An internal test starts from a network position, often a corporate laptop or a dropped device, and asks what that position can reach. An assumed-breach test starts with a low-privilege domain account and focuses on privilege escalation and lateral movement.

Scope must name IP ranges, domains, network segments, and excluded hosts, plus the source addresses the client should expect. Third-party hosting, shared network equipment, and cloud provider infrastructure may need separate consent. If a segment is not listed, it is out of scope even if it is one hop away.

### Reconnaissance and asset discovery

Start with what is publicly knowable. Certificate transparency logs reveal hostnames; DNS records reveal mail, VPN, and service endpoints; regional internet registries show address ownership; job postings and documentation reveal technology choices. For your own or a client's domain, this builds an asset inventory before a single packet is sent.

Active discovery then resolves names and confirms which addresses respond, within scope. Record the source of every asset and verify ownership before scanning: a shared IP address may host many customers, and an "abandoned" subdomain may belong to a third party. Cloud assets are especially easy to misattribute.

### Host discovery and port scanning

TCP connect scans complete a full handshake and are easy to log; SYN scans are quieter but require privileges. UDP scans are slow and ambiguous because lack of a response can mean open, filtered, or simply not implemented. A filtered port is not the same as a closed one, and ICMP blocking makes hosts look dead when they are not.

Interpret results with the protocol in mind. A port that responds may be a proxy, a load balancer, or a honeypot rather than the application you expect. Scan IPv6 as well as IPv4; many networks are dual-stack and the IPv6 side is less carefully filtered. Rate-limit scans on fragile devices and stop if a host becomes unstable.

### Service enumeration

Enumeration identifies what is behind each port: protocol version, authentication methods, shares, users, and configuration. SMB, LDAP, Kerberos, DNS, SNMP, NFS, RDP, SSH, and databases each expose different metadata. Web services on unusual ports deserve the same treatment as the main application.

Banner-to-CVE matching is a hypothesis, not a finding. Backported patches, custom builds, and compensating controls mean the version string may not reflect exploitability. Confirm with a safe check, read the vendor advisory, and record exactly what you observed. Avoid exploit attempts until you understand the service and the scope permits them.

### Vulnerability assessment and validation

Authenticated scans see patch levels and configuration that unauthenticated scans miss; unauthenticated scans see what an outsider sees. Both produce false positives. Validate each candidate against the actual service, the reachable attack path, and the business context.

Prioritise by exploitability and impact, not by scanner severity. A default SNMP community string on a monitoring VLAN may be low impact; the same string on a core switch may expose the entire topology. Document preconditions, because a vulnerability that requires local access is a different risk from one reachable from the internet.

### Protocol weaknesses in authorised labs

Many enterprise protocols trust the local network. ARP has no authentication, so a host on the same segment can claim another address; LLMNR and NBT-NS let a machine answer for names that DNS could not resolve; DHCP has no built-in server authentication; VLAN hopping abuses trunk configuration; SMB and NTLM relay abuse authentication that is not bound to a channel.

These are lab topics, not production techniques. Study them in an isolated environment and focus on the defences: dynamic ARP inspection, DHCP snooping, disabling LLMNR and NBT-NS, SMB signing, LDAP signing and channel binding, Extended Protection for Authentication, network segmentation, and monitoring for anomalous name resolution. The conceptual understanding is what makes you useful in a design review.

### Credential-focused attacks and Active Directory

Most network intrusions end with credentials rather than exploits. Password spraying tries a few common passwords across many accounts to avoid lockout. Kerberoasting requests service tickets for accounts with service principal names and cracks them offline. AS-REP roasting targets accounts that do not require pre-authentication. Relay attacks forward authentication to another service.

Defences are well known and often incomplete: long unique passwords, managed service accounts, gMSA, tiered administration, protected users, disabling legacy protocols, monitoring for anomalous ticket requests, and removing standing privileges. A network tester should be able to explain the attack path and the control gap without publishing a step-by-step recipe.

### Segmentation and firewall validation

Segmentation is only real if traffic is actually blocked. Build a matrix of source zones, destination zones, ports, and expected results, then test each cell from the correct network position. Include east-west traffic, management networks, backup networks, and out-of-band interfaces. A single permissive rule can collapse an otherwise well-designed architecture.

Test both directions and both protocols. A rule that blocks inbound SMB may still allow outbound SMB to a file server, which is enough for exfiltration. Check IPv6, DNS, and ICMP separately. Document every deviation with the evidence and the likely business owner.

### Firewalls, IDS, and traffic analysis

Stateful firewalls track connections; access control lists do not. Intrusion detection systems see traffic at a point in the network, which means placement determines visibility. Encrypted traffic limits inspection unless TLS interception is deployed, and interception introduces its own risks.

Defenders should know what a scan looks like: many connection attempts, half-open handshakes, unusual protocol combinations, and bursts from a single source. Attackers should know that their traffic is visible. Reviewing captures and flows together often explains an alert faster than either alone.

### Wireless and remote access as entry points

Wireless is a separate discipline with its own hardware and legal considerations. For network testing, treat Wi-Fi as a possible entry path: a guest network that routes into corporate, a pre-shared key shared too widely, or an access point with outdated firmware. The details belong in the [wireless security guide](../wireless-security/README.md).

Remote access deserves equal attention. VPN concentrators, remote desktop gateways, and zero-trust connectors are internet-facing identity systems and frequent initial-access targets. Test authentication, patching, MFA enforcement, and split-tunnel policy within scope.

### Reporting and remediation

A network report should tell a story: where you started, what you could reach, which path mattered, and what to change. Map findings to MITRE ATT&CK where it helps defenders, but keep the narrative readable. Include a network diagram, the reachability matrix, and the evidence for each deviation.

Remediation advice should be specific: disable a protocol, add a rule, split a VLAN, remove a standing privilege, or improve detection. Offer a retest plan and close findings only after verification.

## Legal and safe practice

Use private address space for labs and documentation ranges for diagrams. Never scan address space you do not own, including "just to see" scans of your ISP or a public cloud range.

| Range | Purpose |
| --- | --- |
| 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | Private IPv4 space for lab networks (RFC 1918) |
| 127.0.0.0/8 | Loopback; never a target |
| 169.254.0.0/16 | IPv4 link-local; often indicates a DHCP failure |
| 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 | Documentation examples (RFC 5737) |
| 198.18.0.0/15 | Benchmarking range (RFC 2544); useful for lab diagrams |
| fc00::/7, fe80::/10 | IPv6 unique-local and link-local lab addresses |

- Get written authorisation for every segment, address range, and test window.
- Do not run denial-of-service, destructive, or evasion testing unless it is explicitly scoped and supervised.
- Coordinate with the client's defenders so your scans are not treated as a real incident.
- Protect captured traffic and credentials; they are among the most sensitive artefacts you will handle.
- Stop immediately if a device becomes unstable or you reach data outside the agreed scope.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Foundations | Review TCP/IP, routing, DNS, and both operating systems. | A networking refresher notebook |
| 1 | Lab build | Create three zones with a firewall and private addressing. | Topology diagram and firewall rules |
| 2 | Discovery | Inventory the lab and scan it with documented commands. | Asset and service inventory with evidence |
| 3 | Enumeration | Enumerate SMB, LDAP, DNS, and web services in the lab. | Service notes with versions and configuration |
| 4 | Attack paths | Map a path from a workstation to a high-value host. | Attack-path diagram and impact statement |
| 5 | Segmentation | Build and test an allowed-and-denied matrix. | Matrix with pass/fail evidence |
| 6 | Reporting | Write a network assessment report and retest one fix. | Report plus retest note |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; several rooms free | Guided labs | Network enumeration and exploitation basics |
| [Hack The Box Academy](https://www.hackthebox.com/) | Hack The Box | Beginner to advanced | Freemium; some modules free | Guided labs | Structured network and AD paths |
| [Nmap Network Scanning](https://nmap.org/book/) | Gordon Lyon | Beginner to advanced | Free to read online; print edition paid | No | The definitive guide to scanning and interpretation |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark Foundation | Beginner | Free | Sample captures | Practical traffic analysis skills |
| [GOAD](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Intermediate | Free, open source | Full lab | Active Directory attack paths in a controlled environment |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) | NIST | Assessment planning, execution, and reporting |
| [NIST SP 800-41 Rev. 1](https://csrc.nist.gov/pubs/sp/800/41/r1/final) | NIST | Firewall policy and architecture guidance |
| [CIS Critical Security Controls](https://www.cisecurity.org/controls) | Center for Internet Security | Prioritised safeguards for network and identity |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Mapping observed behaviour to detection and defence |
| [Nmap reference guide](https://nmap.org/book/) | Nmap project | Scanning semantics and output interpretation |
| [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918) | IETF | Private address allocation used in every lab |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| Segmented home lab | You, with a hypervisor and firewall VM | Free | VLANs, routing, firewall rules, and reachability testing |
| [GOAD](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Free | Active Directory enumeration and attack paths |
| [Metasploitable 3](https://github.com/rapid7/metasploitable3) | Rapid7 | Free | Deliberately vulnerable Windows and Linux targets |
| [VulnHub](https://www.vulnhub.com/) | VulnHub | Free | Downloadable vulnerable VMs for local practice |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium | Guided network labs with defined scope |

Use host-only or internal virtual networks and document the topology before you test. A lab that can reach the internet is a lab that can accidentally test someone else's system.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Nmap | Discovery, port scanning, and service identification | [nmap.org](https://nmap.org/) |
| Wireshark and tshark | Packet-level verification of what happened | [wireshark.org](https://www.wireshark.org/) |
| NetExec | SMB, LDAP, and WinRM enumeration in authorised labs | [NetExec](https://github.com/Pennyw0rth/NetExec) |
| Impacket | Protocol tooling for Windows network testing in labs | [Impacket](https://github.com/fortra/impacket) |
| Responder | Study name-resolution poisoning in an isolated lab | [Responder](https://github.com/lgandx/Responder) |
| Zeek | Connection and protocol logs for traffic analysis | [zeek.org](https://zeek.org/) |
| Suricata | Detection and network security monitoring | [suricata.io](https://suricata.io/) |

Tools do not replace methodology. A scan is evidence of a response, not proof of a vulnerability; enumeration is a hypothesis until validated; exploitation is a last resort for proving impact.

## Practical projects and exercises

**Project 1: Segmented lab and reachability matrix (portfolio-worthy).**
Objective: prove that segmentation works or find where it fails. Setup: build three zones (user, server, management) with a firewall VM, define the intended policy, and test every source-destination pair for the relevant ports. Deliverable: topology diagram, firewall ruleset, matrix of expected versus observed results, and remediation for each deviation.

**Project 2: External footprint of a domain you own.**
Objective: practise passive discovery and ownership verification. Setup: use certificate transparency, DNS, and registry data to inventory your own domain or a domain you have written permission to assess; do not scan anything you do not own. Deliverable: an asset inventory with sources, ownership notes, and a prioritised exposure review.

**Project 3: Detection-backed scan.**
Objective: connect testing to defence. Setup: with permission, scan a lab host monitored by Suricata or Zeek, capture the alerts, and compare the defender's view with your command log. Deliverable: a timeline, an assessment of what was visible, and two detection improvements.

## Common mistakes and misconceptions

- **Scanning first, scoping later.** It is the fastest way to commit an unauthorised act.
- **Treating nmap output as truth.** Filtered, closed, and open are different states, and banners lie.
- **Ignoring UDP and IPv6.** Both are commonly forgotten and commonly exposed.
- **Assuming the internal network is trusted.** Flat networks turn one foothold into a domain compromise.
- **Confusing a vulnerability scan with a penetration test.** One lists candidates; the other validates paths and impact.
- **Chasing exploits instead of credentials.** Identity paths usually decide the outcome.
- **Reporting without business context.** "SMB signing disabled" means little until you explain what it enables.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Network security engineer | Network administration | Segmentation design, firewall review, and capture analysis |
| Penetration tester | Networking plus labs | Methodology, validated findings, and clean reports |
| Red team operator | Pentest experience | Objective planning, stealth, and detection awareness |
| SOC analyst | Networking plus operating systems | Explaining alerts in terms of traffic and identity |

Network testing is a strong bridge between infrastructure and security careers. It rewards people who can read a topology, ask good questions, and write clearly.

## Next steps

1. Build the three-zone lab and document the reachability matrix before and after firewall rules.
2. Read the [Nmap book](https://nmap.org/book/) and practise interpreting filtered versus closed ports.
3. Work through a GOAD or VulnHub lab and write an attack-path narrative with evidence.
4. Read [Web application security](../web-application-security/README.md) to cover the services most networks expose.
5. Plan practice with the [beginner roadmap](../roadmaps/beginner-to-ethical-hacker.md) and [training grounds](../resources/training-grounds/beginner.md).

## References

- NIST, *SP 800-115: Technical Guide to Information Security Testing and Assessment*, <https://csrc.nist.gov/pubs/sp/800/115/final>
- NIST, *SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy*, <https://csrc.nist.gov/pubs/sp/800/41/r1/final>
- IETF, *RFC 1918: Address Allocation for Private Internets*, <https://www.rfc-editor.org/rfc/rfc1918>
- IETF, *RFC 5737: IPv4 Address Blocks Reserved for Documentation*, <https://www.rfc-editor.org/rfc/rfc5737>
- Gordon Lyon, *Nmap Network Scanning*, <https://nmap.org/book/>
- MITRE, *ATT&CK*, <https://attack.mitre.org/>
- Center for Internet Security, *CIS Critical Security Controls*, <https://www.cisecurity.org/controls>

---

Last reviewed: 2026-10-31

[Repository home](../README.md) · [Learning paths](../roadmaps/README.md) · [Free courses](../resources/free-courses/README.md) · [Contributing](../CONTRIBUTING.md)
