# Project 02 — Baseline and Harden a Linux VM

A default Ubuntu Server install is reasonably sane, but "reasonably sane" is not a defensible baseline. In this project you measure a fresh VM, apply a documented set of controls across accounts, SSH, firewall, updates, kernel settings, and auditing, then prove with a repeatable script that the controls are still in place. The deliverable is not a longer checklist; it is evidence that you can change a system without locking yourself out and verify the result.

| Field | Value |
| --- | --- |
| Difficulty | Intermediate |
| Estimated time | 6–8 hours |
| Cost | $0 |
| Prerequisites | Project 01 complete; an Ubuntu Server 24.04 VM you can rebuild; console access through the hypervisor; basic `systemctl`, `ss`, and `ssh` familiarity |
| Safety and scope | Your own lab VM; snapshot before every change; no production hosts; no real credentials in notes |

`Last reviewed: 2026-10-31`

> **Safety and scope.** Harden only a VM you can rebuild, and keep the hypervisor console open while you change SSH or firewall rules. A hardening project that ends with a locked-out administrator teaches the wrong lesson. Take a snapshot named `pre-hardening` before the first change, and again before each high-risk step, so rollback is a two-minute operation rather than a rescue mission.

## Objective

- Capture a defensible baseline: patch level, listening services, accounts, SSH policy, and a Lynis score.
- Apply a documented hardening set covering updates, accounts, SSH, host firewall, intrusion prevention, kernel network settings, audit rules, and file permissions.
- Keep a rollback path for every control, including the ones that can sever your own access.
- Write and run a verification script that fails loudly when a control drifts.
- Produce a before/after comparison that a reviewer can reproduce.

## Why this project matters

Most compromised Linux hosts were not broken into through a novel exploit. They were reached with a weak or reused SSH password, an unpatched service, a permissive sudo rule, or a service that should never have been listening. Hardening is the discipline of reducing that surface on purpose and being able to prove you did it. It is also one of the few security skills that transfers directly to cloud images, containers, and CI runners, because the same questions apply: who can log in, what is listening, what is patched, what is logged, and how would you know if it changed?

The verification script is the part most learners skip and the part employers value most. Anyone can paste configuration lines. Far fewer people can demonstrate that the configuration survived a reboot and that a drift would be detected.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Ubuntu Server 24.04 LTS | Target system | <https://ubuntu.com/download/server> | Free |
| Lynis | Host audit and hardening index | <https://cisofy.com/lynis/> | Free, open source |
| OpenSSH | Remote administration and hardening target | <https://www.openssh.com/> | Free, open source |
| UFW | Host firewall front end | <https://help.ubuntu.com/community/UFW> | Free, open source |
| fail2ban | SSH authentication abuse throttling | <https://github.com/fail2ban/fail2ban> | Free, open source |
| auditd | Kernel-level auditing | <https://github.com/linux-audit/audit-userspace> | Free, open source |
| AIDE | File integrity monitoring | <https://aide.github.io/> | Free, open source |
| OpenSCAP | SCAP-based compliance scanning (stretch) | <https://www.open-scap.org/> | Free, open source |

## Setup

1. Build a clean Ubuntu Server 24.04 VM with 2 vCPUs, 4 GB RAM, and a 20–30 GB disk on the host-only network from project 01. Give it the address `192.168.56.20`.
2. During install, create your normal administrative user and import an SSH public key if the installer offers it. Do not enable password login for root.
3. Boot the VM, log in through the hypervisor console, and snapshot it as `pre-hardening`.
4. Record the starting state before changing anything:

```bash
mkdir -p ~/hardening/{before,after,configs,scripts}
sudo apt update
sudo apt install -y lynis
sudo lynis audit system --quick | tee ~/hardening/before/lynis-summary.txt
sudo cp /var/log/lynis-report.dat ~/hardening/before/lynis-report.dat
grep -E '^hardening_index=' /var/log/lynis-report.dat
hostnamectl > ~/hardening/before/host.txt
uname -a >> ~/hardening/before/host.txt
ss -tulpn | sudo tee ~/hardening/before/listening.txt
systemctl list-units --type=service --state=running --no-pager > ~/hardening/before/services.txt
```

