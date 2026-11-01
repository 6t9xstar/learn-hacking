# Glossary of Cybersecurity Terms

[Home](../README.md) / Glossary

This glossary defines the vocabulary used across this repository. Terms are grouped alphabetically by their common name. Acronyms are spelled out at first use, and definitions favor the meaning a practitioner needs rather than a marketing claim. Where a term has a contested scope, the definition names the boundary instead of pretending there is universal agreement.

**How to use it.** Follow a cross-reference only when you need the related concept; do not treat a one-line definition as a substitute for the official standard or vendor documentation. For scoring, framework, and legal terms, the authoritative source controls.

## A

- **Access control** — The process of deciding whether a subject may perform an action on an object, and enforcing that decision.
- **Adversarial example** — An input deliberately crafted to cause a machine-learning model to make a wrong prediction while appearing normal to a human.
- **Adversary emulation** — Replicating the behavior of a specific threat actor to test whether defenses detect and respond to it.
- **AI red teaming** — Structured adversarial testing of an AI system's safety, security, privacy, and misuse resistance.
- **Alert fatigue** — The decline in analyst attention and response quality caused by too many low-value or repetitive alerts.
- **Allowlisting** — Permitting only explicitly approved software, hashes, domains, or actions and denying everything else.
- **Annualized loss expectancy (ALE)** — The expected yearly financial loss from a risk, calculated as single loss expectancy multiplied by annualized rate of occurrence.
- **Anomaly detection** — Identifying behavior that differs from an established baseline, which may be benign or malicious.
- **Application programming interface (API)** — A defined interface that lets software components exchange requests and data.
- **Attack surface** — The set of exposed entry points, interfaces, identities, and dependencies an adversary could attempt to use.
- **Authentication** — Verifying that a subject is who or what it claims to be.

## B

- **Baseline** — A documented, measured normal state used to detect change or judge whether behavior is unusual.
- **Bastion host** — A hardened, monitored host used as the controlled entry point to a sensitive network segment.
- **Beaconing** — Periodic outbound communication from compromised software to an operator or controller.
- **Blue team** — The defensive group responsible for monitoring, detection, response, and hardening.
- **Breach** — A security incident in which data or systems are accessed, disclosed, altered, or destroyed without authorization.
- **Brute force** — Attempting many possible credentials or inputs until one succeeds.
- **Business continuity plan (BCP)** — The plan for keeping critical business functions running during and after disruption.
- **Business email compromise (BEC)** — Fraud that uses impersonation or a compromised mailbox to manipulate payments, data, or trust.

## C

- **Capability (Linux)** — A granular privilege that can be granted to a process or file instead of full root authority.
- **Chain of custody** — The documented record of who collected, handled, transferred, and stored evidence, and when.
- **Ciphertext** — Data transformed by encryption so that it is unreadable without the correct key.
- **Cloud access security broker (CASB)** — A control point that enforces policy between users and cloud services.
- **Cloud security posture management (CSPM)** — Continuous assessment of cloud configuration against security baselines and policy.
- **Command and control (C2)** — The infrastructure and channels an attacker uses to direct compromised systems.
- **Common Vulnerability Scoring System (CVSS)** — A standardized framework for describing the technical severity of a vulnerability; a base score is not a complete business risk assessment.
- **Compliance** — Meeting externally imposed laws, regulations, standards, or contractual requirements.
- **Confidentiality, integrity, and availability (CIA triad)** — The three core security properties: information is disclosed only to authorized parties, is accurate and complete, and is accessible when needed.
- **Container** — An isolated, packaged application environment that shares the host kernel but has its own filesystem, network, and process view.
- **Containment** — Limiting the spread or impact of an incident while preserving evidence and business function.
- **Control** — A safeguard, countermeasure, or management action that reduces risk.
- **Credential stuffing** — Testing username and password pairs stolen from one service against another service, exploiting password reuse.
- **Cross-site request forgery (CSRF)** — An attack that causes a logged-in user's browser to send an unintended state-changing request to a trusted site.
- **Cryptography** — The mathematical and procedural techniques used to protect confidentiality, integrity, authenticity, and non-repudiation.

