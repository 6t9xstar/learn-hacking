# Security Career Roadmaps

**Last reviewed: 2026-10-31**

[Home](../README.md) › Roadmaps

Cybersecurity is not one job. It is a set of related disciplines with different daily work, different tools, and different tolerances for ambiguity. A penetration tester spends the day proving that a weakness is real; a SOC analyst decides whether an alert is real; a forensic analyst reconstructs what already happened; a security engineer builds the control that should have prevented it. Choosing the wrong path is not fatal, but it wastes months and makes learning feel harder than it needs to be.

These twelve roadmaps share one structure: a realistic duration at 8–10 study hours per week, honest prerequisites, a staged learning sequence with deliverables, free resources, labs, portfolio projects, and a section on certifications that does not pretend an exam is a career. Use them as maps. None of them is a race, and none of them guarantees employment.

## How to use these roadmaps

1. **Read the at-a-glance table and the prerequisites first.** If the lab requirements or the math do not fit your life, choose a different entry point rather than forcing it.
2. **Pick one roadmap, not five.** Bookmark the others and return after you finish a stage.
3. **Work stage by stage and produce the deliverable.** The deliverable is the point; the topics are supporting material.
4. **Keep a lab notebook from day one.** Use the [lab notes template](../templates/lab-notes.md) and the [checklists](../checklists/README.md).
5. **Review every eight weeks.** If a stage is not producing evidence, change the approach, not the entire plan.
6. **Read [ETHICS.md](../ETHICS.md) before any offensive work.** Authorization and scope are not optional.

## The roadmaps at a glance

| Roadmap | Target role | Realistic duration | Difficulty | Best starting point for |
|---|---|---|---|---|
| [Beginner to ethical hacker](beginner-to-ethical-hacker.md) | Junior tester or security analyst | 9–15 months | Moderate | Career changers who want breadth before choosing |
| [Network penetration tester](network-pentester.md) | Infrastructure tester, internal consultant | 12–18 months | High | Sysadmins and network engineers |
| [Web security specialist](web-security-specialist.md) | Application security analyst, web tester | 9–15 months | Moderate–high | Developers, QA, and web-curious learners |
| [Mobile security specialist](mobile-security-specialist.md) | Mobile application security analyst | 12–18 months | High | App developers and web testers adding mobile |
| [Cloud security engineer](cloud-security-engineer.md) | Cloud security engineer, DevSecOps engineer | 9–15 months | Moderate–high | Cloud admins and DevOps practitioners |
| [Digital forensics](digital-forensics.md) | DFIR analyst, forensic examiner | 10–16 months | High | SOC analysts and detail-oriented investigators |
| [Malware analyst](malware-analyst.md) | Reverse engineer, threat analyst | 12–20 months | Very high | Low-level programmers and incident responders |
| [SOC analyst](soc-analyst.md) | Tier 1 SOC analyst, security operations analyst | 6–10 months | Moderate | Career changers and help-desk staff |
| [Blue team engineer](blue-team-engineer.md) | Detection engineer, security automation engineer | 12–18 months | High | SOC analysts and sysadmins who want to build |
| [Red team operator](red-team-operator.md) | Adversary emulation specialist | 18–30 months | Very high | Experienced testers and senior blue teamers |
| [Bug bounty hunter](bug-bounty-hunter.md) | Independent hunter; web testing skills | 6–12 months to first report | Moderate–high | Self-directed learners with web basics |
| [Cybersecurity engineer](cybersecurity-engineer.md) | Security engineer, infrastructure security engineer | 12–20 months | High | Sysadmins, network engineers, and DevOps |

Durations assume consistent study at 8–10 hours per week. Prior IT experience can shorten them; a busy season can lengthen them. They are planning ranges, not deadlines.

## Choose a direction

The fastest way to choose is to look at the work, not the title.

