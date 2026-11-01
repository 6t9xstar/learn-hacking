# Cybersecurity Engineer Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 12–20 months**

[Home](../README.md) › [Roadmaps](README.md) › Cybersecurity engineer

Cybersecurity engineers build and operate security controls across systems, networks, and cloud platforms. The role is broader than penetration testing and more hands-on than governance: you design a segmented network, implement least-privilege identity, automate hardening, wire logs into a detection pipeline, review a CI/CD pipeline, and explain the residual risk to people who own the business. It is a good path for people who like building reliable systems and want security to be part of the engineering process rather than an inspection at the end.

Read [ETHICS.md](../ETHICS.md). Engineering work grants privileged access; change control, least privilege, and respect for production systems are part of the discipline, not optional etiquette.

## At a glance

| Item | Detail |
|---|---|
| Target role | Security engineer, infrastructure security engineer, cloud security engineer (generalist), DevSecOps engineer |
| Realistic duration | 12–20 months at 8–10 hours per week; 6–12 months with systems administration, network engineering, or DevOps experience |
| Cost | Free documentation and training paths; labs may need a cloud account; exams are paid |
| Lab needs | 16–32 GB RAM; virtualization; Linux and Windows VMs; a small network with segmentation; Terraform; CI/CD runner; a SIEM or log stack |
| Difficulty | High; breadth across systems, networks, cloud, and code |
| Main output | A security architecture document, IaC guardrails, a hardening baseline, and an automation project |

This is a map, not a race. The breadth is the point and also the trap: without depth in at least one area, the role becomes coordination rather than engineering.

## Who this is for

This roadmap suits system administrators, network engineers, DevOps practitioners, and security analysts who want to build controls rather than only test or monitor them. It also suits developers who want to own security in the software delivery lifecycle.

Honest prerequisites:

- **Operating system administration.** Users, permissions, services, packages, logs, and patching on Linux and Windows.
- **Networking.** Subnets, routing, firewalls, DNS, and TLS.
- **Scripting.** Python and Bash; PowerShell is valuable in Microsoft environments.
- **Cloud basics.** At least one provider's compute, storage, identity, and networking.
- **Git and CI/CD familiarity.** You will review pipelines and infrastructure code.
- **Business awareness.** Security engineering is full of trade-offs between risk, cost, and usability.

You do not need to be a senior developer, but you should be comfortable reading code, writing small tools, and reviewing configuration.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Security architecture | Design controls and trust boundaries for a system | An architecture document with threat model and decisions |
| Identity and access | Implement least privilege and strong authentication | An IAM design with role definitions and tests |
| Hardening | Apply and verify baselines across operating systems | A hardening report with scan evidence |
| Network security | Segment, filter, and monitor traffic | A network diagram and firewall rule review |
| Automation | Replace manual controls with tested code | A pipeline or script with tests and rollback |
| Secure SDLC | Integrate security into build and deploy | A CI pipeline with SAST, dependency, and secret checks |
| Logging and detection | Ensure security events are collected and usable | A logging standard and a detection query |
| Risk and governance | Explain controls in business and framework terms | A risk register and control mapping |

Typical entry-level tasks:

- Review a firewall rule set and remove rules that are no longer justified.
- Implement MFA and least-privilege roles for a small application.
- Add SAST, dependency scanning, and secret scanning to a CI pipeline.
- Apply a CIS benchmark to a server and document exceptions.
- Write a logging standard and onboard one application.

## Learning sequence

The sequence builds engineering depth first, then architecture and identity, then automation and secure delivery, then operations and governance.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Engineering foundations | 10–12 weeks | Hardened lab and network design |
| 2 | Security architecture and identity | 10–12 weeks | Architecture document and IAM design |
| 3 | Automation and secure SDLC | 10–12 weeks | CI pipeline and IaC guardrails |
| 4 | Operations, logging, and response | 8–10 weeks | Logging standard and runbook |
| 5 | Risk, governance, and portfolio | 6–8 weeks | Risk register and portfolio |

### Stage 1 — Engineering foundations