## D

- **Data at rest** — Data stored on a device, volume, backup, or cloud service when it is not moving through a network.
- **Data in transit** — Data moving between systems, including over internal networks, the internet, and service-to-service links.
- **Data loss prevention (DLP)** — Controls that detect and block unauthorized movement or disclosure of sensitive data.
- **Data poisoning** — Manipulating training or reference data so a model learns incorrect or attacker-favored behavior.
- **Defense in depth** — Layering independent controls so that one failure does not remove all protection.
- **Detection engineering** — Designing, testing, tuning, and maintaining detections as engineered products with owners and measures.
- **Diamond Model** — An intrusion-analysis framework relating adversary, capability, infrastructure, and victim.
- **Digital forensics** — The disciplined collection, preservation, examination, and reporting of digital evidence.
- **DMZ (demilitarized zone)** — A network segment that exposes services to a less trusted network while separating them from internal systems.
- **Domain Name System (DNS)** — The distributed naming system that maps names to addresses and other records.
- **Dwell time** — The period between an attacker's initial access and detection or containment.

## E

- **Egress filtering** — Restricting outbound network traffic to approved destinations and protocols.
- **Encryption** — Transforming data with a key so that only authorized parties can recover the original content.
- **Endpoint detection and response (EDR)** — Endpoint telemetry, detection, investigation, and response tooling.
- **Enrichment** — Adding context such as asset ownership, reputation, or identity to an alert or event.
- **Enumeration** — Systematically discovering users, services, shares, objects, or other resources in a target environment.
- **Evasion** — Techniques intended to avoid detection by security controls or analysts.
- **Evidence** — Information that supports or refutes a claim, preserved with provenance and integrity.
- **Exfiltration** — Unauthorized transfer of data from a target environment.
- **Exploit** — Code, input, or a procedure that takes advantage of a vulnerability to change system behavior.

## F

- **Fail closed** — A design choice in which a control denies access when it cannot make a decision.
- **Fail open** — A design choice in which a control permits access when it cannot make a decision, usually to preserve availability.
- **False negative** — A missed detection: malicious or anomalous activity is not flagged.
- **False positive** — A benign event incorrectly flagged as malicious or anomalous.
- **File integrity monitoring (FIM)** — Detecting unauthorized changes to files by comparing hashes, metadata, or content against a baseline.
- **Firewall** — A control that permits or denies network traffic according to a rule set.
- **Forensic image** — A bit-for-bit copy of storage media or a logical volume, collected with documented provenance.
- **Fuzzing** — Supplying malformed or unexpected inputs to find crashes, errors, or security weaknesses.

## G

- **Gap analysis** — Comparing current controls or capabilities with a target standard and identifying missing elements.
- **Governance** — The decision rights, policies, and accountability structures that direct security work.
- **Governance, risk, and compliance (GRC)** — The integrated discipline of managing policy, risk, and regulatory obligations.

## H

- **Hardening** — Reducing attack surface by configuring systems securely and removing unnecessary features.
- **Hashing** — Converting data into a fixed-length value that changes if the input changes; hashing is not encryption.
- **Honeypot** — A decoy system or service intended to attract, observe, or delay unauthorized activity.
- **Host-based intrusion detection system (HIDS)** — Detection software that monitors a single host's files, processes, logs, or configuration.
- **Hybrid cloud** — An environment combining private infrastructure with one or more public cloud services.
- **Hypervisor** — Software that creates and manages virtual machines on a physical host.

## I

