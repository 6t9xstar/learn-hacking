[Home](../README.md) / Additional topics

# Additional Topics

The core curriculum covers foundations, offensive security, defensive operations, and the major application domains. This section collects the specialist topics that do not fit neatly into a single category: 19 requested subjects organized across 16 directories. Some directories intentionally cover more than one subject because the work overlaps in practice.

Use this page as a map, not a checklist. Pick a direction, confirm the prerequisites, and follow the linked guide. Every guide follows the same structure: core concepts, legal boundaries, a staged learning path, free resources, official documentation, labs, tools, exercises, mistakes, and careers.

## How the 19 topics map to 16 directories

| Directory | Topic or topics covered | Guide | Best for |
| --- | --- | --- | --- |
| `bug-bounty/` | Bug bounty hunting, program selection, reporting | [Bug bounty](bug-bounty/README.md) | Web testers building a public track record |
| `active-directory/` | Active Directory and Windows Server security | [Active Directory](active-directory/README.md) | Windows admins, SOC analysts, identity engineers |
| `cryptography/` | Applied cryptography, TLS, PKI, post-quantum awareness | [Cryptography](cryptography/README.md) | Developers and security engineers |
| `osint/` | Open-source intelligence and verification | [OSINT](osint/README.md) | Threat intel, investigations, due diligence |
| `iot-security/` | IoT and embedded device security | [IoT security](iot-security/README.md) | Product security and network defenders |
| `hardware-security/` | Hardware attacks, secure elements, physical interfaces | [Hardware security](hardware-security/README.md) | Embedded and hardware researchers |
| `blockchain-security/` | Blockchain and smart contract security | [Blockchain security](blockchain-security/README.md) | Web3 developers and auditors |
| `ai-security/` | AI and machine learning security | [AI security](ai-security/README.md) | ML engineers and security architects |
| `devsecops/` | CI/CD, infrastructure as code, supply chain security | [DevSecOps](devsecops/README.md) | DevOps and platform engineers |
| `application-security/` | Web, API, and product security; secure SDLC | [Application security](application-security/README.md) | Developers and appsec engineers |
| `exploit-development/` | Vulnerability research, fuzzing, mitigations | [Exploit development](exploit-development/README.md) | Advanced offensive practitioners |
| `threat-intelligence/` | Cyber threat intelligence production and sharing | [Threat intelligence](threat-intelligence/README.md) | SOC, intel, and hunting teams |
| `security-architecture/` | Zero trust, segmentation, cloud and system design | [Security architecture](security-architecture/README.md) | Senior engineers and architects |
| `governance-risk-compliance/` | Frameworks, risk, audit, privacy, policy | [Governance, risk, and compliance](governance-risk-compliance/README.md) | GRC, audit, and management roles |
| `linux-security/` | Linux hardening, MAC, auditing, containers | [Linux security](linux-security/README.md) | Sysadmins, SREs, cloud engineers |
| `career-development/` | Portfolio, interviews, certifications, community | [Career development](career-development/README.md) | Anyone planning the next role |

## Where the overlapping topics live

Three requested subjects do not have their own directory because they are inseparable from a parent topic.

**Windows Server security** is covered inside [Active Directory](active-directory/README.md). Domain controllers are Windows Servers, and most Windows Server hardening questions in an enterprise context involve AD: tiered administration, Group Policy baselines, LDAP and SMB signing, LAPS, AD CS, and domain controller recovery. The guide includes a dedicated hardening section and a Windows Server baseline exercise.

**Smart contract security** is covered inside [Blockchain security](blockchain-security/README.md). Smart contracts are the executable layer of most blockchain applications; auditing them requires the blockchain model, the virtual machine, and the deployment and upgrade patterns covered in that guide.

**Secure software development lifecycle (SSDLC)** is shared between [Application security](application-security/README.md) and [DevSecOps](devsecops/README.md). Application security covers threat modeling, secure design, code review, and verification. DevSecOps covers the automation that makes those practices continuous: pipeline controls, infrastructure as code, artifact signing, and supply chain security. Read both if you own a product end to end.

## Choose a direction

### Defensive operations

Start with [SOC and blue team](../soc-blue-team/README.md), then add [Threat intelligence](threat-intelligence/README.md), [Active Directory](active-directory/README.md), and [Linux security](linux-security/README.md). The [SOC analyst roadmap](../roadmaps/soc-analyst.md) sequences the first year. Governance and privacy context comes from [GRC](governance-risk-compliance/README.md).

### Offensive security