5. Store configuration copies before editing so you can diff later:

```bash
sudo cp /etc/ssh/sshd_config ~/hardening/configs/sshd_config.orig
sudo cp /etc/ufw/user.rules ~/hardening/configs/user.rules.orig 2>/dev/null || true
```

Lynis writes a detailed log to `/var/log/lynis.log` and machine-readable findings to `/var/log/lynis-report.dat`. Keep both; the summary alone loses the suggestions that justify each control.

## Step-by-step tasks

1. **Patch the system and enable automatic security updates.** A baseline with known vulnerabilities is not a baseline.

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y unattended-upgrades apt-listchanges
sudo dpkg-reconfigure -plow unattended-upgrades
```

Confirm the periodic settings rather than trusting the dialog:

```bash
apt-config dump APT::Periodic
systemctl status unattended-upgrades --no-pager
systemctl list-timers 'apt-daily*' --no-pager
```

Checkpoint: `APT::Periodic::Unattended-Upgrade "1";` appears, and the service is active. Reboot if the kernel was updated, then re-check `uname -r`.

2. **Audit accounts and privilege.** Find accounts that should not exist, confirm root is locked, and review sudo membership.

```bash
awk -F: '($3 == 0) {print $1}' /etc/passwd
sudo awk -F: '($2 == "") {print $1}' /etc/shadow
sudo passwd -S root
getent group sudo
sudo grep -R '^[^#].*ALL' /etc/sudoers /etc/sudoers.d/ 2>/dev/null
```

Create a named administrative account if you have been working as root, add it to `sudo`, and test `sudo -l` from that account. Do not delete the only administrative account on the box.

```bash
sudo adduser labadmin
sudo usermod -aG sudo labadmin
sudo -l -U labadmin
```

3. **Enforce a password quality policy without cargo-culting rotation.** Install `libpam-pwquality` and set a minimum length of 14 with character diversity. Current guidance discourages forcing arbitrary periodic password changes; prefer length, a password manager, and MFA. Record the decision either way.

```bash
sudo apt install -y libpam-pwquality
sudo tee -a /etc/security/pwquality.conf >/dev/null <<'EOF'

# Project 02 lab baseline
minlen = 14
minclass = 3
maxrepeat = 3
dictcheck = 1
EOF
sudo pam-auth-update
grep -n 'pwquality' /etc/pam.d/common-password
```

In the `pam-auth-update` screen, enable "Password quality checking" and accept. If your file already sets one of these keys earlier, remove the duplicate rather than leaving two values. Test with a deliberately weak password on a throwaway account, then delete the account. Checkpoint: the weak password is rejected with a pwquality message.

4. **Harden SSH in the right order.** Generate and install a key *before* disabling passwords, and keep your current session open while you test a second one.

On your workstation:

```bash
ssh-keygen -t ed25519 -a 100 -C "lab-admin"
ssh-copy-id -i ~/.ssh/id_ed25519.pub labadmin@192.168.56.20
ssh -i ~/.ssh/id_ed25519 labadmin@192.168.56.20 'echo key-login-ok'
```

On the server, create a drop-in rather than editing the vendor file:

```bash
sudo tee /etc/ssh/sshd_config.d/99-lab-hardening.conf >/dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers labadmin
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
sudo sshd -t
sudo sshd -T | grep -E '^(permitrootlogin|passwordauthentication|kbdinteractiveauthentication|allowusers|maxauthtries) '
sudo systemctl reload ssh
```

Checkpoint: a new SSH session with the key succeeds, `ssh -o PreferredAuthentications=password labadmin@192.168.56.20` is refused, and your original session is still open. If either fails, fix it before closing the console.

5. **Apply a default-deny host firewall scoped to the lab subnet.** Use `limit` on SSH so repeated connection attempts are throttled as well as filtered.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit from 192.168.56.0/24 to any port 22 proto tcp
sudo ufw logging on
sudo ufw enable
sudo ufw status verbose
```

