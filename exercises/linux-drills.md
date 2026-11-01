# Linux Drills: CLI, Permissions, Processes, Logs, and Hardening

[Home](../README.md) / [Exercises](README.md) / Linux drills

These 24 drills build the Linux fluency that every later security task depends on. You will inspect a host instead of guessing about it, prove how permissions actually behave, read processes and logs with intent, and review the hardening settings that defenders and attackers both care about.

**Environment.** A disposable Debian 12 or Ubuntu 24.04 VM that you own, with a non-root user that has sudo. Commands that need root are marked with `sudo`. If a command is unavailable, install the package in the VM or note the gap in your evidence; do not skip the reasoning.

**Safety.** Nothing here targets another host. A few drills create processes, files, and temporary audit rules inside the VM. Marked destructive commands remove only your own scratch paths. Snapshot the VM before starting, and never run the cleanup commands against a path you did not create.

## Evidence setup

Create the folders and a baseline host record once. Reuse them across the set.

```bash
mkdir -p ~/cyberlab-evidence/linux ~/lab-data
chmod 700 ~/cyberlab-evidence
hostnamectl > ~/cyberlab-evidence/linux/host-baseline.txt
```

Name artifacts `YYYY-MM-DD_lx-NN_short-slug.ext`, and keep a short reflection note beside each artifact.

## LX-01 — Inventory the host before changing anything

**Goal.** Establish a factual baseline of the operating system, kernel, identity, time source, and privilege you hold.

**Prerequisites.** A lab VM and a normal login. No sudo required.

**Steps.** Run these in order and record the output.

1. Capture the distribution and kernel.

   ```bash
   cat /etc/os-release
   uname -a
   hostnamectl
   ```

2. Capture your identity and group memberships.

   ```bash
   id
   getent passwd "$USER"
   groups
   ```

3. Record time synchronization and uptime. Accurate time is a prerequisite for log correlation.

   ```bash
   timedatectl
   uptime
   ```

4. List what sudo allows without prompting for a password.

   ```bash
   sudo -n -l
   ```

**Expected observation.** You should see a named distribution and kernel version, your numeric UID and GID, supplementary groups, and a time zone with synchronization status. If `sudo -n -l` prints a policy, read it carefully: `NOPASSWD` entries are a real privilege boundary, not a convenience.

**Prove it.** Save all output to `host-baseline.txt` and add the VM image name and snapshot label to `~/cyberlab-evidence/notes/environment.md`.

**Reflect.** Which fact in this output would change your next step if it were different on a production host? Why is an unsynchronized clock a security problem, not just an inconvenience?

## LX-02 — Navigate the filesystem with intent

**Goal.** Locate configuration and data files deliberately, using metadata rather than guesswork.

**Prerequisites.** LX-01. Basic comfort with `cd`, `ls`, and `find`.

**Steps.** Run these in order and record the output.

1. Inspect top-level layout and mounted filesystems.

   ```bash
   ls -la /
   df -hT
   findmnt --real
   ```

2. Compare file types and metadata for three important files.

   ```bash
   stat /etc/passwd /etc/shadow /etc/ssh/sshd_config
   ```

3. Find configuration files under `/etc` without crossing into other filesystems.

   ```bash
   sudo find /etc -xdev -maxdepth 3 -type f -name '*.conf' 2>/dev/null | head -n 20
   ```

4. Locate files modified in the last day, limiting the search to `/etc`.

   ```bash
   sudo find /etc -xdev -type f -mtime -1 -printf '%TY-%Tm-%Td %TH:%TM %p\n' 2>/dev/null
   ```

**Expected observation.** `/etc/shadow` should be mode `640` or `600`, owned by `root:shadow` or `root:root`; `/etc/passwd` should be world-readable; `sshd_config` should be readable only by root. `-xdev` prevents `find` from wandering into mounted filesystems, which keeps results relevant and fast.

**Prove it.** Save the `stat` output and the recent-change list. Annotate each result with what the permission means.

**Reflect.** Why does `find /` sometimes produce noisy, misleading results? When would `-xdev` hide something you actually need to see?

## LX-03 — Prove how modes and umask interact

**Goal.** Predict the permissions a new file and directory will receive, then verify the prediction.

**Prerequisites.** LX-01. A scratch directory you create.

**Steps.** Run these in order and record the output.

1. Create an isolated scratch area and check the current mask.

   ```bash
   mkdir -p ~/lab-scratch/lx03 && cd ~/lab-scratch/lx03
   umask
   ```

2. Create a file and a directory, then read their modes numerically.

   ```bash
   touch default-file
   mkdir default-dir
   stat -c '%a %A %U:%G %n' default-file default-dir
   ```

3. Apply an explicit mode and verify it.

   ```bash
   chmod 640 default-file
   chmod 750 default-dir
   stat -c '%a %A %U:%G %n' default-file default-dir
   ```

