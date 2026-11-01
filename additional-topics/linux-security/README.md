[Home](../../README.md) / [Additional topics](../README.md) / Linux Security

# Linux Security

Linux runs most of the internet's servers, a large share of cloud workloads, and the majority of container images. It is also the operating system many security practitioners use as their daily workstation. Securing Linux means understanding accounts, permissions, authentication, mandatory access control, services, logging, and the supply chain that delivers packages and images.

This guide is for administrators, DevOps engineers, and security learners who can already use a Linux shell but want a defensible hardening methodology. It focuses on Ubuntu, Debian, and Rocky Linux because they cover the most common enterprise and cloud families, and it keeps every exercise inside virtual machines you control.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Beginner to advanced; basic command-line skills are required |
| Realistic time | 2-4 months to build solid hardening habits; ongoing for production depth |
| Cost | Free; everything here runs on open-source software and evaluation cloud tiers |
| Prerequisites | Shell navigation, users and groups, package management, systemd, basic networking |
| Lab requirement | Essential. At least one Ubuntu or Debian VM and one Rocky Linux VM with snapshots |

## Why this field matters

A default Linux installation is not a security baseline. It is a starting point tuned for compatibility. Services run as root because it is easy, SSH accepts passwords because it is convenient, and auditd is installed but empty. Attackers count on these defaults: weak SSH credentials, overly permissive sudo rules, unpatched web applications, and containers running with more privilege than they need.

Hardening is not a one-time script. It is a set of documented decisions about who can do what, which services are exposed, how changes are detected, and how the system is rebuilt. The same skills apply to cloud instances, CI runners, Kubernetes nodes, and embedded devices. They also make you better at incident response, because you know where the evidence lives.

## What you will learn

- How to build a threat model and baseline for a Linux host.
- How to apply least privilege with accounts, groups, sudo, and capabilities.
- How to harden SSH and PAM without locking yourself out.
- How file permissions, ACLs, and special bits actually compose.
- How SELinux and AppArmor add mandatory access control.
- How to patch, inventory packages, and verify integrity.
- How to tune kernel and service settings safely.
- How to collect and retain logs that support detection and forensics.
- How to harden containers and connect hardening to DevSecOps.

## Prerequisites and honest expectations

You should be comfortable with `sudo`, editing files, reading `systemctl` status, and interpreting file permissions. You should understand TCP/IP ports and basic DNS. Familiarity with at least one scripting language helps with automation, and a virtual machine platform (VirtualBox, VMware, KVM, or a cloud free tier) is required.

Expect to break SSH access at least once. Always keep a console session open and take a snapshot before changing authentication. Expect some hardening advice to conflict with vendor defaults or application requirements; the skill is documenting a justified exception, not blindly applying a checklist.

## Core concepts

### 1. Threat modeling and baselines

Start with what the host is for. An internet-facing web server, an internal database, and a developer workstation have different exposure and different data. List the services, the users, the network paths, and the data the host can reach. Then choose controls proportional to that risk.

A baseline is a documented, version-controlled configuration: packages, services, sysctl values, SSH settings, audit rules, and firewall policy. Store it in Git or configuration management, not in a wiki that drifts. Use CIS Benchmarks or vendor guidance as inputs, but record every deviation and why it exists.

### 2. Accounts and least privilege

Every service should run as a dedicated, unprivileged user with no shell and no home directory unless it needs one. Human accounts should be individual, not shared, and administrative access should be separate from daily use. Remove or lock unused accounts, expire stale credentials, and review group membership regularly.

UID 0 is not the only risk. Membership in `sudo`, `wheel`, `docker`, `adm`, or `systemd-journal` can provide effective root access. Treat those groups as privileged and audit them. On cloud images, check for default users and SSH keys baked into the image; they are often overlooked.

### 3. sudo and privilege boundaries

