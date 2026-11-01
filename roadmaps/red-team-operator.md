# Red Team Operator Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 18–30 months**

[Home](../README.md) › [Roadmaps](README.md) › Red team operator

Red team operators emulate adversaries against an organization that has explicitly asked them to do so, with the goal of improving detection and response rather than simply proving that a system can be broken. The work requires strong foundations, planning discipline, operational security, and the ability to brief defenders honestly afterwards. It is not an entry-level role. Most successful operators spend years in systems administration, penetration testing, or security engineering before moving into adversary emulation.

Read [ETHICS.md](../ETHICS.md) before anything else. Red teaming without written authorization, a defined scope, and deconfliction is not red teaming; it is unauthorized access with extra steps. Many jurisdictions criminalize it, and the professional consequences are permanent.

## At a glance

| Item | Detail |
|---|---|
| Target role | Red team operator, adversary emulation specialist, offensive security consultant (senior), detection validation lead |
| Realistic duration | 18–30 months at 8–10 hours per week after foundational IT or security experience; 12–20 months for experienced penetration testers |
| Cost | Free tooling and labs; paid courses and exams are common but optional; a realistic lab needs significant RAM |
| Lab needs | 32 GB RAM preferred; isolated multi-host Active Directory lab; Windows and Linux VMs; a second network segment; logging and detection stack for validation |
| Difficulty | Very high; technical depth, planning, and communication |
| Main output | An adversary emulation plan, a campaign report, a detection validation matrix, and a debrief package |

This is a map, not a race. The timeline assumes you already have foundations. If you do not, complete the [beginner roadmap](beginner-to-ethical-hacker.md) and the [network pentester roadmap](network-pentester.md) first. Skipping that work produces operators who can run tools but cannot plan or explain an engagement.

## Who this is for

This roadmap suits experienced penetration testers moving into adversary emulation, senior SOC or blue team engineers who want to test detections adversarially, and security consultants who are moving from compliance-driven testing to objective-based campaigns.

Honest prerequisites:

- **Two or more years of relevant experience**, or equivalent demonstrable depth. Red teaming assumes you can administer systems, read code, and troubleshoot networks.
- **Active Directory and Windows depth.** Authentication, trusts, Group Policy, and identity attack paths.
- **Linux and networking depth.** Pivoting, tunneling, and protocol behaviour.
- **Scripting and tool development.** Python, PowerShell, C#, or Go enough to adapt tooling.
- **Report writing and briefing.** You will present failures to the people who own them.
- **Operational discipline.** Notes, time tracking, scope adherence, and data protection.
- **A legal and ethical framework.** You must be able to say no to an unsafe request.

This is not the right first roadmap. If you have never held a professional IT or security role, build foundations and get a testing or analyst job first; red team roles are rarely entry-level.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Engagement planning | Define objectives, scope, rules of engagement, and success criteria | A complete RoE and emulation plan |
| Adversary emulation | Model a realistic threat actor against agreed objectives | An ATT&CK-mapped campaign plan |
| Initial access | Gain a foothold using realistic, authorized techniques | A lab campaign narrative with evidence |
| Command and control concepts | Understand beaconing, channels, and operational security at a design level | A C2 architecture diagram and risk analysis |
| Active Directory operations | Move through a domain using realistic identity paths | A BloodHound analysis and containment plan |
| Detection validation | Measure whether defenders saw what you did | A detection matrix with gaps and evidence |
| Operational security | Avoid unnecessary noise, data loss, and collateral impact | An OPSEC plan and incident log |
| Debrief and reporting | Explain findings and improve defence | A campaign report and executive debrief |

Typical entry-level tasks for a junior operator:

- Draft a rules-of-engagement document and an asset list for review.
- Emulate one ATT&CK technique in a lab and document the telemetry it produced.
- Build a detection validation matrix for a small campaign.
- Brief a blue team on what was observed and what was missed.
- Maintain an operational log with timestamps, hosts, and actions.

## Learning sequence

The sequence assumes prior offensive and defensive experience. It emphasizes planning, adversary emulation, and detection validation over tool collection.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Foundations consolidation and lab design | 10–12 weeks | Multi-host lab and tradecraft notes |
| 2 | Planning, recon, and adversary emulation | 10–12 weeks | RoE and emulation plan |
| 3 | Initial access and C2 concepts | 12–14 weeks | Lab campaign with architecture diagram |
| 4 | Active Directory, lateral movement, and OPSEC | 12–14 weeks | AD campaign report |
| 5 | Detection validation, reporting, and debrief | 8–10 weeks | Detection matrix and debrief package |

### Stage 1 — Foundations consolidation and lab design

