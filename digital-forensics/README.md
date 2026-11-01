[Home](../README.md) / Digital Forensics

# Digital Forensics: Sound Evidence Handling and Artifact Analysis

Last reviewed: 2026-10-31. This guide is part of the learn-hacking curriculum and follows the vocabulary of NIST SP 800-86 and RFC 3227.

Digital forensics is the disciplined reconstruction of events from digital evidence. It combines file system analysis, operating system artifacts, memory analysis, network logs, and careful documentation. The technical work is only half the job: evidence must be acquired without altering it, stored with an unbroken chain of custody, analyzed with reproducible methods, and explained to people who were not in the room.

This guide is for incident responders, system administrators, SOC analysts, and career changers who want to work with evidence rather than guesswork. It covers Windows, Linux, memory, mobile, and network sources, with an emphasis on free tools and synthetic practice data. It does not teach you to break into devices or bypass locks. Legal authority, consent, and privacy are prerequisites for every technique here.

> **Ethics and law.** Analyzing a device you do not own or have lawful authority over can be a crime and a privacy violation. Practice only on your own systems, public training images, or synthetic data. Read [ETHICS.md](../ETHICS.md) before you acquire anything.

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Intermediate; patience and attention to detail matter more than raw speed |
| Realistic time | 12–16 weeks at 8 hours per week to handle a small case end to end |
| Cost | Free tools and free training images; a machine with 16 GB RAM and 200 GB free disk helps |
| Prerequisites | Windows and Linux administration, file systems, command line, networking, and report writing |
| Lab requirement | Virtual machines, a write blocker or a software equivalent, and isolated case storage |
| Best first win | A documented Windows artifact timeline from a public training image with verified hashes |

## Why this field matters

Every organization now produces evidence continuously: endpoints log process execution, cloud providers log API calls, network sensors log connections, and mobile devices log locations. When a ransomware incident, insider theft, or fraud allegation occurs, the difference between a defensible conclusion and an expensive guess is forensic method. Investigators who can preserve volatile data, reconstruct a timeline, and explain uncertainty are valuable in incident response, law enforcement, litigation support, and compliance.

Courts and regulators scrutinize process as much as findings. A perfectly correct conclusion can be excluded if the evidence was altered, the chain of custody is broken, or the analyst cannot explain their tooling. Conversely, a careful analyst who documents limitations can support a conclusion even when some artifacts are missing. That is why this guide teaches method before tools.

## What you will learn

- How to acquire and preserve evidence without altering it, including hashing and chain of custody.
- How file systems store metadata and where deleted or hidden data may survive.
- How to interpret Windows execution, persistence, and logon artifacts without overclaiming.
- How to analyze Linux logs, shells, services, and user activity.
- How to acquire and analyze memory with Volatility 3.
- How to build a timeline that correlates host, network, and application events.
- How to use Autopsy, Sleuth Kit, Eric Zimmerman tools, and Plaso in a repeatable workflow.
- How to write a forensic report with findings, limitations, and exhibits.

## Prerequisites and honest expectations

You should be comfortable installing operating systems, navigating the Windows registry, reading Linux logs, and using a command line. You need to understand how files are stored: blocks, inodes, directory entries, and timestamps. Basic networking helps when you correlate IP addresses, DNS queries, and proxy logs. If you have never written an incident report, practice explaining a technical problem to a non-technical reader.

Forensics is slow. Imaging a 500 GB drive takes time, indexing takes time, and the first pass through a case usually raises more questions than it answers. You will need to verify tool output manually, because a pretty timeline can be wrong. You will also need to read legal and policy documents, not just technical ones. If you want fast action and constant novelty, incident response may be a better fit than pure forensics; if you enjoy puzzles and rigor, this field rewards you. Practice on synthetic data: public training images are excellent, but you should also create your own by building a virtual machine, performing a scripted sequence of user actions, snapshotting it, and then investigating what the system recorded. That exercise teaches you how artifacts are generated, which is more valuable than memorizing artifact locations.

## Core concepts

### Forensic soundness and the evidentiary process