`sudo` lets a user run commands as another user according to `/etc/sudoers` and files in `/etc/sudoers.d`. Rules should be specific: allow the exact commands or command groups needed, not `ALL=(ALL) NOPASSWD: ALL`. Wildcards in command paths are dangerous because arguments can be abused.

Use `visudo` to edit rules, because it validates syntax before saving. Require a password for interactive use, set timeouts, and log sudo events. Test every change from a second session before closing the first. Remember that sudo protects the boundary only if the allowed commands cannot spawn a shell or write to privileged files.

### 4. SSH hardening

SSH is the most attacked service on internet-facing Linux hosts. Prefer key-based authentication, disable direct root login, and restrict which users or groups may connect. Use modern algorithms, disable unused features, and consider certificates or short-lived credentials for fleets rather than long-lived authorized keys.

`fail2ban` can reduce log noise from password guessing, but it is not a substitute for disabling password authentication. Rate limiting and firewall rules help, but the strongest control is not exposing SSH publicly at all: use a bastion, VPN, or zero-trust access proxy. Keep an out-of-band console path and test it.

### 5. PAM and authentication policy

Pluggable Authentication Modules (PAM) stack authentication, account, password, and session checks for login, SSH, sudo, and other services. Files in `/etc/pam.d/` define the stack. Modules such as `pam_pwquality` enforce password strength, `pam_faillock` locks accounts after failures, and `pam_access` restricts access by origin.

PAM misconfiguration can lock out every administrator, including root. Change one service at a time, keep a root console open, and test with a non-critical account. Centralized identity (LDAP, Kerberos, SSSD) adds complexity; make sure caching and offline access are understood before an outage.

### 6. Permissions, ACLs, and capabilities

Linux permissions combine owner, group, and other bits with special bits: SUID (run as owner), SGID (run as group or inherit directory group), and sticky (restrict deletion in shared directories). Access control lists (ACLs) add per-user and per-group permissions beyond the basic mode. `umask` determines default permissions for new files.

SUID binaries are a common privilege-escalation target. Inventory them, remove unnecessary ones, and monitor changes. Linux capabilities split root privileges into units such as `CAP_NET_BIND_SERVICE`; prefer a narrow capability over full root, and verify with `getcap`. Never set broad capabilities on scripts or user-writable binaries.

### 7. SELinux and AppArmor

Discretionary access control (DAC) lets owners decide access. Mandatory access control (MAC) adds a system-wide policy that even root is subject to. SELinux labels processes and files with contexts and enforces type enforcement; AppArmor attaches profiles to programs and restricts paths and capabilities.

SELinux modes are enforcing, permissive, and disabled. Use permissive mode for troubleshooting, never as a permanent state. Read denials with `ausearch` or the audit log, then fix labels or write a local policy. AppArmor profiles live in `/etc/apparmor.d/`; use `aa-status` and `aa-logprof`. Do not disable MAC to make an application work; fix the policy or document a confined exception.

### 8. Patching, packages, and supply chain

Install software from distribution repositories with signature verification enabled. Avoid curl-pipe-to-shell installers in production. Enable unattended security updates or a patch cadence, and reboot when the kernel or critical libraries require it. Track the difference between "patched" and "running the patched version".

Generate a software bill of materials (SBOM) for custom images, scan dependencies, and sign artifacts. Supply-chain controls such as SLSA provenance and Sigstore signatures are becoming baseline for containerized delivery. At minimum, verify checksums, pin versions, and keep a rebuild path.

### 9. Kernel and service hardening

Kernel parameters in `/etc/sysctl.d/` control networking and memory protections: IP forwarding, SYN cookies, reverse-path filtering, ICMP behavior, address-space layout randomization, kernel pointer exposure, and dmesg access. Harden what the host needs, not a copied list from the internet; some settings break containers, routing, or monitoring.

