# Linux foundations

[Home](../../README.md) / Foundations / Linux

Linux runs most of the internet's servers, nearly all cloud infrastructure, most containers, and every Android phone. It is also the operating system you will meet in penetration testing labs, incident response evidence, and production outages. Learning it properly is less about memorising commands and more about understanding a small set of ideas: everything is a file, permissions decide access, processes are cheap, and text is the universal interface.

This guide takes you from "I can follow a tutorial" to "I can investigate a system I have never seen before". It assumes no prior Linux experience but expects you to use a terminal, make mistakes, and read manual pages.

## At a glance

| Item | Detail |
| --- | --- |
| Difficulty | Beginner to intermediate. The shell rewards deliberate practice. |
| Realistic time | 6–8 weeks at 5–7 hours per week, most of it in a terminal. |
| Cost | Free. A local virtual machine is enough; no paid platform is required. |
| Prerequisites | Ability to install a virtual machine and comfort typing commands. |
| Lab requirement | One Linux VM (Ubuntu, Debian, or Fedora) with snapshots enabled. |
| Evidence of learning | A hardening checklist, a parsed log timeline, and an investigated process. |

## Why this field matters

Nearly every breach you will investigate leaves traces on a Linux host: a new systemd unit, a modified authorized_keys file, a process listening on an unexpected port, or a burst of failed SSH logins. Defenders who can read those traces and explain them are far more useful than defenders who only read dashboards.

The same skills transfer directly to cloud and container work. A container is a Linux process with namespaces and cgroups around it, and a cloud VM is a Linux host with an API-driven firewall in front of it. If you understand users, permissions, processes, and logs on one machine, you can reason about thousands.

## What you will learn

- Navigate the filesystem hierarchy and explain what belongs in each directory.
- Read and set Unix permissions, ownership, umask, ACLs, and special bits correctly.
- Manage users, groups, sudo policy, and service accounts without over-granting access.
- Investigate processes with `ps`, `/proc`, signals, and `strace`.
- Operate systemd services, timers, and the journal, and read their failure modes.
- Compose shell pipelines and write small scripts that fail safely.
- Audit authentication and system logs, and explain what a suspicious entry means.

## Prerequisites and honest expectations

You need a computer that can run a virtual machine and the patience to break things and repair them. You do not need to memorise every flag; you need to learn how to find the flag in a man page or `--help` output.

- The first two weeks feel slow because everything is unfamiliar. Type commands rather than copying them.
- You will lock yourself out at least once. Take a VM snapshot before changing SSH or sudo configuration.
- "It worked in the tutorial" is not understanding. Change one variable and see what happens.
- GUI tools are fine, but the terminal is where the diagnostic evidence lives.

## Core concepts

### The filesystem is one tree

Linux has a single directory tree rooted at `/`, with other filesystems mounted into it. The Filesystem Hierarchy Standard explains the conventions: `/etc` holds configuration, `/var` holds changing data such as logs, `/home` holds user files, `/tmp` is world-writable, `/usr` holds installed software, and `/proc` and `/sys` are kernel interfaces presented as files. "Everything is a file" means devices, sockets, and process details can often be read and written with ordinary file tools.

This design makes investigation consistent. Configuration is usually text under `/etc`, logs are usually text under `/var/log`, and a running process exposes its state under `/proc/<pid>`. When you learn a new service, ask three questions: where is its configuration, where does it log, and what user does it run as.

### Permissions, ownership, and umask

Every file has an owner, a group, and three sets of permission bits: read, write, and execute for the owner, the group, and everyone else. Octal notation packs them into digits, so `chmod 640` means owner read and write, group read, others nothing. Directories use the same bits differently: read lists names, write creates or deletes entries, and execute allows traversal into the directory.

`umask` subtracts default permissions from newly created files and directories. Special bits matter too: setuid runs a program as its owner (a common privilege-escalation vector when misapplied), setgid inherits a directory's group, and the sticky bit on `/tmp` stops users deleting each other's files. ACLs add per-user rules when the basic model is too coarse. `chmod 777` is almost never the right fix; it hides the ownership problem instead of solving it.

### Users, groups, sudo, and PAM

Linux identifies users by numeric UID and groups by GID. `/etc/passwd` maps names to UIDs, home directories, and login shells; `/etc/shadow` stores password hashes readable only by root. Service accounts exist to run daemons with minimal privilege and should not have interactive shells or login passwords.

