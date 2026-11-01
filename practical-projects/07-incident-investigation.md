# Project 07 — Investigate a Simulated Identity Incident

Most modern intrusions do not begin with a dropped binary. They begin with a valid password, a tired user, and an identity provider that is doing exactly what it was configured to do. In this project you investigate a synthetic account-takeover case: password spraying, MFA fatigue, a new authenticator, a mailbox forwarding rule, and a large mailbox export. You build the timeline from raw JSON events, separate the real victim from a red herring, and write the incident report.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate–Advanced |
| Estimated time | 8–12 hours |
| Cost | $0 |
| Prerequisites | Project 04; comfort with JSON, `jq`, and spreadsheets; basic understanding of SSO and MFA |
| Safety and scope | Entirely synthetic evidence generated in the setup; no real tenant, mailbox, or identity provider is involved |

`Last reviewed: 2026-10-31`

> **Safety and scope.** The evidence packet is fabricated for training, using documentation IP ranges and `.example` domains. Do not replace it with a real tenant export unless you own the tenant and have removed personal data. Nothing in this project requires or authorizes testing a real identity provider. The attack techniques are described only at the level needed to recognize them in logs; do not use them against any account you do not own.

## Objective

- Preserve a synthetic evidence packet with hashes and a documented chain of custody.
- Triage an MFA anomaly alert and decide whether it is a true positive.
- Scope the incident: which accounts were targeted, which were compromised, and which events are unrelated.
- Build a merged, UTC-normalized timeline from two log sources and a user report.
- Reconstruct initial access, persistence, and impact, and map the chain to MITRE ATT&CK.
- Produce containment, eradication, and recovery recommendations, plus detection improvements.

## Why this project matters

Identity is the control plane of most organizations. If an attacker can authenticate as a user, they inherit that user's mail, files, and connected applications without exploiting a single server. Investigations therefore turn on questions that logs can answer: how did the password leak, was MFA actually enforced, what did the session do next, and where did the data go? Analysts who can answer those questions from identity and audit logs are in demand because those logs exist in every cloud-forward organization.

The case also teaches restraint. A failed-login storm against twelve accounts is noise until one account succeeds. A second user with failures from a different country is a distraction unless the evidence connects them. Good investigators state what they know, what they infer, and what they cannot determine from the available data.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Python 3 | Generate evidence, merge timelines, run detections | <https://www.python.org/> | Free |
| jq | Query and summarize JSONL evidence | <https://jqlang.github.io/jq/> | Free, open source |
| sha256sum (coreutils) | Evidence integrity manifest | <https://www.gnu.org/software/coreutils/> | Free, open source |
| LibreOffice Calc | Timeline review and pivot tables | <https://www.libreoffice.org/> | Free, open source |
| MITRE ATT&CK | Map observed behavior to techniques | <https://attack.mitre.org/> | Free |
| Sigma | Portable detection rule format | <https://github.com/SigmaHQ/sigma> | Free, open source |
| NIST SP 800-61 | Incident handling lifecycle reference | <https://csrc.nist.gov/pubs/sp/800/61/r2/final> | Free |

## Setup

1. Create the case directory and save the generator as `make_case.py`. The script writes three evidence files plus a schema README. It is deterministic, so a rebuild produces identical content.