Build foundations first, then choose a specialization. [Red team](../red-team/README.md) covers authorized adversary emulation; [Bug bounty](bug-bounty/README.md) covers web and API testing against live programs; [Exploit development](exploit-development/README.md) covers low-level vulnerability research. The [red team operator roadmap](../roadmaps/red-team-operator.md) and [bug bounty hunter roadmap](../roadmaps/bug-bounty-hunter.md) show the progression.

### Building and securing products

[Application security](application-security/README.md) and [DevSecOps](devsecops/README.md) are the core. Add [Cryptography](cryptography/README.md) for data protection, [AI security](ai-security/README.md) for model and data risks, and [Blockchain security](blockchain-security/README.md) if you work in Web3. [Security architecture](security-architecture/README.md) ties the design together.

### Embedded and connected systems

[IoT security](iot-security/README.md) covers devices, firmware, and protocols. [Hardware security](hardware-security/README.md) goes deeper into physical interfaces, secure elements, and side channels. [Linux security](linux-security/README.md) provides the host hardening foundation both depend on.

### Leadership, risk, and career growth

[Security architecture](security-architecture/README.md) and [GRC](governance-risk-compliance/README.md) build the design and assurance perspective. [Threat intelligence](threat-intelligence/README.md) adds adversary context. [Career development](career-development/README.md) helps you turn all of it into a portfolio and a plan.

## Prerequisites that apply everywhere

Most of these topics assume the same base: networking (TCP/IP, DNS, HTTP), operating system fundamentals (Windows and Linux), basic scripting, and a working understanding of authentication and authorization. If those are shaky, spend time in the foundations section before starting a specialist guide.

Two habits matter more than any prerequisite. First, keep a lab notebook with dates, commands, observations, and sources. Second, write. Every topic here produces artifacts: a report, a rule, a diagram, a threat model, a hardened build. Those artifacts are how you prove learning and how you help the next person.

## Safety and ethics across topics

Every guide repeats the same boundaries because they apply everywhere: test only systems you own or have explicit written authorization to test, keep vulnerable labs isolated, protect other people's data, and stop when you encounter something outside your authority.

Some topics add specific constraints. Hardware and IoT work involves physical safety and radio regulations. OSINT involves privacy law and the risk of enabling harassment. Exploit development can produce dangerous capability. Cryptography and bug bounty work can affect real users if handled carelessly. Read each guide's legal section before the exercises, not after.

The repository-wide [ethics policy](../ETHICS.md) is the baseline. It is short; read it once and revisit it when a task feels ambiguous.

## Cross-cutting resources

- [Intermediate training grounds](../resources/training-grounds/intermediate.md) for labs that go beyond the beginner paths.
- [Ethics policy](../ETHICS.md) for authorization, disclosure, and data handling expectations.
- [Repository resources](../resources/README.md) for the full catalogue of free material.
- [SOC analyst roadmap](../roadmaps/soc-analyst.md), [red team operator roadmap](../roadmaps/red-team-operator.md), and [bug bounty hunter roadmap](../roadmaps/bug-bounty-hunter.md) for sequenced plans.
- [Core category guides](../README.md) for foundations, network penetration testing, web application security, cloud security, digital forensics, malware analysis, wireless security, and mobile security.

## How to use a guide

Each guide is designed to be read once and then used as a reference. A practical sequence:

1. Read the introduction, at-a-glance table, and prerequisites.
2. Skim the core concepts, then return to the ones that are unfamiliar.
3. Read the legal and safe practice section before touching a lab.
4. Follow the structured learning path and complete the exercises.
5. Pick one portfolio project and finish it end to end.
6. Use the mistakes section as a review checklist for your own work.
7. Check the references and official documentation when a detail matters.

Do not try to complete every topic. Depth in one area plus literacy in adjacent areas is more valuable than a shallow tour of all 16 directories. The field rewards people who can go deep, explain their reasoning, and work safely with others.

## Maintenance and contributions

These guides are living documents. If a link rots, a tool changes, or a standard is revised, open an issue or a pull request with the correction and a source. Keep contributions original, cite official documentation, and do not add paid resources without labeling them clearly.

See the [contribution guide](../CONTRIBUTING.md) for the workflow and the [ethics policy](../ETHICS.md) for the rules that apply to all content.

---

Last reviewed: 2026-10-31

[Repository home](../README.md) | [Ethics policy](../ETHICS.md) | [Roadmaps](../roadmaps/) | [Resources](../resources/) | [Contributing](../CONTRIBUTING.md)
