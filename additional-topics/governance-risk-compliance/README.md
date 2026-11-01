[Repository home](../../README.md) / Additional topics / Governance, risk, and compliance

# Governance, Risk, and Compliance

Governance, risk, and compliance (GRC) is the discipline that connects security work to business decisions and legal obligations. Governance sets direction and accountability. Risk management identifies what could go wrong and decides what to do about it. Compliance demonstrates that required controls exist and work. This guide is for security practitioners, auditors, and managers who need to build a program that is useful rather than theatrical.

GRC is often misunderstood as paperwork. Done well, it is the mechanism by which an organization makes explicit choices: how much risk it will accept, which obligations it must meet, who owns each control, and how it will prove that the control operates. Done badly, it produces policies nobody follows and audit evidence manufactured the week before an assessment.

> This guide is educational and is not legal advice. Regulations and contractual obligations depend on your jurisdiction, sector, and agreements. Consult qualified counsel and auditors for decisions about your organization.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Beginner to intermediate; judgment and communication dominate |
| Realistic time | 80–140 hours to build a working risk register and control map |
| Cost | Free frameworks and tools; some standards such as ISO/IEC 27001 are paid documents |
| Prerequisites | Security fundamentals, spreadsheet comfort, business writing |
| Lab requirement | A fictional company or your own program; open-source compliance scanners |
| Best for | Security analysts, auditors, risk managers, aspiring CISOs |

## Why this field matters

Every security program eventually faces the same questions: What are we protecting? What could happen? What are we doing about it? How do we know it works? Who accepted the remaining risk? GRC provides the structure to answer those questions consistently and to defend the answers to a board, a regulator, a customer, or an insurer.

It also prevents two common failure modes. The first is unbounded security spending on controls that do not address the largest risks. The second is compliance without security: passing an audit while remaining exposed because controls exist on paper but not in practice. Good GRC ties spending and evidence to real risk reduction.

## What you will learn

- Distinguish governance, risk management, and compliance, and explain how they interact.
- Run a qualitative and a quantitative risk assessment.
- Write a risk appetite statement and apply tolerance thresholds.
- Map controls across NIST CSF 2.0, NIST SP 800-53, CIS Controls v8, and ISO/IEC 27001.
- Understand the scope and evidence expectations of PCI DSS, HIPAA, GDPR, and SOC 2.
- Assess third-party risk and review assurance reports critically.
- Build a risk register, exception process, and audit evidence pack.
- Report security risk to executives in business language.

## Prerequisites and honest expectations

You should understand basic security concepts — identity, patching, logging, encryption, incident response — and be comfortable with spreadsheets. You do not need a law degree, but you must know when to involve legal counsel. You should also be able to write clearly and briefly; most GRC deliverables are read by busy people.

Expect to spend time reading standards and translating them into plain language. Some frameworks are large, and vendors will try to sell you a platform before you understand your process. Start with a spreadsheet and a small scope. Maturity comes from consistent operation, not from tooling.

## Core concepts

### Governance, risk, and compliance defined

Governance is the system of direction and accountability: who decides, who owns, what the organization will and will not do, and how performance is measured. It includes the board, executive leadership, policies, committees, and reporting lines. Risk management is the process of identifying, analyzing, treating, and monitoring uncertainty. Compliance is the act of meeting external requirements and proving it.

The three are connected but not interchangeable. A governance failure looks like no owner for a critical system. A risk failure looks like an unassessed vendor with access to customer data. A compliance failure looks like a missing control evidence for an audit. A mature program addresses all three without treating the audit as the goal.

### The three lines model and accountability

The three lines model separates management, oversight, and independent assurance. The first line is operational management, which owns and runs controls. The second line is risk and compliance, which sets frameworks, advises, and monitors. The third line is internal audit, which provides independent assurance to the board.

The model is a guide, not a law. Small organizations combine roles, but they should still separate the person who operates a control from the person who declares it effective. If the same team designs, operates, and audits its own work, the assurance is weak. Document where roles are combined and how independence is preserved.

### Risk assessment: identify, analyze, evaluate

A risk assessment starts with assets and processes, then identifies threats and vulnerabilities that could affect them. For each risk, describe the event, the cause, and the consequence. "Ransomware encrypts the order database, halting fulfillment for three days" is a usable risk statement; "cyber risk" is not.

Analysis estimates likelihood and impact, using qualitative scales or quantitative methods. Evaluation compares the result to risk criteria and decides whether to treat, tolerate, transfer, or terminate. Record assumptions and data sources. A risk assessment is a snapshot, not a permanent truth; review it when the system, threat landscape, or business changes.

### Qualitative and quantitative risk methods