4. Test a stricter mask in a subshell so your login shell is unaffected.

   ```bash
   (umask 077; touch private-file; mkdir private-dir; stat -c '%a %n' private-file private-dir)
   ```

**Expected observation.** With a typical `022` mask, a new file is `644` and a new directory is `755`. The subshell with `077` produces `600` and `700`. Modes are octal: read `4`, write `2`, execute `1`, summed per owner, group, and other.

**Prove it.** Save the before-and-after `stat` output and a one-line rule for how umask changes a requested mode.

**Reflect.** Why is `777` almost never the right answer for a shared directory? What does the execute bit mean on a directory, and why is that different from a file?

## LX-04 — Test access as a different user

**Goal.** Verify that permissions restrict an unprivileged account, rather than assuming they do.

**Prerequisites.** LX-03. Root access through sudo.

**Steps.** Run these in order and record the output.

1. Build a controlled test directory with a readable file and a private file.

   ```bash
   mkdir -p /tmp/perm-lab && chmod 755 /tmp/perm-lab
   echo "public marker" > /tmp/perm-lab/public.txt
   echo "private marker" > /tmp/perm-lab/private.txt
   chmod 644 /tmp/perm-lab/public.txt
   chmod 600 /tmp/perm-lab/private.txt
   ls -l /tmp/perm-lab
   ```

2. Read each file as the unprivileged `nobody` account.

   ```bash
   sudo runuser -u nobody -- cat /tmp/perm-lab/public.txt
   sudo runuser -u nobody -- cat /tmp/perm-lab/private.txt
   ```

3. Remove the directory execute bit and retry the public file.

   ```bash
   chmod 644 /tmp/perm-lab
   sudo runuser -u nobody -- cat /tmp/perm-lab/public.txt
   chmod 755 /tmp/perm-lab
   ```

**Expected observation.** The public file is readable by `nobody`; the private file returns `Permission denied`. After removing directory execute permission, even the public file becomes inaccessible because the path cannot be traversed. Root may bypass these checks, which is why testing as `nobody` matters.

**Prove it.** Save a transcript showing both outcomes, with the exact error text. Explain the directory-permission result in your reflection.

**Reflect.** Why does `chmod 000` on a file not always stop root? What is the difference between reading a file and traversing a directory?

## LX-05 — Audit SUID, SGID, and sticky bits

**Goal.** Find binaries that elevate privilege and distinguish legitimate system use from unnecessary exposure.

**Prerequisites.** LX-01. Sudo for a full filesystem scan.

**Steps.** Run these in order and record the output.

1. Find SUID and SGID binaries on the root filesystem.

   ```bash
   sudo find / -xdev -type f \( -perm -4000 -o -perm -2000 \) -printf '%M %u:%g %p\n' 2>/dev/null | sort
   ```

2. Find world-writable directories with the sticky bit set, and those without it.

   ```bash
   sudo find / -xdev -type d -perm -0002 -printf '%M %u:%g %p\n' 2>/dev/null | sort
   ```

3. Inspect one expected SUID binary and its package ownership.

   ```bash
   ls -l /usr/bin/passwd
   dpkg -S /usr/bin/passwd
   ```

**Expected observation.** You will see familiar binaries such as `passwd`, `su`, `sudo`, `mount`, and possibly `pkexec`. Their presence alone is not a finding; an unexpected SUID binary in `/tmp`, `/home`, or `/opt` is. World-writable directories should normally have the sticky bit (`t`), as `/tmp` does.

**Prove it.** Save the sorted list and mark each entry as expected (package-owned) or needing review. Do not change modes on system binaries.

**Reflect.** Why does a SUID shell script usually fail to elevate privileges? What attack path does an unnecessary SUID binary create, and what is the least disruptive remediation?

## LX-06 — Use ACLs for a shared directory

**Goal.** Grant one extra user read access without changing the file's group or world permissions.

**Prerequisites.** LX-03 and LX-04. The `acl` package installed (`sudo apt install acl` in the lab if needed).

**Steps.** Run these in order and record the output.

1. Create a shared directory and file.

   ```bash
   mkdir -p ~/lab-scratch/lx06
   echo "shared report" > ~/lab-scratch/lx06/report.txt
   chmod 640 ~/lab-scratch/lx06/report.txt
   ```

2. Grant `nobody` read access with an ACL, then inspect it.

   ```bash
   setfacl -m u:nobody:r-- ~/lab-scratch/lx06/report.txt
   getfacl ~/lab-scratch/lx06/report.txt
   ```

3. Verify access as `nobody`, then remove the ACL entry.

   ```bash
   sudo runuser -u nobody -- cat ~/lab-scratch/lx06/report.txt
   setfacl -x u:nobody ~/lab-scratch/lx06/report.txt
   getfacl ~/lab-scratch/lx06/report.txt
   ```

4. Set a default ACL on a directory and create a new file inside it.

   ```bash
   mkdir -p ~/lab-scratch/lx06/incoming
   setfacl -d -m u:nobody:r-- ~/lab-scratch/lx06/incoming
   touch ~/lab-scratch/lx06/incoming/new.txt
   getfacl ~/lab-scratch/lx06/incoming/new.txt
   ```