Forensic soundness means that your actions do not change the evidence in ways that affect the conclusion, or that any change is documented and justified. The standard workflow is identification, preservation, acquisition, analysis, and reporting. Preservation includes isolating the device, documenting its state, and preventing writes. Acquisition creates a copy for analysis while the original remains sealed. Analysis works on copies, and reporting explains what was done and what it means.

Hash values are the backbone of integrity verification. Compute a cryptographic hash such as SHA-256 before and after imaging, record it in the case notes, and verify it again before analysis. A hash proves that the copy matches the source at the time of acquisition; it does not prove that the source was unaltered before you received it. Document who handled the device, when, and under what authority. If a tool changes access times or mounts a file system read-write, that is a deviation you must record.

### Chain of custody

Chain of custody is the documented history of evidence: who collected it, where, when, how, and every transfer thereafter. A custody form records the case number, exhibit number, description, serial number, hash, collector, and each release and receipt with signatures or digital equivalents. Storage should be access-controlled, and evidence should be sealed with tamper-evident bags or encrypted containers.

The chain is not bureaucracy. It answers the question "how do you know this is the same drive you collected?" A break in the chain does not automatically invalidate evidence, but it weakens its weight and may trigger exclusion. For digital cases, keep acquisition logs, tool versions, command lines, and hash records together. If you copy a file out for review, record the copy and its hash too.

### Acquisition and imaging

A physical image copies the entire device, including unallocated space and slack space. A logical image copies selected files or volumes and may miss deleted data. Write blockers prevent the acquisition host from writing to the source device; software blockers exist but hardware is preferred for defensibility. Common formats include raw `dd` images, Expert Witness Format (E01), and AFF4. E01 supports compression and metadata, while raw images are simple and widely supported.

For live systems, follow the order of volatility in RFC 3227: collect the most perishable data first, such as memory, network connections, running processes, and temporary files, then move to disk and archival media. Memory acquisition tools include WinPmem, LiME, and AVML. Record the system time, time zone, and any clock skew before acquisition. If you cannot power off a system without losing critical data, document why and capture volatile state first.

### File systems and data recovery

NTFS uses a master file table (MFT) with one record per file. Each record contains attributes, timestamps, data runs, and flags. The `$LogFile` records metadata transactions, `$UsnJrnl` records change journal entries, and `$Bitmap` tracks allocated clusters. Alternate data streams (ADS) can hide data behind a filename. Deleted MFT records may be reused, but remnants can survive in unallocated space and be recovered with carving or record analysis.

Linux ext4 uses inodes, block groups, and a journal. Timestamps include access, modification, change, and creation where supported. FAT and exFAT have directory entries and no journaling, which makes some recovery easier and some tamper detection harder. APFS uses copy-on-write and snapshots, and encrypted volumes require keys. File carving recovers files by signature from unallocated space, but it cannot reconstruct all metadata. Always distinguish between "a file existed" and "a user opened it"; those are different claims.

### Windows execution artifacts

Windows records program execution in several places. Prefetch files under `C:\Windows\Prefetch` contain the executable name, run count, last run times, and referenced files. ShimCache, stored in the registry, records compatibility information and can indicate presence and, on some versions, execution. Amcache records program inventory and sometimes file hashes. The System Resource Usage Monitor (SRUM) tracks application and network resource usage. UserAssist records GUI program launches with run counts and last-used times.

Each artifact has limits. Prefetch can be disabled, cleaned, or irrelevant on servers. ShimCache does not always prove execution. Amcache can include files that were merely present. Corroborate across sources: a Prefetch entry plus a Security event log process creation plus an Application Compatibility artifact is stronger than any single record. Document the artifact version and the Windows build, because locations and formats change.

### Windows persistence and event logs

Persistence artifacts include Run and RunOnce keys, services, scheduled tasks, WMI event subscriptions, startup folders, and logon scripts. Registry hives such as SYSTEM, SOFTWARE, SAM, SECURITY, NTUSER.DAT, and UsrClass.dat contain configuration and user activity. The Task Scheduler stores task definitions as XML, and services record binary paths and start types. Look for unusual paths, unsigned binaries, and tasks that run at logon or every few minutes.