Qualitative methods use scales such as low, medium, and high, often in a five-by-five matrix. They are fast and understandable, but two people can score the same risk differently. Calibrate the scales with definitions and examples, and record the rationale.

Quantitative methods express risk in monetary or frequency terms. A simple approach uses single loss expectancy (SLE) and annualized rate of occurrence (ARO) to estimate annualized loss expectancy (ALE). FAIR (Factor Analysis of Information Risk) provides a more rigorous probabilistic model. Quantitative analysis is more defensible for investment decisions, but it depends on data quality and can create false precision. Use ranges and confidence intervals rather than a single number.

### Risk appetite, tolerance, and capacity

Risk appetite is the amount and type of risk an organization is willing to accept in pursuit of its objectives. Tolerance is the acceptable variation around that appetite, often expressed as thresholds that trigger escalation. Risk capacity is the maximum risk the organization can bear before it is insolvent or unable to operate.

A useful appetite statement is specific: "We accept low risk to customer data confidentiality; any risk rated high requires executive approval and a treatment plan within 30 days." Vague statements such as "we take security seriously" provide no decision rule. Publish the statement, apply it in the register, and review it annually.

### Control frameworks

Control frameworks provide a structured set of safeguards. NIST Cybersecurity Framework 2.0 organizes outcomes into govern, identify, protect, detect, respond, and recover. NIST SP 800-53 is a detailed catalog used widely in government and regulated industries. CIS Controls v8 offers eighteen prioritized controls with implementation groups for different maturity levels. ISO/IEC 27001 specifies requirements for an information security management system.

Frameworks overlap heavily. Choose a primary framework for structure, map others to it, and avoid maintaining four parallel control sets. Record which controls are inherited from a provider, which are shared, and which are owned by your organization. A control map is useful only if it reflects reality.

### Regulations: PCI DSS, HIPAA, GDPR, and SOC 2

PCI DSS applies to organizations that store, process, or transmit payment card data. It is a contractual standard maintained by the PCI Security Standards Council, with requirements for network security, encryption, access control, monitoring, and testing. Scope reduction — avoiding card data wherever possible — is often the most effective compliance strategy.

HIPAA governs protected health information in the United States, with security, privacy, and breach notification rules. GDPR governs personal data of people in the European Union and applies extraterritorially in many cases; it requires lawful basis, data minimization, security, breach notification, and rights fulfillment. SOC 2 is an attestation report against the AICPA Trust Services Criteria, commonly used to assure customers about a service organization's controls.

These regimes are not interchangeable, and none of them is a complete security program. Map their requirements to your control framework, identify shared evidence, and involve legal counsel for interpretation. Avoid claiming certification when the regime is an attestation or a self-assessment.

### Third-party risk management

Third parties introduce risk through access, data processing, concentration, and fourth-party dependencies. A tiering model helps: critical vendors get deeper due diligence and more frequent review than low-risk suppliers. Due diligence should cover security posture, incident history, data handling, subcontractors, financial stability, and contractual terms.

Assurance reports such as SOC 2 are useful but must be read critically. Check the scope, the period, the trust services criteria, complementary user entity controls, exceptions, and the auditor's opinion. A bridge letter may cover the gap after the report period. Contracts should include breach notification, audit rights, data return and deletion, subprocessor approval, and minimum security requirements.

### Audit evidence and control testing

Auditors test two things: design effectiveness (is the control designed to meet the objective?) and operating effectiveness (did it actually operate throughout the period?). Evidence can include configuration exports, tickets, logs, approvals, screenshots, policies, training records, and reconciliation reports.

Good evidence is complete, accurate, timely, and attributable. A screenshot with no date or system name is weak. A sampled ticket that shows approval before access was granted is strong. Keep evidence in a repository with an index, retain it for the required period, and avoid retroactively creating artifacts; auditors are trained to spot inconsistencies.

### Policies, standards, procedures, and exceptions

A policy states intent and mandatory requirements. A standard specifies measurable requirements, such as "TLS 1.2 or higher." A procedure describes how to perform a task. Keep the set small and usable; a policy library nobody reads is a liability, not a control.

Exceptions are a normal part of risk management. A good exception records the requirement, the reason, the compensating controls, the risk owner, the approval, and an expiry date. Review exceptions monthly and close them when the underlying issue is fixed. An exception without an expiry is a permanent waiver in disguise.

### Security metrics and reporting

Metrics should inform decisions. Leading indicators (patch coverage, MFA adoption, threat model completion) predict future outcomes. Lagging indicators (incidents, mean time to detect, losses) describe what happened. Key risk indicators (KRIs) track exposure against appetite and should have thresholds that trigger action.