**Expected observation.** `getfacl` shows a `mask` line and a named user entry; `ls -l` shows a `+` after the mode. The default ACL is inherited by new files. Removing the named entry may leave an effective mask that still summarizes group permissions.

**Prove it.** Save both `getfacl` outputs and the successful `nobody` read. Note whether the filesystem mounted with ACL support.

**Reflect.** How does the ACL mask interact with the group permission bits? When is an ACL clearer than adding a user to a group?

## LX-07 — Review accounts and sudo policy read-only

**Goal.** Identify human accounts, service accounts, and the exact sudo authority granted.

**Prerequisites.** LX-01. Sudo.

**Steps.** Run these in order and record the output.

1. List human-range accounts and their shells.

   ```bash
   awk -F: '$3 >= 1000 && $3 < 65534 {print $1, $3, $4, $6, $7}' /etc/passwd
   ```

2. Check for accounts with UID 0 other than root, and for service accounts with interactive shells.

   ```bash
   awk -F: '$3 == 0 {print}' /etc/passwd
   awk -F: '$3 < 1000 && $7 !~ /(nologin|false)$/ {print $1, $3, $7}' /etc/passwd
   ```

3. Validate the sudo configuration and list your authority.

   ```bash
   sudo visudo -c
   sudo -l
   sudo ls -la /etc/sudoers.d
   ```

**Expected observation.** Only `root` should have UID 0. Most service accounts should end in `nologin` or `false`. `visudo -c` should report a parsed OK; a syntax error is a serious operational risk because it can break sudo. `sudo -l` shows commands and tags such as `NOPASSWD`, `SETENV`, or wildcards.

**Prove it.** Save the account list and a redacted sudo policy summary. Do not paste password hashes or full environment variables.

**Reflect.** Why is a wildcard in a sudo command rule dangerous? What would you check before removing an account that owns files?

## LX-08 — Read the process tree and `/proc`

**Goal.** Move from a flat process list to parentage, executable path, and open resources.

**Prerequisites.** LX-01. A shell.

**Steps.** Run these in order and record the output.

1. Start a harmless long-running process and capture its PID.

   ```bash
   sleep 300 &
   sleep_pid=$!
   echo "$sleep_pid"
   ```

2. Inspect the tree and the process metadata.

   ```bash
   ps -eo pid,ppid,user,stat,etime,cmd --forest | head -n 30
   ps -o pid,ppid,user,stat,etime,cmd -p "$sleep_pid"
   ```

3. Read the kernel's view of the process.

   ```bash
   tr '\0' ' ' < "/proc/$sleep_pid/cmdline"; echo
   readlink "/proc/$sleep_pid/exe"
   readlink "/proc/$sleep_pid/cwd"
   ls -l "/proc/$sleep_pid/fd"
   ```

**Expected observation.** The parent PID should be your shell. `exe` points to `/usr/bin/sleep`, `cwd` to your current directory, and file descriptors include standard input, output, and error. A process can lie in its command-line arguments but not in `/proc/<pid>/exe` without more advanced tampering.

**Prove it.** Save a transcript with the PID, parent, executable path, and working directory. Leave the process running for LX-09.

**Reflect.** Why is parentage important in triage? Which `/proc` fields would you capture first on a suspect host, and why?

## LX-09 — Control jobs, signals, and priority

**Goal.** Stop, resume, renice, and terminate a process you started, and explain what each signal means.

**Prerequisites.** LX-08, with `sleep_pid` still available. If the shell changed, start a new `sleep 300 &` and set the PID again.

**Steps.** Run these in order and record the output.

1. List the job and suspend it.

   ```bash
   jobs -l
   kill -STOP "$sleep_pid"
   ps -o pid,stat,cmd -p "$sleep_pid"
   ```

2. Resume it and lower its scheduling priority.

   ```bash
   kill -CONT "$sleep_pid"
   renice -n 10 -p "$sleep_pid"
   ps -o pid,ni,stat,cmd -p "$sleep_pid"
   ```

3. Terminate it politely, then confirm it is gone.

   ```bash
   kill -TERM "$sleep_pid"
   sleep 1
   ps -p "$sleep_pid" || echo "process exited"
   ```

4. List signal names and read the manual for the two you used.

   ```bash
   kill -l
   man 7 signal
   ```

**Expected observation.** `SIGSTOP` produces state `T`; `SIGCONT` returns it to `S`; `renice` raises the nice value. `SIGTERM` is catchable and allows cleanup; `SIGKILL` (`-9`) cannot be caught and can leave resources inconsistent. Always target a PID you verified, never a broad `pkill` pattern on a shared host.

**Prove it.** Save the state transitions and nice value. State one situation where `SIGKILL` is the wrong first choice.

**Reflect.** Why can a process ignore `SIGTERM` but not `SIGKILL`? What are the risks of `killall` and `pkill -f` on a production system?

