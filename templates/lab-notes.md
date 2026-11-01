# Lab Notes Template

[Home](../README.md) / [Templates](README.md) / Lab notes

A lab notebook turns activity into knowledge. Use this template for a single exercise, a home-lab build, or a research question. The test of a good note is simple: can another learner reproduce the result from it without asking you what you meant?

**Lab ID:** `[LAB-YYYY-NNN]`
**Date:** `[YYYY-MM-DD]`
**Author:** `[Name or handle]`
**Related drill:** `[LX-05 / NET-10 / WEB-06 / BT-08 / other]`

## 1. Metadata

| Field | Value |
| --- | --- |
| Title | `[Short descriptive title]` |
| Objective | `[One sentence: what you want to learn or prove]` |
| Difficulty | `[Beginner / intermediate / advanced]` |
| Time spent | `[Total and breakdown]` |
| Lab environment | `[Hypervisor, VM image, container image]` |
| Network | `[Host-only / NAT / namespace; subnet]` |
| Tools and versions | `[Tool, version]` |
| Safety classification | `[No changes / reversible changes / destructive in lab only]` |
| Snapshot name | `[Before-state snapshot]` |

## 2. Objective and hypothesis

**Question.** `[What are you trying to answer?]`

**Hypothesis.** `[A prediction that could be wrong]`

**Why this matters.** `[The defensive or educational value]`

**Success criteria.** `[What observation would support or refute the hypothesis]`

**Out of scope.** `[What you will not test, and why]`

## 3. Environment baseline

Record the state before changing anything.

```bash
date -u
hostnamectl
uname -a
id
ip -brief address
ip route
```

**Baseline notes.** `[Kernel, distribution, user, network, relevant service versions]`

**Snapshot created.** `[Name and time]`
**Rollback tested.** `[Yes/No; how]`

## 4. Setup and safety

- [ ] The environment is owned by me or covered by written authorization. — Owner: ___; Evidence: ___
- [ ] The network is isolated from production and public targets. — Owner: ___; Evidence: ___
- [ ] A snapshot or rebuild path exists. — Owner: ___; Evidence: ___
- [ ] Destructive commands are marked and reviewed before execution. — Owner: ___; Evidence: ___
- [ ] Evidence will be stored outside the target VM. — Owner: ___; Evidence: ___
- [ ] Stop conditions are written down. — Owner: ___; Evidence: ___

**Setup commands.** Record the exact commands and versions.

```bash
# Record the exact setup, including package versions and configuration changes.
# Avoid copying commands you have not read.
```

**Configuration diff.** `[Path to diff or description of changes]`

## 5. Commands and observations

Keep a chronological log. Record failures as well as successes; a failed command often explains the final result.

| # | Time (UTC) | Command or action | Expected | Observed | Exit code | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `[HH:MM]` | `[command]` | `[prediction]` | `[actual]` | `[0/1]` | `[interpretation]` |
| 2 | `[HH:MM]` | `[command]` | `[prediction]` | `[actual]` | `[0/1]` | `[interpretation]` |

**Full transcript.** Save the terminal transcript to a file and reference it here. Do not paste secrets.

```bash
script -q -a ~/lab-notes/transcript.txt
# Run the exercise, then type exit.
```

## 6. Evidence

| Evidence | Type | Path or reference | SHA-256 | Collected at (UTC) |
| --- | --- | --- | --- | --- |
| `[HTTP transcript]` | `[Text]` | `[Path]` | `[Hash]` | `[Time]` |
| `[Screenshot]` | `[Image]` | `[Path]` | `[Hash]` | `[Time]` |
| `[Log extract]` | `[Text]` | `[Path]` | `[Hash]` | `[Time]` |

**What the evidence proves.** `[Two or three sentences]`

**What the evidence does not prove.** `[Limits, missing data, alternative explanations]`

**Redactions applied.** `[What was removed and why]`

```bash
sha256sum ~/lab-notes/evidence/* | tee ~/lab-notes/evidence/manifest.sha256
```

## 7. Analysis and result

**Result.** `[Supported / refuted / inconclusive]`

**Reasoning.** `[Connect the observation to the hypothesis. Cite the evidence rows.]`

**Alternative explanations.** `[What else could produce the same observation?]`

**Confidence.** `[High / medium / low, with reason]`

**What surprised me.** `[Unexpected behavior or a wrong assumption]`

## 8. Deviations and troubleshooting

| Deviation | Cause | Fix | Effect on result |
| --- | --- | --- | --- |
| `[Different output than expected]` | `[Cause]` | `[Fix]` | `[None / changed conclusion]` |

**Unresolved questions.** `[What you could not determine]`

**Next experiment.** `[A small, concrete follow-up]`

## 9. Cleanup verification

- [ ] Temporary users, keys, and tokens created for the lab are removed or revoked. — Owner: ___; Evidence: ___
- [ ] Test services are stopped and ports are closed. — Owner: ___; Evidence: ___
- [ ] Lab networks and namespaces are deleted. — Owner: ___; Evidence: ___
- [ ] Containers, volumes, and custom networks are removed. — Owner: ___; Evidence: ___
- [ ] Snapshot is restored or the VM is rebuilt. — Owner: ___; Evidence: ___
- [ ] Evidence is exported and hashed before deletion. — Owner: ___; Evidence: ___
- [ ] Host firewall and port-forwarding changes are reverted. — Owner: ___; Evidence: ___

**Cleanup commands.** Review each path before deleting anything.

```bash
# Review each path before deleting. Use rm only on paths you created.
realpath ~/lab-scratch
# rm -rf ~/lab-scratch
```

## 10. Reproducibility checklist

- [ ] A reader can identify the exact OS, tool versions, and network layout. — Owner: ___; Evidence: ___
- [ ] Setup steps are complete and ordered. — Owner: ___; Evidence: ___
- [ ] Commands include required privileges and working directories. — Owner: ___; Evidence: ___
- [ ] Expected and observed outputs are both recorded. — Owner: ___; Evidence: ___
- [ ] Evidence files are named, hashed, and available. — Owner: ___; Evidence: ___
- [ ] Limitations and failed attempts are included. — Owner: ___; Evidence: ___

## 11. References

- `[Official documentation used]`
- `[Standards or framework guidance]`
- `[Related drill or internal note]`

## 12. Reflection

Answer in three to five sentences:

- What can I now do that I could not do before?
- What would I do differently next time?
- What is the defensive lesson?
- What is the next smallest experiment?

---

**Related:** [Template index](README.md) · [Exercise index](../exercises/README.md) · [Home lab checklist](../checklists/home-lab.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
