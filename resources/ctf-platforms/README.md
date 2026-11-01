# CTF Platforms and Competitions

Capture the flag (CTF) events compress a lot of learning into a short window: unfamiliar problems, a scoreboard, and no walkthrough. They are also the cheapest way to find out which categories you actually enjoy. This page lists 19 platforms and competitions, from year-round practice to international events.

> Ethics reminder: CTF rules are part of the challenge. Attacking other teams, the scoring infrastructure, or the event network is cheating and, depending on the event, a crime. See [../../ETHICS.md](../../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Beginner to advanced; the "beginner-friendly" column matters more than the brand |
| Realistic time | 2-4 hours per practice session; 24-48 hours for a full event |
| Cost | Free for almost all platforms and competitions |
| Prerequisites | Terminal comfort, one scripting language, patience with ambiguity |
| Team size | Solo is fine for practice; 2-5 people is typical for competitions |
| Equipment | A laptop; no special hardware required |

## How CTFs differ from labs

| Labs | CTFs |
| --- | --- |
| Teach a technique, then ask you to apply it | Give you a problem and no method |
| Generous time | Hard deadlines |
| Hints and walkthroughs exist | Hints cost points or do not exist |
| Depth in one domain | Breadth across categories you may never have seen |

Both are useful. Labs build competence; CTFs build speed, creativity, and tolerance for being stuck. A learner who only does labs often freezes in an interview exercise; a learner who only does CTFs often cannot explain impact or remediation.

## Year-round practice platforms

| Platform | Provider | Beginner-friendly | Categories | Team or solo | Cadence | Cost / access |
| --- | --- | --- | --- | --- | --- | --- |
| [picoCTF](https://picoctf.org/) | Carnegie Mellon University | Yes, explicitly designed for newcomers | Web, crypto, forensics, binary, general | Both | Year-round practice plus an annual competition | Free account |
| [OverTheWire](https://overthewire.org/wargames/) | OverTheWire | Yes, Bandit starts from zero | Linux, shell, scripting, security concepts | Solo | Continuous, self-paced | Free |
| [pwn.college](https://pwn.college/) | Arizona State University | Intermediate entry, advanced ceiling | Binary exploitation, systems, kernel | Solo | Semester-structured dojos | Free account |
| [CryptoHack](https://cryptohack.org/) | CryptoHack | Yes, with guided introductory challenges | Cryptography and cryptanalysis | Solo | Continuous | Free account |
| [Root-Me](https://www.root-me.org/?lang=en) | Root-Me | Somewhat; the easiest tier is approachable | Web, network, crypto, forensic, programming | Solo | Continuous | Free account |
| [HackThisSite](https://www.hackthissite.org/) | HackThisSite | Yes, for web basics | Web application logic and fundamentals | Solo | Continuous | Free account |
| [pwnable.tw](https://pwnable.tw/) | pwnable.tw | No; assumes exploitation basics | Binary exploitation | Solo | Continuous | Free account |
| [pwnable.kr](https://pwnable.kr/) | pwnable.kr | No; classic, terse, unforgiving | Binary exploitation, systems | Solo | Continuous | Free account |
| [Microcorruption](https://microcorruption.com/) | Square | Yes, excellent first embedded challenge | Embedded assembly, debugging, memory | Solo | Continuous | Free |

picoCTF and OverTheWire are the two best starting points. Microcorruption is the best first exposure to assembly debugging, which many learners avoid for years and then need suddenly.

## Competition calendars and leagues

| Event or platform | Provider | Beginner-friendly | Categories | Team or solo | Cadence | Cost / access |
| --- | --- | --- | --- | --- | --- | --- |
| [CTFtime](https://ctftime.org/) | CTFtime | Yes, as an index | Tracks events, ratings, and write-ups | Both | Continuous calendar | Free |
| [National Cyber League](https://nationalcyberleague.org/) | NCL | Yes, with a structured preseason | Broad, with a standardised format | Both, with team scoring | Seasonal, twice a year | Paid registration for the competition season |
| [CSAW](https://csaw.io/) | NYU Tandon | Somewhat; has a beginner bracket | Web, crypto, reversing, forensics | Team | Annual | Free |
| [US Cyber Challenge](https://www.uscyberchallenge.org/) | US Cyber Challenge | Somewhat; entry assessments and camps | Broad, with training camps | Solo and team events | Annual cycle | Free for eligible participants |
| [CyberPatriot](https://www.uscyberpatriot.org/) | Air and Space Forces Association | Yes, designed for students | System hardening and defence | Team, with coaches | Annual season | Registration fees for teams |
| [Hack The Box CTF](https://ctf.hackthebox.com/) | Hack The Box | Somewhat; mixed difficulty | Web, pwn, crypto, cloud, forensics | Team | Periodic events plus year-round challenges | Free account; some events require a paid tier |

## Major competitions

| Competition | Provider | Beginner-friendly | Categories | Team or solo | Cadence | Cost / access |
| --- | --- | --- | --- | --- | --- | --- |
| [DEF CON CTF](https://defcon.org/) | DEF CON | No; elite level | Attack-defence, pwn, reversing, novel challenges | Team | Annual qualifier plus finals | Free to enter the qualifier |
| [PlaidCTF](https://plaidctf.com/) | Plaid Parliament of Pwning | No; hard but well designed | Pwn, crypto, web, reversing | Team | Annual | Free |
| [Google CTF](https://capturetheflag.withgoogle.com/) | Google | No; advanced | Pwn, web, crypto, reversing, hardware | Team | Annual | Free |
| [NahamCon CTF](https://www.nahamcon.com/) | NahamCon | Yes, with many beginner-friendly challenges | Web, OSINT, hardware, misc | Team | Annual, plus virtual conference | Free to enter; conference pass separate |

## Choosing your first event

1. **Start with a beginner-friendly platform, not a competition.** picoCTF's practice gym and OverTheWire Bandit remove the interface shock.
2. **Enter one small team event before a major one.** NahamCon and CSAW are more welcoming than DEF CON Quals.
3. **Pick two categories, not five.** Web and forensics are the most transferable early; crypto and pwn reward dedicated study.
4. **Read the rules page first.** Flag formats, collaboration rules, and prohibited techniques vary by event.
5. **Timebox each challenge.** Forty-five minutes on one problem, then rotate. A team that rotates scores more than a team that stalls.

## Team play that works

- **Allocate categories, then cross-train.** One person owning web, one owning forensics, everyone able to read the scoreboard.
- **Write as you go.** A shared document with commands, payloads, and dead ends prevents duplicated work.
- **Announce blocks, not just wins.** "I am stuck on the JWT challenge, the signature check looks custom" invites help faster than silence.
- **Do not hoard flags.** Submit immediately so the scoreboard reflects reality.
- **Debrief afterwards.** Which category was slowest, and what would you prepare differently? That debrief is the actual training.

## Conduct and boundaries

- **Do not attack the platform.** Scoring servers, other teams, and infrastructure are out of scope even if they are reachable.
- **Respect the flag format.** Submitting someone else's flag is cheating.
- **Publish write-ups only after the event ends**, and follow the organiser's policy.
- **Do not use real-world targets as "practice".** A CTF challenge is fictional; the domain in a challenge is not yours to scan.
- **Report infrastructure problems to organisers**, not to the internet.

## Turning a CTF into evidence

A scoreboard screenshot is worth little. A write-up is worth a lot:

- Problem statement and constraints.
- Your first hypothesis, and why it was wrong.
- The technique that worked, explained so a peer could reproduce it.
- The general lesson, not just the flag.
- Where the challenge maps to a real class of vulnerability.

Three good write-ups demonstrate communication skill in a way that "top 200 on a CTF" never will. For structure, see the exercise formats in [../../exercises/README.md](../../exercises/README.md).

## Common beginner mistakes

- **Treating an unsolved challenge as failure.** Most challenges are unsolved by most participants; that is the design.
- **Skipping categories you dislike.** Career value often sits in the category you find least comfortable.
- **Copying write-ups during the event.** It defeats the only reason to compete.
- **Ignoring the basics under time pressure.** Most flags fall to careful reading, not exotic exploits.
- **Never competing at all.** Practice platforms alone will not teach you to work against a clock.

## Next steps

1. Create accounts on picoCTF and OverTheWire today; finish three Bandit levels.
2. Add CTFtime to your calendar and pick one beginner-friendly event this quarter.
3. Read [../training-grounds/beginner.md](../training-grounds/beginner.md) if the challenges feel impossible; you may be missing fundamentals rather than talent.
4. Write one public write-up per event, following the organiser's disclosure rules.
5. Join a team through [../communities/README.md](../communities/README.md).

## Catalog status

Catalog status: 19 CTF platforms and competitions across 3 groups.

Last reviewed: 2026-10-31

---

Back to the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