## LX-10 — Inspect systemd services and exposure

**Goal.** Distinguish running, enabled, and failed units, and find where a service's configuration comes from.

**Prerequisites.** LX-01. Sudo for unit files that are root-only.

**Steps.** Run these in order and record the output.

1. List running services and enabled unit files.

   ```bash
   systemctl list-units --type=service --state=running --no-pager
   systemctl list-unit-files --type=service --state=enabled --no-pager | head -n 30
   ```

2. Inspect the SSH unit without restarting it.

   ```bash
   systemctl status ssh --no-pager
   systemctl cat ssh
   systemctl show ssh -p FragmentPath -p ExecStart -p User
   ```

3. Check for failed units and recent unit-related errors.

   ```bash
   systemctl --failed --no-pager
   journalctl -u ssh --since "24 hours ago" --no-pager | tail -n 30
   ```

**Expected observation.** `enabled` means the unit starts at boot; `running` means it is active now. The two are independent. `systemctl cat` shows drop-ins, which override earlier files; this is a common source of "the config file says X but the service does Y".

**Prove it.** Save the unit fragment path and any drop-in paths. Record one service that is running but not enabled, or vice versa.

**Reflect.** Why should you use `systemctl edit` rather than editing a vendor unit file directly? What does a failed unit tell you that a running unit does not?

## LX-11 — Query logs without drowning in them

**Goal.** Use journald priority, time, and unit filters to answer a specific question.

**Prerequisites.** LX-01 and LX-10.

**Steps.** Run these in order and record the output.

1. Check journal size and retention.

   ```bash
   journalctl --disk-usage
   journalctl --list-boots --no-pager | tail -n 5
   ```

2. Pull warnings and errors from the last hour, then narrow to one unit.

   ```bash
   journalctl --since "1 hour ago" -p warning --no-pager | tail -n 40
   journalctl -u ssh --since "24 hours ago" --no-pager | tail -n 40
   ```

3. Inspect classic log files and test logrotate in debug mode. Debug mode reports what it would do without rotating.

   ```bash
   ls -la /var/log | head -n 30
   sudo logrotate -d /etc/logrotate.conf 2>&1 | head -n 40
   ```

**Expected observation.** Journal priorities run from `0` (emergency) to `7` (debug); `-p warning` includes more severe messages. `logrotate -d` prints decisions and does not rotate files. If `/var/log/auth.log` is absent, the distribution may use journald only.

**Prove it.** Save one focused query and its output. Write the exact question the query answers.

**Reflect.** Why does a broad `grep -i error` produce false leads? How does retention affect an investigation that starts three weeks after an incident?

## LX-12 — Analyze authentication logs with synthetic data

**Goal.** Turn raw authentication lines into counts, a timeline, and a defensible hypothesis.

**Prerequisites.** LX-01. `awk`, `sort`, `uniq`.

**Steps.** Run these in order and record the output.

1. Create a synthetic log. All addresses are documentation ranges and all users are fictional.

   ```bash
   cat > ~/lab-data/auth.log <<'EOF'
   Oct 30 10:01:02 lab-vm sshd[1201]: Failed password for invalid user admin from 203.0.113.55 port 51201 ssh2
   Oct 30 10:01:04 lab-vm sshd[1201]: Failed password for invalid user admin from 203.0.113.55 port 51205 ssh2
   Oct 30 10:01:07 lab-vm sshd[1201]: Failed password for invalid user admin from 203.0.113.55 port 51209 ssh2
   Oct 30 10:01:11 lab-vm sshd[1201]: Failed password for invalid user admin from 203.0.113.55 port 51213 ssh2
   Oct 30 10:01:15 lab-vm sshd[1201]: Failed password for invalid user admin from 203.0.113.55 port 51217 ssh2
   Oct 30 10:01:19 lab-vm sshd[1201]: Failed password for labuser from 203.0.113.55 port 51221 ssh2
   Oct 30 10:01:23 lab-vm sshd[1201]: Failed password for labuser from 203.0.113.55 port 51225 ssh2
   Oct 30 10:01:31 lab-vm sshd[1201]: Failed password for labuser from 198.51.100.23 port 40001 ssh2
   Oct 30 10:01:44 lab-vm sshd[1201]: Accepted password for labuser from 203.0.113.55 port 51240 ssh2
   Oct 30 10:02:11 lab-vm sudo: labuser : TTY=pts/0 ; PWD=/home/labuser ; USER=root ; COMMAND=/usr/bin/id
   EOF
   ```

2. Count failures by source address and by username.

   ```bash
   awk '/Failed password/ {for (i=1; i<=NF; i++) if ($i=="from") print $(i+1)}' ~/lab-data/auth.log | sort | uniq -c | sort -nr
   sed -nE 's/.*Failed password for (invalid user )?([^ ]+) from.*/\2/p' ~/lab-data/auth.log | sort | uniq -c | sort -nr
   ```

