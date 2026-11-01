# Project 08 — Build a Forensic Timeline from a Training Image

Forensics is the discipline of answering "what happened on this system" from artifacts that were never designed to tell a story. In this project you acquire a public training image, verify its integrity, ingest it with Autopsy and the Sleuth Kit, build a super-timeline with plaso, pivot into execution and user-activity artifacts, and write a report that separates what the evidence proves from what you infer. You will spend more time filtering and correlating than clicking.

| Field | Value |
| --- | --- |
| Difficulty | Advanced |
| Estimated time | 10–16 hours |
| Cost | $0 |
| Prerequisites | Project 01; 16 GB RAM recommended; a second disk with 2–3 times the image size free; comfort with a Linux shell or Windows analysis VM |
| Safety and scope | Public training images or a synthetic disk you create; never analyze an image of unknown origin or a real person's device without authorization |

`Last reviewed: 2026-10-31`

> **Safety and scope.** Use images from established training sources — CyberDefenders, Blue Team Labs Online, Digital Corpora, or NIST CFReDS — and follow their terms. Do not download random disk images from file-sharing sites, do not analyze a device that belongs to someone else without written authorization, and do not publish another platform's challenge answers while the challenge is active. Treat every image as containing personal data even when it is synthetic.

## Objective

- Acquire a training image lawfully, verify its hash, and document chain of custody.
- Triage the image with `mmls`, `fsstat`, `fls`, and `mactime`, then ingest it into Autopsy.
- Build a filtered super-timeline with plaso and reduce it to the window that matters.
- Answer six investigative questions using execution, USB, browser, registry, and event-log artifacts.
- Check for common anti-forensics and state what the absence of evidence means.
- Write a forensic report with findings, confidence, and limitations.

## Why this project matters

Incident responders are asked for a timeline under time pressure, often while the business is losing money. The difference between a useful answer and a guess is artifact knowledge: knowing that Prefetch shows execution, that AmCache survives some cleanup, that USB history lives in the registry and `setupapi.dev.log`, and that a cleared event log is itself an event. Tools generate timelines; analysts decide which rows matter.

Courts, regulators, and HR also care about process. Hash verification, read-only handling, and a documented chain of custody are what make a finding defensible. This project builds those habits before you are responsible for a real case.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Autopsy | GUI forensic browser and ingest framework | <https://www.autopsy.com/> | Free, open source |
| The Sleuth Kit | CLI filesystem and timeline analysis | <https://www.sleuthkit.org/> | Free, open source |
| plaso / log2timeline | Super-timeline generation | <https://github.com/log2timeline/plaso> | Free, open source |
| Volatility 3 | Memory analysis when a memory image is provided | <https://github.com/volatilityfoundation/volatility3> | Free, open source |
| Eric Zimmerman tools | Windows artifact parsers (MFT, EVTX, Prefetch, AmCache) | <https://ericzimmerman.github.io/> | Free |
| CyberDefenders | Public blue-team challenges with images | <https://cyberdefenders.org/> | Free account; some labs restricted to registered users |
| Blue Team Labs Online | Public defensive challenges | <https://blueteamlabs.online/> | Free tier plus paid content |
| Digital Corpora | Public disk and file corpora for research | <https://digitalcorpora.org/> | Free |
| NIST CFReDS | Reference forensic datasets | <https://cfreds.nist.gov/> | Free |

## Setup

### Choose an image and a platform

Pick a challenge or corpus image that includes a disk image, and ideally a memory image. CyberDefenders challenges usually provide questions that keep you oriented; Digital Corpora and CFReDS provide raw datasets without a guided question set. Either is fine, but record which you chose and why.

Choose one analysis platform:

- **Windows with Autopsy** for the GUI workflow plus Zimmerman tools for registry and event-log parsing.
- **Linux with Sleuth Kit and plaso** for a fully scriptable workflow, plus Autopsy if you want the GUI.

Both paths use the same evidence. Do not install analysis tools on the suspect image; work from a separate analysis VM with a read-only copy.

### Prepare the evidence

```bash
mkdir -p ~/cases/forensics-01/{evidence,work,reports,tools}
cd ~/cases/forensics-01
# Place the downloaded image in evidence/ and record where it came from.
sha256sum evidence/*.E01 | tee evidence/download.sha256
ewfverify evidence/*.E01 | tee evidence/ewfverify.txt
```