| Element | Detail |
|---|---|
| Goal | Build a realistic, isolated environment and confirm the foundations red teaming depends on. |
| Topics | Windows and Linux administration; Active Directory design; network segmentation; logging; Python and PowerShell; Git; virtualization; lab snapshots; operational note-taking. |
| Free learning | [Microsoft AD DS documentation](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services), [GOAD](https://github.com/Orange-Cyberdefense/GOAD), [BloodHound documentation](https://bloodhound.readthedocs.io/), [Impacket](https://github.com/fortra/impacket). |
| Labs | Deploy GOAD or a two-domain lab with a workstation, server, and logging stack. Draw the network and identity map. Practice snapshot and reset procedures. |
| Deliverable | A lab design document with topology, identity map, logging coverage, and reset procedure. |
| Exit criteria | You can rebuild the lab from documentation and explain how each host is observed. |

### Stage 2 — Planning, recon, and adversary emulation

| Element | Detail |
|---|---|
| Goal | Plan a campaign like an adversary and like a consultant: objectives, scope, threat model, and success criteria. |
| Topics | Rules of engagement; deconfliction; threat intelligence and threat actor selection; ATT&CK mapping; objectives versus tactics; reconnaissance; operational security planning; risk registers; legal boundaries. |
| Free learning | [MITRE ATT&CK](https://attack.mitre.org/), [PTES](https://www.pentest-standard.org/), [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final), [NCSC penetration testing guidance](https://www.ncsc.gov.uk/guidance/penetration-testing). |
| Labs | Write a full RoE for a fictional company. Select a threat actor profile and map a campaign to ATT&CK. Build a risk register with stop conditions. Conduct passive recon against a domain you own. |
| Deliverable | A 10–15 page emulation plan with objectives, scope, threat model, techniques, success criteria, and abort conditions. |
| Exit criteria | A reviewer can understand what will be tested, what is excluded, and how success will be measured. |

### Stage 3 — Initial access and C2 concepts

| Element | Detail |
|---|---|
| Goal | Understand how campaigns establish and maintain access, and the operational risks of each approach. |
| Topics | Phishing simulation and payload delivery concepts; web and external exposure; credential-based access; command-and-control architecture; beaconing and channels; redirectors; infrastructure separation; logging and detection opportunities; data handling. |
| Free learning | [MITRE CALDERA](https://github.com/mitre/caldera), [Atomic Red Team](https://atomicredteam.io/), [HackTricks](https://book.hacktricks.xyz/), [ired.team](https://www.ired.team/). |
| Labs | Design a C2 architecture for an isolated lab and document the trade-offs. Run a CALDERA operation against lab hosts. Capture the telemetry produced by each step and compare it with the detection stack. |
| Deliverable | A campaign architecture diagram, an operational log, and a telemetry inventory. |
| Exit criteria | You can explain the detection surface of your infrastructure and why you chose each channel. |

Ethics reminder: phishing simulation, payload delivery, and C2 are only lawful inside an authorized engagement with written scope and deconfliction. Never send real phishing to people who have not consented to an exercise, never use real credentials, and never leave infrastructure running after an engagement. Stop immediately if you encounter data or systems outside scope.

### Stage 4 — Active Directory, lateral movement, and OPSEC

| Element | Detail |
|---|---|
| Goal | Operate through a domain realistically while controlling noise, access, and collateral risk. |
| Topics | Kerberos and NTLM abuse concepts; ACL and delegation paths; privilege escalation; lateral movement; credential hygiene; tiering; logging and detection; OPSEC trade-offs; cleanup and evidence preservation; scope boundaries. |
| Free learning | [BloodHound documentation](https://bloodhound.readthedocs.io/), [Microsoft Defender for Identity](https://learn.microsoft.com/en-us/defender-for-identity/), [SpecterOps blog](https://posts.specterops.io/), [LOLBAS](https://lolbas-project.github.io/). |
| Labs | Execute a multi-step AD campaign in GOAD. Track every action in an operational log. Identify which steps produced Windows events and which produced none. Practice cleanup and verify it. |
| Deliverable | An AD campaign report with attack paths, evidence, detection observations, and cleanup verification. |
| Exit criteria | You can explain the trade-off between stealth, speed, and reliability for each step, and you can clean up without leaving artifacts. |

### Stage 5 — Detection validation, reporting, and debrief

| Element | Detail |
|---|---|
| Goal | Turn a campaign into measurable defensive improvement and communicate it without ego. |
| Topics | Detection validation methodology; purple team collaboration; coverage metrics; evidence handling; report structure; executive and technical debriefs; remediation prioritization; retesting. |
| Free learning | [MITRE ATT&CK](https://attack.mitre.org/), [Atomic Red Team](https://atomicredteam.io/), [Sigma](https://github.com/SigmaHQ/sigma), [NIST SP 800-61](https://csrc.nist.gov/pubs/sp/800/61/r2/final). |
| Labs | Build a detection matrix for the Stage 4 campaign. Run a purple team session with a peer acting as defender. Write a report and deliver a 20-minute debrief. |
| Deliverable | A detection validation matrix, a campaign report, and a debrief slide deck. |
| Exit criteria | Defenders can act on your findings, and you can describe what you would do differently next time. |

## Sequence diagram

```text
Stage 1  Foundations + lab
  AD | Linux | Windows | logging | isolation
        |
        v
Stage 2  Planning + emulation
  RoE -> threat model -> ATT&CK plan -> success criteria
        |
        v
Stage 3  Initial access + C2 concepts
  delivery -> foothold -> infrastructure -> telemetry
        |
        v
Stage 4  AD + lateral movement + OPSEC
  identity paths -> escalation -> movement -> cleanup
        |
        v
Stage 5  Detection validation + debrief
  matrix -> purple team -> report -> defender action
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Beginner–advanced | Free | No | The shared language of adversary behaviour |
| [MITRE CALDERA](https://github.com/mitre/caldera) | MITRE | Advanced | Free, open source | Yes | Automated adversary emulation in a lab |
| [Atomic Red Team](https://atomicredteam.io/) | Red Canary | Intermediate | Free, open source | Yes | Technique-level tests for detection validation |
| [BloodHound documentation](https://bloodhound.readthedocs.io/) | SpecterOps | Advanced | Free | Yes | Active Directory attack-path analysis |
| [Impacket](https://github.com/fortra/impacket) | Fortra | Advanced | Free, open source | Yes | Protocol-level Windows networking |
| [GOAD](https://github.com/Orange-Cyberdefense/GOAD) | Orange Cyberdefense | Advanced | Free, open source | Yes | A realistic multi-host AD lab |
| [HackTricks](https://book.hacktricks.xyz/) | HackTricks | Intermediate–advanced | Free | Reference | Technique checklists and context |
| [ired.team](https://www.ired.team/) | ired.team | Advanced | Free | Notes | Red team tradecraft explanations |
| [SpecterOps blog](https://posts.specterops.io/) | SpecterOps | Advanced | Free | No | Identity attack research |
| [LOLBAS](https://lolbas-project.github.io/) | LOLBAS | Intermediate | Free | Reference | Living-off-the-land binaries and detection |
| [PTES](https://www.pentest-standard.org/) | PTES | Intermediate | Free | No | Engagement methodology |
| [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) | NIST | Intermediate | Free | No | Testing and assessment process |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Multi-host AD lab | GOAD or manual | Design, logging, reset | Free |
| 2 | RoE and emulation plan | Local | Planning and scope | Free |
| 3 | CALDERA operation | Isolated lab | Adversary emulation and telemetry | Free |
| 4 | C2 architecture design | Local | Infrastructure and detection surface | Free |
| 5 | BloodHound attack paths | Lab domain | Identity analysis | Free |
| 6 | Multi-step AD campaign | Lab domain | Lateral movement and OPSEC | Free |
| 7 | Purple team validation | Lab plus SIEM | Detection measurement | Free |
| 8 | Campaign report and debrief | Local | Communication and remediation | Free |

Safe-lab caveat: run campaigns only in an isolated lab or an authorized engagement with signed scope, deconfliction contacts, and stop conditions. Never use real employee credentials, real phishing targets, or production infrastructure without explicit written approval. Keep a complete operational log, avoid accessing data beyond the objective, and remove all tooling and infrastructure afterwards. If you accidentally exceed scope, stop and report it immediately.

## Portfolio projects

1. **Adversary emulation plan.** A complete plan for a fictional organization: objectives, threat actor profile, ATT&CK mapping, scope, success criteria, abort conditions, and risk register.
2. **Campaign report.** A lab campaign narrative with a timeline, evidence, detection observations, and cleanup verification. Redact hostnames and identifiers as needed.
3. **Detection validation matrix.** A table of techniques, tests, expected telemetry, observed detections, and gaps, with a prioritized improvement plan.
4. **Debrief package.** A 20-minute slide deck and a one-page executive summary explaining what was tested, what was found, and what to fix first.
5. **OPSEC and infrastructure design.** A diagram and written trade-off analysis for a lab C2 architecture, including logging, segmentation, and shutdown procedures.

## Milestones and self-assessment

**Months 0–6**

- [ ] I have two or more years of relevant IT or security experience, or equivalent evidence.
- [ ] I built a multi-host AD lab with a logging stack.
- [ ] I can explain Kerberos and NTLM authentication at a working level.
- [ ] I documented a lab reset procedure and verified it.

**Months 6–12**

- [ ] I wrote a complete RoE and emulation plan.
- [ ] I mapped a threat actor profile to ATT&CK techniques.
- [ ] I ran a CALDERA operation and captured its telemetry.
- [ ] I can explain the detection surface of a C2 design.

**Months 12–20**

- [ ] I completed a multi-step AD campaign in the lab.
- [ ] I tracked every action in an operational log.
- [ ] I cleaned up and verified no artifacts remained.
- [ ] I produced a detection matrix with at least ten techniques.

**Months 20–30**

- [ ] I delivered a purple team debrief and received feedback.
- [ ] My portfolio has an emulation plan, campaign report, and debrief deck.
- [ ] I can defend scope decisions and stop conditions under questioning.
- [ ] I completed a mock engagement interview and a technical deep dive.

## Certifications

Red team certifications are optional and expensive; experience and evidence matter more. Every exam below is paid, and several require course or lab access. Verify current prerequisites before planning.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [OSCP](https://www.offsec.com/courses/pen-200/) | OffSec | Advanced | Syllabus and public prep | Paid course, lab, exam | A common prerequisite for red team roles, not a red team credential by itself |
| [OSEP](https://www.offsec.com/courses/pen-300/) | OffSec | Advanced | Syllabus and public research | Paid course and exam | Evasion and advanced exploitation; assumes OSCP-level skill |
| [CRTP](https://www.alteredsecurity.com/) | Altered Security | Intermediate | Community write-ups | Paid course and exam | Active Directory attack and defense |
| [CRTO](https://www.zeropointsecurity.co.uk/) | Zero-Point Security | Advanced | Course lab guidance | Paid course and exam | Red team operations and C2 concepts |
| [PNPT](https://certifications.tcm-sec.com/) | TCM Security | Intermediate | Free TCM YouTube course | Paid exam | Practical internal testing with reporting |
| [HTB CPTS](https://academy.hackthebox.com/) | Hack The Box | Advanced | Some free modules | Paid path and exam | Practical penetration testing depth |
| [GXPN](https://www.giac.org/certifications/exploit-researcher-advanced-penetration-tester-gxpn) | GIAC | Advanced | SANS posters and whitepapers | Paid exam | Exploit development and advanced security testing |

## Common detours and mistakes

- **Treating red teaming as advanced pentesting.** A pentest finds vulnerabilities; a red team campaign tests whether the organization can detect and respond to an objective. The planning and debrief are the job.
- **Skipping foundations.** Tool fluency without systems knowledge collapses the moment the environment differs from the lab.
- **Weak rules of engagement.** Ambiguous scope creates legal and safety risk. Write down targets, exclusions, timing, stop conditions, and contacts.
- **Stealth before reliability.** Chasing zero-noise tradecraft early produces fragile campaigns. Get the objective working, then reduce noise.
- **Ignoring detection.** A campaign with no detection data teaches defenders nothing. Collect telemetry and brief honestly.
- **Tool worship.** Tools change; methodology, identity knowledge, and operational discipline persist.
- **Poor data handling.** Accessing or retaining data beyond the objective is unethical and can be illegal. Stop and report.
- **Ego in the debrief.** The goal is improvement, not proving the blue team incompetent. Present evidence and help them fix it.

## Next steps

1. Read [ETHICS.md](../ETHICS.md) and the [red team guide](../red-team/README.md) before planning any campaign.
2. Confirm your foundations with the [network pentester roadmap](network-pentester.md) or [blue team engineer roadmap](blue-team-engineer.md).
3. Build a GOAD lab and pair it with a logging stack so every campaign produces detection data.
4. Complete the [exercises](../exercises/README.md) and use the [checklists](../checklists/README.md) for planning discipline.
5. Practice debriefing: present a lab campaign to a peer and ask them what they would fix first.

## References

- [MITRE ATT&CK](https://attack.mitre.org/)
- [MITRE CALDERA](https://github.com/mitre/caldera)
- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)
- [Penetration Testing Execution Standard](https://www.pentest-standard.org/)
- [NCSC penetration testing guidance](https://www.ncsc.gov.uk/guidance/penetration-testing)
- [BloodHound documentation](https://bloodhound.readthedocs.io/)
- [Atomic Red Team](https://atomicredteam.io/)
- [SpecterOps research](https://posts.specterops.io/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
