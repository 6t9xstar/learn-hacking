# Blue Team Engineer Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 12–18 months**

[Home](../README.md) › [Roadmaps](README.md) › Blue team engineer

A blue team engineer builds the systems that let defenders see, decide, and act. That means designing log pipelines, writing and tuning detections, automating enrichment and response, hardening endpoints and cloud accounts, and running incident response exercises. The role goes beyond alert triage: an analyst consumes detections, while an engineer owns whether those detections exist, whether the data is trustworthy, and whether the response is repeatable.

This roadmap assumes you already understand alerts and logs. If you do not, start with the [SOC analyst roadmap](soc-analyst.md). Read [ETHICS.md](../ETHICS.md): building detection and response capability includes handling sensitive telemetry and potentially taking action on production systems. Authorization and change control are part of the job.

## At a glance

| Item | Detail |
|---|---|
| Target role | Blue team engineer, detection engineer, security automation engineer, incident response engineer |
| Realistic duration | 12–18 months at 8–10 hours per week; 6–12 months with SOC, sysadmin, or DevOps experience |
| Cost | Free open-source stack is sufficient; optional paid SIEM tiers, courses, and exams |
| Lab needs | 16–32 GB RAM; Wazuh or Elastic; Windows and Linux VMs; Sysmon; osquery; Velociraptor; Python; Ansible; a cloud sandbox for telemetry |
| Difficulty | High; engineering discipline plus security judgement |
| Main output | A detection-as-code repository, a log pipeline, a hardening baseline, and an IR playbook |

This is a map, not a race. Prior experience operating production systems is a real advantage, because detection engineering fails when it ignores how systems actually behave.

## Who this is for

This roadmap suits SOC analysts ready to move from triage to engineering, system administrators who automate and harden, DevOps engineers moving into security, and security generalists who want to build rather than only test.

Honest prerequisites:

- **SOC or operations experience.** You have investigated alerts or run production systems and know what breaks.
- **Networking and operating systems.** Logs, processes, services, DNS, and authentication.
- **Scripting.** Python and PowerShell are the working languages; Bash helps.
- **Version control.** Git, pull requests, and code review are how detection content should be managed.
- **Data literacy.** You can reason about fields, timestamps, joins, and false positives.
- **Change discipline.** Production detection changes need testing, review, and rollback plans.

You do not need to be a software engineer, but you do need to write maintainable code and treat detection content as a product.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Telemetry engineering | Collect, parse, and retain the right logs at acceptable cost | A pipeline diagram and parser configuration |
| Detection engineering | Turn behaviour into tested, documented, low-noise rules | A detection-as-code repository with tests |
| Threat-informed design | Use ATT&CK and intelligence to prioritize coverage | A coverage map with justified gaps |
| Automation | Remove repetitive triage and enrichment work safely | A Python or SOAR workflow with error handling |
| Hardening | Apply and verify baselines across operating systems and cloud | A hardening checklist with scan evidence |
| Incident response | Build playbooks, run exercises, and improve from findings | An IR playbook tested in a tabletop |
| Cloud telemetry | Collect and query control-plane and identity logs | A cloud detection query and dashboard |
| Communication | Explain risk, coverage, and trade-offs to stakeholders | A detection review document and metrics report |

Typical entry-level tasks:

- Onboard a new log source and validate field parsing.
- Write a Sigma rule, convert it to the local SIEM, and test it against benign and malicious activity.
- Automate indicator enrichment with error handling and rate limits.
- Apply a CIS benchmark to a Windows or Linux lab host and document exceptions.
- Build an incident playbook and run a tabletop exercise.

## Learning sequence

The sequence assumes analyst-level knowledge and builds engineering depth in telemetry, detections, automation, and resilience.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Telemetry and data engineering | 8–10 weeks | Log pipeline and parser validation |
| 2 | Detection engineering | 10–12 weeks | Detection-as-code repository |
| 3 | Automation and response | 8–10 weeks | Enrichment workflow and playbook |
| 4 | Hardening, cloud telemetry, and IR | 10–12 weeks | Hardening baseline and cloud detections |
| 5 | Portfolio, metrics, and interviews | 6–8 weeks | Coverage report and portfolio |

### Stage 1 — Telemetry and data engineering

