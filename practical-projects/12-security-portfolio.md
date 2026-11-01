# Project 12 — Security Portfolio and Three Sanitized Write-Ups

A portfolio is not a folder of screenshots or a list of certificates. It is a small, public argument that you can scope work, produce evidence, reason about risk, and explain the result to someone who was not there. In this project you select three artifacts from earlier work, remove everything that should not be public, write the narrative that gives each artifact meaning, and publish a portfolio that a hiring manager can review without asking you for context.

| Field | Value |
| --- | --- |
| Difficulty | Beginner–Intermediate |
| Estimated time | 5–8 hours |
| Cost | $0 |
| Prerequisites | At least three completed practical projects, exercises, or lab reports; a GitHub account; comfort editing Markdown and images |
| Safety and scope | Publish only self-owned lab work or work you have explicit permission to publish; never publish client data, credentials, live malware, or another person's personal information |
| Portfolio outcome | A public index and three sanitized write-ups with reproducible evidence |

`Last reviewed: 2026-10-31`

> **Safety and scope.** Sanitization is a security control, not a cosmetic edit. A blurred screenshot can still contain readable text, a PDF can retain author metadata, and a Git history can retain a deleted secret. Treat every artifact as hostile until you have inspected the content, the metadata, and the history. If you cannot prove that an artifact is safe to publish, leave it private.

## Objective

- Select three pieces of work that demonstrate different skills and evidence types.
- Confirm that you have permission to publish each artifact.
- Build an inventory of sensitive content before editing anything.
- Sanitize text, screenshots, logs, packet captures, documents, and metadata.
- Scan the repository and its history for secrets.
- Write a short narrative for each project: context, constraints, decisions, evidence, outcome, limitations, and reflection.
- Publish a clear index that a reviewer can navigate without prior knowledge.
- Run a peer review and a reproducibility check.
- Set a maintenance and review schedule.

## Why this project matters

Hiring managers see many claims and few artifacts. A candidate who says "I know web security" is easy to ignore; a candidate who links a scoped assessment with a findings register, a remediation retest, and an honest limitations section is difficult to ignore. The portfolio is where the work becomes legible.

The sanitization step is equally important. Publishing a lab write-up with a real token, an employer hostname, or a customer screenshot can end a career before it starts. The habit you build here applies to conference talks, bug bounty reports, incident reviews, and public postmortems. Good sanitization is evidence of professional judgement.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Git | Version control and history inspection | <https://git-scm.com/> | Free, open source |
| GitHub | Public repository and review workflow | <https://github.com/> | Free for public repositories |
| Gitleaks | Secret scanning for the working tree and history | <https://github.com/gitleaks/gitleaks> | Free, open source |
| TruffleHog | Verified-secret scanning across files and history | <https://github.com/trufflesecurity/trufflehog> | Free, open source |
| ExifTool | Inspect and remove image metadata | <https://exiftool.org/> | Free, open source |
| Wireshark | Review packet captures before publishing a sanitized excerpt | <https://www.wireshark.org/> | Free, open source |
| Markdown editor | Write the index and narratives | Any editor | Free options exist |
| Image editor | Crop and permanently redact screenshots | Any editor with destructive redaction | Free options exist |

## Setup

1. Choose a workspace and create a fresh repository. Starting clean is easier than removing sensitive history from an existing repository:

```bash
mkdir -p ~/portfolio/security-portfolio
cd ~/portfolio/security-portfolio
git init
```

2. Create a predictable structure. Three deep projects are easier to review than twelve shallow folders:

```text
security-portfolio/
├── README.md
├── LICENSE
├── 01-web-assessment/
│   ├── README.md
│   ├── findings.md
│   ├── retest.md
│   └── evidence/
├── 02-incident-investigation/
│   ├── README.md
│   ├── timeline.md
│   └── evidence/
└── 03-secure-application/
    ├── README.md
    ├── threat-model.md
    ├── security-tests.md
    └── evidence/
```

3. Create a private working directory for originals. Never edit the only copy of an artifact:

```bash
mkdir -p ~/portfolio/private-originals
```

4. Add a `.gitignore` for local secrets and generated files:

```text
.env
*.env
private-originals/
node_modules/
*.db
*.pcap
*.pcapng
*.zip
```

Do not use `.gitignore` as a security control for files you already committed. It prevents accidental addition; it does not remove history.