3. Extract accepted logins and the sudo event.

   ```bash
   grep 'Accepted' ~/lab-data/auth.log
   grep 'sudo' ~/lab-data/auth.log
   ```

4. Build a compact timeline.

   ```bash
   awk '{print $1, $2, $3, $5, $6, $9, $11}' ~/lab-data/auth.log
   ```

**Expected observation.** There are seven failures from `203.0.113.55` (five for `admin`, two for `labuser`), one failure from `198.51.100.23`, then a successful password login for `labuser` from the same address that produced most failures. The sudo event follows. A defensible hypothesis is a password-guessing attempt followed by a successful login and privilege use; it is not proof until you correlate session, source, and account context.

**Prove it.** Save the three summary outputs and a five-line timeline. Write one alternative explanation and one additional data source that would confirm or refute it.

**Reflect.** Why does a successful login after failures deserve escalation even if the account is legitimate? What would `Accepted publickey` change about your hypothesis?

## LX-13 — Review SSH daemon hardening without locking yourself out

**Goal.** Read the effective SSH configuration, not just the commented file, and identify risky settings.

**Prerequisites.** LX-01 and LX-10. Sudo.

**Steps.** Run these in order and record the output.

1. Dump the effective configuration. `sshd -T` validates and prints the merged result.

   ```bash
   sudo sshd -T 2>/dev/null | grep -Ei '^(permitrootlogin|passwordauthentication|pubkeyauthentication|permitemptypasswords|x11forwarding|maxauthtries|allowtcpforwarding|clientaliveinterval)'
   ```

2. Inspect the non-comment lines of the configuration and any drop-ins.

   ```bash
   sudo grep -vE '^[[:space:]]*(#|$)' /etc/ssh/sshd_config
   sudo ls -la /etc/ssh/sshd_config.d 2>/dev/null || true
   ```

3. Validate syntax without restarting the service.

   ```bash
   sudo sshd -t && echo "syntax ok"
   ```

**Expected observation.** Effective values may differ from the file because of `Include` drop-ins. Common defaults include `permitrootlogin prohibit-password`, `passwordauthentication yes` on some images, and `x11forwarding yes`. Root login with a key is not the same as root login with a password, but key-only administration still deserves an inventory.

**Prove it.** Save a table of setting, effective value, and risk note. Do not restart SSH. If you want to test a change, use a second session and a snapshot.

**Reflect.** Why is `PasswordAuthentication yes` a bigger risk on an internet-facing host than on a management VLAN? Why must you keep an existing session open while changing SSH?

## LX-14 — Map listening sockets to processes

**Goal.** Correlate listening ports, bind addresses, and owning processes.

**Prerequisites.** LX-01. Sudo for process names on all sockets.

**Steps.** Run these in order and record the output.

1. List TCP and UDP listeners with process information.

   ```bash
   sudo ss -tulpn
   ```

2. Start a loopback-only HTTP server and observe the difference.

   ```bash
   python3 -m http.server 8000 --bind 127.0.0.1 &
   http_pid=$!
   sleep 1
   sudo ss -tulpn | grep 8000
   ```

3. Confirm the server is not reachable on another interface address. Use the VM's own address from `ip -brief address`, not an external host.

   ```bash
   ip -brief address
   curl --max-time 3 "http://127.0.0.1:8000/" -o /dev/null -w '%{http_code}\n'
   ```

4. Stop the server and confirm the port is released.

   ```bash
   kill "$http_pid"
   sleep 1
   sudo ss -tulpn | grep 8000 || echo "port released"
   ```

**Expected observation.** `127.0.0.1:8000` is reachable only through loopback; `0.0.0.0:8000` or `[::]:8000` would accept connections on every interface. `ss -tulpn` needs root to show process names for sockets owned by other users.

**Prove it.** Save the listener table before and after, with the bind address highlighted. Note every service that listens on a non-loopback address.

**Reflect.** Which listening service on your VM has the largest attack surface, and why? How would you distinguish a legitimate development server from an unwanted backdoor?

## LX-15 — Read the host firewall rules

**Goal.** Interpret default policies and allowed inbound traffic without changing the ruleset.

**Prerequisites.** LX-01. Sudo. Either `nftables` or `ufw` may be present.

**Steps.** Run these in order and record the output.

1. Read the native ruleset and the distribution front end, if present.

   ```bash
   sudo nft list ruleset
   sudo ufw status verbose 2>/dev/null || echo "ufw not installed"
   ```

2. If the system uses the legacy interface, print rules without counters.

   ```bash
   sudo iptables -S 2>/dev/null | head -n 40
   ```

3. Identify default policies and inbound accept rules. Do not flush or reload.

   ```bash
   sudo nft list chain inet filter input 2>/dev/null || true
   ```

**Expected observation.** A default-deny input policy with explicit allows for management and required services is the goal. An empty ruleset means the host relies on a network firewall or has no host filtering. `ufw` and `nftables` may both be installed; only one is likely active.