Checkpoint: `Status: active` and exactly one inbound allow/limit rule for port 22 from `192.168.56.0/24`. Open a second SSH session before you move on. Remember that Docker publishes ports through its own iptables chains and can bypass UFW; do not assume a UFW rule protects a container port.

6. **Add SSH abuse throttling with fail2ban.** Copy the packaged defaults to `jail.local`, which survives package updates.

```bash
sudo apt install -y fail2ban
sudo tee /etc/fail2ban/jail.local >/dev/null <<'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 4
backend = systemd

[sshd]
enabled = true
mode = aggressive
EOF
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

Test the ban path without waiting for an attacker:

```bash
sudo fail2ban-client set sshd banip 192.168.56.99
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 192.168.56.99
```

Checkpoint: the status output lists one banned IP, then zero after the unban.

7. **Apply kernel and network hardening.** These settings reduce spoofing, redirect, and information-leak exposure. Strict reverse-path filtering can break asymmetric routing, so note the trade-off in your checklist.

```bash
sudo tee /etc/sysctl.d/99-lab-hardening.conf >/dev/null <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.log_martians = 1
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.yama.ptrace_scope = 1
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.suid_dumpable = 0
EOF
sudo sysctl --system
sysctl net.ipv4.tcp_syncookies kernel.kptr_restrict kernel.yama.ptrace_scope
```

Checkpoint: each queried value matches the file. Reboot once and re-check, because sysctl drop-ins are only proven persistent after a boot.

8. **Turn on audit rules for identity and privilege changes.** Watch the files that define who you are and what you may do, plus process execution for interactive users.

```bash
sudo apt install -y auditd audispd-plugins
sudo tee /etc/audit/rules.d/90-lab.rules >/dev/null <<'EOF'
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k privilege
-w /etc/ssh/sshd_config -p wa -k sshd
-a always,exit -F arch=b64 -S execve -F auid>=1000 -F auid!=-1 -k exec
EOF
sudo augenrules --load
sudo systemctl enable --now auditd
sudo auditctl -l
sudo ausearch -k identity -ts today
```

Trigger a benign event to prove collection works: `sudo useradd audit-test && sudo userdel audit-test`, then search for `key=identity`. Checkpoint: `ausearch` returns the add and delete records with timestamps.

9. **Reduce the service surface deliberately.** List enabled units, then disable only services you can justify as unnecessary for this VM. Do not blindly purge packages; a server that cannot resolve DNS or install updates is less secure, not more.

```bash
systemctl list-unit-files --state=enabled --no-pager
ss -tulpn
sudo systemctl disable --now avahi-daemon.service 2>/dev/null || true
sudo systemctl disable --now cups.service 2>/dev/null || true
```

Record each removal with the reason and the command to restore it. Checkpoint: `ss -tulpn` shows only SSH and the services you decided to keep.

10. **Verify permissions and file integrity.** Correct permissions on credential files, then baseline the filesystem with AIDE.

```bash
stat -c '%a %U:%G %n' /etc/passwd /etc/shadow /etc/ssh/sshd_config
sudo chmod 640 /etc/shadow
sudo chown root:shadow /etc/shadow
sudo apt install -y debsums
sudo debsums -c
sudo apt install -y aide
sudo aideinit
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
sudo aide --check
```

Checkpoint: `debsums -c` prints nothing, and the first AIDE check reports no differences. A non-empty `debsums` output means a packaged file changed; investigate before assuming compromise.

11. **Write the verification script.** Save this as `~/hardening/scripts/verify-hardening.sh`, make it executable, and run it with `sudo`. It exits non-zero if any check fails, which makes it usable in cron or CI later.

```bash
#!/usr/bin/env bash
# verify-hardening.sh — lab-only checks for the Project 02 baseline
set -u
failures=0