| If this sounds like you | Start here | Why |
|---|---|---|
| "I like building and fixing systems more than breaking them" | [Cybersecurity engineer](cybersecurity-engineer.md) or [cloud security engineer](cloud-security-engineer.md) | Both reward operational judgment and automation |
| "I like investigating alerts and telling a story from evidence" | [SOC analyst](soc-analyst.md), then [digital forensics](digital-forensics.md) | The analyst role is the most common entry point |
| "I like understanding how software works and where it fails" | [Web security specialist](web-security-specialist.md) | The shortest bridge from development to security |
| "I like networks, Windows domains, and systems" | [Network penetration tester](network-pentester.md) | Internal testing is built on systems knowledge |
| "I like low-level code and puzzles" | [Malware analyst](malware-analyst.md) | Requires assembly and debugging patience |
| "I want to test apps and phones" | [Mobile security specialist](mobile-security-specialist.md) | Needs platform-specific lab equipment, especially for iOS |
| "I want to emulate adversaries and improve detection" | [Red team operator](red-team-operator.md) | Not entry-level; build testing and defender experience first |
| "I want to test real targets independently" | [Bug bounty hunter](bug-bounty-hunter.md) | Rewards methodology and writing, not tool volume |
| "I am not sure yet" | [Beginner to ethical hacker](beginner-to-ethical-hacker.md) | Broad foundations before specialization |

If you are undecided after reading the tables, choose the path whose daily tasks you would still find interesting on a bad day. Salary comparisons are a poor first filter because the roles differ so much in day-to-day work.

## The shared foundation

Every roadmap in this directory assumes the same core. If you are missing more than two of these, spend four to eight weeks on them before starting a specialization.

- **Networking:** IP addressing, TCP and UDP, DNS, HTTP, TLS, and the ability to read a packet capture.
- **Operating systems:** Linux command line, permissions, processes, services, and logs; Windows accounts, services, Event Viewer, and basic Active Directory concepts.
- **Scripting:** enough Python or Bash to parse a file, call an API, and automate a repetitive task.
- **Security vocabulary:** threat, vulnerability, risk, authentication, authorization, confidentiality, integrity, and availability.
- **Documentation:** notes that another person can follow, and reports that separate evidence from opinion.
- **Lab safety:** isolated virtual machines, snapshots, and a clear boundary between practice and production.

The [foundations guide](../foundations/README.md) covers this ground in more depth, and the [glossary](../glossary/README.md) explains terms you will meet in every path.

## A 12-month starter plan

This plan is for someone who wants to begin now and choose a specialization later. Adjust the pace to your life; the sequence matters more than the calendar.

| Months | Focus | Evidence to produce |
|---|---|---|
| 1–3 | Networking, Linux, Windows, and lab setup | Lab diagrams, command notes, Bandit or equivalent |
| 4–6 | Web fundamentals, scripting, and a first SIEM or logging tool | A small script and a local vulnerable app |
| 7–9 | Broad offensive and defensive exposure | PortSwigger labs and three SOC-style investigations |
| 10–12 | Choose a specialization and complete its Stage 1 | A specialization plan and one portfolio artifact |

At the end of the year, you should be able to explain what each major role does, demonstrate basic lab competence, and choose a direction with evidence rather than guesswork.

## How each roadmap is structured

Each roadmap follows the same pattern so you can compare them:

- **At a glance:** role, duration, cost, lab needs, difficulty.
- **Who this is for:** honest prerequisites and who should wait.
- **What you are working toward:** competencies and typical entry-level tasks.
- **Learning sequence:** four to six stages, each with a goal, topics, free resources, labs, deliverable, and exit criteria.
- **Sequence diagram:** the dependency flow in plain text.
- **Recommended free resources:** at least eight entries with level and cost.
- **Hands-on labs:** progressive practice with a safe-lab caveat.
- **Portfolio projects:** concrete artifacts, not vague suggestions.
- **Milestones and self-assessment:** checkboxes that require evidence.
- **Certifications:** optional, with free study separated from paid exams.
- **Common detours and mistakes:** the traps that cost people months.
- **Next steps and references:** where to go next and what to read.

