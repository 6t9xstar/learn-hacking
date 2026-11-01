# Cloud Security Engineer Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 9–15 months**

[Home](../README.md) › [Roadmaps](README.md) › Cloud security engineer

Cloud security engineers design and operate controls for workloads that run on someone else's infrastructure. The role is engineering-heavy: identity and access management, network segmentation, logging and detection, encryption, infrastructure as code, container security, and incident response inside a provider's control plane. It is not "traditional security with a cloud logo". The primitives are different, the console is an API, and a single identity misconfiguration can expose more than a whole subnet of servers.

This roadmap assumes you will go deep on one provider rather than sampling three. Read [ETHICS.md](../ETHICS.md) before testing cloud environments. Creating resources in an account you do not own, or probing a provider's metadata service outside your own lab, is unauthorized activity.

## At a glance

| Item | Detail |
|---|---|
| Target role | Cloud security engineer, cloud security analyst, DevSecOps engineer, security engineer for a cloud migration |
| Realistic duration | 9–15 months at 8–10 hours per week; 6–10 months with production cloud or DevOps experience |
| Cost | Free documentation and many free training modules; practical labs need a cloud account and can incur charges; optional exams are paid |
| Lab needs | One cloud free-tier account with billing alarms; local Docker and Kubernetes; Terraform; an isolated AWS or Azure sandbox for attack/defence labs |
| Difficulty | Moderate–high; identity and networking depth are the hard parts |
| Main output | A secure landing zone in Terraform, an IAM review, a detection lab, and a cloud incident runbook |

This is a map, not a race. Free tiers are limited and change; a lab that costs nothing today can generate a bill tomorrow. Always set a budget and an alert before creating resources.

## Who this is for

This roadmap suits sysadmins and network engineers moving into cloud roles, developers who already deploy to AWS or Azure, SOC analysts who want to work on the cloud control plane, and security generalists who need cloud depth.

Honest prerequisites:

- **Networking fundamentals.** CIDR, routing, DNS, firewalls, and load balancing. Cloud networking is still networking.
- **Linux and command line.** Most cloud engineering happens in a shell and in CI.
- **One scripting language.** Python is the most portable; Bash is unavoidable.
- **Identity basics.** Users, groups, roles, and the principle of least privilege.
- **JSON and YAML.** Policies, templates, and Kubernetes manifests are written in them.
- **Comfort with APIs and CLIs.** The console is a convenience; the CLI is the real interface.

You do not need to be a Kubernetes expert or a full-stack developer, but you should be able to read a CI pipeline and understand what it deploys and with which credentials.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Cloud architecture | Explain accounts, projects, subscriptions, regions, and shared responsibility | A written architecture and trust-boundary review |
| Identity and access | Design least-privilege roles and find overly broad permissions | An IAM policy diff with test results |
| Logging and detection | Enable and query control-plane and data-plane logs | A detection query and a triage note |
| Network controls | Design segmentation with security groups, NACLs, and private endpoints | A network diagram with justified rules |
| Data protection | Apply encryption, key management, and public-access controls | A storage hardening checklist with evidence |
| Infrastructure as code | Review and remediate Terraform or CloudFormation securely | A pull request that fixes a real misconfiguration |
| Containers | Harden images and Kubernetes workloads | A hardened Dockerfile and Kubernetes policy set |
| Incident response | Contain a compromised identity or workload in the cloud | A tabletop runbook and a lab timeline |

Typical entry-level tasks:

- Review an IAM role and remove permissions that are not used.
- Confirm that CloudTrail, GuardDuty, or the equivalent is enabled across accounts and regions.
- Triage a public-storage or over-permissive-security-group finding.
- Write a Terraform change that enforces encryption and logging.
- Map a cloud finding to CIS Benchmark and NIST controls.

## Learning sequence

Go deep on one provider. AWS and Azure are the most common enterprise choices; Google Cloud is a strong third. The concepts transfer, but the names, defaults, and traps do not.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Cloud and security foundations | 8–10 weeks | Architecture and shared-responsibility brief |
| 2 | Provider depth: identity, network, logging | 10–12 weeks | IAM review and logging baseline |
| 3 | Infrastructure as code, containers, automation | 10–12 weeks | Secure Terraform module and hardened image |
| 4 | Detection, response, and compliance | 8–10 weeks | Detection lab and incident runbook |
| 5 | Portfolio and interviews | 6–8 weeks | Two cloud artifacts and a mock interview |

### Stage 1 — Cloud and security foundations