| Element | Detail |
|---|---|
| Goal | Build and operate a small, secure environment from scratch. |
| Topics | Linux and Windows administration; services and package management; network segmentation; firewalls; DNS and TLS; Git; virtualization; backups and snapshots; patch management. |
| Free learning | [Microsoft Learn](https://learn.microsoft.com/en-us/training/), [Cisco Networking Academy](https://www.netacad.com/), [Linux Foundation training](https://training.linuxfoundation.org/), [Ansible documentation](https://docs.ansible.com/). |
| Labs | Build a segmented lab with a management network, a server network, and a client network. Apply firewall rules. Automate user creation with Ansible or a script. Document backup and restore. |
| Deliverable | A lab build document with topology, firewall rules, and restore procedure. |
| Exit criteria | You can rebuild the environment from documentation and explain each firewall rule. |

### Stage 2 — Security architecture and identity

| Element | Detail |
|---|---|
| Goal | Design controls deliberately and implement identity as the primary boundary. |
| Topics | Threat modeling; trust boundaries; defence in depth; zero-trust concepts; IAM roles and policies; federation; MFA; privileged access; secrets management; encryption and key management; architecture decision records. |
| Free learning | [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework), [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/final), [Microsoft Entra documentation](https://learn.microsoft.com/en-us/entra/), [AWS IAM User Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/). |
| Labs | Threat model a three-tier application. Implement role-based access with MFA in a lab. Move a secret from a configuration file into a secret manager. Write an architecture decision record for one control. |
| Deliverable | An architecture document with a threat model, trust boundaries, control decisions, and an IAM design. |
| Exit criteria | You can justify each control by the risk it reduces and explain what it does not cover. |

### Stage 3 — Automation and secure SDLC

| Element | Detail |
|---|---|
| Goal | Make secure configuration repeatable and embed checks in delivery. |
| Topics | Terraform and infrastructure as code; policy as code; CI/CD pipelines; SAST, DAST, dependency, container, and secret scanning; artifact signing concepts; branch protection; least-privilege pipeline identities; rollback. |
| Free learning | [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials), [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/), [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/), [GitHub Actions documentation](https://docs.github.com/en/actions). |
| Labs | Build a CI pipeline that runs SAST, dependency, and secret scanning on a small app. Write Terraform with a policy check. Introduce a failing check and verify the pipeline blocks the merge. |
| Deliverable | A working pipeline with security gates, documented exceptions, and a rollback path. |
| Exit criteria | A developer can understand why a build failed and how to fix it without asking you. |

### Stage 4 — Operations, logging, and response

| Element | Detail |
|---|---|
| Goal | Operate controls in production and make sure security events are visible and actionable. |
| Topics | Logging standards; SIEM ingestion; endpoint telemetry; alert design; patch and vulnerability management; configuration drift; incident response roles; NIST 800-61; tabletop exercises; post-incident review. |
| Free learning | [Wazuh documentation](https://documentation.wazuh.com/), [Elastic documentation](https://www.elastic.co/guide/index.html), [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final), [CIS Controls](https://www.cisecurity.org/controls). |
| Labs | Write a logging standard for one application. Onboard its logs to a SIEM and build one alert. Run a tabletop for a compromised server and update the runbook. |
| Deliverable | A logging standard, one tested alert, and an incident runbook. |
| Exit criteria | You can trace an event from source to alert and explain what would cause a false positive. |

Ethics reminder: production access is privileged. Test changes in a lab or staging environment, follow change control, and never disable logging or controls to make a task easier. Handle secrets and personal data according to policy. See [ETHICS.md](../ETHICS.md).

### Stage 5 — Risk, governance, and portfolio

| Element | Detail |
|---|---|
| Goal | Connect engineering controls to risk and demonstrate a complete security engineering skill set. |
| Topics | Risk registers; control frameworks (NIST CSF, ISO 27001, CIS); compliance context (SOC 2, PCI DSS); security metrics; vendor review; documentation; interview system design. |
| Free learning | [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework), [CIS Controls](https://www.cisecurity.org/controls), [SANS whitepapers](https://www.sans.org/white-papers/), [ISACA resources](https://www.isaca.org/). |
| Labs | Build a risk register for your lab. Map five controls to NIST CSF and CIS. Present an architecture review to a peer and defend a trade-off. |
| Deliverable | A portfolio with an architecture document, pipeline, hardening report, and risk register. |
| Exit criteria | You can explain a control's cost, coverage, and residual risk to a non-technical stakeholder. |

## Sequence diagram

```text
Stage 1  Engineering foundations
  Linux | Windows | network | firewall | backup | Git
        |
        v
Stage 2  Architecture + identity
  threat model -> trust boundaries -> IAM -> MFA -> secrets
        |
        v
Stage 3  Automation + secure SDLC
  Terraform -> policy as code -> CI gates -> rollback
        |
        v
Stage 4  Operations + logging + response
  telemetry -> alerts -> patching -> runbook -> tabletop
        |
        v
Stage 5  Risk + governance + portfolio
  controls -> frameworks -> metrics -> interview
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [Microsoft Learn](https://learn.microsoft.com/en-us/training/) | Microsoft | Beginner–advanced | Free training; exams paid | Some labs | Windows, Azure, and identity engineering |
| [AWS Skill Builder](https://explore.skillbuilder.aws/) | AWS | Beginner–advanced | Free digital courses; paid subscription for some labs | Some | AWS engineering and security |
| [Google Cloud Skills Boost](https://www.cloudskillsboost.google/) | Google | Beginner–advanced | Some free courses; labs need credits or subscription | Yes | GCP engineering and security |
| [Cisco Networking Academy](https://www.netacad.com/) | Cisco | Beginner | Free courses with account | Yes | Networking and infrastructure fundamentals |
| [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) | NIST | Intermediate | Free | No | A common language for risk and controls |
| [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/final) | NIST | Advanced | Free | No | A control catalogue for enterprise programs |
| [CIS Controls](https://www.cisecurity.org/controls) | Center for Internet Security | Intermediate | Free | No | Prioritized, practical safeguards |
| [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) | Center for Internet Security | Intermediate | Free account for some formats | No | Configuration hardening baselines |
| [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) | OWASP | Intermediate | Free | No | Security in the delivery pipeline |
| [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials) | HashiCorp | Beginner–intermediate | Free | Yes | Infrastructure as code |
| [Ansible documentation](https://docs.ansible.com/) | Red Hat | Intermediate | Free, open source | Yes | Configuration automation |
| [Wazuh documentation](https://documentation.wazuh.com/) | Wazuh | Beginner–intermediate | Free, open source | Yes | Logging, detection, and response |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Segmented network with firewall rules | Local virtualization | Architecture and filtering | Free |
| 2 | Identity and MFA implementation | Local or cloud sandbox | Least privilege and authentication | Free tier |
| 3 | Secrets migration | Local app | Secret management | Free |
| 4 | CI pipeline with security gates | GitHub Actions or local runner | SAST, dependencies, secrets | Free tier |
| 5 | Terraform with policy checks | Local plus sandbox | IaC and guardrails | Free |
| 6 | CIS hardening and scan | Local VM | Baseline and exceptions | Free |
| 7 | Logging and alerting | Wazuh or Elastic | Telemetry and detection | Free |
| 8 | Incident tabletop | Local | Response roles and decisions | Free |

Safe-lab caveat: use isolated VMs and a sandbox cloud account with budget alerts. Do not apply hardening or firewall changes to production without change approval. CI/CD credentials should be scoped to the lab repository. Test destructive automation against snapshots and verify rollback before trusting it. Do not collect personal data in lab logs.

## Portfolio projects

1. **Security architecture document.** A three-tier application with a threat model, trust boundaries, control decisions, and an architecture decision record for two trade-offs.
2. **IaC guardrails.** A Terraform module with policy checks, tests, and a README explaining what it prevents and what it does not.
3. **Secure CI pipeline.** A repository with SAST, dependency, secret, and container scanning, branch protection, and a documented exception process.
4. **Hardening baseline.** A CIS-aligned configuration for one operating system, with scan evidence, exceptions, and a rollback plan.
5. **Risk register and control map.** Five risks with likelihood, impact, controls, owner, and framework mapping. This shows you can speak to management without losing technical credibility.

## Milestones and self-assessment

**Months 0–4**

- [ ] I built a segmented lab and documented the firewall rules.
- [ ] I can administer Linux and Windows services from the command line.
- [ ] I automated a repetitive administrative task.
- [ ] I can explain the purpose of each network segment.

**Months 4–8**

- [ ] I threat modeled an application and identified trust boundaries.
- [ ] I implemented least privilege and MFA in a lab.
- [ ] I moved a secret into a secret manager.
- [ ] I wrote an architecture decision record.

**Months 8–14**

- [ ] I built a CI pipeline with at least three security gates.
- [ ] I wrote Terraform with a policy check and tests.
- [ ] I hardened a VM against a CIS benchmark and documented exceptions.
- [ ] I onboarded logs and built one tested alert.

**Months 14–20**

- [ ] I ran a tabletop and updated a runbook.
- [ ] I built a risk register mapped to NIST CSF and CIS.
- [ ] My portfolio has an architecture document, pipeline, and hardening report.
- [ ] I completed a mock system design interview and defended a trade-off.

## Certifications

Certifications are optional and useful mainly for HR filters and structured study. Every exam below is paid; free study material exists through vendor learning paths. Verify prerequisites and current versions.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | Broad baseline for security engineering |
| [CCNA](https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html) | Cisco | Beginner–intermediate | Cisco Learning Network resources | Paid exam | Strong networking foundation; not security-specific |
| [AZ-500](https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/) | Microsoft | Intermediate | Microsoft Learn path is free | Paid exam | Azure identity and platform security |
| [AWS Certified Security – Specialty](https://aws.amazon.com/certification/certified-security-specialty/) | AWS | Intermediate–advanced | AWS Skill Builder free courses | Paid exam | AWS security engineering |
| [CKS](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) | Linux Foundation | Advanced | Kubernetes docs and free tutorials | Paid exam | Container and cluster security; requires CKA |
| [CISSP](https://www.isc2.org/certifications/cissp) | ISC2 | Advanced | Official outline and self-study | Paid exam | Broad management-oriented credential; experience requirement |
| [CISM](https://www.isaca.org/credentialing/cism) | ISACA | Advanced | ISACA resources and community study | Paid exam | Governance and management focus |

## Common detours and mistakes

- **Breadth without depth.** Knowing a little about everything makes you a coordinator. Go deep in one area such as identity, cloud, or detection.
- **Ignoring business context.** A control that blocks work will be bypassed. Understand the workflow before designing the control.
- **Tool-first engineering.** Buying a product is not a strategy. Define the risk and the control objective first.
- **No coding.** Manual console work does not scale. Learn enough Python, Terraform, and pipeline configuration to automate.
- **Leaving cloud out.** Most workloads now touch a cloud provider. On-premises-only skills limit your options.
- **GRC without technical credibility.** Framework knowledge is useful, but engineers are hired to implement controls, not only document them.
- **Certificates instead of artifacts.** A pipeline, a hardening report, and an architecture document are stronger evidence than a stack of exams.
- **No documentation.** Undocumented controls cannot be audited, transferred, or improved.

## Next steps

1. Build the lab in [01-home-lab.md](../practical-projects/01-home-lab.md), then add segmentation and a logging stack.
2. Read the [foundations guide](../foundations/README.md) for gaps and the [checklists](../checklists/README.md) for hardening reviews.
3. Choose a depth area: [cloud security](cloud-security-engineer.md), [blue team engineering](blue-team-engineer.md), or [network penetration testing](network-pentester.md).
4. Build the secure CI pipeline early; it is the most transferable artifact for modern roles.
5. Use the [exercises](../exercises/README.md) and [resources](../resources/free-courses/README.md) to keep practice varied.

## References

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final)
- [CIS Controls](https://www.cisecurity.org/controls)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/)
- [DISA STIGs](https://public.cyber.mil/stigs/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
