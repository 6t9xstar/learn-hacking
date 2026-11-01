# Intermediate Training Grounds

This page is for the stage where guidance stops and judgment begins. The environments here assume you can enumerate a target, recognise common services, and write a basic finding, and they will not hold your hand through the path. Most are free; several are self-hosted, which means you supply the infrastructure and the discipline.

> Ethics reminder: self-hosted ranges are yours to break. Hosted platforms are not. Stay inside the accounts and machines the provider gives you, and read the platform's acceptable-use terms before running automated tools. See [../../ETHICS.md](../../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Intermediate; expects independent enumeration and basic reporting |
| Realistic time | 6-10 hours per week for 3-6 months |
| Cost | Free for self-hosted labs; hosted boxes and guided paths increasingly sit behind subscriptions |
| Prerequisites | One scripting language, HTTP fluency, Linux privilege concepts, note-taking habit |
| Lab requirement | Hypervisor with snapshots; optionally a cloud account with billing alerts |
| Hardware | 16 GB RAM recommended for multi-VM ranges |

## What changes at this level

Beginner labs answer the question "what is this vulnerability?". Intermediate labs answer "which of these ten possible directions is worth pursuing, and how do I know?". The technical content overlaps heavily; the difference is the absence of scaffolding and the presence of dead ends.

Three habits separate learners who progress from those who plateau:

- **Enumeration before exploitation.** Spend at least a third of your time mapping the target. Write the map down.
- **Hypothesis-driven testing.** State what you expect before you run the command, then compare.
- **Evidence collection during, not after.** Screenshots, command output, and timestamps captured at the moment of discovery.

## Offensive labs: web and network

