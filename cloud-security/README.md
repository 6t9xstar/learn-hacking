[Home](../README.md) / Cloud Security

# Cloud Security: Identity, Configuration, and Defensive Architecture

Last reviewed: 2026-10-31. This guide is part of the learn-hacking curriculum; cloud provider features and free-tier terms change often, so verify specifics against current documentation.

Cloud security is the practice of protecting data, identities, workloads, and configuration in public cloud environments. It is less about installing a firewall appliance and more about designing guardrails: who can call which API, what a workload is allowed to reach, which logs prove what happened, and how a bad change is prevented from reaching production. The cloud control plane is powerful and highly automated, which means a single overly broad role or public storage policy can expose an entire organization in minutes.

This guide is for system administrators and developers moving into cloud roles, security analysts who need to investigate cloud incidents, and penetration testers who want to assess cloud environments without breaking provider rules. It focuses on Amazon Web Services (AWS), Microsoft Azure, and Google Cloud, because those three cover most enterprise demand, but the concepts transfer to other providers. The emphasis is defensive: least privilege, segmentation, logging, infrastructure as code, and evidence-based assessment.

> **Ethics and authorization.** Test only accounts, subscriptions, and projects that you own or are explicitly engaged to assess. Never touch another tenant's resources, never run exploitation tools against shared provider infrastructure, and read the provider's penetration testing policy before you start. See [ETHICS.md](../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Intermediate; advanced for multi-account architecture, Kubernetes, and identity graph analysis |
| Realistic time | 10–14 weeks at 8 hours per week for working competency across one provider |
| Cost | Learning material is free; labs can cost money, so use budgets, alerts, and aggressive teardown |
| Prerequisites | TCP/IP, HTTP, Linux, JSON, Git, basic infrastructure as code, and one scripting language |
| Lab requirement | A dedicated cloud account with no production data, MFA on the root user, and a spending limit |
| Best first win | A Prowler baseline of your own account, triaged into ten prioritized fixes with evidence |

## Why this field matters

Organizations no longer ask whether they use cloud; they ask how much of their business runs there. Identity providers, data lakes, CI/CD pipelines, customer-facing APIs, and backups all depend on cloud control planes. The dominant causes of cloud incidents are not hypervisor escapes. They are public storage, overly permissive identities, leaked long-lived keys, disabled logging, and workloads that can reach the internet or the instance metadata service when they should not.

Cloud also changes the shape of incident response. There is no hard drive to seize; evidence lives in audit logs, flow logs, snapshots, and identity provider logs that may expire quickly. A defender who understands CloudTrail, Azure Activity Log, and Google Cloud Audit Logs can reconstruct an intrusion that a traditional endpoint team would miss. That combination of architecture, identity, and forensics is why cloud security skills command a premium and why they pair well with DevSecOps, incident response, and compliance roles.

## What you will learn

- How the shared responsibility model changes depending on whether you use infrastructure, platform, or software as a service.
- How AWS IAM, Azure RBAC and Entra ID, and Google Cloud IAM represent identities, roles, and permissions.
- How to find and fix public storage, exposed management ports, unused keys, and overly broad roles.
- How to design network segmentation with security groups, network security groups, private endpoints, and egress controls.
- How to centralize audit logs and build detections for privilege escalation and credential misuse.
- How to scan infrastructure as code and container images, and assess Kubernetes clusters against CIS benchmarks and pod security standards.
- How to run an authorized cloud assessment, document findings, and avoid runaway costs.

## Prerequisites and honest expectations

You need a working knowledge of IP addressing, subnets, routing, DNS, TLS, and HTTP. You should be comfortable on a Linux command line, reading JSON, and using Git. If you have never written a Terraform file or a CloudFormation template, learn the basics first; most cloud security fixes are configuration changes expressed as code.

Expect provider-specific depth to take time. AWS alone has hundreds of services, and IAM policy evaluation is subtle enough to confuse experienced engineers. You do not need to memorize every service. You need a reliable mental model of identity, resource policy, network path, logging, and encryption, plus the ability to read documentation quickly. Choose one provider as your primary and learn a second well enough to compare. Be careful with free tiers: "free" usually means a limited quantity for a limited time, and charges appear for data egress, NAT gateways, public IPv4 addresses, snapshots, key management requests, and idle resources. Create a dedicated learning account, enable billing alerts and budgets, tag everything, and destroy labs when you finish. Never use a production account for CloudGoat or any intentionally vulnerable environment.

## Core concepts

### The shared responsibility model

Every cloud provider publishes a division of responsibility, but the line moves with the service model. For infrastructure as a service (IaaS), the provider secures facilities, hardware, the hypervisor, and the physical network, while the customer secures the guest operating system, applications, identities, and data. For platform as a service (PaaS), the provider manages the runtime and much of the middleware, but the customer still owns configuration, identities, and data. For software as a service (SaaS), the provider manages almost everything, yet the customer remains responsible for its users, data classification, and integrations.

The practical failure is assuming that "the cloud" encrypts, patches, or monitors something automatically. Read the provider's documentation for the specific service, identify which controls are customer-configurable, and write them into your baseline. The model is not a legal contract by itself; it is a design aid that tells you where to look for gaps.

### Identity as the control plane

In cloud environments, identity is the new network perimeter. A principal is any entity that can make an API call: a human user, a group, a role, a service account, a workload, or a federated identity from another system. Authentication proves who the principal is; authorization decides which actions are allowed on which resources. Most cloud incidents involve stolen credentials, misconfigured trust relationships, or permissions far broader than the workload needs.

Least privilege is the goal, but it is a process rather than a one-time setting. Start with deny-by-default and add the minimum permissions a workload needs. Use short-lived credentials and federation instead of long-lived access keys. Separate human administrative access from workload access. Require multi-factor authentication (MFA) for humans, and use break-glass procedures for emergencies rather than permanent administrator roles.

### AWS IAM in practice

AWS Identity and Access Management (IAM) supports users, groups, roles, and policies. Identity-based policies attach to a principal; resource-based policies attach to a resource such as an S3 bucket or KMS key. Roles are assumed through AWS Security Token Service (STS) and are the preferred mechanism for workloads, cross-account access, and federation. A role's trust policy defines who may assume it, which is a common place for overly broad trust.

Several guardrails are worth knowing. Permission boundaries cap the maximum permissions an identity policy can grant. Service control policies (SCPs) in AWS Organizations set organization-wide limits. IAM Access Analyzer identifies resources shared with external entities, and the credential report shows access key age and MFA status. The root user should have MFA, no access keys, and be used only for the handful of tasks that require it. Long-lived access keys are a liability; prefer roles, federation, and temporary credentials.

### Azure identity and RBAC

Azure separates identity from resources. Microsoft Entra ID (formerly Azure Active Directory) holds users, groups, and service principals. Azure role-based access control (RBAC) assigns roles at scopes: management group, subscription, resource group, or individual resource. Roles are built from allowed actions, and custom roles should be rare and reviewed. Managed identities give Azure workloads an identity without storing credentials, which removes a common secret-management problem.

Conditional Access evaluates signals such as user, device compliance, location, and risk before granting access. Privileged Identity Management (PIM) provides just-in-time elevation for administrative roles. Service principals and app registrations are effectively non-human identities and deserve the same lifecycle controls as employees: owners, expiration, credential rotation, and review. A subscription owner is extremely powerful; treat that role as tier zero.

### Google Cloud IAM

Google Cloud organizes resources in a hierarchy: organization, folders, projects, and individual resources. IAM allow policies bind principals to roles at a node in that hierarchy, and permissions are inherited downward. Service accounts are both identities and resources, which makes them powerful and easy to misuse. Workload identity federation lets external workloads, such as CI jobs or Kubernetes pods, obtain short-lived Google Cloud credentials without service account keys.

Organization policies provide centralized constraints, such as restricting resource locations or disabling service account key creation. IAM Recommender suggests role reductions based on observed usage. VPC Service Controls can create a security perimeter around sensitive APIs. The hierarchy is the key mental model: a broad grant at the organization or folder level can silently affect every project beneath it.

### Storage exposure and data protection

Object storage is a frequent source of breaches because it is easy to make a bucket public and hard to notice. In AWS S3, Block Public Access can be enabled at the account and bucket level, and bucket policies should be reviewed alongside ACLs. In Azure Storage, firewalls, private endpoints, and shared access signatures (SAS) control access, and SAS tokens need short lifetimes and least privilege. In Google Cloud Storage, uniform bucket-level access simplifies permissions and avoids per-object ACL surprises.

Encryption at rest is table stakes and usually enabled by default, but key management still matters: who can use the key, whether keys are customer-managed, and whether cross-account access is intentional. Presigned URLs and SAS tokens are bearer credentials; anyone who obtains one can use it until it expires. Classify data before storing it, apply retention and versioning, and log data-plane access for sensitive buckets. A public bucket is not the only storage risk; an overprivileged application role can be just as damaging.

### Network controls and segmentation

Cloud networks are software-defined. AWS uses virtual private clouds (VPCs) with subnets, security groups, and network ACLs. Security groups are stateful and attached to elastic network interfaces; network ACLs are stateless and apply at the subnet boundary. Azure uses virtual networks, network security groups (NSGs), Azure Firewall, and private endpoints. Google Cloud uses VPC networks, firewall rules, and Private Service Connect. In all three, the default network often permits more east-west traffic than a mature design should.

Design for least connectivity: private subnets for workloads, public subnets only for load balancers, egress through a controlled NAT or proxy, and private endpoints for managed services. Use separate accounts or projects for environments and business units. Do not confuse "the application has authentication" with "the network should be open to the internet". Defense in depth assumes either control can fail.

### Logging, monitoring, and detection

Cloud audit logs are the backbone of detection and response. AWS CloudTrail records API activity; management events are recorded by default for a short retention window, but durable analysis requires an organization trail delivered to a central bucket with integrity validation. AWS Config records resource configuration changes, GuardDuty detects suspicious behavior, and Security Hub aggregates findings. Azure Activity Log records control-plane operations, Defender for Cloud provides posture and threat detection, and Microsoft Sentinel supports SIEM workflows.

Google Cloud Audit Logs include admin activity, data access, and system events; data access logs are often disabled by default because of volume and cost. Security Command Center aggregates findings, and Cloud Logging centralizes logs. In every provider, turn on the logs you need, protect them from deletion, set retention deliberately, and forward them to a central account the production team cannot quietly alter. Detection rules should be tested, not just enabled.

### Misconfiguration and infrastructure as code

Most cloud findings are configuration findings. Public buckets, security groups open to `0.0.0.0/0`, unused access keys, disabled logging, default VPCs, and wildcard IAM policies are recurring patterns. Infrastructure as code (IaC) makes these patterns visible before deployment, but it also spreads them at scale if a bad module is reused.

Policy as code is the defensive answer. Scan Terraform, CloudFormation, and Kubernetes manifests with tools such as Checkov or Trivy, enforce organizational policies with AWS Config rules, Azure Policy, or Google Cloud Organization Policy, and require review for changes to identity and network controls. Detect drift between the repository and the deployed state. The goal is not a perfect score on a scanner; it is a short feedback loop that stops known-bad patterns from reaching production.

### Containers and Kubernetes

Containers package an application and its dependencies, but they do not create a security boundary by themselves. A container image can contain vulnerable packages, secrets baked into layers, or a root user. Scan images in the registry and in CI, use minimal base images, run as non-root, and sign or verify images where supply-chain risk is high. Kubernetes adds its own control plane: API server authentication, RBAC, admission control, network policies, secrets, and pod security.

Managed Kubernetes shifts control-plane patching to the provider but leaves cluster configuration, workload identity, and network policy to the customer. Enable audit logging, restrict public API server endpoints, use RBAC with least privilege, apply network policies, and enforce pod security standards. CIS benchmarks provide a concrete baseline; kube-bench checks many of the worker-node and control-plane settings. Runtime tools such as Falco can detect unexpected process execution, but they need tuning to avoid noise.

### Cloud-native security tooling

The cloud security tool market is crowded, so understand the categories. Cloud security posture management (CSPM) tools compare configuration against benchmarks and produce findings. Cloud workload protection platforms (CWPP) focus on runtime and workload behavior. Infrastructure as code scanners catch issues before deployment. Identity analysis tools graph permissions and find paths to privileged actions.

Prowler runs hundreds of checks across AWS, Azure, Google Cloud, and Kubernetes. ScoutSuite collects configuration and produces a multi-cloud report. CloudGoat deliberately creates vulnerable AWS scenarios for practice. Trivy scans images, filesystems, and IaC. kube-bench checks Kubernetes against CIS benchmarks. Each tool has blind spots: scanners cannot understand your business logic, and a clean report does not prove that the architecture is sound.

### Authorized cloud testing and incident response

Cloud providers publish rules for security testing. AWS permits testing of many services on your own resources without prior approval but prohibits certain activities and requires approval for others; Microsoft publishes rules for penetration testing Azure resources; Google Cloud expects customers to follow its acceptable use policy and agreement. Always read the current policy, stay within your own tenant, avoid denial-of-service and social engineering, and never access another customer's data. Notify your provider and account team when required.

Incident response in the cloud is API-driven. Preserve logs before they expire, identify the compromised principal, revoke sessions and rotate credentials, disable exposed keys, snapshot affected volumes for analysis, and determine which resources the principal could reach. Containment must not destroy evidence: isolate a workload with security groups or network policies rather than terminating it immediately. Afterward, fix the root cause, add a detection, and document the timeline.

## Legal and safe practice

Authorization is defined by account ownership and a written engagement, not by curiosity. Create a dedicated learning account with no real data and no connection to an employer's tenant. If you are assessing a client, the scope should list account IDs, subscriptions, projects, regions, services, time windows, and prohibited actions. Confirm who is responsible for cost and who will be notified if a finding is critical.

Respect provider terms and other tenants. Do not attempt to access metadata or storage belonging to another customer, do not probe shared infrastructure, and do not run load tests without explicit approval. Some services require provider notification even for permitted tests, so review the [AWS](https://aws.amazon.com/security/penetration-testing/) and [Azure](https://learn.microsoft.com/azure/security/fundamentals/pen-testing) testing policies before you start. Data handling matters too: cloud logs can contain personal data, so minimize collection, encrypt evidence, and follow the client's retention policy.

Control cost as a safety issue. Enable budgets and alerts, use the smallest viable instance sizes, prefer free-tier-eligible services, and tear down labs in the same session. Check for lingering NAT gateways, load balancers, snapshots, and public IPv4 addresses. A learning lab that quietly runs for a month can cost more than a paid course.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Cloud foundations (weeks 1–2) | Core services and billing | Create a dedicated account, enable MFA and budgets, deploy a small virtual machine and object store | A cost report, an architecture diagram, and a working budget alert |
| 2. Identity (weeks 3–4) | IAM and least privilege | Build a workload role with minimal permissions; review the credential report and access analyzer findings | A policy diff showing removed wildcards and a justification for each permission |
| 3. Network and storage (weeks 5–6) | Exposure paths | Deploy a private workload with no public IP, then test reachability from the internet and from a peered network | A connectivity matrix and evidence that storage is not public |
| 4. Logging and detection (weeks 7–8) | Audit and response | Enable organization-wide audit logging and create three detections for privilege or key misuse | Working alerts, test events, and a short investigation write-up |
| 5. Containers and Kubernetes (weeks 9–10) | Cluster hardening | Build a local cluster, run kube-bench and Trivy, and apply network policies and pod security | Before/after benchmark output and hardened manifests |
| 6. Assessment and reporting (weeks 11–12) | Prowler and CloudGoat | Baseline your account with Prowler, then run one CloudGoat scenario in an isolated account | A prioritized report, a detection, a fix, and a teardown record |

The stages are ordered so that each one produces a control you can test later. Do not start with CloudGoat: an intentionally vulnerable environment is more useful after you know what normal looks like.

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [AWS Skill Builder](https://skillbuilder.aws/) | AWS | Beginner–advanced | Free digital courses; some labs require a subscription | Partly | Structured AWS learning with official content |
| [Microsoft Learn](https://learn.microsoft.com/training/) | Microsoft | Beginner–advanced | Free; many modules include a sandbox | Yes | Azure and security learning paths with hands-on exercises |
| [Google Cloud Skills Boost](https://www.cloudskillsboost.google/) | Google Cloud | Beginner–advanced | Freemium; some labs and credits are free | Yes | Guided Google Cloud labs and security paths |
| [AWS Workshops](https://workshops.aws/) | AWS | Intermediate | Free | Yes, in your own account | Self-paced workshops on security, networking, and operations |
| [Kubernetes tutorials](https://kubernetes.io/docs/tutorials/) | Kubernetes project | Beginner–intermediate | Free | Yes, local cluster | Core Kubernetes concepts you need before hardening |

Free-tier caveats deserve their own warning. AWS has changed its free-tier structure for newer accounts, and Azure and Google Cloud trial credits expire. Read the current [AWS Free Tier](https://aws.amazon.com/free/), [Azure free account](https://azure.microsoft.com/free/), and [Google Cloud free program](https://cloud.google.com/free) pages before you build. Availability varies by region, and "always free" limits are easy to exceed.

## Official documentation and standards

| Source | Owner | Why it matters |
| --- | --- | --- |
| [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) | AWS | The reference model for AWS security architecture |
| [AWS IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) | AWS | Concrete guidance on root use, MFA, roles, and least privilege |
| [Azure security benchmarks](https://learn.microsoft.com/azure/security/benchmarks/) | Microsoft | The control baseline for Azure workloads |
| [Google Cloud security foundations](https://cloud.google.com/architecture/security-foundations) | Google Cloud | A prescriptive landing-zone and security design guide |
| [Kubernetes security concepts](https://kubernetes.io/docs/concepts/security/) | Kubernetes project | Pod security, secrets, RBAC, and cluster hardening concepts |
| [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) | Center for Internet Security | Consensus hardening baselines for cloud and Kubernetes |
| [NIST SP 800-190](https://csrc.nist.gov/pubs/sp/800/190/final) | NIST | Application container security guidance |
| [MITRE ATT&CK Cloud](https://attack.mitre.org/matrices/enterprise/cloud/) | MITRE | Adversary techniques for cloud threat modeling and detection |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What you practice | Safety note |
| --- | --- | --- | --- | --- |
| [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | Rhino Security Labs | Free tool; AWS usage costs apply | Deliberately vulnerable AWS scenarios and attack paths | Use a dedicated account with a budget and destroy the scenario afterward |
| [AWS Workshops](https://workshops.aws/) | AWS | Free content; resource costs vary | Security, networking, and operations exercises | Read the cleanup section before starting |
| [Microsoft Learn sandbox](https://learn.microsoft.com/training/) | Microsoft | Free sandbox in selected modules | Azure configuration and policy exercises | Sandboxes are temporary; do not store anything you need |
| [Google Cloud Skills Boost](https://www.cloudskillsboost.google/) | Google Cloud | Freemium | Guided labs with temporary credentials | Use provided lab accounts, not a personal billing account |
| [Kubernetes Goat](https://github.com/madhuakula/kubernetes-goat) | Madhu Akula | Free, open source | Intentionally vulnerable Kubernetes cluster scenarios | Run locally or in a disposable cluster only |
| [Prowler](https://github.com/prowler-cloud/prowler) | Prowler | Free, open source | Baseline, triage, and remediation tracking | Read-only mode first; never scan a tenant you do not own |

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| Prowler | Multi-cloud and Kubernetes security assessment against benchmarks | [Prowler](https://github.com/prowler-cloud/prowler) |
| ScoutSuite | Multi-cloud configuration collection and reporting | [ScoutSuite](https://github.com/nccgroup/ScoutSuite) |
| CloudGoat | Intentionally vulnerable AWS scenarios for authorized practice | [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) |
| Trivy | Scans container images, filesystems, and infrastructure as code | [Trivy](https://github.com/aquasecurity/trivy) |
| kube-bench | Checks Kubernetes clusters against CIS benchmarks | [kube-bench](https://github.com/aquasecurity/kube-bench) |
| Checkov | Static analysis for Terraform, CloudFormation, and Kubernetes manifests | [Checkov](https://github.com/bridgecrewio/checkov) |
| Falco | Runtime threat detection for containers and Kubernetes | [Falco](https://falco.org/) |

A scanner is a starting point. The valuable work is triage: deciding which findings are real, which are accepted risk, and which require an architectural change. A report with 500 unranked findings is less useful than ten findings with owners, evidence, and deadlines.

## Practical projects and exercises

### Project 1: AWS baseline audit and remediation

**Objective:** Assess a dedicated AWS account, produce a prioritized findings report, and fix the top issues in code.

**Setup and constraints:** Use a new account with no production data, MFA on root, a budget alert, and CloudTrail enabled. Run Prowler in read-only mode and review IAM, S3, logging, and network findings manually. Do not test resources outside the account. If you use Terraform, keep state local and destroy everything at the end.

**Deliverable:** A report with an executive summary, a findings table (service, issue, risk, evidence, remediation), ten prioritized fixes, and a rescan showing improvement. Include the Terraform or CLI diff for at least three fixes and a cost report proving teardown. This is portfolio-worthy because it demonstrates assessment, prioritization, and engineering follow-through.

### Project 2: CloudGoat attack path, detection, and least privilege

**Objective:** Run one CloudGoat scenario in an isolated account, document the path an attacker could take, then build the detection and the fix.

**Setup and constraints:** Use a dedicated account with a budget and no real data. Read the scenario's cleanup instructions before starting. Do not use the technique against any other account or against shared infrastructure. Capture the API calls in CloudTrail and remove every resource when finished.

**Deliverable:** A diagram of the attack path, the CloudTrail events that reveal it, a detection rule or query, a least-privilege policy that would have blocked the path, and a teardown/cost record. The detection and fix matter more than the exploit: this project is about closing the loop between offense and defense.

### Project 3: Kubernetes hardening with evidence

**Objective:** Harden a local Kubernetes cluster and prove the improvement with benchmarks and policy tests.

**Setup and constraints:** Create a kind or minikube cluster on your workstation. Deploy a sample application, run kube-bench and Trivy before changes, then apply network policies, pod security settings, RBAC restrictions, and a read-only root filesystem where possible. Do not expose the cluster to the internet.

**Deliverable:** Before/after kube-bench output, an image scan report, hardened manifests, a network policy test showing allowed and denied traffic, and a short threat model for the sample application. Explain which findings you accepted and why. This project shows platform engineering skill, which is often more valuable than another scanner screenshot.

## Common mistakes and misconceptions

- **"The cloud provider secures my data."** The provider secures the infrastructure it operates. You remain responsible for identities, configuration, data classification, and most application-layer controls.
- **"MFA on the root account is enough."** Root MFA is essential, but everyday users, roles, and CI/CD identities also need strong authentication and least privilege.
- **"Access keys are fine if they are rotated yearly."** Long-lived keys are a persistent liability. Prefer roles, federation, workload identity, and short-lived credentials.
- **"Only public buckets cause storage breaches."** An overprivileged application role, a leaked presigned URL, or a misconfigured SAS token can expose data without any public bucket.
- **"CloudTrail is on by default, so we have logs."** Default management-event history is limited. Durable, tamper-resistant logging requires a trail, a central bucket, and retention planning.
- **"Free tier means free."** Egress, NAT gateways, public IPv4 addresses, snapshots, and idle resources can generate charges. Budgets and teardown are part of lab safety.
- **"CloudGoat is safe in any account."** It deliberately creates vulnerable resources. Run it only in a disposable account with no data and no trust relationships to production.
- **"A penetration test does not need provider notification."** Provider policies differ and can restrict or prohibit specific tests. Read the current rules and obtain written authorization first.

## Career paths and roles

Cloud security engineer: implements guardrails, identity controls, logging, and remediation across one or more providers. Entry often comes from systems administration, DevOps, or security operations. Demonstrate a hardened account, IaC fixes, and a clear report.

Cloud security architect: designs landing zones, account structures, network segmentation, and compliance boundaries, and may also lead governance, risk, and compliance (GRC) work mapping controls to the Center for Internet Security (CIS), Cloud Security Alliance (CSA), ISO, and regulatory frameworks. This role needs breadth across identity, networking, and governance, and a design document with tradeoffs is stronger evidence than a certificate alone.

DevSecOps or platform security engineer: builds secure CI/CD, image scanning, policy as code, and admission control. It suits people who enjoy automation and developer experience. Show a pipeline that blocks a known-bad Terraform change.

Cloud penetration tester or assessment consultant: performs authorized reviews of cloud estates, often alongside application and identity testing. Demonstrate a CloudGoat path, a detection, and a least-privilege fix, not just a list of exploited scenarios.

## Next steps

1. Read the [cloud security engineer roadmap](../roadmaps/cloud-security-engineer.md) and choose one provider for your first 12 weeks.
2. Create a dedicated learning account, enable MFA and a budget, and run Prowler in read-only mode before changing anything.
3. Complete one CloudGoat scenario end to end, including detection, remediation, and teardown, then harden a local Kubernetes cluster and record before/after kube-bench evidence.
4. Keep your notes in the [lab notes template](../templates/lab-notes.md), and pair this guide with the [network penetration testing guide](../network-penetration-testing/README.md) and the [SOC and blue team guide](../soc-blue-team/README.md).

## References

1. AWS Well-Architected Security Pillar, <https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html>.
2. AWS IAM best practices, <https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html>.
3. Microsoft Azure security benchmarks, <https://learn.microsoft.com/azure/security/benchmarks/>.
4. Google Cloud security foundations, <https://cloud.google.com/architecture/security-foundations>.
5. Kubernetes security concepts, <https://kubernetes.io/docs/concepts/security/>.
6. CIS Benchmarks, <https://www.cisecurity.org/cis-benchmarks>.
7. NIST SP 800-190, Application Container Security Guide, <https://csrc.nist.gov/pubs/sp/800/190/final>.
8. MITRE ATT&CK Cloud Matrix, <https://attack.mitre.org/matrices/enterprise/cloud/>.
9. AWS penetration testing policy, <https://aws.amazon.com/security/penetration-testing/>.

---

Continue with the [repository home](../README.md), the [foundations track](../foundations/README.md), the [resource library](../resources/README.md), or the [contribution guide](../CONTRIBUTING.md).
