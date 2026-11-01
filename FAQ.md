# Frequently Asked Questions

## Is everything here free?

The repository itself is free and MIT licensed. We prioritize genuinely free learning resources. Some recommended platforms are **freemium**: the free part is named on the resource page, and payment is optional. Certifications and paid books are clearly labelled. You do not need to buy anything to progress through the core paths.

## Do I need a degree or prior IT experience?

No. Beginners can start with [foundations](foundations/cybersecurity-fundamentals/README.md) and the [beginner-to-ethical-hacker roadmap](roadmaps/beginner-to-ethical-hacker.md). Prior help-desk, networking, Linux, or software experience helps, especially for SOC, cloud, and engineering roles. Expect more time, not impossibility, without it.

## Can I get a job by following one roadmap?

A roadmap organizes learning; it does not guarantee employment. Hiring depends on demonstrated skills, communication, location, work authorization, market conditions, and interviews. Build evidence through labs, projects, reports, and internships. See [career development](additional-topics/career-development/README.md).

## How long will it take?

At a consistent 8-10 hours per week, foundations often take 3-6 months, a first specialization 6-12 months, and job-ready confidence longer. Prior experience can shorten this. Anyone promising a fixed number of days is selling something.

## Do I need certifications?

No, but some employers or regions value them. Certifications can validate baseline knowledge and pass HR filters. Free study resources are listed in the [certification guide](resources/certifications/README.md). Never use exam dumps. Build practical evidence alongside any certificate.

## Which programming language should I learn first?

Python is the most useful first language for automation, log parsing, and security tooling. JavaScript is essential for web security, Bash for Linux, PowerShell for Windows, and SQL for data and injection concepts. Learn one well before collecting syntax from five.

## Do I need Kali Linux?

Kali is a convenient collection of tools, not a magic operating system. Learn Linux fundamentals on any distribution. You can use Kali in a VM for labs, but understanding the underlying commands matters more than the distribution banner.

## Can I practice on real websites?

Only with explicit authorization, such as a bug bounty program's published scope. Otherwise use deliberately vulnerable applications, your own lab, CTF platforms, or training ranges. "Publicly accessible" is not the same as "authorized." Read [ETHICS.md](ETHICS.md).

## Are these techniques illegal?

Knowledge is not a crime; unauthorized access and interference often are. The legality of testing depends on authorization, scope, intent, jurisdiction, and impact. This repository teaches authorized testing, defense, and remediation. It is not legal advice.

## Is hacking on a phone or over Wi-Fi safe?

Only in an isolated environment you own or are authorized to test. Wireless testing can affect third-party devices and may violate radio or computer-misuse laws. Use dedicated lab hardware and follow [wireless security](wireless-security/README.md).

## How do I build a lab without a powerful computer?

Start with browser-based labs and one lightweight Linux VM. Use cloud free tiers carefully with budget alerts. A used small-form-factor PC or Raspberry Pi can host useful Linux and networking labs. Avoid running multiple heavy VMs on a low-RAM laptop. See [Project 1](practical-projects/01-home-lab.md).

## How do I avoid dangerous malware?

Do not download or execute live malware on your normal computer. Use an isolated, snapshotted analysis VM with no shared folders or network bridging. Follow [malware analysis](malware-analysis/README.md) and the [home lab checklist](checklists/home-lab.md). For learning, use benign samples, EICAR for antivirus testing, and controlled training material.

## Why are some links marked freemium instead of free?

Because the platform offers both. TryHackMe, Hack The Box, CyberDefenders, Blue Team Labs Online, cloud skills platforms, and several course sites restrict some content to subscriptions. We state what is free so you can plan without surprise charges.

## A link is dead or a course changed. What should I do?

Open an issue with the file, URL, date checked, and the replacement if you have one. For a quick fix, submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Can I contribute or translate?

Yes. Read [CONTRIBUTING.md](CONTRIBUTING.md), follow the [Code of Conduct](CODE_OF_CONDUCT.md), and keep contributions original, accurate, and safe. For translations, open an issue first.

## Can I use this content in my class or bootcamp?

The MIT License allows reuse with attribution and the license notice. You may teach from it. You may not imply endorsement, remove attribution, or use it to misrepresent unauthorized activity as legitimate. If you build on it, a link back is appreciated.

## How is content verified?

Resources are checked against official pages, cost/access labels are reviewed, and link automation runs regularly. Educationally, guides cite primary sources. Verification is a point-in-time process; platforms change. See [resources/RESOURCE-FORMAT.md](resources/RESOURCE-FORMAT.md) and [the QA workflow](.github/workflows/quality.yml).

## What if I find unsafe content?

Do not test the technique on a live system. Report it privately through [SECURITY.md](SECURITY.md) or open a content-safety issue without sharing sensitive details.

## Does this repository condone hacktivism or attacking governments?

No. It supports lawful, authorized security education and defense. Content intended to facilitate unauthorized access, disruption, or harm will be removed.

---

[Back to repository home](README.md) · [Learning guide](LEARNING-GUIDE.md) · [Support](SUPPORT.md) · [Ethics](ETHICS.md)