Compare the computed hash with the hash published by the source. If the source does not publish one, record your own at intake and state that provenance is limited. Then create the evidence log:

```text
Case:            FOR-01 training image analysis
Source:          <platform, challenge name, URL, access date>
Image files:     <filenames and sizes>
Hash:            <sha256 from intake>
Acquired by:     <your name>, download from the platform
Handling:        Read-only analysis copy; originals stored in evidence/
Timezone:        <image timezone assumption and evidence for it>
Tools:           <versions of Autopsy, TSK, plaso, Volatility>
Questions:       <the six questions you intend to answer>
```

### Fallback: build a synthetic disk

If you cannot access a training image, create a small ext4 image with known files, delete a few, and analyze that. It is less realistic but fully reproducible and safe.

```bash
dd if=/dev/zero of=lab-disk.img bs=1M count=256
mkfs.ext4 -L LABDISK lab-disk.img
mkdir -p mnt
sudo mount -o loop lab-disk.img mnt
printf 'synthetic evidence A\n' | sudo tee mnt/notes-a.txt
printf 'synthetic evidence B\n' | sudo tee mnt/notes-b.txt
sudo mkdir -p mnt/archive && printf 'to be deleted\n' | sudo tee mnt/archive/old.txt
sudo rm mnt/archive/old.txt
sudo umount mnt
sha256sum lab-disk.img > lab-disk.sha256
```

Document that this is synthetic and state how it differs from a real Windows image: no registry, no event logs, no Prefetch. Those gaps are part of the limitation section.

## Step-by-step tasks

1. **Verify integrity and record the evidence.** Confirm the hash, file sizes, and image format. For E01, `ewfverify` reads the entire image and validates the internal checksum; it can take a while. Checkpoint: the hash matches the source and the verification output is saved.

2. **Map the partitions and filesystem.** Use the Sleuth Kit before opening a GUI; the CLI output tells you what the GUI is doing.

```bash
img_stat evidence/*.E01
mmls evidence/*.E01 | tee work/mmls.txt
```

Identify the partition that holds the operating system and note its sector offset. Set it once and reuse it:

```bash
OFFSET=<sector-offset-from-mmls>
fsstat -o "$OFFSET" evidence/*.E01 | tee work/fsstat.txt
```

Checkpoint: you can state the partition scheme, filesystem type, cluster size, and the offset you will use for every subsequent command.

3. **Triage files and build a filesystem timeline.** List every file with metadata, then convert the bodyfile into a sortable timeline.

```bash
fls -r -m "/" -o "$OFFSET" evidence/*.E01 > work/bodyfile.txt
wc -l work/bodyfile.txt
mactime -b work/bodyfile.txt -d -z UTC > work/fs-timeline.csv
head -n 5 work/fs-timeline.csv
```

Checkpoint: a timeline with tens of thousands of rows is normal. Find the five largest files and the ten most recently modified files, and note whether any look staged for exfiltration.

4. **Ingest into Autopsy and run the useful modules.** Create a case, add the image as a data source, and enable Recent Activity, File Type Identification, Extension Mismatch, Hash Lookup, Keyword Search, and the timeline module. Skip modules that add noise without answering your questions. Checkpoint: the ingest completes without errors, and you can browse the file tree and the timeline view.

5. **Build the super-timeline with plaso.** Plaso combines filesystem metadata with parsed artifacts, which is what makes correlation possible.

```bash
log2timeline.py --storage-file work/case.plaso evidence/*.E01
psort.py -o l2tcsv -w work/super-timeline.csv work/case.plaso
wc -l work/super-timeline.csv
```

Processing a large image can take hours and significant RAM. Start it, work on the Autopsy triage in parallel, and do not kill it just because the progress bar is slow. Checkpoint: the CSV has a `date` column in UTC and a `source` column that distinguishes file system, registry, event log, and browser entries.

6. **Define the incident window and filter.** A super-timeline is useless until it is scoped. Start from the question the challenge asks, or from the most suspicious artifact you found, then filter to a window around it.

```bash
psort.py -o l2tcsv -w work/window.csv work/case.plaso \
  "date > '2026-01-01 00:00:00' and date < '2026-01-03 00:00:00'"
```