5. Confirm your Git identity and create an initial empty commit:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
git commit --allow-empty -m "Start security portfolio"
```

Use a professional email address that you are willing to make public. Do not use an address that reveals an employer or a personal identifier you want to keep private.

## Step-by-step tasks

1. **Select three artifacts with different evidence types.** Pick work that shows range without pretending to be a specialist in everything. A strong default set is:

| Slot | Candidate work | What it proves |
| --- | --- | --- |
| Assessment | [Project 05](05-web-vuln-assessment.md) plus [Project 06](06-security-report.md) | Scoping, testing, evidence, remediation advice |
| Investigation | [Project 07](07-incident-investigation.md) or [Project 08](08-forensics-timeline.md) | Timeline reconstruction, analysis, detection gaps |
| Engineering | [Project 10](10-cloud-security-review.md) or [Project 11](11-secure-web-app.md) | Secure design, controls, tests, CI evidence |

Other valid combinations include a detection-engineering piece from [Project 04](04-log-analysis-siem.md), a malware behavior report from [Project 09](09-malware-analysis-report.md), or a CTF write-up that explains reasoning rather than only a flag. Choose three that you can discuss for fifteen minutes without notes.

Checkpoint: a one-sentence "what this proves" statement for each artifact, written before you edit anything.

2. **Confirm permission and provenance.** For each artifact, record the source, the owner, the authorization basis, and the publication decision. A lab you built is usually safe to publish. A CTF write-up may be restricted until the event ends. An employer artifact requires written permission, and a client artifact usually requires a contract review.

| Artifact | Source | Authorization basis | Publish? | Reason |
| --- | --- | --- | --- | --- |
| Web assessment | Self-owned Juice Shop lab | Self-owned lab | Yes, sanitized | No third-party systems |
| Incident timeline | Synthetic training dataset | Public training data | Yes, sanitized | Confirm dataset licence |
| Secure app | Self-built local app | Self-owned code | Yes, sanitized | No real user data |

If the answer is "I am not sure", the answer is "not yet". Ask the owner, read the licence, or replace the artifact with self-owned work.

3. **Build a sensitive-content inventory.** Review every file before editing. Mark each item as publish, sanitize, or exclude:

| Content | Examples | Decision |
| --- | --- | --- |
| Client or employer identity | Company name, logo, internal project name | Exclude or replace with a generic label |
| Personal data | Names, emails, usernames, avatars, phone numbers | Replace with synthetic examples |
| Authentication material | Passwords, hashes, tokens, cookies, API keys, session IDs | Exclude and rotate if real |
| Network details | Public IPs, internal hostnames, MAC addresses, SSIDs | Replace with documentation ranges and generic names |
| System details | OS build strings, patch levels, serial numbers, licence keys | Remove unless the detail is necessary to the finding |
| Evidence files | PCAPs, disk images, memory images, malware samples | Exclude or publish a small, sanitized excerpt |
| Screenshots | Browser tabs, bookmarks, notifications, timestamps, user profiles | Crop and redact |
| Metadata | EXIF, PDF author, Office properties, file paths | Strip or re-export |
| History | Deleted files, old commits, stash entries, branches | Inspect and rewrite if necessary |

Checkpoint: every file in the proposed public repository has a row in the inventory. If you cannot classify it, exclude it.

4. **Sanitize text and identifiers.** Replace real values consistently so the narrative still makes sense:

| Original type | Safe replacement |
| --- | --- |
| Public IP address | `192.0.2.10`, `198.51.100.20`, or `203.0.113.30` |
| Domain name | `example.com`, `example.org`, or `example.net` |
| Internal hostname | `lab-web-01`, `lab-dc-01`, `lab-files-01` |
| Person | `Alice Example`, `Bob Example` |
| Email address | `alice@example.com`, `bob@example.com` |
| Credential or token | `<REDACTED>` and a note that it was rotated |
| File path | `C:\lab\evidence\` or `/home/analyst/evidence/` |
| Organisation | `Example Corp` or "a fictional retailer" |

Use the same replacement everywhere, including captions and command output. A single leftover real hostname undermines the whole sanitization pass. Do not use a real company's domain as a "safe" example; use the reserved documentation domains.

5. **Redact screenshots and images properly.** Crop browser chrome, tabs, bookmarks, notifications, account menus, and the system clock if it reveals a real date or location. Use solid shapes or destructive pixel replacement, not blur or a semi-transparent highlighter. Save a sanitized copy and verify it at full zoom.

```bash
exiftool -all= -o sanitized-screenshot.png original-screenshot.png
exiftool sanitized-screenshot.png
```

Check the image for text that is still readable at 200 percent zoom, and check the file metadata after export. A screenshot that has been resized may still contain readable small text. When in doubt, recreate the evidence with synthetic data instead of redacting a real capture.

6. **Sanitize logs, documents, and packet captures.** Logs often contain more identifiers than the finding requires. Replace IPs, hostnames, usernames, session IDs, and request bodies with synthetic values, then verify that the finding still makes sense. For PDFs and office documents, remove author, company, comments, tracked changes, and embedded files, then export a fresh copy. For packet captures, publish a short excerpt only after replacing addresses and payloads; never publish traffic from a real network.

Checkpoint: a reviewer can understand the evidence without seeing a real identifier, and the sanitized artifact is still technically accurate.

7. **Scan for secrets before the first push.** Run both a pattern scanner and a verified-secret scanner:

```bash
gitleaks detect --source . --redact --verbose
trufflehog filesystem . --only-verified
```

If either tool reports a real secret:

1. Revoke or rotate the secret first. Removing it from a file does not make it safe.
2. Remove it from the working tree and replace it with a placeholder.
3. Inspect history with `git log --all --full-history -- .env` and similar paths.
4. If the secret is in history, rewrite the history of your personal repository with `git filter-repo`, then force-push only after you understand the impact.
5. Re-scan the working tree and the history.

```bash
git filter-repo --path .env --invert-paths
gitleaks detect --source . --redact --verbose
```

Do not rewrite history on a shared repository without coordinating with every collaborator. On GitHub, enable secret scanning and push protection for public repositories where available. A secret that was exposed publicly should be treated as compromised even after the commit is removed.

8. **Write the narrative for each project.** Use the same structure so reviewers can compare projects quickly:

```markdown
# Project title