systemd can sandbox services with directives such as `NoNewPrivileges`, `ProtectSystem`, `ProtectHome`, `PrivateTmp`, `RestrictAddressFamilies`, and `SystemCallFilter`. Start with `systemd-analyze security` to see a service's exposure score, then add directives incrementally and test. Disable services you do not need and remove their packages when possible.

### 10. auditd, logging, and integrity

`auditd` records security-relevant events: authentication, privilege changes, file access, execution, and syscalls. Write rules for sensitive files (`/etc/passwd`, `/etc/shadow`, `/etc/sudoers`, SSH configuration), privilege escalation, and unusual execution. Test rules with benign activity and watch for log volume and disk usage.

Forward logs to a remote collector so an attacker cannot simply delete local evidence. `journald` and rsyslog can both ship logs; choose one path and make sure timestamps are synchronized with NTP. AIDE or another file-integrity tool creates a baseline of file hashes and alerts on changes. Integrity alerts are only useful if someone triages them.

### 11. Containers and isolation

Containers share the host kernel. Namespaces provide isolation, cgroups limit resources, and seccomp, capabilities, and MAC profiles constrain behavior. A container running as root with the host Docker socket mounted is effectively root on the host. Run as a non-root user, use read-only filesystems, drop all capabilities and add back only what is needed, and set resource limits.

Scan images for known vulnerabilities, pin base images by digest, and rebuild regularly. Kubernetes adds another layer: network policies, pod security standards, secrets management, and admission control. Do not confuse container isolation with a virtual machine boundary; treat a compromised container as a host-level incident until proven otherwise.

### 12. Compliance automation and DevSecOps

CIS Benchmarks, Lynis, and OpenSCAP turn hardening into measurable checks. Lynis gives a quick host audit and a hardening index; OpenSCAP evaluates against SCAP security guides, often mapped to CIS or STIG profiles; AIDE covers integrity. Automate these checks in CI or configuration management so drift is visible.

DevSecOps means security is part of the build, not an inspection at the end. Add dependency scanning, secret scanning, image scanning, and infrastructure-as-code checks to the pipeline. Make the secure path the easy path: golden images, hardened base containers, and reusable modules. Track exceptions with owners and expiry dates.

## Legal and safe practice

Harden and test only systems you own or administer with authorization. A production change requires a change record, a rollback plan, and a test window. Do not run exploitation tools against shared or employer systems without written permission, even if you are "just checking".

Keep vulnerable labs isolated. Snapshot VMs before changing SSH, PAM, or firewall rules, and keep a console session open. Do not publish real hostnames, keys, or credentials in write-ups. If you discover a compromise, preserve evidence before rebuilding: memory, logs, network state, and disk images.