| Lab or platform | Provider | Cost / access | Skill focus | Progression advice |
| --- | --- | --- | --- | --- |
| [PortSwigger Web Security Academy: practitioner labs](https://portswigger.net/web-security/all-labs) | PortSwigger | Free, no account needed | Access control, business logic, SSRF, deserialisation, race conditions | Work by topic, not by lab count; finish every lab in one topic before moving on |
| [Hack The Box machines](https://www.hackthebox.com/) | Hack The Box | Freemium: limited free machines; VIP adds retired machines and more | Full-box enumeration, privilege escalation on Linux and Windows | Alternate Linux and Windows; write a report for each box, not just the flag |
| [TryHackMe intermediate paths](https://tryhackme.com/) | TryHackMe | Freemium: free rooms remain free; structured paths need a subscription | Tooling breadth and guided methodology | Useful when a topic is completely new; skip rooms that are pure walkthroughs |
| [PentesterLab](https://pentesterlab.com/) | PentesterLab | Freemium: a limited set of free exercises; badge paths are paid | Precise, isolated vulnerability mechanics | Do the free exercises first; buy a badge only for a topic you will use |
| [Root-Me](https://www.root-me.org/?lang=en) | Root-Me | Free account | Broad challenge catalog with a scoring system | Filter to your weak area; resist the urge to farm easy points |
| [VulnHub](https://www.vulnhub.com/) | VulnHub | Free | Unpatched, realistic, sometimes messy full boxes | Pick images with recent comments; older boxes often need manual network fixes |

## Defensive labs: investigation and detection

| Lab or platform | Provider | Cost / access | Skill focus | Progression advice |
| --- | --- | --- | --- | --- |
| [CyberDefenders](https://www.cyberdefenders.org/) | CyberDefenders | Free account for challenges | Disk, memory, and network forensics with investigative questions | Answer in a timeline first, then check the score; the reasoning is the transferable part |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Freemium: free challenges plus a paid library | Phishing analysis, log analysis, malware triage | Write the escalation note you would send to a manager for each challenge |
| [LetsDefend](https://letsdefend.io/) | LetsDefend | Freemium: limited free investigations; full platform is paid | SOC alert triage and case management | Practise closing alerts as false positive with a justification |
| [DetectionLab](https://github.com/clong/DetectionLab) | Chris Long and contributors | Free software; you supply compute | Building an instrumented Windows and Splunk lab | Start with one host; expand only after logs flow end to end |
| [Splunk BOTS datasets](https://github.com/splunk/botsv3) | Splunk | Free datasets with an account | Investigating realistic attack scenarios in a SIEM | Ask a question before each search; avoid wandering queries |

## Cloud and container labs

| Lab or platform | Provider | Cost / access | Skill focus | Progression advice |
| --- | --- | --- | --- | --- |
| [Kubernetes Goat](https://github.com/madhuakula/kubernetes-goat) | Madhu Akula | Free software; local cluster | Container and Kubernetes attack paths, RBAC, misconfiguration | Run it in a local cluster, not a shared one; tear it down afterwards |
| [OWASP WrongSecrets](https://github.com/OWASP/wrongsecrets) | OWASP | Free | Secrets management failures across deployment models | Complete the local variants before the cloud ones |
| [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | Rhino Security Labs | Free software; AWS usage may cost money | Cloud attack scenarios with a deliberately vulnerable AWS account | Set a billing alarm before you start and destroy the environment after |

## Binary exploitation and low-level practice

| Lab or platform | Provider | Cost / access | Skill focus | Progression advice |
| --- | --- | --- | --- | --- |
| [pwn.college](https://pwn.college/) | Arizona State University | Free account | Assembly, memory corruption, exploitation fundamentals | Do the dojo modules in order; the difficulty curve is deliberate |

## Skill matrix

Use this to choose a lab rather than to collect badges.

| If you are weak at | Practise here | Evidence you improved |
| --- | --- | --- |
| Enumeration | Hack The Box machines, VulnHub | An enumeration log another person could follow |
| Web logic flaws | PortSwigger practitioner labs | A finding with a business-impact sentence |
| Privilege escalation | Hack The Box, VulnHub hard boxes | A list of local misconfigurations you can spot from memory |
| Log analysis | Splunk BOTS, LetsDefend | A query set saved and explained |
| Memory forensics | CyberDefenders | A reconstructed process tree with timestamps |
| Cloud misconfiguration | CloudGoat, WrongSecrets | A remediation diff, not just a screenshot |
| Container escape paths | Kubernetes Goat | A written chain from pod to host with the control that should have stopped it |

## A sustainable weekly rhythm

- **Two sessions of 2 hours.** One offensive, one defensive, so you see both sides of the same technique.
- **One hour of review.** Rewrite notes from the week as if explaining the topic to a colleague.
- **One deliverable per week.** A report, a detection rule, a timeline, or a hardened configuration.
- **No new platform until the current one is finished.** This is the single hardest rule to keep and the most valuable.

## Progression advice

1. **Finish a box without hints before buying anything.** Subscriptions do not fix enumeration weakness.
2. **Alternate domains.** A month of web followed by a month of blue team produces more insight than a year of web alone.
3. **Rebuild one lab from scratch.** Standing up DetectionLab or a vulnerable app yourself teaches more than consuming someone else's instance.
4. **Practice explaining impact.** "I got root" is not a finding. "This service ran as root and was reachable from the user network, so a compromised laptop could have taken the server" is.
5. **Enter one competition per quarter.** See [../ctf-platforms/README.md](../ctf-platforms/README.md) for team versus solo options.
6. **Track time, not trophies.** If a box takes 12 hours, that is data about your enumeration speed, not a character flaw.

## What to do with a completed lab

Turn it into an artifact before starting the next one:

- A one-page report: summary, scope, findings, evidence, remediation, lessons.
- A detection rule for at least one action you took, written against the log source you would actually have.
- A short "if I did this again" section listing the dead ends you would skip.

The project structures in [../../practical-projects/README.md](../../practical-projects/README.md) are designed for exactly this reuse.

## Common pitfalls

- **Tool hopping.** New scanners rarely fix a methodology gap.
- **Reading walkthroughs "for context".** Context is what you write after the fact; reading before you try removes the learning.
- **Ignoring Windows.** Most enterprise paths go through Active Directory; avoid Windows boxes and you will avoid most real environments.
- **Never touching defensive tooling.** Without knowing what logs look like, your offensive techniques will be untestable and your reports unconvincing.
- **Forgetting to snapshot.** Losing a lab to a broken update costs more time than the snapshot would have.
- **Leaving cloud labs running.** A forgotten Kubernetes cluster or AWS environment turns a free lab into a bill.

## Next steps

1. Choose one offensive and one defensive lab from this page and schedule them.
2. Move to [advanced.md](advanced.md) when you can complete an unguided box in under six hours and write the report the same day.
3. Pair this practice with the [free courses index](../free-courses/README.md) for theory you have not covered.
4. Review the [open-source tools index](../open-source-tools/README.md) so you understand what your scanners are actually doing.
5. Re-read the [beginner track](beginner.md) if you find gaps in fundamentals; there is no prize for skipping it.

## Catalog status

Catalog status: 15 intermediate labs and platforms.

Last reviewed: 2026-10-31

---

Back to the [training grounds overview](README.md), the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
