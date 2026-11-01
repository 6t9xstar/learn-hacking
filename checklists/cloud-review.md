# Cloud Review Checklist: Identity, Logging, Network, Data, Compute, and Cost

[Home](../README.md) / [Checklists](README.md) / Cloud review

Use this checklist for an authorized review of a cloud tenant, subscription, or project. It is provider-neutral, with mapping notes for AWS, Microsoft Azure, and Google Cloud. It focuses on configuration evidence and risk reasoning, not on collecting credentials or bypassing controls.

> **Authorized tenants only.** A cloud account is not a public target. Review only accounts, subscriptions, projects, and regions named in the engagement. Do not access customer data, rotate production keys, or change configuration without explicit approval and a rollback plan.

**Engagement ID:** `[ENG-YYYY-NNN]`
**Provider and account:** `[AWS / Azure / Google Cloud; account or subscription ID]`
**Regions in scope:** `[List]`
**Review window:** `[Start and end, time zone]`

## Scope reminder

- Record the account or subscription ID, organization, and billing owner.
- Define whether the review is read-only or includes approved changes.
- List workloads, data classifications, and regulatory constraints.
- Identify shared services, landing zones, and third-party integrations.
- Confirm that log access is authorized and that evidence handling is agreed.

## 1. Identity and access

- [ ] Human identities are federated to the enterprise identity provider where possible. — Owner: ___; Evidence: ___
- [ ] Root, global administrator, or organization-owner accounts are tightly controlled and monitored. — Owner: ___; Evidence: ___
- [ ] MFA is enforced for privileged and console access. — Owner: ___; Evidence: ___
- [ ] Long-lived access keys and service-account keys are inventoried and minimized. — Owner: ___; Evidence: ___
- [ ] Workloads use short-lived identity (roles, workload identity federation, managed identities). — Owner: ___; Evidence: ___
- [ ] Permissions follow least privilege and are reviewed for wildcards and privilege escalation paths. — Owner: ___; Evidence: ___
- [ ] Separation of duties exists between deployment, approval, and audit roles. — Owner: ___; Evidence: ___
- [ ] Break-glass accounts are documented, tested, and alerted on. — Owner: ___; Evidence: ___
- [ ] Cross-account and cross-tenant trust relationships are documented and reviewed. — Owner: ___; Evidence: ___
- [ ] Access reviews and joiner/mover/leaver processes are evidenced. — Owner: ___; Evidence: ___

## 2. Logging and monitoring

- [ ] Control-plane audit logging is enabled in every in-scope region. — Owner: ___; Evidence: ___
- [ ] Data-plane logging is enabled for critical storage and database services where supported. — Owner: ___; Evidence: ___
- [ ] Logs are centralized in a protected account or project. — Owner: ___; Evidence: ___
- [ ] Log retention meets policy and investigation needs. — Owner: ___; Evidence: ___
- [ ] Log integrity controls prevent or detect deletion and modification. — Owner: ___; Evidence: ___
- [ ] Alerts cover privilege changes, key creation, logging changes, and public exposure. — Owner: ___; Evidence: ___
- [ ] Security findings are routed to an owner and tracked to closure. — Owner: ___; Evidence: ___
- [ ] Time synchronization and timestamp formats are consistent. — Owner: ___; Evidence: ___

## 3. Network

- [ ] Default networks and default firewall rules are removed or justified. — Owner: ___; Evidence: ___
- [ ] Public ingress is limited to intended services and protected by a load balancer, WAF, or equivalent. — Owner: ___; Evidence: ___
- [ ] Management interfaces are restricted to approved networks or zero-trust access. — Owner: ___; Evidence: ___
- [ ] Egress is restricted to approved destinations where practical. — Owner: ___; Evidence: ___
- [ ] VPC/VNet segmentation separates public, application, data, and management tiers. — Owner: ___; Evidence: ___
- [ ] Peering, transit gateways, and hybrid links are documented and reviewed. — Owner: ___; Evidence: ___
- [ ] Private endpoints are used for managed services where available. — Owner: ___; Evidence: ___
- [ ] DNS logging and resolver configuration are reviewed. — Owner: ___; Evidence: ___
- [ ] DDoS protections and rate limits are enabled for public endpoints. — Owner: ___; Evidence: ___

## 4. Storage and data protection

- [ ] Buckets, blobs, and object stores are classified and owned. — Owner: ___; Evidence: ___
- [ ] Public access is blocked by default and verified with configuration evidence. — Owner: ___; Evidence: ___
- [ ] Encryption at rest uses provider-managed or customer-managed keys as required. — Owner: ___; Evidence: ___
- [ ] Key management, rotation, and access policies are documented. — Owner: ___; Evidence: ___
- [ ] Versioning, soft delete, and backup protect against ransomware and accidental deletion. — Owner: ___; Evidence: ___
- [ ] Lifecycle and retention rules match legal and business requirements. — Owner: ___; Evidence: ___
- [ ] Cross-region replication is intentional and protected. — Owner: ___; Evidence: ___
- [ ] Database snapshots and exports are access-controlled. — Owner: ___; Evidence: ___
- [ ] Secrets are stored in a managed secret service, not in code or images. — Owner: ___; Evidence: ___