- **Identity and access management (IAM)** — The systems and processes that create identities, authenticate them, and authorize their access.
- **Incident** — A confirmed or suspected event that actually or potentially harms confidentiality, integrity, availability, or business operations.
- **Incident response (IR)** — The organized process for preparing for, detecting, containing, eradicating, recovering from, and learning from incidents.
- **Indicator of compromise (IOC)** — An observable artifact, such as a hash, domain, IP address, or registry key, associated with malicious activity.
- **Integrity** — The property that data or systems are accurate, complete, and protected from unauthorized change.
- **Intrusion detection system (IDS)** — A control that monitors activity and alerts on suspected intrusions.
- **Intrusion prevention system (IPS)** — An IDS that can also block or modify traffic inline.
- **Isolation** — Separating a system, network, or process so it cannot affect other systems beyond an intended boundary.

## J

- **Jailbreak (AI)** — A prompt or interaction designed to bypass a model's safety or usage restrictions.
- **JSON Web Token (JWT)** — A compact, often signed token format carrying claims; a JWT is not encrypted by default.
- **Just-in-time (JIT) access** — Granting elevated access only for a limited task and time window, then removing it.

## K

- **Kerberos** — A network authentication protocol based on tickets issued by a trusted key distribution center.
- **Key management** — The lifecycle of cryptographic keys: generation, distribution, storage, rotation, revocation, and destruction.
- **Kill chain** — A phased model of an intrusion, from reconnaissance through actions on objectives, used to organize detection and defense.
- **Kubernetes** — An open-source container orchestration platform with its own identity, network, and admission-control model.

## L

- **Lateral movement** — Moving from one compromised system or account to another within an environment.
- **Least privilege** — Granting only the access necessary for a task, for only as long as it is needed.
- **Living off the land (LOTL)** — Using legitimate built-in tools and features to perform malicious actions while blending in.
- **Log retention** — The policy and practice of keeping logs for a defined period for investigation, compliance, and operations.
- **Lookalike domain** — A domain that imitates a trusted brand or domain through typography, spelling, or structure.

## M

- **Malware** — Software designed to harm, disrupt, spy on, or gain unauthorized access to a system.
- **Managed detection and response (MDR)** — An outsourced service that provides continuous detection, investigation, and response.
- **Mean time to detect (MTTD)** — The average time from an event's occurrence to its detection.
- **Mean time to respond (MTTR)** — The average time from detection to containment or resolution, depending on the organization's definition.
- **MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge)** — A curated knowledge base of adversary tactics and techniques observed in real intrusions.
- **MITRE D3FEND (Detection, Denial, and Disruption Framework Empowering Network Defense)** — A knowledge base of defensive countermeasures mapped to ATT&CK.
- **Model poisoning** — Manipulating a model's training, fine-tuning, or feedback process to degrade or bias its behavior.
- **Multi-factor authentication (MFA)** — Authentication using two or more independent factors, such as a password and a hardware key.

## N

- **National Institute of Standards and Technology (NIST) Cybersecurity Framework (CSF)** — A voluntary risk-management framework organized around Govern, Identify, Protect, Detect, Respond, and Recover.
- **Network access control (NAC)** — Enforcing admission policy for devices before or when they connect to a network.
- **Network segmentation** — Dividing a network into zones with controlled paths between them to limit reachability and blast radius.
- **Non-repudiation** — Assurance that a party cannot credibly deny having performed an action, often supported by signatures and audit records.

## O

- **Obfuscation** — Making code or data harder to understand while preserving its function, often to impede analysis or detection.
- **Open source intelligence (OSINT)** — Intelligence gathered from publicly available information using lawful collection methods.
- **Open Worldwide Application Security Project (OWASP)** — A nonprofit community producing free application-security guidance, standards, and tools.
- **Order of volatility** — The principle of collecting the most perishable evidence, such as memory and network state, before less volatile data.
- **OWASP Top 10** — A widely used awareness list of the most critical web application security risk categories, updated periodically.

## P