check() {
  local name="$1" expected="$2" actual="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    printf 'PASS  %-30s %s\n' "$name" "$actual"
  else
    printf 'FAIL  %-30s expected %s, got %s\n' "$name" "$expected" "$actual"
    failures=$((failures + 1))
  fi
}

check "root login disabled" "no" "$(sudo sshd -T | awk '/^permitrootlogin/{print $2}')"
check "password auth disabled" "no" "$(sudo sshd -T | awk '/^passwordauthentication/{print $2}')"
check "firewall active" "active" "$(sudo ufw status | head -n1)"
check "tcp syncookies" "1" "$(sysctl -n net.ipv4.tcp_syncookies)"
check "kptr_restrict" "2" "$(sysctl -n kernel.kptr_restrict)"
check "fail2ban active" "active" "$(systemctl is-active fail2ban)"
check "audit identity rule" "1" "$(sudo auditctl -l | grep -c -- '-k identity')"
check "shadow mode" "640" "$(stat -c '%a' /etc/shadow)"

if [[ "$failures" -eq 0 ]]; then
  echo "All checks passed"
else
  echo "$failures check(s) failed"
fi
exit "$failures"
```

```bash
chmod +x ~/hardening/scripts/verify-hardening.sh
sudo ~/hardening/scripts/verify-hardening.sh
```

Checkpoint: every line says PASS. Deliberately break one control, confirm the script fails, restore it, and confirm it passes again. A verifier you have never seen fail is not a verifier.

12. **Re-scan, compare, and document.** Run Lynis again, save the report, and build a before/after table with the controls, the evidence, and the residual risk.

```bash
sudo lynis audit system --quick | tee ~/hardening/after/lynis-summary.txt
sudo cp /var/log/lynis-report.dat ~/hardening/after/lynis-report.dat
grep -E '^hardening_index=' ~/hardening/after/lynis-report.dat
diff -u ~/hardening/configs/sshd_config.orig /etc/ssh/sshd_config || true
```

Lynis indexes typically move by ten to twenty points for a change set like this, but the number is a heuristic, not a grade. Some suggestions will not fit a lab VM (separate partitions, GRUB passwords, a TPM); record why you declined each one instead of forcing a change you cannot maintain.

## Expected results

- A patched VM with automatic security updates enabled and verified through `apt-config`.
- SSH accessible only by key from the lab subnet, with root login and password authentication refused.
- A default-deny UFW policy with a single scoped SSH rule, plus fail2ban banning after four failures.
- Persistent sysctl and audit rules that survive a reboot, demonstrated with before/after queries.
- A verification script that passes on the hardened host and fails when a control is reverted.
- A before/after Lynis comparison and a checklist that explains every accepted or declined control.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `hardening-checklist.csv` | CSV | Columns: control, rationale, command/config, verification, status, rollback |
| `before/` and `after/` | Directory | Lynis reports, listening sockets, running services, package counts |
| `sshd_config.d/99-lab-hardening.conf` | Config | Drop-in file with a comment for every setting that is not obvious |
| `99-lab-hardening.conf` (sysctl) | Config | Applied and verified after a reboot |
| `90-lab.rules` (audit) | Config | Loaded with `augenrules`, visible in `auditctl -l`, exercised with a test event |
| `verify-hardening.sh` | Bash script | Passes cleanly, fails on drift, exits non-zero |
| `rollback.md` | Markdown | Exact commands or snapshot step to undo each high-risk change |
| `lab-notes.md` | Markdown | Dated entries from [the lab notes template](../templates/lab-notes.md) |

## Skills gained

- Baselining a Linux host and turning observations into a control set.
- Safe remote administration: key management, drop-in configuration, and lockout avoidance.
- Host firewalling, intrusion throttling, kernel hardening, and audit rule authoring.
- File integrity monitoring and package verification.
- Writing idempotent verification checks instead of trusting a one-time configuration.
- Explaining security trade-offs and declined controls in writing.

## Stretch improvements

1. Run OpenSCAP with the Ubuntu SCAP Security Guide and compare its findings with your checklist.
2. Map your controls to the current CIS Ubuntu Linux benchmark and record where you deviate and why.
3. Add AIDE to a nightly systemd timer and ship the report to the SIEM you build in project 04.
4. Turn the checklist into an Ansible role and prove idempotence by running it twice.
5. Add a `systemd` unit that runs the verification script hourly and writes failures to the journal.
6. Test the controls from the Kali VM: confirm the firewall behavior, observe fail2ban, and capture the traffic in project 03.

## Troubleshooting

### You are locked out of SSH after the change

Use the hypervisor console. Check `sudo sshd -t` for syntax errors, `journalctl -u ssh -n 50` for refusals, and `sudo ufw status verbose` for a missing rule. Common causes are disabling passwords before the key worked, a typo in `AllowUsers`, or an allow rule scoped to the wrong subnet. Fix from the console, then test with a second session before closing it. Restoring the `pre-hardening` snapshot is a valid last resort.

### fail2ban is running but never bans

Confirm the jail is enabled with `sudo fail2ban-client status`, then `sudo fail2ban-client status sshd`. If the filter sees no log lines, the backend is wrong: on Ubuntu 24.04 the journal is the reliable source, so keep `backend = systemd`. Validate the filter against a real log line with `sudo fail2ban-regex systemd-journal /etc/fail2ban/filter.d/sshd.conf`. Also check that another tool is not already blocking the source before fail2ban sees it.

### Audit rules disappear after a reboot

Rules loaded with `auditctl` are runtime-only. Put them in `/etc/audit/rules.d/` and load them with `augenrules --load`, then confirm `/etc/audit/audit.rules` contains them. If you enabled immutable mode with `-e 2`, changes require a reboot. Check `systemctl status auditd` and `journalctl -u auditd` for load failures.

### Lynis recommends changes that do not fit the VM

Lynis does not know your threat model. Suggestions such as a separate `/var` partition, a bootloader password, or disabling USB storage may be irrelevant or harmful in a VM. Record each suggestion, your decision, and the reason in the checklist. A reviewer will respect a justified exception more than an unexplained perfect score.

### Unattended upgrades never run

Check `systemctl list-timers 'apt-daily*'` and `systemctl status unattended-upgrades`. Confirm `APT::Periodic::Unattended-Upgrade "1";` is set, then inspect `/var/log/unattended-upgrades/` and `journalctl -u unattended-upgrades`. A VM that is usually suspended will miss timers; run `sudo unattended-upgrade --dry-run --debug` to test the configuration without waiting.

## Portfolio presentation

Publish the checklist, the verification script, and a short before/after table with the Lynis index, the number of listening services, and the SSH policy. Show one configuration diff and one deliberately failed verification run, because both demonstrate judgment. Do not publish real hostnames, public IP addresses, usernames, key material, or the full `sshd_config` if it contains comments specific to an employer. Private lab addresses and the generic `labadmin` account are fine. Frame the work as a reproducible baseline with accepted exceptions, not as a claim of perfect compliance.

## References

1. Ubuntu security notices and hardening guidance — <https://ubuntu.com/security>
2. OpenSSH manual pages, including `sshd_config` — <https://www.openssh.com/manual.html>
3. Lynis documentation and controls — <https://cisofy.com/lynis/>
4. CIS Benchmarks, including Ubuntu Linux — <https://www.cisecurity.org/cis-benchmarks>
5. Ubuntu UFW community documentation — <https://help.ubuntu.com/community/UFW>
6. Linux audit userspace documentation — <https://github.com/linux-audit/audit-userspace>
7. AIDE file integrity monitoring — <https://aide.github.io/>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