`sudo` lets permitted users run specific commands as another user, controlled by `/etc/sudoers` and files in `/etc/sudoers.d`. Prefer targeted rules over `ALL=(ALL) NOPASSWD: ALL`. Pluggable Authentication Modules (PAM) stack the authentication checks behind login, SSH, and `sudo`; misconfigured PAM can silently allow access or lock everyone out. Always test changes in a second session before closing the first.

### Processes, signals, and jobs

A process is a running program with a PID, a parent PID, an owner, an address space, and open file descriptors. New processes are created with `fork` followed by `exec`, which is why the process tree tells you how something was launched. `ps aux`, `top`, and `htop` show state; `/proc/<pid>/cmdline`, `cwd`, and `fd` reveal details that `ps` hides.

Signals are asynchronous notifications. `SIGTERM` asks a process to stop cleanly, `SIGKILL` cannot be caught and should be a last resort, `SIGHUP` often means reload configuration, and `SIGSTOP` pauses a process for inspection. Background jobs with `&`, `jobs`, `fg`, and `bg` are shell features, not service management; for anything long-lived, use systemd or a terminal multiplexer such as tmux.

### systemd: services, timers, and the journal

systemd is the init system and service manager on most distributions. A unit file describes a service, timer, mount, or target. `systemctl start` runs it now, `systemctl enable` starts it at boot, and `systemctl status` shows the last exit code and recent log lines. Dependencies such as `After=` and `Requires=` control ordering and failure behaviour.

Unit files also support sandboxing: `ProtectSystem=strict`, `PrivateTmp=yes`, `NoNewPrivileges=yes`, and restricted address families can limit the damage a compromised service can do. Timers replace cron for many scheduled jobs and log through the journal. `journalctl -u <unit>` reads a service's logs, `journalctl -b` reads the current boot, and persistent journal storage must be enabled if you need logs across reboots.

### Shell fluency

The shell is a programming environment for files, processes, and text. Pipes connect a program's output to another's input; redirection sends output to files or reads input from them; `2>` captures errors; `&&` and `||` branch on exit status. Quoting controls expansion: double quotes preserve spaces but allow variables, single quotes preserve everything literally.

Learn a small set of tools deeply: `grep` for searching, `find` for locating files by metadata, `xargs` for building command lines, `sed` for stream editing, `awk` for field-based reports, and `sort | uniq -c` for counting. `man`, `--help`, and `explainshell.com` answer most questions. Tab completion and history search are not luxuries; they reduce typos that cause outages.

### Scripting that fails safely

A useful script starts with a shebang, documents its purpose, and fails loudly. `set -euo pipefail` stops on errors, undefined variables, and failed pipeline stages. Quote variable expansions (`"$file"`), use `mktemp` for temporary files, clean up with `trap`, and check that required commands exist. Avoid `eval` and unquoted user input, which turn data into code.

Shell is excellent for orchestration and terrible for complex data structures. When a script grows conditionals, arrays, and JSON parsing, rewrite it in Python. Run ShellCheck on every script you keep; it catches quoting bugs and portability problems that are easy to miss in review.

### Packages, repositories, and updates

Package managers install software from signed repositories: `apt` on Debian and Ubuntu, `dnf` on Fedora and RHEL-family systems, `pacman` on Arch. A repository's signing key is part of your supply chain; adding an untrusted PPA or COPR repository is equivalent to trusting its maintainer to run code as root.

Keep the system updated, but treat updates as changes: read notices, schedule reboots, and have a rollback plan. Unattended upgrades reduce exposure for internet-facing servers. Snap and Flatpak packages bundle dependencies for isolation and freshness, at the cost of size and a second update mechanism to monitor.

### Logs and auditing

The journal collects service logs, kernel messages, and authentication events. Traditional text logs still exist: `/var/log/auth.log` or `/var/log/secure` for authentication, `/var/log/syslog` or `/var/log/messages` for general system events, and application-specific directories under `/var/log`. `logrotate` prevents logs from filling the disk, which means retention is a policy decision, not an accident.

The Linux audit subsystem records security-relevant events such as file access, permission changes, and executed commands. Rules can watch a sensitive file or a syscall, and `ausearch` and `aureport` query the results. For anything beyond a single host, forward logs to a central system; logs that only exist on the compromised machine are not evidence you can trust.

### Networking and SSH

Modern Linux uses `ip` for addresses and routes, `ss` for sockets, `dig` for DNS, `curl` for HTTP, and `tcpdump` for packets. `ip addr`, `ip route`, and `ss -tulpn` answer most "why can't it connect" questions before you reach for a packet capture.

