[Repository home](../../README.md) / Additional topics / Security architecture

# Security Architecture

Security architecture is the discipline of making structural decisions that keep a system secure as it grows, changes, and fails. It sits above configuration and below business strategy: it chooses trust boundaries, identity models, segmentation, encryption, and control patterns, then documents the tradeoffs. This guide is for senior engineers, cloud architects, and security practitioners moving from finding issues to designing systems that avoid them.

A good architecture does not promise that nothing will go wrong. It assumes components will be compromised, people will make mistakes, and vendors will fail, then designs containment, detection, and recovery so those events do not become catastrophes. That mindset — resilience over perfection — is what separates architecture from compliance checklists.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Advanced; requires broad technical and organizational judgment |
| Realistic time | 150–250 hours to build competent review and design skills |
| Cost | Free to learn; cloud labs may incur small charges unless free tier is used |
| Prerequisites | Networking, identity, cloud platforms, threat modeling, risk basics |
| Lab requirement | Your own cloud account with budget alerts, or local equivalents |
| Best for | Senior engineers, cloud architects, consultants, security leads |

## Why this field matters

Most security incidents are contained or amplified by architecture. A flat network lets ransomware spread from a laptop to a database. A shared identity with broad permissions turns one phished account into an organization-wide breach. A single region with no tested backup turns an outage into a business-ending event. These are design decisions, made long before an incident.

Architects also own the tradeoffs nobody else wants to make. Strong segmentation can break a legitimate workflow; encryption can complicate debugging; zero trust can slow a legacy application. The job is not to insist on the most secure option, but to make risk explicit, choose deliberately, and document what was accepted. That is how security survives contact with delivery pressure.

## What you will learn

- Translate business and regulatory requirements into security architecture qualities.
- Select reference patterns for segmentation, identity, and resilience.
- Apply zero trust principles from NIST SP 800-207 without treating them as a product.
- Design identity-centric access with least privilege and strong workload identity.
- Map controls across NIST CSF 2.0, NIST SP 800-53, CIS Controls, and cloud frameworks.
- Threat model at the architecture level and prioritize attack paths.
- Write architecture decision records that capture context and consequences.
- Run an architecture review and produce findings a team can act on.

## Prerequisites and honest expectations

You should understand how networks route, how TLS and certificates work, how identity providers and tokens work, and how at least one cloud provider organizes accounts, networks, and IAM. You should also have run something in production; architecture without operational experience tends to produce diagrams that cannot be operated.

Expect ambiguity and disagreement. There is rarely one correct architecture, and the best choice depends on constraints you do not control. You will need to say "it depends" and then explain on what. Communication, writing, and facilitation matter as much as technical depth. Certifications can help with vocabulary but do not replace a reviewed design.

## Core concepts

### From requirements to architecture

Architecture starts with requirements: business goals, data classification, regulatory obligations, availability targets, budget, legacy constraints, and the risk appetite of the organization. Translate these into quality attributes: confidentiality, integrity, availability, privacy, safety, performance, operability, and cost. Each attribute implies tradeoffs.

A useful technique is to write the requirement as a testable scenario: "If a single availability zone fails, checkout remains available within 60 seconds and no orders are lost." That forces decisions about replication, queues, and failure modes. Security requirements should be equally concrete: "No customer data is readable by another tenant, even with a valid session and a modified object identifier."

### Reference architectures and patterns

Reference architectures accelerate design by starting from a known-good shape. Common patterns include three-tier web applications, hub-and-spoke networks, landing zones with separate accounts per environment, event-driven services, and service meshes for workload identity and traffic policy. Each pattern encodes assumptions about trust and failure.

Use references as a starting point, not a religion. A pattern designed for a large enterprise may be unworkable for a ten-person team; a simple architecture with strong identity and backups can be safer than a complex one nobody understands. Document where you deviated and why.

### Defense in depth

Defense in depth layers preventive, detective, and corrective controls so a single failure does not become a breach. Preventive controls block, detective controls notice, and corrective controls recover. Examples include network policy, endpoint protection, application authorization, encryption, logging, backups, and tested incident response.

Layering is not the same as duplication. Two firewalls from the same vendor with the same ruleset are one control, not two. Effective depth uses independent mechanisms: identity checks plus network policy plus application authorization, so a bypass of one still leaves another. It also avoids common-mode failures such as a shared identity provider or a single logging pipeline.

### Segmentation and trust boundaries