Avoid vanity metrics such as number of alerts, number of policies, or lines of security documentation. Report trends, not just snapshots, and always include the business context. A board wants to know which risks are outside appetite, what is being done, what it costs, and what could happen if it is not fixed.

### Risk treatment and business communication

There are four treatment options: mitigate (add or improve controls), transfer (insurance or contract), avoid (stop the activity), and accept (documented decision). Each has a cost and a residual risk. Present options with tradeoffs, not a single recommendation disguised as the only choice.

Executives think in terms of revenue, cost, customers, legal exposure, and reputation. Translate technical findings into those terms. A useful structure is: the risk in one sentence, the likelihood and impact, the options with cost and residual risk, the recommendation, and the decision needed by when. Then record the decision.

## A risk register that works

A risk register is a living inventory of risks, not a one-time spreadsheet.

| Field | What to record |
| --- | --- |
| Risk ID and title | A stable identifier and a short event-oriented name |
| Asset and owner | The system or process affected and the accountable person |
| Threat and vulnerability | What could act on the weakness and why it exists |
| Likelihood and impact | Scores with the rationale and data source |
| Inherent score | Risk before controls, for context |
| Controls | Existing preventive and detective controls |
| Residual score | Risk after controls, with confidence |
| Treatment | Mitigate, transfer, avoid, or accept, with a plan and date |
| Appetite status | Within appetite, above tolerance, or escalated |

Review the register quarterly and after major changes. Close risks that no longer exist, and split risks that are too broad to treat.

## Legal and safe practice

> This material is educational and not legal advice. Compliance obligations vary by jurisdiction, sector, contract, and facts.

When working with real data, minimize collection and access. Risk registers and audit evidence often contain sensitive details about systems and people; store them with appropriate access controls and retention rules. Do not fabricate evidence, backdate approvals, or misrepresent a control's effectiveness. If you discover a compliance gap, escalate it through the appropriate channel and document the response.

