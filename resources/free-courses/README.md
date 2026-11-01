# Free and Low-Cost Cybersecurity Courses

A curated, verification-first index of courses you can start today without paying for a subscription. Every entry names the owner, the level, exactly what is free, and whether you get hands-on practice. Entries are grouped by the ten major fields covered by this repository plus a foundations block and a block of adjacent topics.

This is a study map, not a link dump. Read [How to use this list](#how-to-use-this-list) before you start clicking, and pair every course with the lab tracks in [../training-grounds/README.md](../training-grounds/README.md).

> Ethics reminder: every technique in these courses belongs inside systems you own or have written permission to test. Authorization comes before curiosity. See [../../ETHICS.md](../../ETHICS.md).

## How to use this list

1. Pick **one** foundations course and finish it. Do not stack three beginner courses in parallel.
2. Move to the field you actually care about. The ten field sections below mirror the repository's domain directories.
3. Alternate theory and practice: one course module, then one lab from the matching training-ground track.
4. Keep a lab notebook from day one. Write what you tried, what failed, what you would do differently. See [../../exercises/README.md](../../exercises/README.md) for exercise formats.
5. Only pay when a free tier has already proven useful to you, and only for a specific gap.

## Cost models used in this list

| Label | What it means |
| --- | --- |
| Free account | No payment, but registration is required to reach the material. |
| Freemium | A real, permanently free portion plus paid tiers. The free part is stated per entry. |
| Audit free | The course content is readable without payment, but graded work, certificates, or labs are paid. |

Course catalogs change. Prices are deliberately not listed; check the provider page for current terms.

## Foundations

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Introduction to Cybersecurity](https://www.netacad.com/courses/introduction-to-cybersecurity) | Cisco Networking Academy | Beginner | Free account | No | Threat landscape, security principles, career orientation; a sane first course |
| [Networking Basics](https://www.netacad.com/courses/networking-basics) | Cisco Networking Academy | Beginner | Free account | Yes, simulated | IP addressing, routing, switching, and packet-level thinking with guided labs |
| [Python Essentials 1](https://www.netacad.com/courses/python-essentials-1) | Cisco Networking Academy | Beginner | Free account | Yes | Programming fundamentals in the language most security tooling assumes |
| [Microsoft Learn training hub](https://learn.microsoft.com/en-us/training/) | Microsoft | Beginner to advanced | Free account | Yes, sandboxes on some paths | Guided paths for security, compliance, identity, Azure, and Defender |
| [CS50x](https://cs50.harvard.edu/x/) | Harvard University | Beginner | Free (verified certificate paid) | Yes, problem sets | Computer science depth: memory, data structures, algorithms, C and Python |
| [Information Security curriculum](https://www.freecodecamp.org/learn/information-security/) | freeCodeCamp | Beginner | Free account | Yes | Information security concepts plus hands-on projects and a free certification |
| [CompTIA Security+ video course](https://www.professormesser.com/) | Professor Messer | Beginner | Free videos (notes and practice exams paid) | No | Complete walkthrough of Security+ domains, useful even without the exam |
| [Cyber Aces](https://www.sans.org/cyberaces/) | SANS Institute | Beginner | Free | Yes | Operating system, networking, and sysadmin fundamentals with assessments |
| [Linux Upskill Challenge](https://linuxupskillchallenge.org/) | Linux Upskill Challenge | Beginner | Free | Yes | Four weeks of daily Linux administration drills on your own server or VM |
| [Cloudflare Learning Center](https://www.cloudflare.com/learning/) | Cloudflare | Beginner | Free | No | Clear explanations of DNS, TLS, DDoS, bots, and web architecture |

## Ethical hacking and general offensive security

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner to intermediate | Freemium: a large set of free rooms stays free; full learning paths and many rooms need a subscription | Yes | Guided rooms that teach a concept and then make you use it |
| [Hack The Box Academy](https://academy.hackthebox.com/) | Hack The Box | Beginner to advanced | Freemium: selected modules are free, most modules and certification paths are paid | Yes | Module-based theory plus optional labs, stronger on methodology than walkthroughs |
| [HackTricks](https://book.hacktricks.wiki/) | HackTricks community | Intermediate to advanced | Free | No | Encyclopedic technique reference; best used to answer a specific question |
| [The Hacker Recipes](https://www.thehacker.recipes/) | The Hacker Recipes | Intermediate | Free | No | Active Directory and enterprise attack-path recipes with defensive notes |
| [Red Team Notes](https://www.ired.team/) | IRED Team | Intermediate to advanced | Free | No | Windows internals, credential access theory, and detection opportunities |

## Network penetration testing

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CompTIA Network+ video course](https://www.professormesser.com/) | Professor Messer | Beginner | Free videos | No | Protocol-level networking knowledge that makes scanning interpretable |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark Foundation | Beginner to advanced | Free | Yes, with captures | Display filters, protocol dissection, and evidence-grade packet reading |
| [tcpdump documentation](https://www.tcpdump.org/) | tcpdump.org | Intermediate | Free | Yes | Command-line capture on hosts where a GUI is not available |
| [Computer Networks: A Systems Approach](https://book.systemsapproach.org/) | Peterson and Davie | Intermediate | Free online | No | The "why" behind routing, congestion control, and naming |

## Web application security

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Beginner to advanced | Free, no account needed for labs | Yes, hundreds of labs | The best free structured path from HTTP basics to advanced exploitation classes |
| [Hacker101](https://www.hacker101.com/) | HackerOne | Beginner | Free account | Yes, CTF levels | Vulnerability classes taught for bug-bounty thinking, plus private program access |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Beginner to intermediate | Free | Yes | A deliberately vulnerable app covering the OWASP Top 10 and beyond |
| [PentesterLab](https://pentesterlab.com/) | PentesterLab | Beginner to advanced | Freemium: a limited set of free exercises; badge paths are paid | Yes | Precise, minimal exercises that isolate one vulnerability each |
| [Application Security Education](https://application.security/) | Snyk | Beginner to intermediate | Free account | No | Short modules on secure design and common implementation flaws |
| [Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | Intermediate | Free | No | The test-case catalog professionals use to structure an assessment |

## Cloud security

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [AWS Skill Builder](https://skillbuilder.aws/) | Amazon Web Services | Beginner to advanced | Freemium: digital courses are free with an account; labs and exam prep need a subscription | Some | IAM, logging, network controls, and the shared responsibility model |
| [Microsoft Learn security paths](https://learn.microsoft.com/en-us/azure/security/) | Microsoft | Beginner to advanced | Free account | Yes, sandboxes on selected paths | Defender, Sentinel, Entra ID, and Azure hardening guidance |
| [Google Skills, formerly Cloud Skills Boost](https://www.cloudskillsboost.google/) | Google Cloud | Beginner to advanced | Freemium: a limited catalog of free courses and periodic credits; most labs consume credits | Yes | Google Cloud security fundamentals and hands-on labs |
| [HackTricks Cloud](https://cloud.hacktricks.wiki/) | HackTricks community | Intermediate | Free | No | Cloud and Kubernetes attack-path reference with defensive context |
| [AWS Well-Architected Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) | AWS | Intermediate | Free | No | Design-level review questions that map directly to audit findings |

## Digital forensics and incident response

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CyberDefenders](https://www.cyberdefenders.org/) | CyberDefenders | Beginner to advanced | Free account for challenges | Yes | Realistic disk and memory images with investigative questions |
| [Autopsy training](https://www.autopsy.com/) | Basis Technology | Beginner | Free account for some modules | Yes | Disk-image triage workflow in a widely used open-source suite |
| [SANS DFIR resources](https://www.sans.org/dfir/) | SANS Institute | Intermediate | Free posters, cheat sheets, and webcasts; SANS courses are paid | No | Investigator checklists and artifact reference material |
| [Volatility Foundation](https://www.volatilityfoundation.org/) | Volatility Foundation | Intermediate | Free | Yes, with sample images | Memory forensics concepts and the Volatility workflow |

## Malware analysis and reverse engineering

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Malware Unicorn RE101](https://malwareunicorn.org/workshops/re101.html) | Malware Unicorn | Beginner | Free | Yes | A guided first reverse-engineering workshop with practice binaries |
| [Malware Traffic Analysis](https://www.malware-traffic-analysis.net/) | Brad Duncan | Intermediate | Free | Yes, with PCAP exercises | Network evidence of malware behaviour, safely analyzed offline |
| [REMnux documentation](https://remnux.org/) | REMnux | Intermediate | Free | Yes, in a VM | A curated Linux toolkit and workflow for analyzing hostile software |
| [Ghidra](https://ghidra-sre.org/) | NSA | Intermediate to advanced | Free | Yes | Disassembly and decompilation without a commercial licence |

## Mobile application security

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Mobile Application Security Testing Guide](https://mas.owasp.org/MASTG/) | OWASP | Intermediate | Free | Some, with supplied apps | Android and iOS testing methodology at a professional level |
| [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/) | OWASP | Beginner | Free | No | The recurring mobile risk categories and their platform causes |
| [Android security best practices](https://developer.android.com/privacy-and-security/security-tips) | Google | Beginner to intermediate | Free | No | What a correct Android implementation looks like, which makes findings easier to justify |
| [Apple platform security documentation](https://developer.apple.com/documentation/security) | Apple | Intermediate | Free | No | Keychain, code signing, and entitlement behaviour on iOS and macOS |

## Wireless security

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Aircrack-ng documentation](https://www.aircrack-ng.org/) | Aircrack-ng | Beginner | Free | Yes, with your own hardware | Monitor mode, capture handling, and WPA analysis mechanics |
| [WirelessHack](https://www.wirelesshack.org/) | WirelessHack | Beginner | Free | Some | Practical tutorials for common wireless assessments and home lab setups |
| [Kismet](https://www.kismetwireless.net/) | Kismet | Intermediate | Free | Yes | Passive wireless discovery, logging, and site survey work |
| [Wi-Fi Alliance](https://www.wi-fi.org/) | Wi-Fi Alliance | Intermediate | Free | No | What WPA3, PMF, and certification actually specify, straight from the standards body |

## Red teaming and adversary emulation

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | Beginner to advanced | Free | No | A shared vocabulary of adversary behaviour that makes reports comparable |
| [Atomic Red Team](https://atomicredteam.io/) | Red Canary | Intermediate | Free | Yes | Small, safe tests that map to ATT&CK techniques and validate detection |
| [Caldera](https://caldera.mitre.org/) | MITRE | Advanced | Free | Yes | Automated adversary emulation in a lab you control |
| [SpecterOps blog](https://specterops.io/blog/) | SpecterOps | Advanced | Free | No | Deep, original research on Active Directory and identity attack paths |

## SOC and blue team operations

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [LetsDefend](https://letsdefend.io/) | LetsDefend | Beginner to intermediate | Freemium: limited free investigations; full platform is paid | Yes | Alert triage practice with a simulated SOC queue |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Security Blue Team | Beginner to advanced | Freemium: a set of free challenges; full library is paid | Yes | Investigative challenges across phishing, malware, and log analysis |
| [Splunk free courses](https://www.splunk.com/en_us/training/free-courses/overview.html) | Splunk | Beginner to intermediate | Free courses with an account | Some | Search processing language and detection logic in a SIEM context |
| [Elastic training](https://www.elastic.co/training) | Elastic | Beginner to intermediate | Free training catalog with an account | Some | Querying and visualizing security data in the Elastic stack |
| [Sigma](https://github.com/SigmaHQ/sigma) | SigmaHQ | Intermediate | Free | Yes, with a lab | Vendor-neutral detection rules and the logic behind them |

## Adjacent and specialist topics

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [CryptoHack](https://cryptohack.org/) | CryptoHack | Beginner to advanced | Free account | Yes | Applied cryptography through interactive challenges instead of proofs |
| [picoCTF](https://picoctf.org/) | Carnegie Mellon University | Beginner | Free | Yes, year-round practice | A friendly entry into CTF categories with strong beginner support |
| [Bellingcat guides](https://www.bellingcat.com/resources/) | Bellingcat | Beginner to intermediate | Free | Yes, guided investigations | Open-source intelligence verification discipline |
| [Surveillance Self-Defense](https://ssd.eff.org/) | Electronic Frontier Foundation | Beginner | Free | Some | Threat modelling and privacy hygiene for yourself and sources |
| [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/) | Al Sweigart | Beginner | Free online | Yes | Scripting fundamentals for repetitive analysis and parsing work |

## Sequencing advice

Do not treat this list as a checklist. A workable twelve-week schedule for a beginner:

1. Weeks 1-3: one foundations course plus the beginner track in [../training-grounds/beginner.md](../training-grounds/beginner.md).
2. Weeks 4-6: one field-specific course. Finish every lab inside it before starting another.
3. Weeks 7-9: move from guided labs to independent boxes or challenges in the same field.
4. Weeks 10-12: build one deliverable, such as a vulnerability report, a detection rule set, or a forensic timeline, and show it to someone who will critique it.

If a course makes you copy commands without explaining why, treat that as a signal, not a curriculum. The [open-source tools index](../open-source-tools/README.md) explains what each tool is for so you can reason about the commands you run.

## When free is not enough

Some gaps are real. A free tier will rarely give you deep Active Directory lab time, large-scale cloud environments, or human feedback on a report. When you hit such a gap, pay for the narrowest thing that closes it: one month of a lab platform, one exam voucher, one book. The [certifications index](../certifications/README.md) explains which paid credentials are worth considering and which are mostly marketing.

## References

1. Cisco Networking Academy course catalog, <https://www.netacad.com/>
2. PortSwigger Web Security Academy, <https://portswigger.net/web-security>
3. OWASP projects index, <https://owasp.org/projects/>
4. MITRE ATT&CK, <https://attack.mitre.org/>
5. SANS Internet Storm Center, <https://isc.sans.edu/>

## Catalog status

Catalog status: 60 course entries across 12 sections (foundations, the ten major fields, and adjacent topics).

Last reviewed: 2026-10-31

---

Back to the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), the [beginner-to-ethical-hacker roadmap](../../roadmaps/beginner-to-ethical-hacker.md), and [contribution guidance](../../CONTRIBUTING.md).