Event logs are central. Security logon events (4624) and failures (4625) show access patterns; process creation (4688) shows execution when auditing is enabled; service installation (7045) can reveal persistence; PowerShell script block logging (4104) can reveal encoded commands. Sysmon adds process, network, file, and registry telemetry with configurable rules. Logs can be cleared or forwarded, so check for gaps and compare with centralized copies. Absence of an event is not proof that an action did not occur.

### Linux artifacts

Linux evidence lives in logs, shell history, service definitions, and file metadata. Authentication events appear in `/var/log/auth.log` on Debian-based systems or `/var/log/secure` on Red Hat-based systems, and systemd systems centralize logs in the journal. `wtmp`, `btmp`, and `lastlog` record logins and failures. Shell history files such as `.bash_history` reveal commands, but they can be edited, truncated, or disabled.

Persistence often hides in cron jobs, systemd units and timers, `.bashrc` and profile scripts, SSH `authorized_keys`, and init scripts. Check package manager logs for installed tools, auditd logs for executed commands and file access, and `/proc` on a live system for running processes and open files. Compare file timestamps with package installation times; a binary modified after installation is worth examining. Container hosts add another layer, so check Docker or containerd logs and image history.

### Memory forensics

Memory contains running processes, network connections, loaded modules, injected code, encryption keys, and sometimes credentials. It is highly volatile: powering off a machine destroys it. Acquire memory before shutting down when policy and safety allow, and record the acquisition tool and hash. Analysis with Volatility 3 uses symbol tables for the specific kernel version, so matching the image to the right profile matters.

Useful plugin families include process listing and scanning, network connection enumeration, command-line recovery, loaded module inspection, and memory-only file extraction. Compare `pslist` (active process list) with `psscan` (pool scanning) to find hidden or terminated processes. Look for processes with no disk backing, suspicious parent-child relationships, and executable memory regions. Memory analysis is powerful but fragile: results depend on the acquisition, the kernel version, and the tool's parsing, so corroborate with disk artifacts.

### Mobile and cloud evidence

Mobile devices are computers with their own acquisition challenges. Logical extraction copies accessible data such as contacts, messages, and app databases. File system and physical extraction may require specialized tools and legal authority, and modern devices encrypt data with device credentials. Backups can be a useful source when authorized. App data often lives in SQLite databases, plists, and caches. Document the device model, OS version, lock state, and acquisition method.

Cloud evidence comes from audit logs, identity provider logs, storage access logs, and control-plane events. It is often the only record of an action, and retention may be short. Preserve logs by exporting them to controlled storage with hashes and timestamps, and record the query used. Cloud providers have their own legal process for customer data; do not assume you can access another tenant's logs. Chain of custody for cloud evidence includes account identifiers, regions, and API query parameters.

### Network forensics and timeline analysis

Network evidence includes packet captures, flow records, DNS logs, proxy logs, firewall logs, and intrusion detection alerts. A packet capture can prove a connection occurred and reveal payloads when traffic is unencrypted, but encrypted traffic limits visibility to metadata. Flow records are smaller and longer-lived but lack payload. Correlate network indicators with host artifacts: an IP address in a proxy log is more useful when matched to a process and a user on an endpoint.

Timelines are the main analytical product. Normalize timestamps to UTC, record the source time zone and clock offset, and distinguish modified, accessed, changed, and created times. Plaso can parse many artifact types into a super timeline, and Timesketch provides collaborative analysis. Watch for timestomping, where an attacker changes file times, and for time zone confusion that shifts events by hours. A timeline should tell a coherent story with evidence for each link, not just a sorted list of rows.

### Reporting, peer review, and testimony

A forensic report states the scope, authority, methodology, tools and versions, findings, limitations, and conclusions. Separate observations from interpretations: "the Prefetch file shows the executable ran" is an observation; "the user intentionally launched the malware" is an interpretation that may require more evidence. Include hashes, exhibit numbers, and enough detail for another examiner to reproduce the analysis.

Peer review catches errors in parsing, time zones, and logic. Before finalizing, have a colleague attempt to reproduce one key finding from your notes. If the case may go to court, prepare to explain your training, your tools, and the limits of your conclusions in plain language. Expert testimony is not about sounding certain; it is about being credible and transparent about uncertainty.

## Legal and safe practice