```python
#!/usr/bin/env python3
"""Generate the synthetic Case 07 identity incident packet. Documentation IPs only."""
import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

random.seed(11)
OUT = Path(__file__).resolve().parent / "evidence"
OUT.mkdir(exist_ok=True)
ATTACKER = "198.51.100.23"
VICTIM = "r.okafor@northwind.example"
USERS = [f"{n}@northwind.example" for n in
         ["a.mensah", "b.chen", "c.silva", "d.kumar", "e.novak", "f.haddad",
          "g.osei", "h.tanaka", "i.petrova", "j.moreau", "k.adeyemi", "r.okafor"]]
BASE = datetime(2026, 10, 12, 8, 14, 0, tzinfo=timezone.utc)

def iso(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

def event(dt, etype, actor, result="failure", src_ip=ATTACKER,
          geo="Ashburn, US", ua="python-requests/2.31", **extra):
    row = {"ts": iso(dt), "event_type": etype, "actor": actor, "src_ip": src_ip,
           "geo": geo, "user_agent": ua, "result": result}
    row.update(extra)
    return row

idp = []
for i in range(40):
    idp.append(event(BASE + timedelta(seconds=i * 41), "user.session.start",
                     random.choice(USERS), detail="invalid_credentials"))

for i in range(4):
    idp.append(event(BASE + timedelta(minutes=26, seconds=i * 30), "user.session.start",
                     VICTIM, detail="invalid_credentials"))

for i in range(6):
    idp.append(event(BASE + timedelta(minutes=31, seconds=i * 50), "user.session.start",
                     "j.moreau@northwind.example", src_ip="203.0.113.88",
                     geo="Frankfurt, DE", detail="invalid_credentials"))

t_login = datetime(2026, 10, 12, 9, 2, 11, tzinfo=timezone.utc)
idp.append(event(t_login, "user.session.start", VICTIM, result="success",
                 ua="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0",
                 detail="password accepted; MFA challenged"))

for i in range(14):
    idp.append(event(t_login + timedelta(seconds=55 + i * 58), "user.mfa.attempt",
                     VICTIM, detail="push denied" if i < 4 else "push timeout",
                     ua="Chrome/129.0"))

t_mfa = t_login + timedelta(minutes=19, seconds=20)
idp.append(event(t_mfa, "user.authentication.auth_via_mfa", VICTIM,
                 result="success", detail="push approved", ua="Chrome/129.0"))

t_factor = t_mfa + timedelta(minutes=5)
idp.append(event(t_factor, "user.mfa.factor.activate", VICTIM, result="success",
                 detail="TOTP authenticator enrolled", factor="totp", ua="Chrome/129.0"))
idp.append(event(t_factor + timedelta(minutes=2), "user.mfa.factor.deactivate", VICTIM,
                 result="success", detail="push factor removed", factor="push", ua="Chrome/129.0"))

t_rule = t_factor + timedelta(minutes=6)
mail = [{"ts": iso(t_rule), "event_type": "mailbox.rule.create", "actor": VICTIM,
         "src_ip": ATTACKER, "result": "success", "rule_name": "RSS",
         "forward_to": "archive.drop@example.net",
         "detail": "forward all mail; move to RSS Subscriptions"}]

for minutes, items, size_mb in [(9, 412, 38), (22, 1180, 96), (45, 2400, 210)]:
    mail.append({"ts": iso(t_rule + timedelta(minutes=minutes)),
                 "event_type": "mailbox.export", "actor": VICTIM, "src_ip": ATTACKER,
                 "result": "success", "items": items, "bytes": size_mb * 1024 * 1024,
                 "detail": "archive export"})

ticket = f"""# Helpdesk ticket HD-4471

Opened: {iso(t_rule + timedelta(minutes=66))}
Reporter: r.okafor@northwind.example
Summary: "My phone kept buzzing with sign-in approvals this morning and now my mail
rules look wrong. I did not create a rule called RSS and I did not approve anything
until I tapped the last prompt by mistake."

IT note: user is in Manchester, UK today. No travel recorded. User reports no VPN
session today. Mailbox forwarding to an external address is visible in the tenant
audit log.
"""

(OUT / "idp.jsonl").write_text("\n".join(json.dumps(r) for r in idp) + "\n", encoding="utf-8")
(OUT / "mail.jsonl").write_text("\n".join(json.dumps(r) for r in mail) + "\n", encoding="utf-8")
(OUT / "helpdesk-ticket.md").write_text(ticket, encoding="utf-8")
(OUT / "README.md").write_text(
    "# Case 07 evidence packet\n\n"
    "Synthetic training data. IPs are from RFC 5737 documentation ranges and all\n"
    "domains are under example. Generated by make_case.py.\n\n"
    "## Files\n\n"
    "- idp.jsonl: normalized identity provider events, one JSON object per line\n"
    "- mail.jsonl: normalized mailbox audit events\n"
    "- helpdesk-ticket.md: user report\n\n"
    "## Schema\n\n"
    "idp: ts (UTC ISO 8601), event_type, actor, src_ip, geo, user_agent, result, detail\n"
    "mail: ts, event_type, actor, src_ip, result, rule_name, forward_to, items, bytes, detail\n\n"
    "## Known visibility gaps\n\n"
    "- No VPN or network flow logs\n"
    "- No endpoint telemetry\n"
    "- No identity provider admin audit before 08:14 UTC\n"
    "- No HR or travel system export\n",
    encoding="utf-8")
print(f"idp_events={len(idp)} mail_events={len(mail)}")
```

