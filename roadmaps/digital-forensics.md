# Digital Forensics Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 10–16 months**

[Home](../README.md) › [Roadmaps](README.md) › Digital forensics

Digital forensics is the disciplined reconstruction of what happened on a system, device, or network, using evidence that would survive scrutiny. It is equal parts technical and procedural: acquiring data without altering it, verifying integrity, interpreting operating system artifacts, building timelines, and writing conclusions that separate observation from inference. This roadmap covers forensic soundness, Windows and Linux artifacts, memory and network evidence, timeline analysis, and mock cases that produce defensible reports.

Forensics is not the same as incident response, although the two overlap. Incident response focuses on containment and recovery; forensics focuses on evidence and reconstruction. Read [ETHICS.md](../ETHICS.md) and remember that handling other people's data carries legal, privacy, and ethical obligations.

## At a glance

| Item | Detail |
|---|---|
| Target role | Digital forensics analyst, DFIR analyst, forensic examiner, incident response consultant |
| Realistic duration | 10–16 months at 8–10 hours per week; 6–10 months with prior sysadmin, SOC, or legal investigative experience |
| Cost | Free tools and training material; optional paid exams, courses, and hardware write blockers |
| Lab needs | 16 GB RAM; virtualization; forensic images or VMs to image; Autopsy, Volatility 3, Eric Zimmerman tools, Wireshark, Plaso; ample disk space |
| Difficulty | High; precision, patience, and documentation discipline matter more than speed |
| Main output | Two mock case reports, a memory analysis, a network timeline, and an artifact reference |

This is a map, not a race. Forensic skill grows by doing complete cases, including the boring acquisition and verification steps. Prior IT experience helps you recognize normal system behaviour, which is half of spotting anomalies.

## Who this is for

This roadmap suits SOC analysts who want to move from alerts to reconstruction, system administrators who enjoy investigation, law enforcement or legal professionals moving into technical work, and security generalists who want a defensible evidence skill set.

Honest prerequisites:

- **Windows and Linux internals.** You should know the registry, event logs, file systems, processes, and services well enough to know what is normal.
- **Networking basics.** IP, TCP, DNS, HTTP, and how to read a packet capture.
- **Command line confidence.** Most acquisition and parsing tools are command-line utilities.
- **Scripting.** Python or PowerShell for parsing, hashing, and automation.
- **Meticulous documentation.** If you cannot explain how evidence was handled, the analysis is weak.
- **Legal awareness.** Authority, consent, privacy, and chain of custody vary by jurisdiction and employer.

You do not need a law degree, but you do need to know when to ask a lawyer or a manager. A technically brilliant report with a broken chain of custody is not useful evidence.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Forensic soundness | Acquire and handle evidence without altering it | An acquisition log with hashes and tool versions |
| Windows artifact analysis | Interpret registry, event logs, execution artifacts, and file system metadata | A findings table with artifact paths and timestamps |
| Linux artifact analysis | Read system logs, shell history, persistence, and file metadata | A host reconstruction with commands and sources |
| Memory analysis | Identify processes, network connections, and injected code from a memory image | A memory report with process trees and indicators |
| Network forensics | Reconstruct sessions and data flows from packet captures | A network timeline tied to host events |
| Timeline analysis | Correlate artifacts across sources and time zones | A master timeline with source attribution |
| Reporting | Separate fact, inference, and opinion; support every conclusion | A mock case report with an evidence appendix |
| Evidence handling | Maintain chain of custody and data integrity | A completed custody form and hash verification |

Typical entry-level tasks:

- Acquire a forensic image of a lab VM and verify its hash before and after analysis.
- Parse Windows event logs and build a logon and process-execution timeline.
- Extract running processes and network connections from a memory image.
- Correlate a packet capture with host artifacts from the same incident.
- Write a report that states what is known, what is inferred, and what remains unknown.

## Learning sequence

The sequence starts with soundness and artifacts, then moves to acquisition, memory, network, and full-case reporting. Each stage should be practiced on evidence you created, so you know the ground truth and can check your conclusions.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Forensic foundations and operating system artifacts | 10–12 weeks | Artifact reference with verified examples |
| 2 | Acquisition, Windows analysis, and file systems | 10–12 weeks | Acquisition log and Windows case report |
| 3 | Memory, Linux, and network forensics | 10–12 weeks | Memory and network analysis reports |
| 4 | Timeline correlation and mock cases | 8–10 weeks | Full mock case report |
| 5 | Portfolio, testimony basics, and interviews | 6–8 weeks | Two polished case reports |