- **Packet capture** — Recording network packets, with metadata such as interface, filter, and timestamp, for analysis.
- **Patch management** — Identifying, testing, deploying, and verifying updates that fix defects and vulnerabilities.
- **Payload** — The part of an attack or exploit that performs the desired action after access is gained.
- **Penetration test** — An authorized, scoped assessment that attempts to exploit weaknesses to evaluate real-world impact.
- **Phishing** — Deceptive communication that tricks a person into disclosing information, running code, or approving an action.
- **Pivot** — Using a compromised host as a staging point to reach other systems.
- **Playbook** — A documented, repeatable procedure for handling a specific scenario.
- **Policy** — A management statement of required behavior, constraints, and responsibilities.
- **Post-quantum cryptography** — Cryptographic algorithms designed to resist attacks by both classical and quantum computers.
- **Privilege escalation** — Gaining a higher level of access than originally granted, whether locally or across a network.
- **Prompt injection** — Manipulating an AI system through crafted input so it follows unintended instructions or leaks protected context.
- **Public key infrastructure (PKI)** — The policies, roles, and technical systems that issue, manage, and validate digital certificates.
- **Purple team** — A collaborative approach in which offensive and defensive teams jointly improve detection and response.

## Q

- **Quarantine** — Isolating a suspicious file, email, or system so it cannot affect other resources while it is examined.
- **Quishing** — Phishing delivered through a QR code that leads to a malicious destination or action.

## R

- **Ransomware** — Malware that encrypts or steals data and demands payment, often with extortion threats beyond encryption.
- **Recovery point objective (RPO)** — The maximum acceptable amount of data loss, expressed as a time window.
- **Recovery time objective (RTO)** — The target time to restore a service after disruption.
- **Red team** — An authorized group that emulates adversaries to test people, processes, and technology.
- **Remediation** — Correcting or mitigating a weakness, often with verification and retest.
- **Residual risk** — The risk that remains after controls and treatment decisions.
- **Resilience** — The ability to withstand, adapt to, and recover from disruption.
- **Risk** — The combination of the likelihood of an event and its impact, often expressed qualitatively or quantitatively.
- **Risk appetite** — The amount and type of risk an organization is willing to accept in pursuit of its objectives.
- **Risk register** — A structured record of risks, owners, ratings, treatments, and review dates.
- **Role-based access control (RBAC)** — Granting permissions based on assigned roles rather than individual identities.
- **Root cause analysis** — Determining the underlying conditions that allowed an incident or defect, beyond the immediate trigger.
- **Rules of engagement (RoE)** — The agreed boundaries for an assessment, including targets, techniques, timing, communications, and stop conditions.

## S

- **Salt** — Random data added to a password before hashing so identical passwords produce different hashes and precomputation is harder.
- **Sandbox** — An isolated environment for running or analyzing untrusted code without exposing the host.
- **Scope** — The explicitly authorized assets, activities, time window, and exclusions for an assessment.
- **Secrets management** — Storing, distributing, rotating, and auditing credentials and keys through a dedicated controlled system.
- **Security information and event management (SIEM)** — A platform that centralizes logs, correlates events, and supports alerting and investigation.
- **Security operations center (SOC)** — The team and facility responsible for continuous monitoring, triage, and response.
- **Security orchestration, automation, and response (SOAR)** — Tooling that coordinates workflows and automates response actions across security products.
- **Serverless** — A cloud execution model in which the provider manages servers and scales functions or managed services on demand.
- **Session hijacking** — Taking over an authenticated session by stealing or abusing its token or cookie.
- **Shared responsibility model** — The division of security duties between a cloud provider and its customer.
- **Shellcode** — Small machine code used as an exploit payload, often to start a shell or loader.
- **Sigma** — A vendor-neutral format for expressing log-based detection rules.
- **Social engineering** — Manipulating people into taking actions or disclosing information that undermines security.
- **Software bill of materials (SBOM)** — A machine-readable inventory of the components and dependencies in a software product.
- **Software supply chain** — The people, tools, services, and dependencies involved in building and distributing software.
- **Static application security testing (SAST)** — Analyzing source or bytecode for insecure patterns without running the application.
- **Supply chain attack** — Compromising a trusted supplier, dependency, or build process to reach its customers.
- **Sysmon** — A Windows system-monitoring tool that records detailed process, network, file, and registry events.