| Element | Detail |
|---|---|
| Goal | Understand the cloud operating model and where security responsibility actually sits. |
| Topics | Regions and availability zones; accounts, subscriptions, and projects; shared responsibility; virtual networks; compute and storage basics; pricing and budgets; the provider CLI; cloud versus on-premises threat models. |
| Free learning | [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html), [Microsoft Azure security fundamentals](https://learn.microsoft.com/en-us/azure/security/fundamentals/), [Google Cloud security architecture framework](https://cloud.google.com/architecture/framework/security), [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework). |
| Labs | Create a free-tier account with a billing alarm and budget. Deploy a small virtual machine and a private storage bucket. Break public access deliberately, then fix it. Delete everything and verify the bill. |
| Deliverable | A one-page architecture and shared-responsibility brief for a small web application. |
| Exit criteria | You can explain which controls the provider owns and which you own for compute, storage, and identity. |

### Stage 2 — Provider depth: identity, network, logging

| Element | Detail |
|---|---|
| Goal | Master the three areas that cause most cloud incidents: identity, exposure, and missing logs. |
| Topics | IAM users, roles, policies, and trust relationships; federation and workload identity; least privilege; VPC or virtual network design; security groups and network ACLs; private endpoints; object storage policies; control-plane and data-plane logging; log retention and centralization. |
| Free learning | [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/), [AWS CloudTrail User Guide](https://docs.aws.amazon.com/cloudtrail/), [Microsoft Entra documentation](https://learn.microsoft.com/en-us/entra/), [Google Cloud IAM documentation](https://cloud.google.com/iam/docs), [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks). |
| Labs | Audit an account with Prowler or ScoutSuite. Write a least-privilege policy for a specific workload and test it. Enable organization-wide logging and query it for a specific event. Draw the network path for a three-tier app. |
| Deliverable | An IAM review with findings and a logging baseline checklist covering identity, network, and storage. |
| Exit criteria | You can read a policy document and predict what it allows, and you can find an event in logs without console hunting. |

### Stage 3 — Infrastructure as code, containers, automation

| Element | Detail |
|---|---|
| Goal | Make secure configuration repeatable and reviewable instead of clicking it into existence. |
| Topics | Terraform fundamentals and state; modules; policy as code; secrets management; CI/CD identity; Docker image hardening; Kubernetes RBAC, network policies, and pod security; supply-chain basics; drift detection. |
| Free learning | [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials), [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/), [Docker security documentation](https://docs.docker.com/engine/security/), [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/). |
| Labs | Write a Terraform module for a private, encrypted, logged storage bucket. Scan it with Checkov or Trivy. Harden a Dockerfile and run it as a non-root user. Apply Kubernetes network policies in a local cluster. |
| Deliverable | A secure Terraform module with tests and a hardened container image with a scan report. |
| Exit criteria | A reviewer can read your code and see the security intent. A scan reports no high-severity issues you cannot explain. |

### Stage 4 — Detection, response, and compliance

| Element | Detail |
|---|---|
| Goal | Detect and respond to cloud attacks using provider telemetry, and map controls to a framework. |
| Topics | CloudTrail, GuardDuty, Security Hub, Defender for Cloud, Security Command Center; identity-based attacks; anomalous API calls; detection queries; containment with identity and network controls; evidence preservation; CIS and NIST mappings; cloud incident response roles. |
| Free learning | [AWS GuardDuty User Guide](https://docs.aws.amazon.com/guardduty/latest/ug/), [Microsoft Defender for Cloud documentation](https://learn.microsoft.com/en-us/azure/defender-for-cloud/), [Microsoft Sentinel documentation](https://learn.microsoft.com/en-us/azure/sentinel/), [MITRE ATT&CK cloud matrix](https://attack.mitre.org/matrices/enterprise/cloud/). |
| Labs | Run [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) in an isolated sandbox with a strict budget. Detect the activity in logs, write a timeline, and contain it. Complete [flaws.cloud](https://flaws.cloud/) for common misconfigurations. |
| Deliverable | A detection and response runbook for a compromised cloud identity, validated in the lab. |
| Exit criteria | You can explain what telemetry would prove an identity was misused and what you would disable first. |

Ethics reminder: CloudGoat and similar tools create real, vulnerable infrastructure. Only run them in an account you own, never in a shared or production account, and tear everything down afterwards. Do not use these techniques against a provider or a customer without written authorization.

### Stage 5 — Portfolio and interviews

| Element | Detail |
|---|---|
| Goal | Show engineering judgment, not just familiarity with a console. |
| Topics | Architecture review write-ups; code review; incident narratives; cost and risk trade-offs; certification preparation; interview whiteboard design. |
| Free learning | [AWS Skill Builder](https://explore.skillbuilder.aws/), [Microsoft Learn](https://learn.microsoft.com/en-us/training/), [Google Cloud Skills Boost](https://www.cloudskillsboost.google/), [free courses index](../resources/free-courses/README.md). |
| Labs | Present your Terraform module and incident runbook to a peer. Complete a mock architecture review with a time limit. |
| Deliverable | A portfolio with a secure landing zone, an IAM review, and a detection runbook. |
| Exit criteria | You can defend a design trade-off in terms of cost, blast radius, and operational burden. |

## Sequence diagram

```text
Stage 1  Cloud foundations
  accounts | regions | shared responsibility | budgets
        |
        v
Stage 2  Provider depth
  IAM -> network -> logging -> storage
        |
        v
Stage 3  IaC + containers
  Terraform -> policy as code -> image hardening -> Kubernetes
        |
        v
Stage 4  Detection + response
  telemetry -> detection query -> containment -> compliance mapping
        |
        v
Stage 5  Portfolio + interview
  landing zone -> IAM review -> runbook -> design interview
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) | AWS | Intermediate | Free | No | A design framework for secure AWS workloads |
| [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/) | AWS | Intermediate | Free | Examples | Policy evaluation and least privilege |
| [AWS CloudTrail User Guide](https://docs.aws.amazon.com/cloudtrail/) | AWS | Intermediate | Free | Examples | Control-plane logging and audit |
| [Microsoft Entra documentation](https://learn.microsoft.com/en-us/entra/) | Microsoft | Intermediate | Free | Some labs | Identity, conditional access, and federation |
| [Microsoft Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/) | Microsoft | Intermediate | Free docs; paid product tiers | No | Cloud posture and workload protection |
| [Google Cloud security architecture framework](https://cloud.google.com/architecture/framework/security) | Google | Intermediate | Free | No | Security design principles across GCP |
| [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/) | Kubernetes | Intermediate–advanced | Free | Examples | Cluster and workload hardening |
| [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials) | HashiCorp | Beginner–intermediate | Free tutorials; Terraform Cloud has a free tier | Yes | Infrastructure as code fundamentals |
| [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | Rhino Security Labs | Advanced | Free, open source; AWS charges may apply | Yes | Deliberately vulnerable cloud scenarios |
| [flaws.cloud](https://flaws.cloud/) | Summit Route | Beginner–intermediate | Free | Yes | Common AWS misconfigurations |
| [Prowler](https://github.com/prowler-cloud/prowler) | Prowler | Intermediate | Free, open source | Yes | Cloud security assessment and reporting |
| [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) | Center for Internet Security | Intermediate | Free account required for some formats | No | Hardening baselines per provider |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Account with budget and billing alarm | AWS, Azure, or GCP free tier | Cost safety and basic guardrails | Free tier, watch limits |
| 2 | Private storage and public-access fix | Cloud sandbox | Data exposure and policy | Free tier |
| 3 | Prowler or ScoutSuite assessment | Cloud sandbox | Posture review and triage | Free |
| 4 | Least-privilege IAM refactor | Cloud sandbox | Policy analysis and testing | Free tier |
| 5 | Terraform secure module | Local plus sandbox | IaC, scanning, and review | Free |
| 6 | CloudGoat scenario | Isolated AWS account | Attack path and detection | May incur small charges |
| 7 | flaws.cloud challenges | Browser | Misconfiguration recognition | Free |
| 8 | Detection and containment tabletop | Local notes plus sandbox logs | Incident response in cloud | Free tier |

Safe-lab caveat: always use a dedicated sandbox account, never a work or shared account. Set a budget, an alert, and a resource cleanup reminder before you deploy. CloudGoat creates real vulnerable resources; run only the scenarios you need, tear them down, and verify the account is clean. Do not test a provider's metadata service from resources you do not own, and do not attempt to access other tenants. Treat cloud credentials like production secrets.

## Portfolio projects

1. **Secure landing zone.** Terraform for a small multi-account or multi-project structure with centralized logging, guardrails, and a cost-control policy. Include a diagram and a threat model.
2. **IAM least-privilege review.** Take an over-permissive role, analyze actual usage, produce a reduced policy, and test that the workload still works. Show the diff and the residual risk.
3. **Cloud detection lab.** Run one CloudGoat scenario, write the detection query, build a timeline, and document containment. Redact account IDs and keys.
4. **Container hardening pack.** A hardened Dockerfile, a Kubernetes policy set, and a scan report showing the before and after.
5. **Incident response runbook.** A cloud-identity compromise playbook with roles, first actions, evidence sources, and communication steps, validated in a tabletop exercise.

## Milestones and self-assessment

**Months 0–3**

- [ ] I can explain shared responsibility for compute, storage, and identity.
- [ ] I created a cloud account with a budget and billing alarm.
- [ ] I deployed and deleted a small workload without leaving resources behind.
- [ ] I can read an IAM policy and predict its effect.

**Months 3–6**

- [ ] I enabled centralized logging across the account or organization.
- [ ] I found and fixed a public-storage or overly broad network rule.
- [ ] I ran Prowler or ScoutSuite and triaged the findings.
- [ ] I can trace one API call through the logs.

**Months 6–10**

- [ ] I wrote a Terraform module that enforces encryption and logging.
- [ ] I hardened a container image and a Kubernetes workload.
- [ ] I completed one CloudGoat scenario and detected it.
- [ ] I can explain blast radius for an identity compromise.

**Months 10–15**

- [ ] I wrote a cloud incident runbook and tested it in a tabletop.
- [ ] My portfolio has a landing zone, an IAM review, and a detection write-up.
- [ ] I mapped a finding to CIS and NIST controls.
- [ ] I completed a mock architecture review and defended a trade-off.

## Certifications

Cloud certifications are common in job adverts but optional. Every exam is paid; study material is often free through the provider. Lab accounts may incur charges even when training is free.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | General baseline; pair it with cloud depth |
| [AWS Certified Security – Specialty](https://aws.amazon.com/certification/certified-security-specialty/) | AWS | Intermediate–advanced | AWS Skill Builder free courses and docs | Paid exam | Strong signal for AWS security roles |
| [Azure Security Engineer Associate (AZ-500)](https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/) | Microsoft | Intermediate | Microsoft Learn paths are free | Paid exam | Identity and Defender depth for Azure |
| [Google Professional Cloud Security Engineer](https://cloud.google.com/learn/certification/cloud-security-engineer) | Google | Intermediate–advanced | Google Cloud Skills Boost has free content | Paid exam | Best fit for GCP-heavy organizations |
| [CCSP](https://www.isc2.org/certifications/ccsp) | ISC2 | Advanced | Official outline and self-study | Paid exam | Management-oriented cloud security; experience recommended |
| [CCSK](https://cloudsecurityalliance.org/) | Cloud Security Alliance | Intermediate | CSA research is free; course and exam paid | Paid exam | Vendor-neutral cloud governance baseline |
| [CKS](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) | Linux Foundation | Advanced | Kubernetes docs and free tutorials | Paid exam | Requires CKA; strong for platform security roles |

## Common detours and mistakes

- **Console-only learning.** If you cannot express a design in Terraform or a CLI, you cannot review it or reproduce it.
- **Ignoring identity.** Most cloud incidents involve credentials and permissions, not zero-days. IAM deserves the most time.
- **Free-tier bill shock.** Forgetting to delete NAT gateways, load balancers, or clusters is a common and expensive mistake. Budget alerts first.
- **Treating cloud as a network problem.** Security groups matter, but control-plane logging and identity policy usually matter more.
- **Hardcoding secrets.** Secrets in code, images, or user data are still the most common cloud leak. Use a secret manager.
- **Chasing three providers.** Depth in one provider transfers better than shallow familiarity with three consoles.
- **Certificates without labs.** An exam proves recall. A landing zone and a runbook prove judgment.
- **Skipping compliance context.** Engineers who can map controls to CIS, NIST, or ISO requirements are far more effective in enterprise roles.

## Next steps

1. Choose one provider, create a sandbox account, and set a budget before anything else.
2. Work through the [cloud security guide](../cloud-security/README.md) and [01-home-lab.md](../practical-projects/01-home-lab.md) for the local container piece.
3. Build the secure Terraform module before attempting CloudGoat; you need to recognize what "fixed" looks like.
4. If detection interests you, continue with the [SOC analyst roadmap](soc-analyst.md); for broader engineering, see the [cybersecurity engineer roadmap](cybersecurity-engineer.md).
5. Use the [free courses index](../resources/free-courses/README.md) and [exercises](../exercises/README.md) to add structure.

## References

- [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/)
- [Microsoft Azure security fundamentals](https://learn.microsoft.com/en-us/azure/security/fundamentals/)
- [Google Cloud security architecture framework](https://cloud.google.com/architecture/framework/security)
- [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [MITRE ATT&CK for Cloud](https://attack.mitre.org/matrices/enterprise/cloud/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