Forensic work is authorized work. Get written authority that identifies the devices, accounts, data types, time period, and purpose. In an employment context, policy and consent may provide authority, but policies vary by jurisdiction and by country; confirm with legal counsel. For criminal or civil matters, preserve evidence according to local rules and do not exceed the scope of a warrant or preservation order.

Privacy law matters. Personal devices may contain health, financial, and family data unrelated to the case. Minimize collection, use targeted keyword searches where appropriate, and restrict access to the case team. Encrypt evidence at rest, log access, and define a retention and destruction schedule. If you encounter evidence of a crime outside your scope, stop and escalate rather than expanding the investigation yourself.

Use synthetic data for training. Public images from NIST CFReDS and Digital Corpora are designed for this purpose, and you can generate your own with virtual machines. Do not practice on a friend's laptop, a discarded work device, or a phone you found. The technical skills are easy to learn; the judgment to stop at the boundary is what makes a professional.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations (weeks 1–2) | Evidence and file systems | Read NIST SP 800-86 and RFC 3227; create and delete files on NTFS and ext4, then inspect the metadata | A lab notebook explaining allocation, deletion, and timestamps |
| 2. Acquisition (weeks 3–4) | Imaging and integrity | Image a USB drive or VM disk, verify SHA-256 before and after, and complete a custody form | A verified image, hash log, and signed custody record |
| 3. Windows analysis (weeks 5–7) | Execution and persistence | Analyze a public Windows image with Autopsy and Zimmerman tools; build an execution timeline | A findings table with artifact citations and confidence levels |
| 4. Memory analysis (weeks 8–9) | Volatile evidence | Acquire a memory image from your own VM and analyze it with Volatility 3 | A process and network map with at least three corroborated findings |
| 5. Network and timeline (weeks 10–12) | Correlation | Combine a packet capture with host logs and build a super timeline in Plaso or Timesketch | A correlated incident narrative with a UTC timeline |
| 6. Reporting and mock case (weeks 13–16) | Professional deliverable | Run a full mock case from acquisition to report; have a peer review it | A report, exhibits, limitations, and a peer-review note |