## T

- **Tabletop exercise** — A discussion-based rehearsal of a scenario that tests decisions, roles, and communications without changing real systems.
- **Tactics, techniques, and procedures (TTP)** — The adversary's goals, methods, and specific implementations, used to structure threat analysis.
- **Threat hunting** — Proactive, hypothesis-driven search for malicious activity that existing detections may have missed.
- **Threat intelligence** — Information about threats, actors, and campaigns that is contextualized for a specific decision.
- **Threat modeling** — Systematically identifying assets, trust boundaries, threats, and mitigations during design.
- **Timeline analysis** — Ordering events from multiple sources to reconstruct what happened and when.
- **Tokenization** — Replacing sensitive data with a non-sensitive token that maps back through a protected system.
- **Transport Layer Security (TLS)** — A protocol providing encrypted, authenticated transport between systems.
- **Triage** — Rapidly assessing and prioritizing an alert or incident to decide the next action.
- **Trust boundary** — A point where data or control passes between components with different trust levels.
- **Typosquatting** — Registering a domain or package name that is a likely misspelling of a legitimate name.

## U

- **Unauthorized access** — Access to a system, account, or data without permission or legal authority.
- **User and entity behavior analytics (UEBA)** — Detecting anomalies by modeling the behavior of users, accounts, and devices over time.

## V

- **Virtual private network (VPN)** — An encrypted tunnel that connects a device or network to another network.
- **Vishing** — Voice phishing conducted by phone or voice messaging.
- **Vulnerability** — A weakness that can be exploited to affect confidentiality, integrity, or availability.
- **Vulnerability management** — Identifying, prioritizing, remediating, and verifying vulnerabilities across an estate.
- **Vulnerability scan** — An automated check for known weaknesses or missing patches; a scan is not a penetration test.

## W

- **Watering hole** — Compromising a site or service likely to be visited by a targeted group.
- **Web application firewall (WAF)** — A control that inspects HTTP traffic and blocks requests matching attack patterns or policy.
- **White team** — The exercise control group that sets rules, observes, and adjudicates a simulation.
- **Worm** — Self-propagating malware that spreads across systems without requiring a user to run it each time.

## X

- **Extended detection and response (XDR)** — Integrated detection and response across endpoint, network, identity, email, and cloud telemetry.
- **XML external entity (XXE)** — A vulnerability in XML parsing that can disclose files, reach internal services, or cause denial of service.
- **XSS (cross-site scripting)** — Injecting script into a page viewed by another user, causing code to run in that user's browser origin.

## Y

- **YARA (Yet Another Recursive Acronym)** — A pattern-matching tool and rule language used to identify malware families and artifacts.

## Z

- **Zero trust** — A security model that treats no network location as inherently trusted and verifies each request explicitly.
- **Zero trust network access (ZTNA)** — An access model that grants per-application access after identity and device checks rather than placing users on a flat network.
- **Zero-day** — A vulnerability with no vendor fix available at the time of exploitation or disclosure.
- **Zombie** — A compromised computer controlled remotely as part of a botnet.

## References

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — risk-management vocabulary and functions.
- [MITRE ATT&CK](https://attack.mitre.org/) — adversary tactics and techniques.
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — web application risk categories.
- [FIRST CVSS](https://www.first.org/cvss/) — severity scoring specification.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response terminology in context.

---

**Related:** [Repository home](../README.md) · [Foundations](../foundations/README.md) · [Exercises](../exercises/README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md)

Last reviewed: 2026-10-31