Be careful with hardening scripts from the internet. They often disable services, change permissions, or apply kernel settings that break production. Read every line, test in a lab, and prefer distribution-supported tooling.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Fundamentals | Users, permissions, services | Build an Ubuntu VM and a Rocky VM; practice users, groups, ACLs, systemd | A command journal explaining each permission change |
| 2. Access hardening | SSH, sudo, PAM | Disable password SSH, configure key auth, write narrow sudo rules | An access matrix proving each role can do only its task |
| 3. MAC and integrity | SELinux, AppArmor, AIDE | Enable enforcing mode, fix one denial, baseline critical files | A denial analysis and an integrity alert report |
| 4. Monitoring | auditd and remote logs | Write audit rules, forward logs, generate test events | A detection note for each rule with sample evidence |
| 5. Automation | Lynis, OpenSCAP, IaC | Run a baseline audit and automate remediation checks | Before/after scores with documented exceptions |
| 6. Containers and CI | Image and pipeline security | Build a hardened image, scan it, add checks to CI | A secure Dockerfile, scan report, and pipeline policy |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [OverTheWire](https://overthewire.org/wargames/) | OverTheWire | Beginner | Free | Yes | Progressive wargames that build Linux and security fundamentals |
| [pwn.college](https://pwn.college/) | Arizona State University | Beginner to advanced | Free | Yes | Structured systems and security modules with hands-on challenges |
| [TryHackMe Linux rooms](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; some rooms free, paths require subscription | Yes | Guided Linux fundamentals and privilege-escalation labs |
| [Ubuntu tutorials](https://ubuntu.com/tutorials) | Canonical | Beginner | Free | Yes, local VM | Official guidance for server setup and common services |
| [Microsoft Learn Linux training](https://learn.microsoft.com/training/) | Microsoft | Beginner | Free | Some | Linux on Azure and general administration fundamentals |
| [OpenSCAP documentation](https://www.open-scap.org/) | OpenSCAP project | Intermediate | Free | Yes, self-hosted | Compliance scanning and remediation workflow |

## Official documentation and standards

- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — consensus hardening baselines for Linux distributions and server roles.
- [NIST SP 800-123: Guide to General Server Security](https://csrc.nist.gov/pubs/sp/800/123/final) — a vendor-neutral server security framework.
- [NIST SP 800-53 Revision 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final) — control catalog used by many compliance programs.
- [OpenSCAP](https://www.open-scap.org/) — SCAP scanning, evaluation, and remediation tooling.
- [SELinux project](https://github.com/SELinuxProject/selinux) — source, tools, and policy documentation for SELinux.
- [AppArmor](https://apparmor.net/) — profile language and administration documentation.
- [OpenSSH](https://www.openssh.com/) — the reference implementation and release notes.
- [Linux audit documentation](https://github.com/linux-audit/audit-documentation) — auditd rules, fields, and event interpretation.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [Ubuntu virtual machine](https://ubuntu.com/download/server) | Self-hosted target | Free | Snapshot before every hardening change |
| [Rocky Linux virtual machine](https://rockylinux.org/) | Self-hosted target | Free | Use the security profile and test SELinux enforcing mode |
| [OverTheWire](https://overthewire.org/wargames/) | Wargames | Free | Platform-hosted targets only |
| [pwn.college](https://pwn.college/) | Systems challenges | Free | Authorized educational environment |
| [TryHackMe](https://tryhackme.com/) | Guided rooms | Freemium | Use only platform-provided machines |
| [Hack The Box Academy](https://academy.hackthebox.com/) | Guided modules | Freemium | Some modules free; platform targets only |

## Essential open-source tools

Tools support a methodology; they do not replace understanding. A high Lynis score on a host with an exposed, unpatched service is still a vulnerable host.

| Tool | Purpose | Official link |
| --- | --- | --- |
| Lynis | Host hardening audit with actionable suggestions | [cisofy.com/lynis](https://cisofy.com/lynis/) |
| OpenSCAP | SCAP compliance scanning and remediation | [open-scap.org](https://www.open-scap.org/) |
| AIDE | File integrity monitoring and baseline comparison | [aide.github.io](https://aide.github.io/) |
| auditd | Kernel-level auditing of security-relevant events | [linux-audit/audit-documentation](https://github.com/linux-audit/audit-documentation) |
| fail2ban | Log-driven temporary blocking for exposed services | [github.com/fail2ban/fail2ban](https://github.com/fail2ban/fail2ban) |
| osquery | SQL-based endpoint visibility across Linux and other platforms | [osquery.io](https://osquery.io/) |
| Trivy | Vulnerability, misconfiguration, and secret scanning for images and IaC | [github.com/aquasecurity/trivy](https://github.com/aquasecurity/trivy) |
| Grype | Vulnerability scanning for container images and filesystems | [github.com/anchore/grype](https://github.com/anchore/grype) |

## Practical projects and exercises

### Exercise 1: Harden a fresh server against a documented baseline

Objective: take a clean Ubuntu Server VM to a defensible baseline and measure the change.

Constraints: snapshot first; keep an SSH session and a console session open; do not lock out your own account.

Deliverable: a hardening report with the CIS or vendor profile used, a before/after Lynis or OpenSCAP result, a table of every changed setting with justification, exceptions with owners, and a rollback procedure. Include a section on what you chose not to change and why.

### Exercise 2: Detect tampering with auditd and AIDE

Objective: create an integrity baseline, then simulate unauthorized changes to a sensitive file and prove detection.

Constraints: use a test file or a copy of a configuration file; do not modify real authentication files on a host you need; revert changes afterward.

Deliverable: audit rules, AIDE baseline commands, alert evidence, a timeline of the simulated change, and a short detection note explaining false positives and how you would tune them. This demonstrates monitoring rather than only configuration.

### Exercise 3: Build a hardened container image

Objective: create a minimal container image for a small service and reduce its attack surface.

Constraints: run as non-root, read-only root filesystem where possible, drop all capabilities and add only the needed one, set a seccomp profile, and pin the base image by digest.

Deliverable: a Dockerfile with comments explaining each control, a Trivy or Grype scan before and after, a runtime test proving the service still works, and a short threat model describing what the container can still reach. Include a failure case you found and how you fixed it.

## Common mistakes and misconceptions

1. **Applying a hardening script without reading it.** Blind scripts break services and create a false sense of security. Review, test, and document.
2. **Disabling SELinux or AppArmor to fix an application.** This removes a major control. Fix labels or write a confined policy instead.
3. **Believing a strong SSH password is enough.** Prefer keys or certificates, disable password auth where possible, and restrict source networks.
4. **Giving broad sudo rights for convenience.** `ALL` and wildcards are common paths to root. Grant the minimum command set.
5. **Auditing files but not forwarding logs.** Local logs can be deleted by an attacker. Ship them off-host and monitor the pipeline.
6. **Treating containers as virtual machines.** Containers share the kernel; a privileged container is a host compromise waiting to happen.
7. **Running scanners once and declaring compliance.** Configuration drifts. Automate checks and review exceptions on a schedule.
8. **Forgetting patching of user-space dependencies.** Kernel updates matter, but so do web frameworks, language runtimes, and base images.
9. **Hardening production without a rollback plan.** A reboot or authentication change can cause an outage. Stage and verify first.

## Career paths and roles

Linux security skills support roles such as Linux systems administrator, site reliability engineer, cloud security engineer, security engineer, DevSecOps engineer, and compliance analyst. Specializations include container security, identity and access management, and detection engineering for cloud-native environments.

What employers value: evidence of operating systems in production, automation with Ansible, Terraform, or similar, and the ability to explain tradeoffs between security and availability. A documented hardening project, a tested incident runbook, or a secure CI pipeline is more convincing than a list of tools. Certifications can help, but hands-on evidence is stronger.

Entry routes include help desk or junior administration, then security-focused infrastructure work. Cloud platforms (AWS, Azure, GCP) are a natural extension; their identity and network controls build on the same least-privilege reasoning.

## Next steps

1. Build the two-VM lab and complete the baseline hardening exercise.
2. Write five auditd rules and validate them with benign activity.
3. Turn one container into a hardened image and scan it in CI.
4. Read the [intermediate training grounds](../../resources/training-grounds/intermediate.md) for harder labs.
5. Review the [ethics policy](../../ETHICS.md) and the repository [resources index](../../resources/) before expanding scope.

## References

1. CIS, [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks).
2. NIST, [SP 800-123: Guide to General Server Security](https://csrc.nist.gov/pubs/sp/800/123/final).
3. NIST, [SP 800-53 Revision 5](https://csrc.nist.gov/pubs/sp/800/53/r5/final).
4. OpenSCAP, [project documentation](https://www.open-scap.org/).
5. SELinux project, [source and tools](https://github.com/SELinuxProject/selinux).
6. AppArmor, [project documentation](https://apparmor.net/).
7. Linux Audit, [audit documentation](https://github.com/linux-audit/audit-documentation).
8. OpenSSH, [project documentation](https://www.openssh.com/).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