If a roadmap feels too long, work one stage at a time. A stage is usually eight to twelve weeks, which is a manageable commitment.

## Study method that works

- **Favor labs over videos.** A rough ratio of two hours of practice to one hour of instruction is a reasonable starting point.
- **Write before you feel ready.** Notes and reports are how you find out what you actually understand.
- **Use active recall.** Close the tutorial and rebuild the lab from memory. If you cannot, you have found a gap.
- **Keep one notebook.** A searchable notebook beats scattered screenshots. The [lab notes template](../templates/lab-notes.md) is a starting point.
- **Review weekly.** Spend thirty minutes summarizing what you learned, what failed, and what to try next.
- **Join a community.** Local security meetups, open-source projects, and study groups reduce isolation and expose you to how others work.
- **Take breaks.** Burnout is the most common reason people stop. A sustainable pace beats an intense month followed by silence.

## Ethics, scope, and safety

Offensive skills are only legal and professional when they are authorized. Before any scan, exploit, or analysis, confirm that you own the target or have written permission that defines scope, timing, and data handling. Keep vulnerable machines isolated, never test public systems for practice, and never publish another person's data. Read [ETHICS.md](../ETHICS.md) and the [FAQ](../FAQ.md) before your first engagement-style exercise.

Defensive work also carries obligations. Logs and forensic images contain personal information. Access only what the task requires, store evidence securely, and follow retention policy.

## Certifications and evidence

Certifications can help with hiring filters, but they are a supplement. Every roadmap lists free study material separately from paid exams and explains which credentials are beginner-friendly. No certificate guarantees a job, and no exam replaces a portfolio. The strongest evidence is usually a working lab, two or three written artifacts, and the ability to explain your decisions.

If you are paying for one thing, pay for lab time or a course that includes hands-on practice before paying for another exam voucher. The [free courses index](../resources/free-courses/README.md) and [training grounds](../resources/training-grounds/README.md) list no-cost options.

## Common mistakes when choosing a path

- **Choosing by salary alone.** High-paying roles often require years of adjacent experience; the day-to-day work may not suit you.
- **Collecting roadmaps instead of finishing one.** Reading twelve plans feels like progress. Completing one stage does not.
- **Skipping foundations.** Every specialization assumes networking, operating systems, and writing. Gaps surface at the worst time.
- **Confusing a course with competence.** A certificate of completion is not evidence. A lab and a report are.
- **Avoiding writing.** Every path in this directory requires documentation. If you dislike writing, build the habit early.
- **Working without a lab.** You cannot learn security from slides. A modest isolated lab is enough to start.
- **Comparing timelines.** People arrive with different backgrounds. Use the ranges to plan, not to judge yourself.
- **Ignoring the defensive side.** Even offensive specialists benefit from understanding logs and detection. It makes findings more credible.

## Next steps

1. Read [ETHICS.md](../ETHICS.md), [LEARNING-GUIDE.md](../LEARNING-GUIDE.md), and the [FAQ](../FAQ.md).
2. Build the isolated lab in [01-home-lab.md](../practical-projects/01-home-lab.md).
3. Pick one roadmap from the table above and complete its Stage 1 before evaluating another.
4. Use [exercises](../exercises/README.md) for drills and [checklists](../checklists/README.md) for reviews.
5. Contribute improvements through [CONTRIBUTING.md](../CONTRIBUTING.md); corrections and new free resources are welcome.

## References

- [NIST NICE Workforce Framework](https://www.nist.gov/itl/applied-cybersecurity/nice)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CISA cybersecurity resources](https://www.cisa.gov/)
- [OWASP](https://owasp.org/)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [FIRST CVSS](https://www.first.org/cvss/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