| Element | Detail |
|---|---|
| Goal | Get the right data from the right sources, parsed correctly, at a cost you can defend. |
| Topics | Log sources and schemas; Sysmon and Windows event forwarding; Linux auditd and syslog; network flow and DNS; cloud audit logs; parsing and normalization; retention and storage cost; time synchronization; data quality checks. |
| Free learning | [Microsoft Sysinternals](https://learn.microsoft.com/en-us/sysinternals/), [Elastic documentation](https://www.elastic.co/guide/index.html), [Wazuh documentation](https://documentation.wazuh.com/), [RFC 5424 syslog](https://www.rfc-editor.org/rfc/rfc5424). |
| Labs | Deploy Wazuh or Elastic. Onboard Windows with Sysmon and Linux with auditd. Break a parser deliberately and fix it. Build a data quality check for missing timestamps or hosts. |
| Deliverable | A pipeline diagram, parser configuration, and a validation report showing field coverage. |
| Exit criteria | You can trace a single event from source to search result and explain every transformation. |

### Stage 2 — Detection engineering

| Element | Detail |
|---|---|
| Goal | Build detection content as a tested, reviewed, versioned product. |
| Topics | Detection lifecycle; behaviour versus indicator detection; Sigma and SIEM-native rules; ATT&CK mapping; test data generation with Atomic Red Team; false-positive analysis; rule performance; documentation and ownership. |
| Free learning | [Sigma](https://github.com/SigmaHQ/sigma), [MITRE ATT&CK](https://attack.mitre.org/), [Atomic Red Team](https://atomicredteam.io/), [MITRE CAR](https://car.mitre.org/), [MITRE D3FEND](https://d3fend.mitre.org/). |
| Labs | Write five Sigma rules for behaviours you can generate in the lab. Convert them to your SIEM. Test each against benign activity and an Atomic Red Team technique. Measure false positives and tune. |
| Deliverable | A Git repository of five detections with metadata, tests, expected results, and tuning notes. |
| Exit criteria | Each rule has a documented behaviour, data requirement, test, and known false positives. A reviewer can run the tests. |

### Stage 3 — Automation and response

| Element | Detail |
|---|---|
| Goal | Automate repetitive work without creating fragile or dangerous workflows. |
| Topics | Python for APIs; pagination, retries, rate limits, and secrets; enrichment with threat intelligence; SOAR concepts; approval gates; idempotency; logging and alerting on automation failure; Microsoft Sentinel automation rules and playbooks. |
| Free learning | [Python documentation](https://docs.python.org/3/), [Microsoft Sentinel automation](https://learn.microsoft.com/en-us/azure/sentinel/), [Ansible documentation](https://docs.ansible.com/), [CISA automation resources](https://www.cisa.gov/). |
| Labs | Write a Python enrichment script for an IP or hash with retries and caching. Build an approval-gated workflow that opens a ticket and adds context. Deliberately fail the API and verify error handling. |
| Deliverable | An enrichment tool with tests, documentation, and a failure-mode analysis. |
| Exit criteria | The automation fails safely, logs clearly, and never takes a destructive action without approval. |

### Stage 4 — Hardening, cloud telemetry, and IR

| Element | Detail |
|---|---|
| Goal | Reduce the attack surface, extend detection to cloud identity, and prove response works. |
| Topics | CIS Benchmarks and DISA STIGs; Microsoft security baselines; patch and configuration management; endpoint detection; cloud audit logs and identity detections; NIST incident handling; playbooks and tabletop exercises; post-incident improvement. |
| Free learning | [CIS Controls](https://www.cisecurity.org/controls), [DISA STIGs](https://public.cyber.mil/stigs/), [Microsoft security baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines), [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final). |
| Labs | Harden a Windows VM against a CIS baseline and document exceptions. Add cloud audit log ingestion and write one identity detection. Run a tabletop for a cloud credential compromise and update the playbook. |
| Deliverable | A hardening report with scan evidence and a tested incident playbook. |
| Exit criteria | You can show the before/after configuration, explain each exception, and walk through the playbook under questioning. |

Ethics reminder: hardening and response actions can break production. Test in a lab, use change control, and never disable security controls to make a test pass. Telemetry contains personal data; collect the minimum necessary and follow retention policy. See [ETHICS.md](../ETHICS.md).

### Stage 5 — Portfolio, metrics, and interviews

| Element | Detail |
|---|---|
| Goal | Show engineering outcomes and communicate their value. |
| Topics | Detection coverage metrics; mean time to detect and respond; false-positive rate; documentation; portfolio structure; interview system design. |
| Free learning | [MITRE ATT&CK](https://attack.mitre.org/), [Sigma](https://github.com/SigmaHQ/sigma), [lab notes template](../templates/lab-notes.md), [checklists](../checklists/README.md). |
| Labs | Produce a coverage report for your detection repository. Present one detection from behaviour to test to deployment. Run a mock system design interview for a log pipeline. |
| Deliverable | A portfolio with a detection repository, pipeline diagram, hardening report, and playbook. |
| Exit criteria | You can defend a detection's value, its noise, and its data cost in one conversation. |

## Sequence diagram

```text
Stage 1  Telemetry
  sources -> parsers -> normalization -> retention -> quality checks
        |
        v
Stage 2  Detection engineering
  behaviour -> Sigma -> SIEM rule -> test -> tune -> review
        |
        v
Stage 3  Automation
  API -> enrichment -> approval gate -> ticket -> failure handling
        |
        v
Stage 4  Hardening + cloud + IR
  baseline -> verify -> cloud telemetry -> playbook -> tabletop
        |
        v
Stage 5  Metrics + portfolio
  coverage -> noise -> cost -> interview
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [Sigma](https://github.com/SigmaHQ/sigma) | SigmaHQ | Intermediate | Free, open source | Rules | Vendor-neutral detection content |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Beginner–advanced | Free | No | Behaviour taxonomy and coverage planning |
| [Atomic Red Team](https://atomicredteam.io/) | Red Canary | Intermediate | Free, open source | Yes | Safe technique tests for detection validation |
| [MITRE CAR](https://car.mitre.org/) | MITRE | Intermediate–advanced | Free | Analytics | Detection analytics and data requirements |
| [MITRE D3FEND](https://d3fend.mitre.org/) | MITRE | Intermediate | Free | No | Defensive countermeasure mapping |
| [Wazuh documentation](https://documentation.wazuh.com/) | Wazuh | Beginner–intermediate | Free, open source | Yes | SIEM, XDR, and response lab |
| [Elastic documentation](https://www.elastic.co/guide/index.html) | Elastic | Beginner–advanced | Free docs; free basic self-managed tier | Yes | Search, detection, and dashboards |
| [Velociraptor](https://docs.velociraptor.app/) | Velocidex | Advanced | Free, open source | Yes | Endpoint visibility and response |
| [osquery](https://osquery.io/) | osquery | Intermediate | Free, open source | Yes | Endpoint telemetry with SQL |
| [CIS Controls](https://www.cisecurity.org/controls) | Center for Internet Security | Intermediate | Free | No | A prioritized control framework |
| [DISA STIGs](https://public.cyber.mil/stigs/) | DISA | Advanced | Free | No | Detailed hardening requirements |
| [Microsoft security baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines) | Microsoft | Intermediate | Free | Yes | Windows hardening guidance |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Build a log pipeline | Local Wazuh or Elastic | Ingestion, parsing, quality | Free |
| 2 | Write and test five Sigma rules | Local SIEM | Detection lifecycle | Free |
| 3 | Generate techniques with Atomic Red Team | Local lab | Detection validation | Free |
| 4 | Python enrichment tool | Local | APIs, retries, error handling | Free |
| 5 | Approval-gated response workflow | Local or Sentinel trial | Automation safety | Free tier |
| 6 | CIS hardening of a Windows VM | Local | Baseline and exceptions | Free |
| 7 | Cloud identity detection | AWS or Azure sandbox | Control-plane telemetry | Free tier, watch costs |
| 8 | Tabletop and playbook revision | Local | Incident response process | Free |

Safe-lab caveat: run attack simulations only in an isolated lab with explicit approval. Atomic Red Team tests can trigger endpoint protection and generate real alerts; coordinate with whoever owns the lab. Do not test hardening changes on production. Cloud labs should use a sandbox account with budget alerts. Detection rules that take automated action need approval gates and a rollback plan.

## Portfolio projects

1. **Detection-as-code repository.** Five to ten rules with metadata, ATT&CK mapping, test commands, expected results, and tuning notes. Include a README explaining the review process.
2. **Log pipeline design.** A diagram and configuration for Windows, Linux, and cloud logs, including volume estimates, retention choices, and failure handling.
3. **Hardening baseline.** A CIS-aligned configuration for one operating system, with a scan report, documented exceptions, and a rollback procedure.
4. **Automation tool.** A Python enrichment or response workflow with tests, logging, rate-limit handling, and a clear statement of what it will not do automatically.
5. **Incident playbook.** A tested runbook for a specific scenario such as business email compromise or cloud key misuse, with roles, decision points, and evidence requirements.

## Milestones and self-assessment

**Months 0–4**

- [ ] I can diagram a log pipeline from source to search.
- [ ] I onboarded Windows and Linux logs with working parsers.
- [ ] I wrote a data quality check for missing or malformed events.
- [ ] I can explain the cost and retention trade-off for each source.

**Months 4–8**

- [ ] I wrote five Sigma rules and converted them to my SIEM.
- [ ] I tested each rule against benign activity and one technique.
- [ ] I documented false positives and tuning decisions.
- [ ] I built an ATT&CK coverage map with justified gaps.

**Months 8–13**

- [ ] I wrote a Python enrichment tool with retries and caching.
- [ ] I built an approval-gated response workflow and tested failure modes.
- [ ] I hardened a VM against a CIS baseline and documented exceptions.
- [ ] I added cloud audit logs and wrote one identity detection.

**Months 13–18**

- [ ] I ran a tabletop and revised the playbook based on findings.
- [ ] I produced a coverage, noise, and cost report.
- [ ] My portfolio has a detection repository, pipeline, and hardening report.
- [ ] I completed a mock system design interview for detection infrastructure.

## Certifications

Certifications are optional and should follow evidence, not replace it. Every exam below is paid; free study material exists through vendor documentation and community content.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [CySA+](https://www.comptia.org/certifications/cybersecurity-analyst) | CompTIA | Intermediate | Objectives and free video courses | Paid exam | Analyst-level baseline with some engineering content |
| [SC-200](https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/) | Microsoft | Intermediate | Microsoft Learn path is free | Paid exam | Sentinel and Defender operations |
| [SC-100](https://learn.microsoft.com/en-us/credentials/certifications/cybersecurity-architect-expert/) | Microsoft | Advanced | Microsoft Learn path is free | Paid exam | Architecture and governance for Microsoft clouds |
| [GCDA](https://www.giac.org/certifications/certified-detection-analyst-gcda/) | GIAC | Advanced | SANS posters and whitepapers | Paid exam | Detection-focused credential; expensive |
| [GCIH](https://www.giac.org/certifications/certified-incident-handler-gcih/) | GIAC | Intermediate–advanced | SANS posters and whitepapers | Paid exam | Incident handling depth |
| [CISSP](https://www.isc2.org/certifications/cissp) | ISC2 | Advanced | Official outline and self-study | Paid exam | Management-oriented; experience requirement |

## Common detours and mistakes

- **Writing rules without data.** A detection is only as good as the log source behind it. Validate that the fields exist and are populated.
- **Alert volume as success.** More alerts is not more security. Measure precision, false positives, and analyst time.
- **No testing.** An untested rule either misses the behaviour or floods the queue. Use Atomic Red Team and benign baselines.
- **Fragile automation.** Scripts without retries, rate-limit handling, and approval gates cause incidents of their own.
- **Ignoring cloud identity.** Most modern intrusions touch identity. On-premises-only telemetry leaves a blind spot.
- **Hardening without exceptions.** Breaking a business application to pass a benchmark is a failure. Document and justify deviations.
- **Tool sprawl.** Five overlapping tools with no ownership produce gaps. Prefer a small, well-instrumented stack.
- **No documentation.** Detection content without ownership, tests, and rationale decays into noise.

## Next steps

1. Confirm your analyst foundations with the [SOC analyst roadmap](soc-analyst.md), then build the lab in [01-home-lab.md](../practical-projects/01-home-lab.md).
2. Read the [SOC and blue team guide](../soc-blue-team/README.md) and the [Sigma documentation](https://github.com/SigmaHQ/sigma).
3. Write five detections and test them before adding a sixth. Quality beats count.
4. For cloud depth, continue with the [cloud security engineer roadmap](cloud-security-engineer.md); to validate detections adversarially, see the [red team operator roadmap](red-team-operator.md).
5. Use the [exercises](../exercises/README.md), [checklists](../checklists/README.md), and [lab notes template](../templates/lab-notes.md).

## References

- [NIST SP 800-61: Incident Handling Guide](https://csrc.nist.gov/pubs/sp/800/61/r2/final)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [MITRE D3FEND](https://d3fend.mitre.org/)
- [SigmaHQ](https://github.com/SigmaHQ/sigma)
- [Atomic Red Team](https://atomicredteam.io/)
- [CIS Controls](https://www.cisecurity.org/controls)
- [DISA Security Technical Implementation Guides](https://public.cyber.mil/stigs/)
- [Microsoft security baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