**Prove it.** Save the ruleset and write a three-row table: default policy, allowed inbound service, and business justification (or "unknown").

**Reflect.** Why is a host firewall not a substitute for network segmentation? What is the risk of a broad `accept` rule placed before a specific deny?

## LX-16 — Assess package integrity and patch posture

**Goal.** Detect modified packaged files and list pending security updates without installing them.

**Prerequisites.** LX-01. Debian/Ubuntu with `dpkg` and `apt`.

**Steps.** Run these in order and record the output.

1. Verify installed package files against their recorded checksums.

   ```bash
   sudo dpkg -V 2>&1 | head -n 40
   ```

2. Count installed packages and list upgradable ones.

   ```bash
   dpkg -l | grep -c '^ii'
   apt list --upgradable 2>/dev/null | head -n 30
   ```

3. Simulate an upgrade. The `-s` flag makes no changes.

   ```bash
   sudo apt-get -s upgrade | tail -n 20
   ```

**Expected observation.** `dpkg -V` prints only files whose checksum, size, or mode differs from the package metadata. Modified configuration files are common and not automatically malicious. `apt list --upgradable` may include security and feature updates; read the origin, not just the count.

**Prove it.** Save the `dpkg -V` output and the upgrade simulation. For each modified file, state whether it is a configuration file you or the image changed.

**Reflect.** Why can `dpkg -V` miss a compromised file that was replaced along with its package metadata? What does patch latency mean for exposure?

## LX-17 — Build a file-integrity baseline

**Goal.** Detect a change to a configuration file by comparing hashes and metadata against a baseline.

**Prerequisites.** LX-01. `sha256sum`.

**Steps.** Run these in order and record the output.

1. Create a baseline for a small, controlled directory.

   ```bash
   mkdir -p ~/lab-scratch/lx17/etc-copy
   cp /etc/hosts /etc/hostname ~/lab-scratch/lx17/etc-copy/
   find ~/lab-scratch/lx17/etc-copy -type f -print0 | sort -z | xargs -0 sha256sum > ~/lab-scratch/lx17/baseline.sha256
   cat ~/lab-scratch/lx17/baseline.sha256
   ```

2. Make a benign change to the copy and re-hash.

   ```bash
   printf '\n# lab change\n' >> ~/lab-scratch/lx17/etc-copy/hosts
   find ~/lab-scratch/lx17/etc-copy -type f -print0 | sort -z | xargs -0 sha256sum > ~/lab-scratch/lx17/after.sha256
   diff -u ~/lab-scratch/lx17/baseline.sha256 ~/lab-scratch/lx17/after.sha256 || true
   ```

3. Verify one file manually.

   ```bash
   sha256sum -c ~/lab-scratch/lx17/after.sha256
   stat ~/lab-scratch/lx17/etc-copy/hosts
   ```

**Expected observation.** The `diff` shows one changed hash for `hosts`. `sha256sum -c` reports OK for both files against the new manifest. A real integrity monitor also records ownership, mode, and timestamps, and stores the baseline somewhere the monitored host cannot modify.

**Prove it.** Save both manifests and the diff. Explain why a baseline stored only on the monitored host is weak.

**Reflect.** Which files would you baseline on a production server, and how often? How would you distinguish an approved change from tampering?

## LX-18 — Audit scheduled tasks

**Goal.** Inventory cron jobs and systemd timers, including their owners and commands.

**Prerequisites.** LX-01. Sudo.

**Steps.** Run these in order and record the output.

1. List systemd timers and the next elapse time.

   ```bash
   systemctl list-timers --all --no-pager
   ```

2. Inspect system and user cron locations.

   ```bash
   sudo ls -la /etc/cron.d /etc/cron.daily /etc/cron.hourly 2>/dev/null
   sudo grep -RIn --exclude='*.dpkg-*' . /etc/cron.d /etc/crontab 2>/dev/null | head -n 40
   crontab -l 2>/dev/null || echo "no user crontab"
   ```

3. Read one timer unit and its service.

   ```bash
   systemctl cat apt-daily.timer 2>/dev/null || systemctl cat logrotate.timer
   ```

**Expected observation.** Timers expose `OnCalendar` or `OnBootSec` schedules and the unit they trigger. Cron entries have five time fields, a user, and a command. Pay attention to jobs running as root, jobs fetching code from the network, and jobs whose script is writable by a non-root user.

**Prove it.** Save a table of schedule, owner, command or unit, and trust assessment. Flag any job that writes to or executes from a world-writable directory.

**Reflect.** Why is a writable script referenced by a root cron job a privilege-escalation path? How do systemd timers improve observability compared with cron?

## LX-19 — Audit Linux capabilities

**Goal.** Find binaries with elevated capabilities and explain why the capability exists.

**Prerequisites.** LX-01. `libcap2-bin` installed.

**Steps.** Run these in order and record the output.

1. Show your shell's capability sets.

   ```bash
   capsh --print | head -n 20
   getpcaps "$$"
   ```