Privacy assessments may involve personal data. Follow your organization's policies, applicable law, and any works council or regulatory consultation requirements. For cross-border data transfers, seek legal guidance rather than relying on a template. Read [ETHICS.md](../../ETHICS.md) for the repository's broader expectations.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Foundations | Governance, risk, compliance, three lines | A one-page glossary and role map |
| 2. Risk | Assessment methods, appetite, treatment | A risk register for a fictional company |
| 3. Controls | Frameworks, mapping, evidence | A control matrix with owners and evidence |
| 4. Obligations | PCI, HIPAA, GDPR, SOC 2 scoping | A scoping memo and obligation map |
| 5. Assurance | Audit testing, exceptions, reporting | An evidence pack and board brief |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [NIST CSF 2.0 Quick Start Guides](https://www.nist.gov/cyberframework/quick-start-guides) | NIST | Beginner | Free | No | A practical path from framework outcomes to actions |
| [CISA Cyber Essentials](https://www.cisa.gov/cyber-essentials) | CISA | Beginner | Free | Some | A baseline set of practices for small and mid-sized organizations |
| [CIS Controls v8](https://www.cisecurity.org/controls/v8) | Center for Internet Security | Intermediate | Free | Some | Prioritized safeguards and implementation groups |
| [NIST SP 800-30](https://csrc.nist.gov/pubs/sp/800/30/r1/final) | NIST | Intermediate | Free | No | A structured risk assessment methodology |
| [Microsoft compliance solutions](https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-compliance-solutions/) | Microsoft Learn | Beginner | Free | Some | Compliance, data governance, and risk concepts in practice |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework) | NIST | The common outcome-based framework across sectors |
| [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final) | NIST | A comprehensive security and privacy control catalog |
| [CIS Controls v8](https://www.cisecurity.org/controls) | Center for Internet Security | Prioritized safeguards with implementation groups |
| [ISO/IEC 27001](https://www.iso.org/standard/27001) | ISO/IEC | Requirements for an information security management system |
| [PCI DSS](https://www.pcisecuritystandards.org/) | PCI SSC | Payment card data security requirements |
| [HIPAA](https://www.hhs.gov/hipaa/index.html) | U.S. HHS | Health information privacy, security, and breach rules |
| [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | European Union | Personal data protection obligations in the EU |
| [SOC 2](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) | AICPA | Trust Services Criteria and attestation reporting |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [OpenSCAP](https://www.open-scap.org/) | OpenSCAP project | Free, local | Scan a lab VM against a public benchmark; do not scan production without approval |
| [Prowler](https://github.com/prowler-cloud/prowler) | Prowler | Free, self-hosted | Run against your own cloud account with read-only credentials |
| [Wazuh](https://wazuh.com/) | Wazuh | Free, self-hosted | Compliance and security monitoring in a home lab |
| [ComplianceAsCode](https://github.com/ComplianceAsCode/content) | ComplianceAsCode | Free, local | Build and test remediation content for Linux benchmarks |

## Essential open-source tools

Tools automate evidence collection and scanning. They do not decide risk, and they do not replace an auditor's judgment.

| Tool | Purpose | Link |
| --- | --- | --- |
| OpenSCAP | SCAP-based configuration and vulnerability assessment | [open-scap.org](https://www.open-scap.org/) |
| Prowler | Cloud security and compliance checks | [github.com/prowler-cloud/prowler](https://github.com/prowler-cloud/prowler) |
| Wazuh | Security monitoring with compliance dashboards | [wazuh.com](https://wazuh.com/) |
| CISO Assistant | Open-source GRC and risk management platform | [github.com/intuitem/ciso-assistant-community](https://github.com/intuitem/ciso-assistant-community) |
| Eramba | Governance, risk, and compliance platform | [eramba.org](https://www.eramba.org/) |
| SimpleRisk | Risk register and management tool | [simplerisk.com](https://www.simplerisk.com/) |

## Practical projects and exercises

### Project 1: Risk register and control mapping

Objective: build a risk register for a fictional SaaS company and map controls to a framework.

Constraints: define the company's assets, data, and obligations. Identify at least twelve risks, score them qualitatively, and map each treatment to NIST CSF 2.0 or CIS Controls v8. Include inherent and residual scores, owners, and target dates.

Deliverable: a spreadsheet with a risk register, a control matrix, and a one-page summary of the top five risks. Add a short section explaining scoring assumptions and data gaps. This is the core portfolio artifact for GRC roles.

### Project 2: Policy and exception workflow

Objective: write one policy and design the exception process around it.

Constraints: choose a policy with real operational impact, such as access control or encryption. Define the requirement, scope, roles, review cycle, and evidence. Design an exception form with risk assessment, compensating controls, approver, and expiry.

Deliverable: a two-page policy, a one-page procedure, and a completed example exception for a realistic scenario. Include a decision log showing how the exception would be reviewed and closed.

### Project 3: Audit evidence pack and board brief

Objective: prepare for an assessment and communicate the result to leadership.

Constraints: pick a framework or regulation from this guide. Build an evidence index for ten controls, marking each as implemented, partially implemented, or missing. Do not fabricate evidence; use a lab or fictional scenario.

Deliverable: an evidence index with owners and locations, a gap list with remediation dates, and a one-page board brief covering risk posture, top gaps, investment requested, and the decision needed. This demonstrates the translation skill that distinguishes senior GRC practitioners.

## Common mistakes and misconceptions

- Treating compliance as security. Passing an audit does not mean an attacker cannot succeed.
- Writing policies nobody can follow, then blaming staff for non-compliance.
- Scoring risks without definitions, so the same risk gets different scores from different people.
- Maintaining four separate control sets for four frameworks instead of one mapped set.
- Accepting a SOC 2 report without checking scope, period, exceptions, and complementary controls.
- Granting permanent exceptions with no expiry or compensating control.
- Reporting activity metrics such as number of policies instead of risk reduction.
- Backfilling evidence or backdating approvals before an audit.

## Career paths and roles

GRC analysts maintain risk registers, control maps, and evidence. Security auditors assess controls and write findings. Risk managers own the assessment process and appetite framework. Compliance managers interpret obligations and coordinate assessments. Third-party risk analysts assess vendors and contracts. Privacy analysts handle data protection impact assessments and rights requests. Senior practitioners move into security leadership, often toward CISO or risk officer roles.

Entry points include IT audit, security operations, legal and compliance, and consulting. Certifications such as CISA, CISM, CRISC, CISSP, and ISO/IEC 27001 lead auditor can help with hiring filters, but they are paid and should follow practical experience. A portfolio with a risk register, a control matrix, and a board brief is strong evidence. Expect interviews to include a scenario question about a business unit that wants an exception.

## Next steps

- Build a twelve-risk register for a fictional company and map it to NIST CSF 2.0.
- Read NIST SP 800-30 and rewrite three risks using its method.
- Review a public SOC 2 report outline and list the questions you would ask a vendor.
- Draft a risk appetite statement with thresholds and an escalation path.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and [practical projects](../../practical-projects/README.md).

## References

- NIST, [Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework).
- NIST, [SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final).
- Center for Internet Security, [CIS Controls](https://www.cisecurity.org/controls).
- ISO/IEC, [ISO/IEC 27001](https://www.iso.org/standard/27001).
- PCI Security Standards Council, [PCI DSS](https://www.pcisecuritystandards.org/).
- U.S. Department of Health and Human Services, [HIPAA](https://www.hhs.gov/hipaa/index.html).
- European Union, [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
- AICPA, [SOC 2](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
