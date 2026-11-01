# Training Grounds: Labs, Ranges, and Practice Environments

Reading about an attack teaches you its name. Performing it in an isolated lab teaches you the mechanics, the failure modes, and the evidence it leaves behind. This directory is the practice layer of the curriculum: a progression of environments where you can break things that are meant to be broken.

> Ethics reminder: none of these platforms authorizes you to attack anything you do not own. A lab account grants access to the provider's machines only. See [../../ETHICS.md](../../ETHICS.md) before you start.

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Beginner to advanced, split across three pages |
| Realistic time | 4-6 hours per week for 6-12 months to move from guided rooms to independent assessments |
| Cost | Mostly free; intermediate and advanced tracks increasingly rely on paid subscriptions |
| Prerequisites | Comfort with a Linux terminal, basic networking, and one scripting language |
| Lab requirement | A machine you control, a hypervisor, and snapshots you trust |
| Hardware | 16 GB RAM is comfortable; 8 GB is workable if you run one VM at a time |

## How this directory is organized

| Page | Audience | What it contains |
| --- | --- | --- |
| [beginner.md](beginner.md) | First six months | 16 guided platforms, walkthrough rooms, and wargames plus a four-week starter plan |
| [intermediate.md](intermediate.md) | After you can finish a guided box unaided | 15 platforms and self-hosted labs that expect you to choose your own path |
| [advanced.md](advanced.md) | Preparing for professional work | 13 ranges, CTFs, and simulation environments, including adversary emulation |

Read them in order. Skipping to advanced labs produces the familiar pattern of copying a walkthrough without learning why any step worked.

## How to choose a lab

Choose by the gap you are trying to close, not by the platform's reputation.

1. **You do not know what a service is.** Pick a guided room on that service. TryHackMe and the PortSwigger Academy are stronger than random walkthroughs.
2. **You know the concept but freeze at the keyboard.** Pick a box with no walkthrough and a time limit. Process matters more than the flag.
3. **You can get in but cannot explain it.** Write the report before you look at anyone else's solution.
4. **You can do machines but not whole networks.** Move to a range with multiple hosts and a stated objective.
5. **You are preparing for a certification or a job task.** Use the platform whose format matches the assessment, not the one with the most content.

A useful heuristic: if you finish a lab in under an hour and learned nothing new about *why* a control failed, you picked the wrong lab.

## Terminology you will meet

| Term | Meaning |
| --- | --- |
| Room | A single guided exercise, usually with reading and tasks, common on TryHackMe |
| Machine / box | A full virtual host you must compromise end to end, common on Hack The Box and VulnHub |
| Challenge | A self-contained puzzle, often with a flag, common on CTF platforms |
| Wargame | A sequence of progressive levels accessed over SSH or a web shell, such as OverTheWire |
| Range | Several hosts and services in one network, sometimes with a story and a business objective |
| Pro Lab | A large, persistent enterprise-like network, usually paid and time-limited |
| Flag | A string that proves success; useful for scoring, useless as evidence of skill |

## Lab safety rules

These are not optional. Most lab incidents are self-inflicted, and a few are legal problems.

- **Isolate.** Run vulnerable machines on a host-only or internal virtual network. Never bridge a deliberately vulnerable VM onto a network you do not own.
- **Snapshot first.** Take a clean snapshot before installing tools or detonating anything. Roll back rather than repair.
- **Never point a scanner at the internet.** A misconfigured scan is indistinguishable from an attack, and it may breach your provider's terms.
- **Treat lab credentials as disposable.** Reuse of a real password in a lab is how lab compromises become real ones.
- **Handle malware samples only in an isolated analysis VM** with no shared folders, no clipboard sharing, and no bridged networking.
- **Check platform terms.** Some platforms forbid automated scanning of their infrastructure; respect it. You are a guest.
- **Do not publish flags or full walkthroughs of active machines.** It spoils the exercise and can violate platform rules. Publish methodology and remediation instead.
- **Keep a lab notebook.** Date, target, hypothesis, command, result, interpretation. This habit is what turns practice into employable skill.

If a lab asks you to attack a real third party, a real company domain, or "a friend's site to test", stop. That is not a lab.

## The progression model

| Stage | You are learning | Typical environment | Exit criterion |
| --- | --- | --- | --- |
| 1. Guided | Tooling and terminology | Walkthrough rooms, beginner labs | You can complete a room without following a video |
| 2. Targeted | One vulnerability class at a time | PortSwigger labs, isolated challenges | You can identify the class from behaviour, not from the title |
| 3. Independent | Enumeration and decision-making | Single boxes with no hints | You can finish a box in 4-8 hours and write a report |
| 4. Networked | Pivoting, privilege escalation chains, objectives | Ranges and Pro Labs | You can plan an engagement across hosts and document it |
| 5. Adversary emulation | Detection-aware tradecraft | Caldera, Atomic Red Team, DetectionLab | You can reproduce a technique and explain what would detect it |

Most learners try to jump from stage 1 to stage 4. The gap is almost always enumeration discipline and note-taking, not secret tools.

## Free versus paid, honestly

Guided beginner content is largely free. Depth is where payment appears.

- Free tiers exist on TryHackMe, Hack The Box, LetsDefend, Blue Team Labs Online, and CyberDefenders, but they are deliberately partial: free rooms, a handful of free machines, a subset of challenges.
- Self-hosted labs (DetectionLab, DVWA, WebGoat, Kubernetes Goat, CloudGoat) are free software, but cloud-based ones can incur real provider charges if you leave them running.
- Paid subscriptions buy convenience and breadth, not competence. Many strong practitioners learned on free tiers plus self-hosted ranges.

If you pay for one thing, pay for a lab platform that gives you unguided machines and time pressure, because that is the part free content cannot simulate.

## Turning labs into evidence

A folder of screenshots proves nothing. Build artifacts instead:

- A one-page vulnerability report per box, with impact, evidence, and remediation.
- A detection rule written for one technique you executed.
- A timeline for one forensic challenge.
- A short write-up that explains a dead end and how you escaped it.

The exercise formats in [../../exercises/README.md](../../exercises/README.md) and the project ideas in [../../practical-projects/README.md](../../practical-projects/README.md) give you structures to reuse.

## Legal boundaries

Practice is legal because the target owner consents. That consent disappears the moment you test outside the lab. Unauthorized access is a crime in most jurisdictions, even if you "only looked". If you are unsure whether something is in scope, it is out of scope. For professional work, get written authorization and a defined scope before any testing; the [ethics guide](../../ETHICS.md) and [contribution guide](../../CONTRIBUTING.md) describe the expectations for material in this repository.

## Related resources

- Course-style learning that pairs with these labs: [../free-courses/README.md](../free-courses/README.md)
- Tools used inside the labs: [../open-source-tools/README.md](../open-source-tools/README.md)
- Competitions for testing yourself against others: [../ctf-platforms/README.md](../ctf-platforms/README.md)
- A staged study plan: [../../roadmaps/beginner-to-ethical-hacker.md](../../roadmaps/beginner-to-ethical-hacker.md)

## Catalog status

Catalog status: this overview links to 44 training environments across three pages (16 beginner, 15 intermediate, 13 advanced).

Last reviewed: 2026-10-31

---

Back to the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