If you only have Windows, use a Linux VM for ext4 practice. If you only have Linux, use a Windows VM. The point is to see how the same event looks different across file systems and operating systems.

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [SANS DFIR webcasts and posters](https://www.sans.org/webcasts/) | SANS | Mixed | Free; registration may be required | No | Practitioner talks and reference posters on artifacts and response |
| [DFIR Science](https://dfir.science/) | DFIR Science | Beginner–intermediate | Free | Partly | Conceptual explanations and tool walkthroughs |
| [13Cubed](https://www.13cubed.com/) | 13Cubed | Intermediate | Free videos | Partly | Windows artifact deep dives and investigation workflows |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Intermediate | Free | Yes, challenge images | Blue team investigations with realistic evidence |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Blue Team Labs | Intermediate | Freemium; some challenges free | Yes | Investigative scenarios with scored objectives |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; some rooms free | Yes | Guided Linux, Windows, and security fundamentals |

Certifications such as GCFA, GCFE, and EnCE are respected in hiring but paid and not required to start. A well-documented mock case and a clear report are often more persuasive to a hiring manager than a certificate without evidence of practice.

## Official documentation and standards

| Source | Owner | Why it matters |
| --- | --- | --- |
| [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final) | NIST | The foundational guide to integrating forensics into incident response |
| [RFC 3227](https://www.rfc-editor.org/rfc/rfc3227) | IETF | Guidelines for evidence collection and order of volatility |
| [NIST CFReDS](https://cfreds.nist.gov/) | NIST | Reference datasets and challenge images for forensic training |
| [SWGDE](https://www.swgde.org/) | Scientific Working Group on Digital Evidence | Best-practice documents for digital evidence handling |
| [ISO/IEC 27037](https://www.iso.org/standard/44381.html) | ISO/IEC | International guidance on identifying, collecting, and preserving evidence |
| [Volatility 3 documentation](https://github.com/volatilityfoundation/volatility3) | Volatility Foundation | Memory analysis architecture, plugins, and symbol tables |
| [The Sleuth Kit](https://www.sleuthkit.org/) | Sleuth Kit project | File system analysis concepts and command-line tools |
| [Sysmon documentation](https://learn.microsoft.com/sysinternals/downloads/sysmon) | Microsoft | Configuring the endpoint telemetry that many investigations rely on |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What you practice | Safety note |
| --- | --- | --- | --- | --- |
| [NIST CFReDS](https://cfreds.nist.gov/) | NIST | Free | Imaging, file system, and artifact analysis on reference data | Use the published scenario and preserve the original download |
| [Digital Corpora](https://digitalcorpora.org/) | Digital Corpora | Free | Disk and memory images across operating systems | Check licenses and use only the provided data |
| [CyberDefenders](https://cyberdefenders.org/) | CyberDefenders | Free | End-to-end blue team investigations | Work from a copy; never upload case data to public tools |
| [Blue Team Labs Online](https://blueteamlabs.online/) | Blue Team Labs | Freemium | Investigative challenges with evidence | Stay within the challenge environment |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium | Guided forensics and incident response rooms | Use the provided VM and avoid real personal data |
| [MemLabs](https://github.com/stuxnet999/MemLabs) | MemLabs | Free | Memory forensics challenges with Volatility | Analyze the provided images only |
| [SIFT Workstation](https://www.sans.org/tools/sift-workstation/) | SANS | Free | A prebuilt Linux analysis environment | Verify the download and run it in an isolated VM |

The quality of a lab matters less than the completeness of your write-up. For every exercise, record the image hash, the tool versions, the commands or GUI steps, the findings, and the limitations. That notebook becomes your portfolio.

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| Autopsy | Graphical forensic platform built on Sleuth Kit | [Autopsy](https://www.autopsy.com/) |
| The Sleuth Kit | Command-line file system and image analysis | [Sleuth Kit](https://www.sleuthkit.org/) |
| Volatility 3 | Memory forensics framework | [Volatility 3](https://github.com/volatilityfoundation/volatility3) |
| Eric Zimmerman tools | Windows artifact parsers for MFT, registry, event logs, and more | [Zimmerman tools](https://ericzimmerman.github.io/) |
| Plaso | Super timeline creation from many artifact types | [Plaso](https://github.com/log2timeline/plaso) |
| Timesketch | Collaborative timeline analysis platform | [Timesketch](https://github.com/google/timesketch) |
| RegRipper | Registry hive extraction and reporting | [RegRipper](https://github.com/keydet89/RegRipper3.0) |
| Wireshark | Packet capture analysis for network evidence | [Wireshark](https://www.wireshark.org/) |

Tools change; method does not. Learn what each tool parses, what it ignores, and how to validate its output against the raw artifact. A GUI that shows a timeline is not evidence until you can trace each row back to a source record.

## Practical projects and exercises

### Project 1: End-to-end Windows case with synthetic evidence

**Objective:** Create and investigate a realistic Windows case from acquisition to report.

**Setup and constraints:** Build a Windows VM, script a sequence of actions (download a file, create a user, schedule a task, delete a file), snapshot it, then image the virtual disk. Use a write blocker or work from a verified copy. Do not use real credentials or personal data. Keep the original image sealed and analyze only the copy.

**Deliverable:** A case folder with the acquisition log, SHA-256 hashes, a signed custody form, an Autopsy case, a Zimmerman-tools artifact dump, a UTC timeline of at least ten events, and a report with findings, limitations, and exhibits. This is portfolio-worthy because it demonstrates the full evidentiary lifecycle, not just tool familiarity.

### Project 2: Memory forensics challenge

**Objective:** Analyze a public memory image and answer a set of investigative questions with evidence.

**Setup and constraints:** Use a MemLabs image or a memory capture from your own VM. Record the image hash and the Volatility 3 version. Work from a copy and keep notes on every plugin and its output. Do not attempt to recover real credentials from third-party systems.

**Deliverable:** A process tree, a network connection table, a list of suspicious memory regions, and a short narrative explaining what the evidence supports and what it cannot prove. For each claim, cite the plugin and the specific output. Include a section on acquisition and symbol-table limitations.

### Project 3: Correlated network and host timeline

**Objective:** Reconstruct a multi-source incident from synthetic network and host evidence.

**Setup and constraints:** Generate a small packet capture and matching Windows or Linux logs in your lab, or use a public challenge with both sources. Normalize all times to UTC and document the time zone of each source. Do not capture traffic from networks you do not own.

**Deliverable:** A super timeline in Plaso or Timesketch, a data-source inventory, an incident narrative with confidence levels, and a limitations section. Explain at least one contradiction between sources and how you resolved it. This exercise shows the correlation skill that distinguishes a forensic analyst from a log collector.

## Common mistakes and misconceptions

- **"A hash proves the evidence is authentic."** A hash proves the copy matches the source at acquisition time. It does not prove who created the file, when, or why.
- **"Deleted files are gone."** Deleted data can persist in unallocated space, slack space, and journal records until it is overwritten. Recovery depends on the file system and subsequent activity.
- **"The timestamp is the truth."** Timestamps can be affected by time zones, clock skew, file system behavior, and deliberate timestomping. Corroborate before drawing conclusions.
- **"Live analysis is always better because it captures more."** Live analysis changes the system. Follow the order of volatility, document every action, and prefer a copy when the system is stable.
- **"Tool output is a finding."** A parsed artifact is data. A finding requires interpretation, corroboration, and an explanation of the limits of the evidence.
- **"Chain of custody is only for court cases."** It is how you prove your work to a client, an auditor, or your future self. Start the habit on every case.
- **"Absence of an artifact means the activity did not happen."** Logging may be disabled, overwritten, or never configured. State what the absence can and cannot support.
- **"I can analyze any device I am given."** Authority matters more than access. Confirm scope, consent, and legal process before touching the evidence.

## Career paths and roles

Digital forensics and incident response (DFIR) analyst: investigates intrusions, contains threats, and produces timelines and reports; incident response consultants do similar work across multiple clients and need breadth across Windows, Linux, cloud, and network evidence. Entry often comes from SOC analysis, system administration, or help desk. Demonstrate a mock case and clear writing.

Forensic examiner: supports litigation, law enforcement, or internal investigations with formal reports and possible testimony, while adjacent eDiscovery and litigation support roles process large document sets, apply preservation rules, and support legal review. The role values procedure, chain of custody, and communication under scrutiny, and a sample report with exhibits is essential.

Threat hunter or detection engineer: uses forensic artifacts to improve detection and hunting. It overlaps with SOC work and malware analysis; see the [malware analysis guide](../malware-analysis/README.md) and the [SOC and blue team guide](../soc-blue-team/README.md).

## Next steps

1. Read the [digital forensics roadmap](../roadmaps/digital-forensics.md) and choose a first case type: Windows endpoint, memory, or network.
2. Image a USB drive or VM disk and verify hashes before doing any analysis.
3. Complete one CFReDS or MemLabs challenge and write a full report with limitations.
4. Build a super timeline from at least two sources and explain one contradiction.
5. Keep every case in the [lab notes template](../templates/lab-notes.md), and cross-train with the [malware analysis guide](../malware-analysis/README.md) and the [cloud security guide](../cloud-security/README.md).

## References

1. NIST SP 800-86, Guide to Integrating Forensic Techniques into Incident Response, <https://csrc.nist.gov/pubs/sp/800/86/final>.
2. IETF RFC 3227, Guidelines for Evidence Collection and Archiving, <https://www.rfc-editor.org/rfc/rfc3227>.
3. NIST Computer Forensic Reference Data Sets, <https://cfreds.nist.gov/>.
4. SWGDE best practices, <https://www.swgde.org/>.
5. ISO/IEC 27037, Guidelines for Identification, Collection, Acquisition, and Preservation of Digital Evidence, <https://www.iso.org/standard/44381.html>.
6. The Sleuth Kit, <https://www.sleuthkit.org/>.
7. Autopsy, <https://www.autopsy.com/>.
8. Volatility 3, <https://github.com/volatilityfoundation/volatility3>.
9. Eric Zimmerman tools, <https://ericzimmerman.github.io/>.
10. SIFT Workstation, <https://www.sans.org/tools/sift-workstation/>.

---

Continue with the [repository home](../README.md), the [foundations track](../foundations/README.md), the [resource library](../resources/README.md), or the [contribution guide](../CONTRIBUTING.md).