Segmentation limits lateral movement by dividing the environment into zones with explicit policy between them. Zones can be based on network, workload, data sensitivity, or tenant. A trust boundary is any point where data or authority crosses between zones; each boundary needs authentication, authorization, logging, and a defined protocol.

Modern segmentation goes beyond VLANs: security groups, Kubernetes network policies, service mesh authorization, private endpoints, and separate cloud accounts. East-west traffic deserves as much attention as north-south. A compromised web server should not be able to reach the payroll database just because both are in the same virtual network.

### Zero trust

Zero trust rejects the idea that network location confers trust. Every request is evaluated on identity, device posture, and context, using policy decision and enforcement points. NIST SP 800-207 describes the principles and deployment models; it is a strategy, not a product you buy.

In practice, zero trust means strong identity, least privilege, microsegmentation, continuous verification, and logging. It does not mean "no network" or "every request needs a human." Start with a high-value use case, such as administrative access or contractor access, and expand. CISA's Zero Trust Maturity Model provides a useful progression across its five pillars — identity, devices, networks, applications and workloads, and data — plus cross-cutting capabilities such as visibility and analytics.

### Identity-centric design

Identity is the primary control plane in modern architecture. Centralize authentication with an identity provider, use federation and single sign-on, enforce multi-factor authentication, and apply conditional access based on risk. Separate human and workload identities; workloads should use short-lived credentials from a platform identity service, not static keys.

Authorization should be centralized and policy-driven, with least privilege and just-in-time elevation. Privileged access management, break-glass accounts, and session recording reduce the impact of admin compromise. Design for joiner-mover-leaver lifecycle events, because stale access is one of the most common findings in reviews.

### Secure defaults and resilience

Secure defaults make the safe choice the easy one: private storage by default, encryption enabled, public access blocked, logging on, least-privilege roles, and hardened images. Infrastructure as code should encode these defaults so a new environment inherits them without a checklist.

Resilience is a security property. Design for graceful degradation, bounded retries, circuit breakers, backups that are immutable and tested, and recovery objectives that the business has agreed to. Assume a component will fail or be compromised; decide how the system behaves, how you detect it, and how you recover. Tabletop exercises reveal gaps that diagrams hide.

### Cloud shared responsibility

Cloud providers secure the physical infrastructure, hypervisor, and managed service foundation. Customers secure their identities, data, configurations, and applications. The split varies by service model: with infrastructure as a service you patch the operating system; with a managed database the provider patches the engine, but you still own access and data.

Most cloud incidents are customer-side misconfigurations: public buckets, over-broad roles, exposed keys, and missing logging. Architecture reviews should verify account structure, guardrails, network design, identity federation, data protection, and detection. "The cloud is secure" is not a control.

### Control mapping and frameworks

Control frameworks give you a common language and a completeness check. NIST CSF 2.0 organizes outcomes into govern, identify, protect, detect, respond, and recover. NIST SP 800-53 provides a detailed control catalog. CIS Controls offer a prioritized set of safeguards. Cloud providers publish mappings to these frameworks, and OWASP ASVS covers application-level requirements.

Mapping is not compliance theater. The goal is to show how each architecture component satisfies a requirement, what evidence exists, and where gaps remain. Record inherited controls (provider-managed) separately from customer-owned controls. A control that exists only in a document is not implemented.

### Architecture threat modeling and attack paths

Architecture threat modeling looks at flows between components rather than individual functions. Draw the system with trust boundaries, then identify attack paths: initial access, privilege escalation, lateral movement, data access, and exfiltration. Rank paths by likelihood and business impact.

PASTA and STRIDE are common methods; the specific framework matters less than consistency. For each path, ask which control breaks it and what happens if that control fails. Attack-path analysis is especially useful in cloud environments, where a single role assumption can chain across accounts.

### Architecture decision records and tradeoffs

An architecture decision record (ADR) captures a decision, its context, alternatives considered, and consequences. It is short, dated, and versioned with the code. ADRs make security tradeoffs visible and prevent the same debate from recurring every year.

A security ADR should state the risk being accepted, the compensating controls, the owner, and the review date. For example: "We will allow outbound internet access from the reporting service because a vendor API requires it; we accept the exfiltration risk, restrict destinations by allowlist, log egress, and review quarterly." That is a defensible decision; silence is not.

### SABSA, TOGAF, and review governance

