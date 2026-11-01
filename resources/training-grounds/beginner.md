# Beginner Training Grounds

Sixteen places to start practising, chosen because they teach rather than test, they are free or have a genuinely useful free tier, and they do not require you to already know the answer. Each entry says what it is, what it costs, how long a first session takes, and what you should be able to do afterwards.

> Ethics reminder: these platforms host intentionally vulnerable systems. Attack only those systems, only through the access the provider gives you, and never scan the provider's wider infrastructure. See [../../ETHICS.md](../../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Beginner; assumes a browser and a terminal, not prior security work |
| Realistic time | 6-10 hours per week for four weeks to complete the starter plan |
| Cost | Free; two platforms have optional paid tiers that you do not need yet |
| Prerequisites | Basic Linux commands, how IP addresses and ports work, willingness to read documentation |
| Lab requirement | None for browser-based labs; a hypervisor for self-hosted apps |
| Hardware | 8 GB RAM is enough; snapshot-capable virtualisation helps |

## How to use this page

Start with one guided platform and one self-hosted application. Running five platforms at once produces familiarity with five interfaces and mastery of none.

The tables group environments by what they train:

- Guided platforms teach a concept and then require you to apply it.
- Self-hosted vulnerable applications let you break the same target repeatedly and safely.
- Wargames train persistence and command-line fluency.
- Foundations labs fill the gaps that make security material incomprehensible.

## Guided multi-topic platforms