## 5. Compute and serverless

- [ ] Instances and functions use approved, patched images. — Owner: ___; Evidence: ___
- [ ] Administrative access uses session management, not shared keys. — Owner: ___; Evidence: ___
- [ ] Instance metadata services are hardened (IMDSv2 or equivalent). — Owner: ___; Evidence: ___
- [ ] Public IP addresses are inventoried and justified. — Owner: ___; Evidence: ___
- [ ] Auto-scaling and quota limits are configured to resist abuse. — Owner: ___; Evidence: ___
- [ ] Serverless permissions are scoped to the function's needs. — Owner: ___; Evidence: ___
- [ ] Function triggers and public endpoints are reviewed for unintended exposure. — Owner: ___; Evidence: ___
- [ ] Patch and vulnerability findings are tracked to remediation. — Owner: ___; Evidence: ___

## 6. Containers and orchestration

- [ ] Container images come from approved registries and are scanned. — Owner: ___; Evidence: ___
- [ ] Images run as non-root with read-only filesystems where possible. — Owner: ___; Evidence: ___
- [ ] Kubernetes RBAC is least privilege and service-account tokens are scoped. — Owner: ___; Evidence: ___
- [ ] Admission controls block privileged pods, host mounts, and unsafe capabilities. — Owner: ___; Evidence: ___
- [ ] Network policies restrict pod-to-pod traffic. — Owner: ___; Evidence: ___
- [ ] Secrets are mounted from a managed secret store, not baked into images. — Owner: ___; Evidence: ___
- [ ] The control plane audit log is enabled and retained. — Owner: ___; Evidence: ___
- [ ] Cluster and node patching is owned and scheduled. — Owner: ___; Evidence: ___

For Kubernetes-specific guidance, see the [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/) and the [Docker documentation](https://docs.docker.com/).

## 7. Cost and abuse

- [ ] Budgets and anomaly alerts are configured. — Owner: ___; Evidence: ___
- [ ] Unused resources, orphaned volumes, and idle instances are reviewed. — Owner: ___; Evidence: ___
- [ ] Cryptomining indicators (GPU quotas, unexpected instance families, high egress) are monitored. — Owner: ___; Evidence: ___
- [ ] Spend anomalies are routed to security and finance owners. — Owner: ___; Evidence: ___
- [ ] Quotas limit the blast radius of stolen credentials. — Owner: ___; Evidence: ___
- [ ] Cost allocation tags identify owners and environments. — Owner: ___; Evidence: ___

## 8. Provider mapping

| Control area | AWS | Microsoft Azure | Google Cloud |
| --- | --- | --- | --- |
| Audit logs | CloudTrail | Activity Log | Cloud Audit Logs |
| Identity | IAM and IAM Identity Center | Microsoft Entra ID and Azure RBAC | Cloud IAM |
| Network firewall | Security groups and Network ACLs | Network security groups | VPC firewall rules |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Key management | KMS | Key Vault | Cloud KMS |
| Posture tooling | Security Hub and Config | Defender for Cloud | Security Command Center |
| Container orchestration | EKS | AKS | GKE |

## 9. Evidence and reporting

- [ ] Each finding cites the configuration, API response, or console evidence and the time observed. — Owner: ___; Evidence: ___
- [ ] Account IDs, keys, and sensitive resource names are redacted in shared reports. — Owner: ___; Evidence: ___
- [ ] Findings state whether the issue is confirmed or requires validation. — Owner: ___; Evidence: ___
- [ ] Remediation names the specific control and owner, not just "harden IAM". — Owner: ___; Evidence: ___
- [ ] Retest steps are documented for each finding. — Owner: ___; Evidence: ___

## Stop conditions

Stop if you encounter customer data beyond the agreed scope, if a change would affect production availability, if a credential is exposed, or if the account boundary is unclear. Escalate to the engagement owner and the cloud account owner.

## References

- [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) — AWS security design guidance.
- [Microsoft Azure security benchmarks](https://learn.microsoft.com/azure/security/benchmarks/) — Azure control baselines.
- [Google Cloud security foundations](https://cloud.google.com/architecture/security-foundations) — Google Cloud landing-zone guidance.
- [Kubernetes security](https://kubernetes.io/docs/concepts/security/) — cluster security concepts and controls.
- [CIS Controls](https://www.cisecurity.org/controls) — prioritized safeguards.

---

**Related:** [Checklist index](README.md) · [Home lab](home-lab.md) · [Exercises index](../exercises/README.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