2. Run the generator and inspect the packet before analyzing it:

```bash
mkdir -p ~/cases/2026-10-12-mfa && cd ~/cases/2026-10-12-mfa
python3 make_case.py
wc -l evidence/idp.jsonl evidence/mail.jsonl
head -n 2 evidence/idp.jsonl
cat evidence/mail.jsonl | jq -c .
```

3. Preserve the originals. Make them read-only, hash them, and work only from copies:

```bash
chmod 444 evidence/idp.jsonl evidence/mail.jsonl evidence/helpdesk-ticket.md
sha256sum evidence/idp.jsonl evidence/mail.jsonl evidence/helpdesk-ticket.md > evidence/manifest.sha256
sha256sum -c evidence/manifest.sha256
mkdir -p working && cp evidence/idp.jsonl evidence/mail.jsonl working/
```

4. Record the case metadata in `case-log.md`: case ID, source of the data, who generated it, when, the hash manifest, and the handling rule. This is a synthetic case, but the habit is the point.

## Step-by-step tasks

1. **Triage the initial alert.** The SOC alert reads: "14 MFA prompts in 19 minutes for `r.okafor@northwind.example`; final prompt approved from `198.51.100.23` (Ashburn, US) while the user's last known location was Manchester, UK." Write a triage note with four fields: what fired, what you confirmed, what you need next, and your initial severity. Checkpoint: you can state whether the alert is a true positive without yet explaining the full chain.

2. **Scope the accounts and addresses.** Count failures by source and by account, list every successful authentication, and identify the unrelated activity.

```bash
jq -r '.src_ip' evidence/idp.jsonl | sort | uniq -c | sort -nr
jq -r 'select(.result=="success") | [.ts, .actor, .event_type, .src_ip] | @tsv' evidence/idp.jsonl
jq -r 'select(.src_ip=="203.0.113.88") | [.ts, .actor, .result, .geo] | @tsv' evidence/idp.jsonl
```

Checkpoint: a table of targeted accounts, one confirmed compromised account, and a written explanation of why `j.moreau`'s failures are not part of this incident. "Different source, no success, different geography, six attempts" is the kind of reasoning to record.

3. **Build the merged timeline.** Use this script to normalize both sources into one CSV with a single timestamp format. Then review the full timeline and mark the events that change the story.

```python
#!/usr/bin/env python3
"""Merge the Case 07 JSONL sources into one UTC timeline."""
import csv
import json
from pathlib import Path

rows = []
for name in ("idp.jsonl", "mail.jsonl"):
    for line in (Path("evidence") / name).read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        e = json.loads(line)
        rows.append({
            "timestamp_utc": e["ts"],
            "source": name.removesuffix(".jsonl"),
            "event_type": e.get("event_type", ""),
            "actor": e.get("actor", ""),
            "src_ip": e.get("src_ip", ""),
            "result": e.get("result", ""),
            "detail": e.get("detail", "") or e.get("rule_name", ""),
        })

rows.sort(key=lambda r: r["timestamp_utc"])
with open("timeline-all.csv", "w", newline="", encoding="utf-8") as fh:
    writer = csv.DictWriter(fh, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
print(f"wrote {len(rows)} events")
```