Replace the dates with your actual window. Checkpoint: the window is small enough to read (hundreds to a few thousand rows), and you can explain why you chose its boundaries.

7. **Answer the six questions.** Work through them in order, recording the artifact, the value, the source file, and your confidence for each.

| Question | Primary artifacts | What it can prove |
| --- | --- | --- |
| Who used the system? | SAM users, logon events, profile folders, `NTUSER.DAT` last write | Accounts present and interactive logons |
| What executed? | Prefetch, AmCache, ShimCache, SRUM, event logs | Program execution with varying confidence |
| What did the user touch? | LNK files, JumpLists, recent docs, browser history | Files opened and locations visited |
| What external devices connected? | `USBSTOR`, `setupapi.dev.log`, mount points | Device connection and volume serial |
| What data left? | Browser uploads, cloud sync logs, USB writes, SRUM bytes | Possible exfiltration paths |
| Was evidence destroyed? | Event 1102/104, USN journal gaps, timestamp anomalies | Anti-forensic activity, or its absence |

Checkpoint: each question has at least one cited artifact and an explicit confidence level. "Prefetch shows `7zFM.exe` executed at 14:22 UTC" is evidence; "the user compressed files" is an inference.

8. **Parse Windows artifacts with the right tool.** If you are on Windows, use the Zimmerman tools rather than hunting through the registry by hand.

```powershell
EvtxECmd.exe -d C:\cases\forensics-01\evidence\Windows\System32\winevt\Logs --csv C:\cases\forensics-01\work\evtx
MFTECmd.exe -f C:\cases\forensics-01\evidence\$MFT --csv C:\cases\forensics-01\work --csvf mft.csv
PECmd.exe -d C:\cases\forensics-01\evidence\Windows\Prefetch --csv C:\cases\forensics-01\work\prefetch
```

On Linux, mount the image read-only with `ewfmount` or use `icat` to extract individual files, then parse them on the analysis host. Checkpoint: you have parsed at least three artifact families beyond the filesystem timeline.

9. **Check for anti-forensics.** Look for log clearing, timestamp manipulation, deleted USN records, disabled Prefetch, and gaps in event coverage. A clean result is also a finding: it tells you the image does not show those behaviors.

```bash
# Look for cleared-log events in the parsed EVTX CSV
grep -iE '1102|audit log was cleared' work/evtx/*.csv | head
# Compare $STANDARD_INFORMATION and $FILE_NAME timestamps in the MFT output
head -n 2 work/mft.csv
```

For timestamp comparison, look for files whose `$SI` modification time is much earlier than `$FN` creation time, or whose timestamps predate the operating system install. Explain why a mismatch is suspicious but not proof on its own.

10. **Analyze memory if the dataset includes it.** Volatility 3 needs the symbol tables for the specific Windows build; the first run may download them.

```bash
python3 vol.py -f evidence/memory.raw windows.info
python3 vol.py -f evidence/memory.raw windows.pstree | head -n 40
python3 vol.py -f evidence/memory.raw windows.cmdline
python3 vol.py -f memory.raw windows.netscan
```

Checkpoint: at least one memory finding that corroborates or contradicts the disk timeline. If the process list shows a binary running from a user directory at the same time Prefetch shows execution, that is corroboration worth stating.

11. **Write the narrative and the timeline table.** Keep the full timeline as an appendix and put twenty to forty significant rows in the report. Every row needs a timestamp in UTC, a source, an event, and a significance note. Do not include rows just because they exist.

12. **Write the forensic report.** Include case background, evidence and integrity, methodology and tools, findings with confidence, timeline, artifact table, anti-forensics assessment, IOCs if applicable, limitations, and appendix. Checkpoint: a reader who has never seen the image can follow the story and tell which claims are certain, probable, or unknown.

## Expected results