| Platform | Provider | Cost / access | First session | What it trains | Start with |
| --- | --- | --- | --- | --- | --- |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium: a large free room library; full paths and many rooms need a subscription | 45-90 minutes | Linux, networking, web basics, tool orientation | The introductory and pre-security rooms |
| [Hack The Box Starting Point](https://www.hackthebox.com/) | Hack The Box | Freemium: a small number of free machines and selected free Academy modules; most content is paid | 60-120 minutes | Enumeration discipline against real service configurations | The tier 0 machines, without walkthroughs |
| [CyberDefenders](https://www.cyberdefenders.org/) | CyberDefenders | Free account for challenges | 60-120 minutes | Blue team investigation: disk, memory, network evidence | A beginner-labelled challenge |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Freemium: a set of free challenges; the full library is paid | 45-90 minutes | Alert triage and investigative reasoning | Any free challenge tagged easy |
| [LetsDefend](https://letsdefend.io/) | LetsDefend | Freemium: limited free investigations; full platform is paid | 30-60 minutes | SOC workflow: queue, triage, escalation notes | A phishing or malware alert simulation |

## Self-hosted vulnerable applications

| Application | Provider | Cost / access | First session | What it trains | Notes |
| --- | --- | --- | --- | --- | --- |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free | 45-90 minutes | OWASP Top 10 classes in a modern single-page app | Run it in Docker on a host-only network |
| [OWASP WebGoat](https://owasp.org/www-project-webgoat/) | OWASP | Free | 60-90 minutes | Guided lessons with in-app hints for each vulnerability class | Deliberately insecure; never expose it publicly |
| [DVWA](https://github.com/digininja/DVWA) | DVWA project | Free | 45-90 minutes | PHP and MySQL flaws at four difficulty levels | The difficulty dial makes it reusable as you improve |

Self-hosted applications are the cheapest way to repeat an attack until the mechanics are boring. Repeating a SQL injection on the same target at increasing difficulty teaches more than five unrelated rooms.

## Wargames and progressive challenges

| Platform | Provider | Cost / access | First session | What it trains | Entry point |
| --- | --- | --- | --- | --- | --- |
| [OverTheWire: Bandit](https://overthewire.org/wargames/) | OverTheWire | Free | 30-60 minutes | Shell basics, file permissions, pipes, encoding | Level 0 over SSH |
| [picoCTF](https://picoctf.org/) | Carnegie Mellon University | Free account | 30-60 minutes | Broad CTF categories with beginner-friendly hints | The practice gym and past challenges |
| [Hacker101 CTF](https://www.hacker101.com/) | HackerOne | Free account | 45-90 minutes | Web vulnerability discovery without guided steps | The easiest available flags |
| [Root-Me](https://www.root-me.org/?lang=en) | Root-Me | Free account | 30-60 minutes | A wide, graded challenge catalog across many domains | Challenges filtered by difficulty |
| [HackThisSite](https://www.hackthissite.org/) | HackThisSite | Free account | 30-45 minutes | Web fundamentals through basic missions | Basic missions 1-5 |
| [VulnHub](https://www.vulnhub.com/) | VulnHub | Free | 60-120 minutes | Full-box practice with downloadable images | A beginner-rated box released in the last few years |

VulnHub images are community-built. Check the release date and the comments before you download, and keep the VM on an isolated network.

## Foundations and structured web practice

| Resource | Provider | Cost / access | First session | What it trains | Why it belongs here |
| --- | --- | --- | --- | --- | --- |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Free, no account needed | 30-60 minutes | HTTP, authentication, injection, access control | The clearest free explanation-to-lab progression available |
| [Linux Upskill Challenge](https://linuxupskillchallenge.org/) | Linux Upskill Challenge | Free | 60 minutes per day | File systems, services, permissions, logs | Every other lab assumes this fluency |

## The four-week starter plan

The goal of the first month is not to "finish" a platform. It is to build the habits that make later practice efficient: a notebook, a repeatable enumeration process, and the ability to read an error message without panic.

### Week 1: terminal and network literacy

| Day | Activity | Time | Evidence |
| --- | --- | --- | --- |
| 1-2 | OverTheWire Bandit levels 0-10 | 60-90 min | Notebook entries with the command and the reason it worked |
| 3 | Linux Upskill Challenge day 1-2 material | 60 min | A file tree sketch of a Linux system you use |
| 4-5 | TryHackMe introductory rooms | 90 min | A one-paragraph summary of each room's core idea |
| 6 | Wireshark documentation: capture filters and display filters | 60 min | A capture of your own traffic with three saved filters |
| 7 | Review notes; rewrite one page as if teaching a friend | 45 min | One clean page of notes |

### Week 2: how web applications break

| Day | Activity | Time | Evidence |
| --- | --- | --- | --- |
| 8-9 | PortSwigger Academy: HTTP basics and access control labs | 90 min | Lab completions plus a note on why each payload worked |
| 10 | OWASP Juice Shop: run locally in Docker, complete three challenges | 90 min | Screenshot plus a two-sentence impact statement per finding |
| 11 | PortSwigger Academy: authentication labs | 90 min | Notes distinguishing logic flaws from implementation flaws |
| 12 | OWASP WebGoat: injection lessons | 60 min | A before/after query showing the unsanitised input path |
| 13 | DVWA at low difficulty: command injection | 60 min | A note explaining the missing control |
| 14 | Rest and review; identify the vulnerability class you understood least | 30 min | One paragraph naming your weakest area |

### Week 3: first independent target

| Day | Activity | Time | Evidence |
| --- | --- | --- | --- |
| 15-17 | Hack The Box Starting Point, tier 0, without a walkthrough | 2-3 hours total | An enumeration log: every port, service, and hypothesis |
| 18 | Write a one-page report on the box you solved | 60 min | Report with impact, evidence, and remediation |
| 19 | TryHackMe room on the weakest area you identified in week 2 | 90 min | Updated notes |
| 20 | Blue team counterpart: one CyberDefenders beginner challenge | 90 min | A short investigative timeline |
| 21 | Compare your report with a public write-up, if one exists | 45 min | A list of what you missed and why |

### Week 4: breadth and reflection

| Day | Activity | Time | Evidence |
| --- | --- | --- | --- |
| 22-23 | Blue Team Labs Online and LetsDefend free content | 2 hours | Two triage notes with severity and next action |
| 24 | picoCTF practice challenges in an unfamiliar category | 90 min | Notes on the category's conventions |
| 25 | Root-Me: five challenges at your current level | 90 min | A log of attempts, including failures |
| 26 | Hacker101 CTF: one flag without hints | 90 min | A short write-up of your process |
| 27 | Build a one-page "what I can do now" inventory | 60 min | Skills list with evidence links |
| 28 | Choose the next field to study and schedule it | 30 min | A dated plan saved in your notebook |

### What success looks like after four weeks

You should be able to: move around a Linux system without a cheat sheet; explain what a service banner tells you; find and exploit one vulnerability class on a target you have not seen before; write a report that a non-technical manager could act on.

You should not expect to be employable yet. Four weeks is enough to know whether you enjoy the work, which is the more useful outcome.

## When you get stuck

1. Re-read the error message aloud. Most stalls are a typo, a wrong port, or a service that never started.
2. Check whether the target is reachable before checking whether your exploit is correct.
3. Write down the three most likely causes and test them in order. Guessing randomly destroys the learning value.
4. Use a hint, then close the hint and reproduce the step from memory. If you cannot, you did not learn it.
5. After 90 minutes on the same wall, read a walkthrough, then write why you did not see the path. That paragraph is worth more than the flag.
6. Ask in a community with your own attempt included. "It does not work" cannot be answered; "this payload returns 500 and the log says X" can. See [../communities/README.md](../communities/README.md).

## Common beginner mistakes

- **Collecting platforms instead of finishing labs.** Three solved rooms beat thirty started ones.
- **Ignoring enumeration.** The most common cause of failure is not scanning thoroughly or not reading what the scan returned.
- **Copying payloads without understanding the parser.** If you cannot explain where the input is interpreted, you cannot adapt the payload.
- **Skipping the report.** The report is the deliverable in professional work; practice writing it now.
- **Running vulnerable VMs on a bridged adapter.** This exposes deliberately broken software to your real network.
- **Comparing yourself to people who publish write-ups.** Publication bias hides years of failed attempts.
- **Believing the flag is the point.** The point is a repeatable method you can apply to an unfamiliar target.

## Next steps

1. Finish the four-week plan before subscribing to anything.
2. Move to [intermediate.md](intermediate.md) when you can solve a beginner box without hints in under four hours.
3. Pair practice with one course from [../free-courses/README.md](../free-courses/README.md).
4. Start a lab notebook today, not after the next lab.
5. Read the [beginner-to-ethical-hacker roadmap](../../roadmaps/beginner-to-ethical-hacker.md) for the longer sequence.

## Catalog status

Catalog status: 16 beginner platforms and rooms.

Last reviewed: 2026-10-31

---

Back to the [training grounds overview](README.md), the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