## Question
What problem did this project answer?

## Context and constraints
Lab environment, scope, time window, tools, and what was out of scope.

## What I did
The method, with links to the artifact rather than a full repeat of it.

## Evidence
The files a reviewer can open, and what each one proves.

## Outcome
The finding, fix, detection, or design decision, stated plainly.

## Limitations
What the lab could not reproduce, what you did not test, and what you would need next.

## Reflection
What you would change about the method, tooling, or communication next time.
```

The narrative is the part that distinguishes a professional from someone following a tutorial. It should explain why you made a decision, not just list commands. Keep it to roughly 400–700 words per project.

9. **Publish a clear index.** The repository `README.md` should answer three questions in the first screen: who you are, what the portfolio contains, and how to review it. Include a table with the project, the skill it demonstrates, the artifact, and the date.

```markdown
# Security portfolio

I am an early-career security practitioner focused on application security and
incident investigation. These projects were completed in isolated labs with
synthetic or public data. Each write-up states its scope and limitations.

| Project | Skills | Artifact | Reviewed |
| --- | --- | --- | --- |
| Web assessment | WSTG, evidence, remediation | [Report](01-web-assessment/) | 2026-10-31 |
| Incident timeline | Triage, timeline, detection gaps | [Report](02-incident-investigation/) | 2026-10-31 |
| Secure application | ASVS, threat model, CI tests | [Report](03-secure-application/) | 2026-10-31 |

## How to review
Start with the project README, then open the linked evidence. Commands and
sanitized outputs are included so the work can be reproduced in a lab.