```bash
python3 merge_timeline.py
head -n 25 timeline-all.csv
```

Checkpoint: 72 events in strict chronological order, every timestamp ending in `Z`, and no duplicate rows. If a row appears twice, check whether the generator was run more than once into the same directory.

4. **Establish initial access.** Examine the spray window, the accounts targeted, and the transition to the victim's successful login. Distinguish what the logs prove from what they only suggest.

```bash
jq -r 'select(.ts < "2026-10-12T09:00:00Z") | [.ts, .actor, .src_ip, .result] | @tsv' evidence/idp.jsonl | tail -n 12
jq -r 'select(.actor=="r.okafor@northwind.example") | [.ts, .event_type, .result, .detail] | @tsv' evidence/idp.jsonl
```

Checkpoint: a paragraph that states the password was valid, the source was the same hosting-range address used in the spray, and the method by which the password was obtained cannot be determined without endpoint or email logs. Do not invent a phishing email because the story feels incomplete.

5. **Analyze the MFA sequence.** Count prompts, timing, and outcomes. Explain why fourteen prompts in nineteen minutes is consistent with push fatigue rather than a broken device.

```bash
jq -r 'select(.event_type|startswith("user.mfa")) | [.ts, .result, .detail] | @tsv' evidence/idp.jsonl
jq -r 'select(.event_type|startswith("user.mfa")) | .result' evidence/idp.jsonl | sort | uniq -c
```

Checkpoint: the sequence of four denials, then timeouts, then one approval, with the exact approval time. Note that the user's later statement corroborates the log; in a real case you would weigh both, not treat the ticket as ground truth.

6. **Identify persistence.** Look for changes to authentication factors and mailbox rules. These are the actions that let an attacker return after a password reset.

```bash
jq -r 'select(.event_type=="user.mfa.factor.activate" or .event_type=="user.mfa.factor.deactivate") | [.ts, .event_type, .detail] | @tsv' evidence/idp.jsonl
jq -r 'select(.event_type=="mailbox.rule.create") | [.ts, .actor, .forward_to, .rule_name, .detail] | @tsv' evidence/mail.jsonl
```

Checkpoint: two persistence mechanisms identified: a new TOTP factor with the original push factor removed, and a forwarding rule to `archive.drop@example.net` that also hides mail in the RSS folder.

7. **Quantify impact.** Sum the exports and list what was taken. Volume alone is not impact; describe the mailbox contents in business terms and note what you cannot see.

```bash
jq -s 'map(select(.event_type=="mailbox.export")) | {exports: length, items: (map(.items) | add), bytes: (map(.bytes) | add)}' evidence/mail.jsonl
jq -r 'select(.event_type=="mailbox.export") | [.ts, .items, (.bytes/1048576|floor|tostring) + " MB"] | @tsv' evidence/mail.jsonl
```

Checkpoint: 3,992 items and 344 MB across three exports, plus an ongoing forwarding rule whose future impact is unknown. State that the content classification cannot be determined from the packet.

8. **Map the chain to ATT&CK.** Use a table with one row per observed step, the technique ID, the evidence, and your confidence. Keep the mapping honest: if the logs do not show a step, do not map it.

| Step | Technique | Evidence | Confidence |
| --- | --- | --- | --- |
| Password spraying | T1110.003 | 44 failures across multiple accounts from one address | High |
| Valid account used | T1078.004 | Successful login for the victim from the attacker address | High |
| MFA fatigue | T1621 | 14 push prompts, four denied, then approval | High |
| MFA factor modification | T1556.006 | New TOTP enrolled, push factor removed | High |
| Email forwarding rule | T1114.003 | Rule forwards all mail to an external address | High |
| Mailbox collection | T1114.002 | Three exports totaling 344 MB | High |
| Initial password acquisition | Unknown | No endpoint or email telemetry | Unknown |