2. Search the filesystem for file capabilities.

   ```bash
   sudo getcap -r / 2>/dev/null
   ```

3. Inspect a common example, such as `ping`, and compare with its mode.

   ```bash
   ls -l "$(command -v ping)"
   getcap "$(command -v ping)" 2>/dev/null || echo "no file capabilities"
   ```

**Expected observation.** `ping` may use `cap_net_raw=ep` instead of SUID root. `cap_net_bind_service` lets a service bind a low port without full root. A capability such as `cap_setuid` or `cap_sys_admin` on an unexpected binary is high risk because it can be equivalent to root in practice.

**Prove it.** Save the capability inventory and annotate each entry with its purpose or "unexplained".

**Reflect.** Why is `cap_sys_admin` often described as effectively root? How do capabilities change the container threat model?

## LX-20 — Review kernel and resource hardening settings

**Goal.** Read defensive kernel settings and resource limits, and map each to a concrete risk.

**Prerequisites.** LX-01.

**Steps.** Run these in order and record the output.

1. Read memory-protection and information-exposure sysctls.

   ```bash
   sysctl kernel.randomize_va_space kernel.kptr_restrict kernel.dmesg_restrict
   sysctl fs.protected_hardlinks fs.protected_symlinks
   ```

2. Read network reverse-path and redirect settings.

   ```bash
   sysctl net.ipv4.conf.all.rp_filter net.ipv4.conf.all.accept_redirects net.ipv4.conf.all.send_redirects
   ```

3. Read shell and process limits.

   ```bash
   ulimit -a
   cat /etc/security/limits.conf | grep -vE '^[[:space:]]*(#|$)'
   ```

**Expected observation.** `randomize_va_space=2` means full ASLR. `kptr_restrict=1` or `2` reduces kernel pointer disclosure. `dmesg_restrict=1` limits kernel log access to privileged users. `rp_filter=1` enables strict reverse-path filtering. Values vary by distribution and workload; do not change them without understanding the application impact.

**Prove it.** Save a table of setting, current value, desired value, and rationale. Cite the hardening baseline you are comparing against, without claiming compliance.

**Reflect.** Which setting could break a legitimate routing or container workload if changed blindly? Why is a hardening benchmark a starting point rather than a guarantee?

## LX-21 — Check mandatory access control status

**Goal.** Determine whether AppArmor or SELinux is active and whether profiles are enforcing.

**Prerequisites.** LX-01. Sudo.

**Steps.** Run these in order and record the output.

1. Detect which framework is present.

   ```bash
   command -v aa-status && sudo aa-status || echo "apparmor tooling absent"
   command -v sestatus && sestatus || echo "selinux tooling absent"
   ```

2. Read the kernel parameter for AppArmor, if available.

   ```bash
   cat /sys/module/apparmor/parameters/enabled 2>/dev/null || true
   ```

3. List a few loaded profiles and their modes.

   ```bash
   sudo aa-status --profiled 2>/dev/null | head -n 20
   ```

**Expected observation.** Ubuntu commonly reports AppArmor enabled with a mix of enforce and complain profiles. Fedora/RHEL commonly reports SELinux `Enforcing`. A framework that is installed but disabled provides no confinement. "Complain" mode logs but does not block.

**Prove it.** Save the status output and count enforced versus complaining profiles. Note one service that is confined and one that is not.

**Reflect.** What is the security difference between complain and enforce mode? Why can a custom application require a tailored profile rather than a generic one?

## LX-22 — Add and remove a temporary audit watch

**Goal.** Use the Linux audit framework to record access to a scratch file, then remove the rule cleanly.

**Prerequisites.** LX-01. `auditd` installed and running; sudo. If `auditctl` is unavailable, document the gap and analyze the equivalent `journalctl` output instead.

**Steps.** Run these in order and record the output.

1. Confirm the audit service and current rules.

   ```bash
   systemctl is-active auditd
   sudo auditctl -l
   ```

2. Add a watch on a file you create, then modify it.

   ```bash
   touch /tmp/audit-lab-file
   sudo auditctl -w /tmp/audit-lab-file -p wa -k lab_watch
   echo "change" >> /tmp/audit-lab-file
   sleep 1
   sudo ausearch -k lab_watch -i | tail -n 30
   ```

3. Remove the rule and confirm it is gone.

   ```bash
   sudo auditctl -W /tmp/audit-lab-file -p wa -k lab_watch
   sudo auditctl -l | grep lab_watch || echo "rule removed"
   ```

**Expected observation.** `ausearch` shows a `SYSCALL` record with the watched path, the process that wrote, and the audit key. The rule exists only until reboot unless persisted in `/etc/audit/rules.d/`. Removing the watch with `-W` uses the same path, permissions, and key.

**Prove it.** Save the rule listing, the audit event, and the post-removal check. Explain what the `-p wa` filter means.

**Reflect.** Why is auditd valuable even when application logs exist? What are the performance and storage risks of auditing every file access?