- A verified image with a documented source, hash, and handling record.
- Partition and filesystem facts from TSK, plus a filesystem timeline.
- An Autopsy case with successful ingest and a browsable file tree.
- A filtered plaso super-timeline for a justified incident window.
- Answers to the six investigative questions with cited artifacts and confidence levels.
- A forensic report with a significant-event timeline, anti-forensics assessment, and limitations.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `evidence-log.md` | Markdown | Source, hashes, handling, tool versions, timezone, questions |
| `work/mmls.txt`, `work/fsstat.txt` | Text | Raw outputs preserved, offset documented |
| `work/bodyfile.txt` | Bodyfile | Reproducible from the documented command |
| `work/super-timeline.csv` | CSV | UTC, sorted, with source labels |
| `work/window.csv` | CSV | Justified incident window, not the whole image |
| `artifact-table.csv` | CSV | Artifact, value, source file, question answered, confidence |
| `timeline-significant.md` | Markdown | 20–40 rows with significance and source |
| `forensic-report.md` | Markdown | Findings, confidence, anti-forensics, IOCs, limitations |
| `lab-notes.md` | Markdown | Dated entries from [the lab notes template](../templates/lab-notes.md) |

## Skills gained

- Evidence intake, hash verification, and chain-of-custody documentation.
- Partition and filesystem analysis with Sleuth Kit.
- Super-timeline generation and scoped filtering with plaso.
- Windows artifact interpretation: execution, USB, browser, registry, event logs.
- Memory analysis fundamentals with Volatility 3.
- Anti-forensics detection and confidence-based reporting.

## Stretch improvements

1. Analyze a second image from a different platform and compare artifact availability and timestamps.
2. Build a focused timeline for one user by correlating profile paths, logon events, and LNK targets.
3. Write a Python script that merges the plaso window with your own notes into a single annotated CSV.
4. Add file carving with `photorec` or `scalpel` on unallocated space and assess whether the recovered files change your conclusions.
5. Use `ewfmount` and a read-only mount to browse the image, then compare what you see with the TSK output.
6. Present the case as a ten-minute briefing with one slide per question and a clear confidence statement.

## Troubleshooting

### The E01 image will not open or verify

Install `ewf-tools` (`libewf`) and confirm with `ewfverify`. If the tool reports a checksum error, re-download the image; do not attempt to "repair" evidence. If the file is a split E01 set, keep all segments in the same directory with their original names.

### `mmls` shows no partitions or the offset is wrong

The image may be a raw filesystem rather than a partitioned disk. Run `fsstat` without an offset, or `file` on the image to identify the format. If the image is partitioned, copy the exact start sector from `mmls` and use `-o` consistently; mixing offsets produces misleading file listings.

### plaso processing is extremely slow or runs out of memory

Large images produce millions of events. Give the analysis VM more RAM, exclude irrelevant paths if the tool supports filtering, and process in stages. Do not run plaso and Autopsy ingest at the same time on a memory-constrained host. If it fails, the `.plaso` storage file can often be resumed or queried without reprocessing.

### Autopsy ingest fails with a Java heap error

Increase the JVM heap in Autopsy's `etc/autopsy.conf` and restart. Close other applications, and check that the case directory is on a disk with free space. On Windows, run Autopsy as a user who can write to the case directory rather than as administrator unless the image path requires it.

### Volatility reports missing symbols

Volatility 3 needs an Intermediate Symbol File for the exact kernel build. The first run downloads symbols if a network is available; offline analysis needs the symbol pack placed in the symbols path. Confirm the Windows build from `windows.info` and match it precisely, because a nearby build will not work.

## Portfolio presentation

Publish the report and the significant-event timeline, not the full super-timeline or the image itself. State the source of the training image and its license, and do not republish the image. If you used a CyberDefenders or BTLO challenge, check the platform's write-up policy and avoid spoiling active questions. Replace usernames, hostnames, and any personal data with `user-a`, `host-a`, and documentation addresses. The strongest portfolio version includes one finding you initially got wrong and how the evidence corrected you; that demonstrates method better than a perfect narrative.

## References

1. The Sleuth Kit documentation — <https://www.sleuthkit.org/sleuthkit/docs/>
2. Autopsy documentation and user guides — <https://www.autopsy.com/support/>
3. plaso / log2timeline documentation — <https://plaso.readthedocs.io/>
4. Volatility 3 documentation — <https://volatility3.readthedocs.io/>
5. Eric Zimmerman tools documentation — <https://ericzimmerman.github.io/>
6. NIST CFReDS reference datasets — <https://cfreds.nist.gov/>
7. Digital Corpora — <https://digitalcorpora.org/>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