SSH is the standard remote administration protocol. Use key-based authentication, protect private keys with a passphrase, and disable password login on internet-facing hosts. `sshd_config` controls allowed users, forwarding, and authentication methods; changing it without a second session open is a classic way to lock yourself out. Tunnels and agent forwarding are powerful and should be enabled deliberately, because they extend trust beyond the host.

### Mandatory access control and containers

SELinux and AppArmor add mandatory access control on top of Unix permissions: even root can be confined to a policy that forbids reading certain files or binding certain ports. Check the mode (`getenforce`, `aa-status`) before blaming permissions for a denial, and read the audit log to see which rule fired.

Containers use namespaces for isolation and cgroups for resource limits. They share the host kernel, so a kernel vulnerability or a privileged container can break the boundary. Run containers as non-root, drop capabilities, use read-only filesystems where possible, and never mount the Docker socket into a container you do not fully trust.

## Legal and safe practice

Practise on machines you own. A local VM with snapshots is the right place to experiment with permissions, services, and firewall rules.

- Do not test privilege escalation or persistence on shared systems, school machines, or employer infrastructure without written authorisation.
- Treat logs and configuration files as potentially sensitive; they can contain tokens, personal data, and internal addresses.
- When following a lab, keep the vulnerable machine on a host-only network and revert snapshots afterwards.
- If you discover a real vulnerability, report it through the organisation's disclosure channel rather than exploring further.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 0 | Navigation | Learn the FHS, paths, `ls`, `cd`, `file`, `man`, and redirection. | A cheat sheet you wrote yourself |
| 1 | Permissions | Create users and groups, set modes, test umask and ACLs. | Permission matrix with expected and actual results |
| 2 | Processes | Inspect processes, send signals, read `/proc`, and use `strace`. | Investigation notes for one hung process |
| 3 | Services | Write a systemd unit and timer, then debug a failed start. | Unit files and `journalctl` evidence |
| 4 | Shell and scripting | Build a log-analysis pipeline and a checked script. | ShellCheck-clean script in a Git repository |
| 5 | Hardening | Harden SSH, enable a firewall, and configure audit rules. | Before-and-after checklist with proof commands |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Linux Journey](https://linuxjourney.com/) | Linux Journey (now hosted by LabEx) | Beginner | Free to read; some interactive features may need an account | Interactive lessons | Gentle progression from files to networking |
| [Bandit](https://overthewire.org/wargames/bandit/) | OverTheWire | Beginner | Free | SSH wargame | Shell fluency through 30+ puzzles |
| [The Linux Command Line](https://linuxcommand.org/tlcl.php) | William Shotts | Beginner | Free to read online; print edition paid | Exercises | Deep, well-written coverage of the shell |
| [The Missing Semester](https://missing.csail.mit.edu/) | MIT | Beginner | Free | Exercises and lectures | Shell, scripting, Git, and debugging habits |
| [Linux Upskill Challenge](https://linuxupskillchallenge.org/) | Linux Upskill Challenge | Beginner | Free | Daily server exercises | A month of realistic administration practice |

## Official documentation and standards

| Resource | Publisher | Why it matters |
| --- | --- | --- |
| [Linux man-pages](https://man7.org/linux/man-pages/) | man7.org | The reference for system calls, file formats, and commands |
| [GNU Bash manual](https://www.gnu.org/software/bash/manual/) | GNU Project | Authoritative behaviour of the shell you use every day |
| [systemd documentation](https://systemd.io/) | systemd project | Unit files, timers, sandboxing, and journal design |
| [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html) | Linux Foundation | Why files live where they do |
| [Linux kernel documentation](https://www.kernel.org/doc/html/latest/) | kernel.org | Kernel interfaces, namespaces, and cgroups |
| [Ubuntu tutorials](https://ubuntu.com/tutorials) | Canonical | Task-focused guides for common server operations |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What to practise |
| --- | --- | --- | --- |
| [Bandit](https://overthewire.org/wargames/bandit/) | OverTheWire | Free | File permissions, pipes, and shell problem solving |
| Local VM | You | Free | Snapshots, users, services, firewalls, and recovery |
| [Linux Upskill Challenge](https://linuxupskillchallenge.org/) | Linux Upskill Challenge | Free | A realistic small server administered day by day |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium; several rooms free | Guided Linux fundamentals and log analysis |

Use snapshots before every experiment that touches boot, SSH, or authentication. A VM you can revert in ten seconds is a safe place to learn.

## Essential open-source tools

| Tool | Purpose | Link |
| --- | --- | --- |
| Bash and coreutils | The everyday interface to files, text, and processes | [GNU coreutils](https://www.gnu.org/software/coreutils/) |
| ShellCheck | Static analysis for shell scripts | [shellcheck.net](https://www.shellcheck.net/) |
| tmux | Persistent terminal sessions for remote work | [tmux](https://github.com/tmux/tmux) |
| strace | Trace system calls to see what a process is doing | [strace.io](https://strace.io/) |
| auditd | Kernel-level auditing for security events | [audit-userspace](https://github.com/linux-audit/audit-userspace) |
| OpenSSH | Remote administration and tunnelling | [openssh.com](https://www.openssh.com/) |

Tools do not replace methodology. `strace` output is only useful if you have a hypothesis; `auditd` is only useful if someone reviews the alerts. Start with the question, then choose the tool.

## Practical projects and exercises

**Project 1: Harden a fresh server.**
Objective: apply least privilege and prove it. Setup: install a minimal Linux VM, create a non-root admin user, disable password SSH, enable a default-deny firewall, configure unattended upgrades, and add an audit rule for changes to `/etc/passwd`. Deliverable: a checklist with the command used and the output that proves each control.

**Project 2: Log investigation notebook.**
Objective: turn raw logs into a timeline. Setup: in an isolated lab, generate failed SSH logins and a successful login, then parse `auth.log` or the journal with `grep`, `awk`, and `sort`. Deliverable: a timeline of events, a count by source address, and a short script that reproduces the analysis.

**Project 3: Process investigation (portfolio-worthy).**
Objective: demonstrate debugging rather than guessing. Setup: start a service that hangs, find its PID, inspect `/proc`, send signals, and trace its system calls. Deliverable: a written investigation with commands, observations, root cause, and the fix, plus the systemd unit you would use to prevent recurrence.

## Common mistakes and misconceptions

- **`chmod 777` fixes permission errors.** It removes the security boundary and hides the real ownership problem.
- **Use `sudo` for everything.** Daily work as root turns a typo into an outage and destroys accountability.
- **Linux is immune to malware.** Servers are routinely compromised through exposed services, weak credentials, and supply-chain packages.
- **`kill -9` is the normal way to stop a service.** It skips cleanup; use `systemctl stop` and `SIGTERM` first.
- **Logs are optional on small systems.** Without logs you cannot investigate, and attackers know it.
- **`curl | bash` is an acceptable install method.** It executes whatever the server sends, with your privileges.
- **Containers are a security boundary.** They share the host kernel; privileged containers are close to root on the host.

## Career paths and roles

| Role | Typical entry point | What to demonstrate |
| --- | --- | --- |
| Linux systems administrator | Help desk or homelab | Service management, permissions, and recovery evidence |
| DevOps or site reliability engineer | Scripting and cloud basics | Automation, observability, and safe change practices |
| SOC analyst | Linux plus networking | Log analysis and host triage |
| Penetration tester | Linux fluency plus labs | Enumeration, privilege escalation, and clean reporting |

Linux is a multiplier: every other security discipline becomes easier once the terminal is comfortable. Pair this guide with [Networking foundations](../networking/README.md) and then move to [Linux security](../../additional-topics/linux-security/README.md) for hardening depth.

## Next steps

1. Finish Bandit up to level 15 without reading walkthroughs, then compare your solutions.
2. Write and ShellCheck a script that summarises failed logins by address.
3. Harden the VM and save the checklist as a portfolio artefact.
4. Read [Windows foundations](../windows/README.md) to compare the two operating system models.
5. Use the [beginner roadmap](../../roadmaps/beginner-to-ethical-hacker.md) and [exercises](../../exercises/README.md) to plan the next month.

## References

- Linux man-pages project, <https://man7.org/linux/man-pages/>
- GNU Project, *Bash Reference Manual*, <https://www.gnu.org/software/bash/manual/>
- systemd project, *Documentation*, <https://systemd.io/>
- Linux Foundation, *Filesystem Hierarchy Standard 3.0*, <https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html>
- OverTheWire, *Bandit*, <https://overthewire.org/wargames/bandit/>
- MIT, *The Missing Semester of Your CS Education*, <https://missing.csail.mit.edu/>

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) · [Learning paths](../../roadmaps/README.md) · [Free courses](../../resources/free-courses/README.md) · [Contributing](../../CONTRIBUTING.md)