## LX-23 — Triage a suspicious process using evidence

**Goal.** Practice a repeatable triage sequence on a harmless process with a deceptive name, without jumping to conclusions.

**Prerequisites.** LX-08 and LX-14. A shell.

**Steps.** Run these in order and record the output.

1. Start a harmless process with a custom argument name. This is a simulation, not malware.

   ```bash
   bash -c 'exec -a kworker-update sleep 900' &
   sim_pid=$!
   sleep 1
   echo "$sim_pid"
   ps -o pid,ppid,user,stat,etime,cmd -p "$sim_pid"
   ```

2. Verify the executable, working directory, and open files.

   ```bash
   readlink "/proc/$sim_pid/exe"
   readlink "/proc/$sim_pid/cwd"
   sudo ls -l "/proc/$sim_pid/fd" | head -n 20
   ```

3. Check network activity and the parent process.

   ```bash
   sudo ss -tupan | grep -E "pid=$sim_pid|$sim_pid" || echo "no network sockets"
   ps -o pid,ppid,user,cmd -p "$(awk '{print $4}' "/proc/$sim_pid/stat")" 2>/dev/null || true
   ```

4. Stop the simulation and write your assessment.

   ```bash
   kill "$sim_pid"
   ```

**Expected observation.** The command line says `kworker-update`, but `exe` points to `/usr/bin/sleep`, the parent is your shell, and there are no network sockets. A deceptive name alone is not proof of compromise; the executable path, parentage, network behavior, persistence, and file writes form the case. On a real host, capture volatile data before killing anything.

**Prove it.** Save the five evidence fields (command line, exe, cwd, fds, sockets) and write a three-sentence assessment with a confidence level and one follow-up question.

**Reflect.** Why can an attacker change the process name but not easily the `exe` target? What volatile evidence would you capture before termination, and why?

## LX-24 — Package evidence and clean up safely

**Goal.** Produce a tamper-evident evidence bundle and remove only your scratch data.

**Prerequisites.** LX-01 to LX-23. A completed artifact set.

**Steps.** Run these in order and record the output.

1. Create a bundle of the Linux evidence and a hash manifest.

   ```bash
   cd ~/cyberlab-evidence
   tar -czf "linux-evidence-$(date +%Y%m%d).tar.gz" linux notes
   sha256sum "linux-evidence-$(date +%Y%m%d).tar.gz" > "linux-evidence-$(date +%Y%m%d).tar.gz.sha256"
   tar -tzf "linux-evidence-$(date +%Y%m%d).tar.gz" | head -n 20
   ```

2. Verify the bundle hash.

   ```bash
   sha256sum -c "linux-evidence-$(date +%Y%m%d).tar.gz.sha256"
   ```

3. Remove only the scratch directories you created. Confirm the resolved path first.

   > **Destructive — lab VM only.** These commands delete `~/lab-scratch`, `/tmp/perm-lab`, and the audit test file. Run `realpath` first and stop if any path is not what you expect.

   ```bash
   realpath ~/lab-scratch /tmp/perm-lab /tmp/audit-lab-file
   rm -rf ~/lab-scratch
   rm -rf /tmp/perm-lab
   rm -f /tmp/audit-lab-file
   ```

4. Write a short chain-of-custody note.

   ```text
   Collector: <name or initials>
   Date/time and time zone: <ISO 8601>
   Host: <VM name and image version>
   Scope: <drills and paths collected>
   Hash: <sha256 of the bundle>
   Storage location and access: <path and who can read it>
   ```

**Expected observation.** The tar listing shows the expected files, and `sha256sum -c` reports OK. The cleanup targets exist only if you created them. A hash proves integrity after collection, not that the original data was accurate.

**Prove it.** Save the bundle, the `.sha256` file, and the custody note. Record the VM snapshot you used.

**Reflect.** Why is hashing at collection time important? What does a hash not prove about evidence?

## Set review

Before moving on, check that you can answer these without notes:

- Explain the difference between a file mode and an ACL.
- Trace a process to its executable, parent, and sockets using `/proc` and `ss`.
- Build a count and a timeline from an authentication log.
- Distinguish an enabled service from a running one.
- Name three hardening settings and the risk each reduces.
- Package evidence with provenance and clean up without touching host data.

If any answer is shaky, repeat the relevant drill with a different synthetic scenario.

## References

- [Linux man-pages project](https://man7.org/linux/man-pages/) — authoritative command and system-call documentation.
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — consensus hardening baselines; adapt to your platform.
- [CIS Controls](https://www.cisecurity.org/controls) — prioritized safeguards that contextualize host hardening.
- [MITRE ATT&CK](https://attack.mitre.org/) — technique context for process, credential, and persistence behaviors.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident handling context for the triage drills.

---

**Related:** [Exercise index](README.md) · [Networking drills](networking-drills.md) · [Blue team drills](blue-team-drills.md) · [Home lab checklist](../checklists/home-lab.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md)

Last reviewed: 2026-10-31