## Contact
Professional contact details only.
```

Add a licence if you want others to reuse the text or code. State clearly that the work is educational and not a client engagement. Do not imply that a lab finding affected a real organisation.

10. **Run a peer review and a reproducibility check.** Ask one person who did not do the project to review it. Give them the public repository, not your private notes. Ask them to answer:

- Can you state the scope and the main finding after five minutes?
- Can you find the evidence for the main claim?
- Are the commands reproducible with synthetic data?
- Is any real identifier, credential, or personal data visible?
- Is the lab context stated, or does the write-up imply a real target?
- Are the limitations honest, or does the write-up overclaim?
- Do the links work, and can every artifact be opened?

Record the review comments and the changes you made. A portfolio that has survived one skeptical review is stronger than one that has only been self-reviewed.

11. **Set a maintenance schedule.** Review the portfolio every three to six months. Re-run link checks, open every artifact, check that claims still match the evidence, and update the review date. Remove projects that no longer represent your work rather than leaving stale material online. If a tool or standard changes, add a note rather than silently rewriting history.

Checkpoint: a dated maintenance entry in the repository and a reminder for the next review.

## Expected results

- Three published artifacts that demonstrate different skills and evidence types.
- A public index with scope, skills, links, and review dates.
- A sanitization inventory with a publish decision for every file.
- A secret-scan result for both the working tree and the history.
- Narratives that explain context, decisions, limitations, and reflection.
- A peer review record with concrete changes.
- A maintenance date and a repeatable review checklist.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `README.md` | Markdown | Clear index, lab context, skills, links, review date |
| Three project folders | Markdown and evidence | Each has a narrative, artifact, and limitations |
| `sanitization-inventory.csv` | CSV | File, sensitive content, action, reviewer, date |
| `secret-scan.txt` | Text | Gitleaks and TruffleHog results with no live secrets |
| `peer-review.md` | Markdown | Reviewer questions, findings, and changes made |
| `maintenance.md` | Markdown | Review dates, link status, and next actions |
| `LICENSE` | Text | A licence you understand and intend to use |

## Skills gained

- Selecting evidence for an audience instead of dumping every artifact.
- Recognizing and removing personal, client, and credential data.
- Sanitizing screenshots, documents, logs, and packet captures.
- Scanning a repository and its history for secrets.
- Writing a concise technical narrative with honest limitations.
- Publishing and maintaining a professional public portfolio.
- Reviewing your own work as a skeptical hiring manager would.

## Stretch improvements

1. Add a short "how I work" page that describes your lab setup, note-taking, and review process without revealing sensitive infrastructure.
2. Record a five-minute walkthrough of one project and publish a transcript with the video.
3. Add a machine-readable index such as a small JSON file that lists projects, skills, and artifact paths.
4. Ask a second reviewer from a different role, such as a developer or a recruiter, and compare their feedback.
5. Recreate one artifact with new synthetic data to prove that the method, not the original data, is the reusable part.
6. Add a "known gaps" section that names the skills you are currently building, without turning the portfolio into a confessional.
7. Run the repository's link checker and Markdown lint as a local pre-publish check.

## Troubleshooting

### A secret was published before you noticed

Revoke or rotate it immediately, then remove it from the working tree and inspect history. Rewrite history if the repository is yours and you understand the consequences; otherwise coordinate with the repository owner. Enable push protection, re-scan, and document the incident. Monitoring for misuse matters more than deleting the commit.

### A redacted screenshot still shows sensitive text

Open the sanitized file at full resolution and zoom. Blur, mosaic, and semi-transparent highlights are reversible or leave readable shapes. Replace the region with an opaque shape, crop it out, or recreate the screenshot with synthetic data. Check the exported file, not the editor canvas.

### Git history contains a large or sensitive file

Use `git filter-repo` on a fresh clone of your personal repository, then verify the result before force-pushing. If the history is too tangled, create a new repository with a clean initial commit and copy only the sanitized files. A clean history is more valuable than preserving every intermediate commit.

### A reviewer cannot open an artifact

Prefer Markdown, PDF, PNG, and CSV over proprietary formats. Include a short summary at the top of every artifact so a reviewer can understand it without the original tool. Test the repository in a private browser window with no cached login, exactly as an external reviewer would.

### An employer or client artifact is useful but not approved

Leave it out. Replace it with a self-owned project that demonstrates the same skill, or publish a methods-only write-up with no client details. A portfolio gap is recoverable; a confidentiality breach may not be.

### A CTF write-up would spoil an active event

Wait until the event ends and follow the organiser's disclosure policy. Do not publish flags, challenge files, or solutions while the competition is live. If the rules are unclear, ask the organisers before publishing.

## Portfolio presentation

The portfolio itself is the final artifact. It should be easy to scan, honest about scope, and free of anything you would not want a current or future employer to see. Lead with the three projects and the skills they prove, not with a long biography. State the lab context on every project, link the evidence directly, and keep the contact details professional.

Do not publish a polished exploit chain against a real product, a client's name, a live malware sample, an exam dump, or a paid course's material. Do not present a lab finding as a real engagement. The strongest signal is not the number of projects; it is the quality of the scoping, the evidence, and the reflection.

## References

1. OWASP Web Security Testing Guide — <https://owasp.org/www-project-web-security-testing-guide/>
2. OWASP Application Security Verification Standard — <https://owasp.org/www-project-application-security-verification-standard/>
3. NIST SP 800-218, Secure Software Development Framework — <https://csrc.nist.gov/pubs/sp/800/218/final>
4. CISA Secure by Design — <https://www.cisa.gov/securebydesign>
5. GitHub secret scanning documentation — <https://docs.github.com/en/code-security/secret-scanning>
6. Gitleaks — <https://github.com/gitleaks/gitleaks>
7. TruffleHog — <https://github.com/trufflesecurity/trufflehog>
8. ExifTool — <https://exiftool.org/>
9. Practical projects index — [README.md](README.md)
10. Repository ethics policy — [ETHICS.md](../ETHICS.md)

---

**Navigation:** [Practical projects index](README.md) · [Project 11](11-secure-web-app.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
