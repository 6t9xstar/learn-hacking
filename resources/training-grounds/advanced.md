# Advanced Training Grounds

Advanced practice is not harder versions of beginner labs. It is work with an objective, a time budget, and a deliverable that someone else could audit. The environments on this page are large, often adversarial to your assumptions, and sometimes deliberately unpleasant. They are also where you find out whether your methodology survives contact with a network you did not design.

> Ethics reminder: enterprise-style ranges exist so you can practise without harming anyone. Every technique here must stay inside the lab boundary. If a range gives you a scope document, treat it as binding. See [../../ETHICS.md](../../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Advanced; assumes you can run an engagement without guidance |
| Realistic time | 10-15 hours per week for 6-12 months to reach professional readiness |
| Cost | Mostly paid at this level; emulation and malware labs are free software with infrastructure costs |
| Prerequisites | Independently solved boxes, Active Directory exposure, scripting, report writing |
| Lab requirement | Multi-host virtual network, snapshots, isolated analysis VM, optional cloud account |
| Hardware | 32 GB RAM is comfortable for enterprise ranges; 16 GB with careful sequencing works |

## What "advanced" actually means

At this level the scarce skills are not exploits. They are:

- **Scoping.** Deciding what is in and out of bounds before you touch anything.
- **Planning.** Turning a vague objective into a sequence of hypotheses with time boxes.
- **Pivoting.** Moving through a network without losing track of where you are or what you have touched.
- **Detection awareness.** Knowing what your actions look like to a defender, and why that matters for a credible report.
- **Communication.** A findings narrative that a technical and a non-technical reader can both act on.

A hard box you solve with a published exploit teaches less than a medium range you plan and document yourself.

## Full-network ranges and professional-grade labs

| Lab or platform | Provider | Cost / access | Skill focus | How to use it well |
| --- | --- | --- | --- | --- |
| [Hack The Box Pro Labs](https://www.hackthebox.com/hacker/pro-labs) | Hack The Box | Paid subscription, time-limited access | Enterprise networks with Active Directory, pivoting, multiple objectives | Write a scope and objective list before the first scan; time-box each host |
| [OffSec Proving Grounds Practice](https://www.offsec.com/products/proving-grounds/) | OffSec | Paid subscription | Independent boxes with exam-like pressure | Practise the report as much as the compromise; the exam grades both |
| [PortSwigger expert labs](https://portswigger.net/web-security/all-labs) | PortSwigger | Free, no account needed | Deserialisation, advanced SSRF, OAuth and JWT flaws, race conditions | Solve without the community solutions; the difficulty is the point |
| [PentesterLab badge paths](https://pentesterlab.com/) | PentesterLab | Paid badge paths; some free exercises | Deep, isolated exploitation mechanics | Use a badge to close a specific gap, not as a completion goal |
| [TryHackMe advanced rooms](https://tryhackme.com/) | TryHackMe | Freemium: some advanced rooms are free, most are paid | Windows and Linux privilege escalation, specific toolchains | Useful for exposure to unfamiliar stacks; skip anything that hands you the path |
| [VulnHub hard boxes](https://www.vulnhub.com/) | VulnHub | Free | Messy, realistic, occasionally broken environments | Good for resilience; document the fixes you needed to make the box run |

## Competition-grade practice

| Platform | Provider | Cost / access | Skill focus | Cadence |
| --- | --- | --- | --- | --- |
| [pwn.college](https://pwn.college/) | Arizona State University | Free account | Binary exploitation, kernel concepts, systems programming | Self-paced, semester-structured |
| [CryptoHack](https://cryptohack.org/) | CryptoHack | Free account | Applied cryptography and cryptanalysis | Self-paced, continuous |
| [DEF CON CTF Qualifier](https://defcon.org/) | DEF CON | Free to compete; qualifying teams advance | Extreme reverse engineering, pwn, and novel challenge design | Annual, usually spring |
| [PlaidCTF](https://plaidctf.com/) | Plaid Parliament of Pwning | Free to compete | Hard, well-designed challenges across categories | Annual |

Competition results are not a substitute for engagement experience, and vice versa. Use competitions to stress-test speed and novelty; use ranges to stress-test planning and documentation.

## Adversary emulation and detection engineering

| Lab or platform | Provider | Cost / access | Skill focus | Notes |
| --- | --- | --- | --- | --- |
| [Caldera](https://caldera.mitre.org/) | MITRE | Free software | Automated adversary emulation mapped to ATT&CK | Run it against lab hosts only; watch the agent deployment carefully |
| [Splunk Attack Range](https://github.com/splunk/attack_range) | Splunk | Free software; cloud usage may cost money | Building an attackable environment with logging and detection | Start small: one victim and one attacker host |
| [FLARE VM](https://github.com/mandiant/flare-vm) | Mandiant | Free software | Windows malware analysis workstation | Never join it to a domain or bridge its network adapter |

The emulation category is the most valuable for career breadth. Being able to say "I executed this technique and wrote the detection that catches it" is rarer, and more employable, than another root flag.

## Running your own mini-engagement

Treat a range as a client engagement, even a fictional one.

1. **Write a scope document.** Hosts, time window, allowed techniques, data handling, emergency stop. Keep it to one page.
2. **Define objectives.** "Obtain domain administrator" is an objective. "Try things" is not.
3. **Plan phases.** Reconnaissance, initial access, privilege escalation, lateral movement, objective, cleanup.
4. **Time-box.** Four hours per host, then write down what blocked you and move on.
5. **Log as you go.** Timestamp, host, action, result. Reconstruction after the fact is unreliable.
6. **Produce a report.** Executive summary, technical findings with evidence, remediation, and an appendix of techniques mapped to ATT&CK.
7. **Debrief yourself.** Which hypothesis was wrong, and what signal would have corrected it sooner?

## Evidence and portfolio

At this level, a portfolio of three well-documented engagements beats thirty screenshots.

- One multi-host range report with an attack path diagram and remediation priorities.
- One detection package: technique, log source, rule, false-positive analysis, validation.
- One deep technical write-up: a vulnerability class explained with a lab reproduction and a fix.
- One hardening artifact: a configuration diff or policy that measurably reduces exposure.

Follow the project formats in [../../practical-projects/README.md](../../practical-projects/README.md) and the writing standards implied by [../../templates/README.md](../../templates/README.md) if templates exist in your checkout.

## Safety at this level

Advanced tooling is genuinely dangerous if it escapes the lab.

- **C2 and emulation frameworks** should run on a dedicated host-only network with no route to the internet.
- **Credential material** obtained in a lab must never be reused, stored, or shared. Delete it with the lab.
- **Malware** belongs only in a disposable analysis VM with no shared clipboard, folders, or network bridging.
- **Cloud labs** require billing alerts and a destroy step in your notes, not in your memory.
- **Client-like data** in a range is fictional; treat it as if it were real anyway, because the habit is the point.

## Common failure modes

- **Skipping the plan.** The most common cause of a 20-hour range is an unstructured first hour.
- **Chasing every host.** Depth on the objective path beats breadth across the network.
- **Ignoring detection.** If you cannot describe what your action logged, your report is incomplete.
- **Over-reliance on automated exploitation.** It works until the environment is slightly unusual.
- **No cleanup.** Leaving agents, scheduled tasks, or cloud resources behind is a professional failure, not a lab quirk.
- **Treating Pro Labs as a scoreboard.** The certificate is a side effect; the methodology is the product.

## Next steps

1. Pick one range and write the scope document before you scan anything.
2. Add a detection deliverable to every offensive exercise from now on.
3. Review [../certifications/README.md](../certifications/README.md) if you need a credential that matches this level, and read the honest caveats there.
4. Enter one competition per quarter; see [../ctf-platforms/README.md](../ctf-platforms/README.md).
5. Revisit [intermediate.md](intermediate.md) for anything you skipped; gaps surface under pressure.

## Catalog status

Catalog status: 13 advanced labs, competitions, and simulation environments.

Last reviewed: 2026-10-31

---

Back to the [training grounds overview](README.md), the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