SABSA is a business-driven security architecture framework that traces security attributes from business context through conceptual, logical, physical, component, and operational layers. TOGAF is an enterprise architecture framework with an architecture development method. You do not need to certify in either to benefit from their ideas: start from business drivers, document layers, and govern change. The [Open Group's TOGAF](https://www.opengroup.org/togaf) and [SABSA Institute](https://sabsa.org/) publish overviews that are free to read.

An architecture review board or a lighter peer-review process catches gaps before build. Reviews should be risk-based: a new public-facing payment service deserves more scrutiny than an internal dashboard. The output should be findings, decisions, and owners, not a score.

## An architecture review checklist

Use this checklist as a starting point, then adapt it to the system's data and threat model.

| Area | Questions to ask |
| --- | --- |
| Data | What is the classification, where does it live, who can read it, and how long is it retained? |
| Identity | How are humans and workloads authenticated? Are credentials short-lived and scoped? |
| Authorization | Where is the policy enforced? Can one tenant reach another's objects? |
| Boundaries | Where does data cross a trust boundary, and what authenticates each side? |
| Network | Is east-west traffic restricted? Are administration paths private and audited? |
| Encryption | What is encrypted in transit and at rest, and where are keys managed? |
| Resilience | What fails, how do you detect it, and what are the tested recovery objectives? |
| Detection | Are security logs centralized, tamper-resistant, and alerting on high-risk actions? |
| Supply chain | What third parties, images, and dependencies are trusted, and how is that verified? |
| Operations | Who runs this, what is the runbook, and how are exceptions tracked? |

## Legal and safe practice

> Architecture labs often involve real cloud accounts. Use your own account, enable budget alerts, and never assess a client environment without a signed scope.

Cloud resources can cost money and expose data if misconfigured. Use free tiers, tear down labs after use, and avoid placing real personal data in test systems. When reviewing a client architecture, follow confidentiality terms, minimize access, and do not copy diagrams or data into public portfolios without permission.

Offensive cloud labs such as CloudGoat are designed for isolated accounts; running them against an employer's environment without authorization is a serious violation. If you find a vulnerability during a review, report it through the agreed channel and do not exploit it beyond what is needed to demonstrate impact. Read [ETHICS.md](../../ETHICS.md) before starting.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Foundations | Networks, identity, cloud accounts, threat modeling | A data-flow diagram of a system you operate |
| 2. Patterns | Segmentation, landing zones, resilience | A reference design with tradeoffs documented |
| 3. Zero trust | 800-207, ZTMM, identity-centric access | A current-versus-target maturity assessment |
| 4. Governance | Control mapping, ADRs, review process | A review with findings and accepted risks |
| 5. Advanced | Multi-cloud, regulated workloads, recovery | A full architecture review portfolio piece |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Well-Architected Labs](https://wellarchitectedlabs.com/) | AWS | Intermediate | Free labs; AWS account may incur small costs | Yes | Security, reliability, and cost labs based on the Well-Architected Framework |
| [Microsoft Cybersecurity Architect (SC-100)](https://learn.microsoft.com/en-us/training/courses/sc-100t00) | Microsoft Learn | Advanced | Free course; exam paid | Some | Designing security strategy, architecture, and operations |
| [NIST CSF 2.0 Quick Start Guides](https://www.nist.gov/cyberframework/quick-start-guides) | NIST | Beginner to intermediate | Free | No | Turning framework outcomes into an actionable program |
| [Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) | CISA | Intermediate | Free | No | A staged roadmap across zero trust pillars |
| [SABSA resources](https://sabsa.org/) | SABSA Institute | Advanced | Free overview; certification paid | No | A business-driven approach to security architecture |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) | NIST | The reference definition of zero trust principles and deployment models |
| [CISA Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model) | CISA | A practical maturity progression across pillars |
| [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) | AWS | Design principles and best practices for cloud security |
| [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework) | NIST | Outcome-based governance, protection, detection, and recovery |
| [Microsoft Azure security architecture](https://learn.microsoft.com/en-us/azure/architecture/framework/security/) | Microsoft | Reference patterns for identity, network, and data security |
| [Google Cloud security framework](https://cloud.google.com/architecture/framework/security) | Google Cloud | Cloud security design guidance across the lifecycle |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [Well-Architected Labs](https://wellarchitectedlabs.com/) | AWS | Free labs; account costs possible | Use a dedicated sandbox account with budget alerts |
| [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | Rhino Security Labs | Free, self-hosted | Deliberately vulnerable AWS scenarios; own account only |
| [flAWS](http://flaws.cloud/) | Summit Route | Free | A guided AWS misconfiguration challenge; use a disposable account |
| [Kubernetes Goat](https://github.com/madhuakula/kubernetes-goat) | Kubernetes Goat | Free, self-hosted | Intentionally vulnerable cluster; never expose it publicly |
| [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/) | OWASP | Free | Model an architecture you own and compare findings with a peer |

## Essential open-source tools

Architecture work is mostly reasoning and communication. These tools help you model, visualize, and verify.

| Tool | Purpose | Link |
| --- | --- | --- |
| OWASP Threat Dragon | Data-flow diagrams with threat modeling | [owasp.org](https://owasp.org/www-project-threat-dragon/) |
| Prowler | Cloud security assessment across providers | [github.com/prowler-cloud/prowler](https://github.com/prowler-cloud/prowler) |
| Open Policy Agent | Policy as code for architecture guardrails | [openpolicyagent.org](https://www.openpolicyagent.org/) |
| Cloud Custodian | Rules engine for cloud governance and cleanup | [cloudcustodian.io](https://cloudcustodian.io/) |
| Cartography | Graph-based cloud asset and relationship mapping | [github.com/lyft/cartography](https://github.com/lyft/cartography/) |
| Excalidraw | Fast, shareable architecture diagrams | [excalidraw.com](https://excalidraw.com/) |

## Practical projects and exercises

### Project 1: Architecture review with findings

Objective: review a realistic three-tier SaaS architecture and produce a client-ready assessment.

Constraints: use a reference design you build in diagrams (or a small lab you deploy). Cover identity, network segmentation, data protection, resilience, logging, and supply chain. Do not assess a real company without permission.

Deliverable: an architecture summary, a findings table with severity, evidence, and recommendation, three ADRs for the most consequential decisions, and a prioritized remediation roadmap. This is the central portfolio piece for architecture roles.

### Project 2: Zero trust gap assessment

Objective: assess a system against the CISA Zero Trust Maturity Model and NIST SP 800-207.

Constraints: score the five pillars (identity, devices, networks, applications and workloads, data) and the cross-cutting capabilities (visibility and analytics, automation and orchestration, governance) as traditional, initial, advanced, or optimal. Justify each score with evidence, not aspiration.

Deliverable: a heat map, a target-state description, a 12-month roadmap with owners, and a list of quick wins. Include the assumptions and the limits of your evidence.

### Project 3: Control mapping matrix

Objective: connect architecture components to a control framework.

Constraints: choose NIST CSF 2.0 or CIS Controls v8. Map at least fifteen controls to specific components and evidence. Mark inherited controls and gaps. Do not claim a control is implemented because a policy says so.

Deliverable: a matrix with control, implementation, evidence, owner, and status, plus a one-page executive summary of the largest gaps. This is directly useful for audit preparation and security program work.

## Common mistakes and misconceptions

- Treating zero trust as a product purchase rather than an identity and policy strategy.
- Drawing a beautiful diagram that nobody can operate, monitor, or afford.
- Adding network layers without restricting east-west traffic or administration paths.
- Assuming the cloud provider secures customer identity, data, and configuration.
- Mapping controls for compliance without testing whether they work.
- Writing ADRs after the fact to justify a decision instead of recording the tradeoff.
- Ignoring resilience and recovery because the focus is on prevention.
- Designing for a threat model that excludes insiders, supply chain, or misconfiguration.

## Career paths and roles

Security architects design controls and trust boundaries across systems. Cloud security architects specialize in landing zones, identity, and cloud-native patterns. Enterprise architects connect security to business capabilities and long-term portfolios. Product security architects embed with engineering teams. Consultants perform reviews and transformations for clients. Security engineers often move into architecture after several years of operational work.

Certifications such as CISSP, CCSP, SABSA, and TOGAF can help with vocabulary and some hiring filters, but they are not substitutes for a reviewed design. A portfolio with an architecture review, a zero trust roadmap, and ADRs is strong evidence. Expect interviews to include a whiteboard design, a threat discussion, and a question about a tradeoff you made.

## Next steps

- Diagram a system you operate and mark every trust boundary.
- Read NIST SP 800-207 and write a one-page summary of its deployment models.
- Score one system against the CISA Zero Trust Maturity Model.
- Review an architecture with a peer and write three ADRs from the discussion.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and [advanced training grounds](../../resources/training-grounds/advanced.md).

## References

- NIST, [Zero Trust Architecture (SP 800-207)](https://csrc.nist.gov/pubs/sp/800/207/final).
- CISA, [Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model).
- NIST, [Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework).
- AWS, [Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html).
- Microsoft, [Azure security architecture](https://learn.microsoft.com/en-us/azure/architecture/framework/security/).
- Google Cloud, [Security framework](https://cloud.google.com/architecture/framework/security).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