9. **Write the containment, eradication, and recovery plan.** Order matters: preserve evidence, then revoke sessions and tokens, disable the forwarding rule, reset the account and factors, block the source at the identity and network layers, and notify the user and privacy team if personal data was involved. For each action, name the evidence to capture first and the verification step.

10. **Recommend detection improvements.** Write at least three: a push-fatigue rule that counts denials and timeouts, an alert on new MFA factor enrollment from a new geography, and an alert on external mail forwarding rules. Include the false-positive story for each. Then implement one as a runnable check:

```python
#!/usr/bin/env python3
"""Flag actors with five or more MFA failures followed by a success within 30 minutes."""
import json
from collections import defaultdict
from datetime import datetime

def parse(ts):
    return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ")

events = [json.loads(line) for line in open("evidence/idp.jsonl", encoding="utf-8") if line.strip()]
by_actor = defaultdict(list)
for e in events:
    if e["event_type"] in {"user.mfa.attempt", "user.authentication.auth_via_mfa"}:
        by_actor[e["actor"]].append(e)

for actor, rows in by_actor.items():
    rows.sort(key=lambda r: r["ts"])
    failures = [r for r in rows if r["result"] == "failure"]
    successes = [r for r in rows if r["result"] == "success"]
    if len(failures) >= 5 and successes:
        span = parse(successes[-1]["ts"]) - parse(failures[0]["ts"])
        if span.total_seconds() <= 1800:
            print(f"ALERT {actor}: {len(failures)} MFA failures, success at {successes[-1]['ts']}")
```

Checkpoint: running the script prints exactly one alert, for the victim, and the `j.moreau` failures do not trigger it because there is no success.

11. **Draft a portable Sigma rule and label its limits.** The packet uses a normalized schema, so the rule below is a starting point that must be mapped to your identity provider's field names before deployment.

```yaml
title: Repeated MFA Failures Followed by Approval
id: 5b1e7c2a-0000-4000-8000-000000000001
status: experimental
description: Draft for a normalized identity log; map fields before production use.
logsource:
  product: identity_provider
  service: authentication
detection:
  selection:
    event_type:
      - user.mfa.attempt
      - user.authentication.auth_via_mfa
  condition: selection | count() by actor > 5
fields:
  - actor
  - src_ip
  - geo
falsepositives:
  - User with a broken authenticator retrying repeatedly
level: medium
```

12. **Write the incident report and executive brief.** Use the report structure below, keep the timeline in UTC, and separate facts from inferences. The executive brief is 150–200 words and contains no log lines.

```text
1. Incident summary and current status
2. Severity, scope, and affected accounts
3. Timeline of significant events
4. Initial access and attack chain
5. Persistence and impact
6. Detection and response analysis
7. Containment, eradication, and recovery actions
8. Recommendations and owners
9. Indicators of compromise
10. Evidence index and limitations
```

13. **Run the lessons-learned review.** Answer four questions in writing: which control failed, which detection was missing, which response step was slow, and what would have prevented the export. Then convert each answer into an owner and a due date.

## Expected results

- A preserved, hashed evidence packet with originals unchanged and a documented case log.
- A scoping table separating targeted accounts, the compromised account, and the unrelated user.
- A merged timeline of 72 events in UTC, with the significant events annotated.
- A reconstructed chain: spray, valid password, MFA fatigue, factor replacement, forwarding rule, exports.
- A runnable detection that fires once, plus a labeled Sigma draft.
- An incident report and executive brief with facts, inferences, gaps, and prioritized actions.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `evidence/` | JSONL, Markdown | Originals read-only, manifest present, never edited |
| `case-log.md` | Markdown | Case ID, source, hashes, handling rules, analyst, dates |
| `triage-note.md` | Markdown | Alert, confirmation, next steps, initial severity |
| `timeline-all.csv` | CSV | 72 events, UTC, sorted, de-duplicated |
| `timeline-annotated.md` | Markdown | Significant events with interpretation and confidence |
| `detection-mfa-fatigue.py` | Python | Fires once on the packet, no false positive on the red herring |
| `sigma-mfa-fatigue.yml` | YAML | Clearly labeled draft with field-mapping caveat |
| `incident-report.md` | Markdown | Facts, inferences, impact, actions, IOCs, limitations |
| `executive-brief.md` | Markdown | 150–200 words, no jargon, clear status and ask |
| `lab-notes.md` | Markdown | Dated entries from [the lab notes template](../templates/lab-notes.md) |