### Stage 1 — Forensic foundations and operating system artifacts

| Element | Detail |
|---|---|
| Goal | Understand forensic soundness and learn where operating systems record activity. |
| Topics | Locard's exchange principle; volatility of evidence; chain of custody; hashing; write blockers; order of volatility; file systems (NTFS, ext4, APFS overview); Windows registry, event logs, prefetch, Amcache, ShimCache; Linux logs, authentication records, shell history, cron, systemd. |
| Free learning | [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final), [SWGDE documents](https://www.swgde.org/), [DFIR Training](https://www.dfir.training/), [AboutDFIR](https://aboutdfir.com/). |
| Labs | Create a Windows VM, perform normal activity, then locate evidence in the registry and event logs. Repeat on Linux. Hash every exported artifact. |
| Deliverable | An artifact reference with at least 15 artifacts, their locations, what they prove, and limitations. |
| Exit criteria | You can explain the difference between an artifact and an interpretation, and you can find a logon event without a walkthrough. |

### Stage 2 — Acquisition, Windows analysis, and file systems

| Element | Detail |
|---|---|
| Goal | Acquire evidence defensibly and reconstruct user and system activity on Windows. |
| Topics | Physical versus logical acquisition; imaging tools; verification; live response trade-offs; NTFS metadata ($MFT, $UsnJrnl, $LogFile); registry hives; event log parsing; execution artifacts; USB and browser history; anti-forensics indicators. |
| Free learning | [Autopsy documentation](https://www.autopsy.com/), [Eric Zimmerman tools](https://ericzimmerman.github.io/), [SANS SIFT Workstation](https://www.sans.org/tools/sift-workstation/), [Windows security log encyclopedia](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/). |
| Labs | Image a lab VM with FTK Imager or a documented dd command. Verify the hash. Analyze the image in Autopsy. Parse registry hives and event logs with Eric Zimmerman tools. |
| Deliverable | A Windows case report covering acquisition, user activity, execution, and persistence, with an evidence appendix. |
| Exit criteria | Every conclusion cites an artifact, a timestamp, and a method. Hashes match before and after analysis. |

### Stage 3 — Memory, Linux, and network forensics

| Element | Detail |
|---|---|
| Goal | Work with volatile and network evidence, where context disappears fastest. |
| Topics | Memory acquisition; process and network artifacts; DLL and code injection indicators; Linux persistence and logs; packet capture analysis; DNS and HTTP reconstruction; file carving from network streams; encryption and its limits. |
| Free learning | [Volatility 3 documentation](https://github.com/volatilityfoundation/volatility3), [Wireshark documentation](https://www.wireshark.org/docs/), [Malware Traffic Analysis](https://www.malware-traffic-analysis.net/), [The DFIR Report](https://thedfirreport.com/). |
| Labs | Capture memory from a lab VM, then analyze processes and connections with Volatility 3. Analyze a public packet capture from Malware Traffic Analysis. Correlate a network connection to a process. |
| Deliverable | A memory analysis report and a network timeline, each tied to the same simulated incident. |
| Exit criteria | You can explain what memory adds that disk cannot, and you can identify a suspicious connection without overclaiming attribution. |

### Stage 4 — Timeline correlation and mock cases

| Element | Detail |
|---|---|
| Goal | Combine sources into one defensible timeline and run a complete case from intake to report. |
| Topics | Time zones and timestamp formats; normalization; super-timelines with Plaso or log2timeline; correlation across disk, memory, and network; gaps and contradictions; hypothesis testing; report structure; peer review. |
| Free learning | [Plaso documentation](https://plaso.readthedocs.io/), [CyberDefenders](https://cyberdefenders.org/), [Blue Team Labs Online](https://blueteamlabs.online/), [Velociraptor documentation](https://docs.velociraptor.app/). |
| Labs | Complete two CyberDefenders forensics challenges. Build a super-timeline from a lab image. Write a full report with findings, timeline, and limitations. Have a peer challenge your conclusions. |
| Deliverable | A complete mock case report with an executive summary, technical findings, master timeline, and evidence appendix. |
| Exit criteria | The timeline is internally consistent, every finding is sourced, and unsupported hypotheses are explicitly labeled. |

Ethics reminder: only examine systems and data you own or are authorized to investigate. Evidence often contains personal communications and credentials; access only what the case requires, store it securely, and delete it according to policy. Do not publish case data or re-identify individuals. See [ETHICS.md](../ETHICS.md).

### Stage 5 — Portfolio, testimony basics, and interviews

| Element | Detail |
|---|---|
| Goal | Present forensic work credibly and understand the expectations of legal or corporate proceedings. |
| Topics | Report redaction; exhibit numbering; expert versus lay witness; peer review; deposition basics; reproducibility; tool validation; continuing education. |
| Free learning | [SWGDE](https://www.swgde.org/), [NIST forensic science](https://www.nist.gov/forensics), [SANS whitepapers](https://www.sans.org/white-papers/), [lab notes template](../templates/lab-notes.md). |
| Labs | Redact and publish one case report. Present findings to a non-technical reviewer in ten minutes. Run a mock cross-examination on your conclusions. |
| Deliverable | Two polished, redacted case reports and a one-page methodology statement. |
| Exit criteria | You can explain your method to a non-expert, defend a limitation, and avoid stating an opinion beyond the evidence. |

## Sequence diagram

```text
Stage 1  Foundations + OS artifacts
  soundness | hashing | registry | event logs | Linux logs
        |
        v
Stage 2  Acquisition + Windows + file systems
  image -> verify -> Autopsy -> MFT -> execution -> persistence
        |
        v
Stage 3  Memory + Linux + network
  RAM -> processes -> connections -> pcap -> correlation
        |
        v
Stage 4  Timeline + mock case
  normalize -> super-timeline -> hypotheses -> report -> peer review
        |
        v
Stage 5  Portfolio + testimony
  redact -> present -> defend -> interview
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final) | NIST | Intermediate | Free | No | The foundational forensic process guide |
| [SWGDE documents](https://www.swgde.org/) | SWGDE | Intermediate–advanced | Free | No | Technical and quality standards for digital evidence |
| [Autopsy](https://www.autopsy.com/) | Sleuth Kit | Beginner–intermediate | Free, open source | Yes | Disk image analysis and reporting |
| [Volatility 3](https://github.com/volatilityfoundation/volatility3) | Volatility Foundation | Advanced | Free, open source | Yes | Memory forensics |
| [Eric Zimmerman tools](https://ericzimmerman.github.io/) | Eric Zimmerman | Intermediate | Free | Yes | Windows artifact parsing |
| [Plaso](https://plaso.readthedocs.io/) | Plaso project | Advanced | Free, open source | Yes | Super-timeline creation |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark | Beginner–advanced | Free | Yes | Packet analysis |
| [Velociraptor](https://docs.velociraptor.app/) | Velocidex | Advanced | Free, open source | Yes | Endpoint visibility and live response |
| [Malware Traffic Analysis](https://www.malware-traffic-analysis.net/) | Brad Duncan | Intermediate | Free; archives are password-protected | Yes | Realistic packet capture exercises |
| [DFIR Training](https://www.dfir.training/) | DFIR Training | Beginner–advanced | Free resource index | No | A curated map of forensic resources |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Beginner–advanced | Free challenges | Yes | Blue-team and forensics scenarios |
| [The DFIR Report](https://thedfirreport.com/) | The DFIR Report | Intermediate–advanced | Free | No | Real intrusion reconstructions |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Create and image a lab VM | Local | Acquisition and hash verification | Free |
| 2 | Windows registry and event log analysis | Local image | User and execution artifacts | Free |
| 3 | Autopsy case with timeline | Local image | Disk analysis and reporting | Free |
| 4 | Memory capture and Volatility analysis | Local VM | Processes, connections, injection | Free |
| 5 | Packet capture investigation | Malware Traffic Analysis | Network reconstruction | Free |
| 6 | Super-timeline with Plaso | Local image | Correlation across sources | Free |
| 7 | CyberDefenders challenge | Online | Guided investigative reasoning | Free |
| 8 | Full mock case and peer review | Local | End-to-end reporting | Free |

Safe-lab caveat: work on copies, never originals. Use a write blocker when one is available, and document every tool and version. Keep evidence in encrypted storage, restrict access, and do not upload case images to random online services. Malware Traffic Analysis captures may contain real malicious traffic; analyze them in an isolated VM with no shared folders. If you did not create the data and do not have authority to examine it, stop.

## Portfolio projects

1. **Windows forensic case report.** A complete report from a lab image: acquisition record, user activity, execution evidence, persistence, timeline, and limitations. Include hash values and tool versions.
2. **Memory analysis report.** Process tree, suspicious connections, injected regions, and a clear statement of what memory does and does not prove.
3. **Network forensics case.** A packet capture investigation tied to host artifacts, with an annotated timeline and indicators.
4. **Artifact cheat sheet.** A practical reference of 25 artifacts across Windows and Linux, with location, interpretation, and caveats. This is useful to a SOC team and demonstrates depth.
5. **Evidence handling package.** A chain-of-custody form, acquisition checklist, verification log, and retention policy for a fictional lab.

## Milestones and self-assessment

**Months 0–4**

- [ ] I can explain forensic soundness and order of volatility.
- [ ] I created a lab VM, found ten artifacts, and documented their limitations.
- [ ] I hashed evidence and verified integrity before and after analysis.
- [ ] I can navigate Event Viewer and the registry with purpose.

**Months 4–8**

- [ ] I imaged a VM and analyzed it in Autopsy.
- [ ] I parsed registry and event logs with at least two tools.
- [ ] I wrote a Windows case report with a sourced timeline.
- [ ] I can explain what NTFS metadata reveals about file activity.

**Months 8–12**

- [ ] I captured and analyzed memory from a lab VM.
- [ ] I reconstructed a network session from a packet capture.
- [ ] I built a super-timeline with Plaso and resolved time-zone issues.
- [ ] I completed a CyberDefenders or Blue Team Labs forensics challenge.

**Months 12–16**

- [ ] I completed a full mock case and had it peer reviewed.
- [ ] I can present findings to a non-technical audience in ten minutes.
- [ ] My portfolio has two redacted case reports.
- [ ] I can articulate the limits of my conclusions under questioning.

## Certifications

Forensic certifications are optional and often expensive. Every exam below is paid; free study material exists through SANS posters, whitepapers, and vendor documentation, but the official courses are paid.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | General baseline, not forensic |
| [GCFE](https://www.giac.org/certifications/certified-forensic-examiner-gcfe/) | GIAC | Intermediate | SANS posters and whitepapers | Paid exam | Windows forensic analysis focus; course is expensive |
| [GCFA](https://www.giac.org/certifications/certified-forensic-analyst-gcfa/) | GIAC | Advanced | SANS posters and whitepapers | Paid exam | Intrusion-focused forensics; widely recognized |
| [GNFA](https://www.giac.org/certifications/network-forensic-analyst-gnfa/) | GIAC | Advanced | SANS posters and whitepapers | Paid exam | Network forensics depth |
| [CFCE](https://www.iacis.com/certification/) | IACIS | Advanced | Limited free material | Paid training and exam | Strong law-enforcement-oriented credential |
| [ACE](https://www.exterro.com/) | Exterro | Intermediate | Vendor documentation | Paid | Vendor-specific; check employer demand |

## Common detours and mistakes

- **Working on originals.** Always image first and analyze the copy. One accidental write can undermine the entire case.
- **No hash verification.** Without hashes, you cannot show integrity. Record them at acquisition and after analysis.
- **Tool tunnel vision.** A tool's output is not a finding. Validate with a second source where possible.
- **Ignoring time zones.** Mixed UTC and local timestamps create false sequences. Normalize and document.
- **Overclaiming attribution.** Technical evidence rarely proves who was at the keyboard. Separate fact from inference.
- **Skipping documentation.** If the method is not recorded, the result is not reproducible.
- **Untested tools.** Validate tool behaviour on known data before relying on it in a case.
- **Mishandling personal data.** Forensic images contain private information. Access only what the case requires.

## Next steps

1. Build the lab in [01-home-lab.md](../practical-projects/01-home-lab.md), then create and image a dedicated forensic VM.
2. Read the [digital forensics guide](../digital-forensics/README.md) and [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final) before your first case.
3. Practice on [CyberDefenders](https://cyberdefenders.org/) and [Blue Team Labs Online](https://blueteamlabs.online/) until you can work without hints.
4. If incident response appeals, continue with the [SOC analyst roadmap](soc-analyst.md); for malicious code, see the [malware analyst roadmap](malware-analyst.md).
5. Use the [exercises](../exercises/README.md), [checklists](../checklists/README.md), and [lab notes template](../templates/lab-notes.md) for consistent evidence handling.

## References

- [NIST SP 800-86: Guide to Integrating Forensic Techniques into Incident Response](https://csrc.nist.gov/pubs/sp/800/86/final)
- [SWGDE technical documents](https://www.swgde.org/)
- [RFC 3227: Guidelines for Evidence Collection and Archiving](https://www.rfc-editor.org/rfc/rfc3227)
- [Autopsy documentation](https://www.autopsy.com/)
- [Volatility 3](https://github.com/volatilityfoundation/volatility3)
- [Eric Zimmerman tools](https://ericzimmerman.github.io/)
- [NIST forensic science program](https://www.nist.gov/forensics)
- [The DFIR Report](https://thedfirreport.com/)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