## Skills gained

- Evidence preservation and integrity verification for log-based cases.
- Identity investigation: spray detection, MFA fatigue recognition, factor tampering, mailbox rules.
- Timeline construction from multiple schemas with UTC normalization.
- Scoping discipline, including documenting and excluding a red herring.
- ATT&CK mapping with explicit confidence and unknowns.
- Incident reporting for both technical and executive readers.

## Stretch improvements

1. Add a VPN log source with a legitimate session from the user's home address at the same time, then revise the impossibility argument.
2. Add a second compromised account using a different MFA method and compare the detection coverage.
3. Build a small dashboard with MFA outcomes over time, failures by source ASN, and new factors per day.
4. Write a tabletop exercise for a colleague: give them only the triage alert and see what they request next.
5. Add a benign factor enrollment by an administrator and measure the false-positive rate of your new-factor rule.
6. Convert the timeline into a graph of account, source, and action, and explain what the graph reveals that the table does not.

## Troubleshooting

### `jq` fails with a parse error on one file

The glob may be picking up `README.md` or `manifest.sha256`, which are not JSON. Pass the exact JSONL file names, or use `find evidence -name '*.jsonl'`. Check the failing line with `jq -c . file | head` to locate the malformed record.

### Timeline rows are out of order or the sort looks wrong

ISO 8601 strings with a `Z` suffix sort correctly lexicographically only if every timestamp uses the same format and offset. If you add events with `+01:00`, normalize to UTC first. In Python, parse with `datetime.fromisoformat(ts.replace("Z", "+00:00"))` and sort the datetime objects, then format back to UTC.

### The hash manifest no longer verifies

Something modified the originals, possibly an editor that rewrote line endings or a script that appended output. Restore from a fresh generator run, chmod the files read-only again, and regenerate the manifest. Never "fix" the manifest to match edited evidence; that defeats its purpose.

### The MFA detection fires on a legitimate user with a broken phone

That is a real false positive: repeated failures can come from a device problem, not an attacker. Tune with context: a success from a new geography or a new user agent, a factor enrollment immediately afterward, or a mailbox rule within the same session. Document the tuning and keep a test case for the benign scenario.

### The report implies facts the packet cannot support

Read every sentence that starts with "the attacker" and ask which log line proves it. If the answer is none, rewrite it as an inference with a confidence level, or move it to the unknowns section. Missing endpoint and email telemetry is a finding about visibility, not a gap you should fill with imagination.

## Portfolio presentation

Publish the incident report, the annotated timeline, and the detection script, with the synthetic nature of the packet stated in the first paragraph. This project demonstrates the full investigative loop and is especially strong for SOC and identity roles. Remove the fictional user's name and email if you prefer, replacing them with `user-a@example.com`; keep the relative timing and the log structure. Do not publish a real tenant export, real forwarding addresses, or screenshots of a live identity provider. The detection script and Sigma draft are safe to publish because they operate on synthetic data and contain no live indicators.

## References

1. NIST SP 800-61, Computer Security Incident Handling Guide — <https://csrc.nist.gov/pubs/sp/800/61/r2/final>
2. MITRE ATT&CK, initial access, MFA, and email collection techniques — <https://attack.mitre.org/>
3. SigmaHQ detection rule repository — <https://github.com/SigmaHQ/sigma>
4. Microsoft identity and sign-in log documentation — <https://learn.microsoft.com/en-us/entra/identity/monitoring-health/>
5. RFC 5737, IPv4 address blocks for documentation — <https://www.rfc-editor.org/rfc/rfc5737>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
