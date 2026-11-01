# Project 01 — Build a Safe Cybersecurity Home Lab

A home lab is not a pile of virtual machines. It is a small, documented network with a clear boundary, a reset button, and a rule about what never crosses that boundary. In this project you design that network, build three virtual machines, prove the isolation works, and write the runbook you will use for every later project. Expect to spend most of the time on design and verification rather than installation.

| Field | Value |
| --- | --- |
| Difficulty | Beginner–Intermediate |
| Estimated time | 6–10 hours across two or three sessions |
| Cost | $0 in software; you supply the hardware |
| Prerequisites | A computer you own with virtualization support, 16 GB RAM recommended, 80–120 GB free disk; comfort with a command line |
| Safety and scope | Self-owned hardware only; host-only network; no bridged adapters on vulnerable VMs; no real data |

`Last reviewed: 2026-10-31`

> **Safety and scope.** Everything you build here is deliberately weak and must stay unreachable from your home network and the internet. Use a host-only virtual network, never port-forward a vulnerable service, and treat any unexpected inbound connection as an incident in your own lab. If you cannot explain where a packet can travel, you are not finished designing.

## Objective

By the end of this project you will have:

- A written lab charter and scope note that defines what the lab is allowed to touch.
- A topology diagram and IP plan for an isolated `192.168.56.0/24` segment plus management access through NAT.
- Three working VMs: an Ubuntu workbench, a Kali attacker, and an Ubuntu Docker target hosting two intentionally vulnerable applications.
- A connectivity matrix you have tested in both directions, including a negative test proving your home LAN cannot reach the lab.
- A snapshot policy, a reset procedure, and a runbook short enough to follow at the start of every session.

## Why this project matters

Almost every hands-on security skill is learned by causing something to happen and observing it. That requires an environment where you can be wrong safely. Professionals call this "blast radius control": the ability to bound the consequences of a mistake before you make one. A segmented lab with snapshots teaches that instinct, and it is the first thing an experienced interviewer probes when you describe a home lab. "I ran nmap against a VM" is weak; "I designed a host-only segment, proved my LAN could not route to it, and reset the target from a clean snapshot in ninety seconds" is a design conversation.

The lab also protects other people. Most accidental home-lab incidents come from a bridged adapter, a port forward, or a vulnerable service bound to `0.0.0.0` on a laptop that later joins a café network. Building the boundary first makes those mistakes much harder.

## Required tools

| Tool | Purpose | Official link | Free status |
| --- | --- | --- | --- |
| Oracle VirtualBox | Type-2 hypervisor used for the examples | <https://www.virtualbox.org/> | Free and open source; Extension Pack is free for personal/educational use under its license |
| VMware Workstation Pro / Fusion | Alternative hypervisor if you prefer it | <https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion> | No-cost download for personal use with a Broadcom account; check current terms |
| Ubuntu Server | Workbench and Docker target | <https://ubuntu.com/download/server> | Free |
| Kali Linux | Attacker VM with preinstalled tooling | <https://www.kali.org/get-kali/> | Free |
| Docker Engine | Runs vulnerable web applications on the target | <https://docs.docker.com/engine/install/ubuntu/> | Free |
| OWASP Juice Shop | Modern deliberately vulnerable web app | <https://owasp.org/www-project-juice-shop/> | Free |
| DVWA | Classic PHP/MySQL vulnerable app for comparison | <https://dvwa.co.uk/> | Free |

Tools are not the deliverable. A lab with three hypervisors installed and no diagram or reset procedure is a hobby, not a lab.

## Setup

### Design the topology first

Use two virtual networks. The NAT network provides outbound internet for updates only. The host-only network carries all lab traffic and has no route to your physical LAN.

```text
                    ┌──────────────────────────────┐
                    │        Physical host         │
                    │  VirtualBox / VMware         │
                    └──────────────┬───────────────┘
                                   │
                 ┌─────────────────┴──────────────────┐
                 │                                    │
        NAT 10.0.2.0/24                    Host-only 192.168.56.0/24
        (outbound updates only)            (all lab traffic, no LAN route)
                 │                                    │
      ┌──────────┴──────────┐              ┌──────────┼──────────┐
      │                     │              │          │          │
  lab-ubuntu            lab-kali        lab-kali  lab-ubuntu  lab-target
  .56.20                .56.10          .56.10     .56.20      .56.30
  workbench             attacker        attacker   workbench   Docker apps
```

| VM | Role | RAM | vCPU | Disk | Host-only address |
| --- | --- | --- | --- | --- | --- |
| lab-ubuntu | Workbench, notes, scanning client | 4 GB | 2 | 40 GB | 192.168.56.20 |
| lab-kali | Attack and tooling VM | 4 GB | 2 | 40 GB | 192.168.56.10 |
| lab-target | Docker host for Juice Shop and DVWA | 4 GB | 2 | 30 GB | 192.168.56.30 |

If your host has 8 GB of RAM, run two VMs at a time and drop each to 2 GB. Do not overcommit memory; swapping inside a guest makes every later exercise feel broken.

### Check host capacity

Run these in PowerShell on Windows before installing anything.

```powershell
Get-CimInstance Win32_ComputerSystem | Select-Object TotalPhysicalMemory, NumberOfLogicalProcessors
Get-CimInstance Win32_Processor | Select-Object Name, VirtualizationFirmwareEnabled
Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}}
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All | Select-Object FeatureName, State
```

On Linux use `lscpu | grep -i virtualization`, `free -h`, and `df -h`. On macOS check `sysctl -n machdep.cpu.features` and free disk in System Settings.

### Install the hypervisor and create the host-only network

Install VirtualBox and the matching Extension Pack from the official download page, then create a host-only adapter. On Windows the default path is `C:\Program Files\Oracle\VirtualBox\VBoxManage.exe`.

```powershell
$vbox = "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe"
& $vbox list hostonlyifs
& $vbox hostonlyif create
& $vbox hostonlyif ipconfig "VirtualBox Host-Only Ethernet Adapter" --ip 192.168.56.1 --netmask 255.255.255.0
```

If the adapter already exists with a different range, either change it to `192.168.56.1/24` or update the IP plan to match. Consistency matters more than the specific range.

### Build the VMs

1. Create `lab-ubuntu` from the Ubuntu Server ISO with 4 GB RAM, 2 vCPUs, and a 40 GB dynamically allocated disk.
2. Attach two adapters: Adapter 1 NAT, Adapter 2 host-only. Set the host-only adapter's promiscuous mode to "Allow All" only if you plan to run the network sensor from project 03.
3. Install Ubuntu Server with OpenSSH enabled, then set a static address on the host-only interface using netplan:

```yaml
network:
  version: 2
  ethernets:
    enp0s8:
      addresses: [192.168.56.20/24]
```

Apply with `sudo netplan apply` and confirm using `ip -brief address`.

4. Import the prebuilt Kali VM from <https://www.kali.org/get-kali/>, set Adapter 1 to NAT and Adapter 2 to host-only, boot it, and change the default `kali` password immediately with `passwd`.
5. Create `lab-target` the same way as the workbench, then install Docker Engine using the official Ubuntu instructions.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
# Follow the official Docker apt repository steps, then:
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

Log out and back in for the group change, then start the vulnerable apps bound only to the host-only address:

```bash
docker run -d --name juice-shop -p 192.168.56.30:3000:3000 bkimminich/juice-shop
docker run -d --name dvwa -p 192.168.56.30:8080:80 vulnerables/web-dvwa
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

The `-p 192.168.56.30:...` prefix is deliberate. Publishing to `0.0.0.0` would expose the apps on the NAT interface as well.

## Step-by-step tasks

1. **Write the lab charter.** Create `lab-charter.md` with purpose, owner, allowed targets, prohibited actions, data rules, and a review date. Keep it under one page. This is the document that forces you to decide what "in scope" means before a tool asks you.

2. **Record the inventory.** Create `inventory.csv` with columns `hostname,role,os,host_only_ip,ram_gb,vcpu,disk_gb,snapshot_base,owner`. Fill it in as you build. You will use it in every later project.

3. **Build the workbench VM.** Install `git`, `curl`, `jq`, `nmap`, `net-tools`, `openssh-server`, and a text editor. Set the static IP and confirm outbound access with `curl -I https://ubuntu.com`. Checkpoint: `ssh` from your host to `192.168.56.20` works, and `ip route` shows the host-only subnet with no default route through it.

4. **Build the Kali VM.** Change the default password, set a static host-only address, update the package index, and take a snapshot named `baseline-updated`. Checkpoint: `ping 192.168.56.20` succeeds and `nmap -sn 192.168.56.0/24` finds both other VMs.

5. **Build the target and launch the apps.** Confirm with `sudo ss -tulpn` that ports 3000 and 8080 listen only on `192.168.56.30`, then browse to `http://192.168.56.30:3000` from Kali. Checkpoint: both applications load from Kali and from your physical host (which owns `192.168.56.1` on the host-only network), and neither loads from your phone.

6. **Test the connectivity matrix.** Run each check and record the actual result in `connectivity-matrix.md`.

| Source → destination | Method | Expected |
| --- | --- | --- |
| Kali → workbench (ICMP) | `ping -c 2 192.168.56.20` | Pass |
| Kali → target port 3000 | `curl -s -o /dev/null -w '%{http_code}' http://192.168.56.30:3000` | 200 |
| Kali → target port 8080 | `curl -s -o /dev/null -w '%{http_code}' http://192.168.56.30:8080` | 200 or 302 |
| Workbench → target port 22 | `nc -zv 192.168.56.30 22` | Refused |
| Target → internet | `curl -I https://ubuntu.com` via NAT | 200 |
| Physical host → target port 3000 | browser | Should succeed; the host owns the host-only gateway |
| Home LAN device → target | `ping` from another computer | Timeout |
| Home LAN device → host LAN IP, port 3000 | browser | Refused or timeout |

7. **Prove the boundary deliberately.** Temporarily add a NAT port-forward rule so the app is reachable through a second path on `127.0.0.1:3000`, show that the path exists, then delete the rule and show that it is gone. Record both outputs. This negative test is the most valuable evidence in the project because it demonstrates you understand where the boundary actually is. Keep the forward bound to `127.0.0.1`; never forward a vulnerable service to all host interfaces.

```powershell
& $vbox showvminfo "lab-target" | Select-String "natpf"
& $vbox controlvm "lab-target" natpf1 "juice-test,tcp,127.0.0.1,3000,,3000"
# Test, then remove it:
& $vbox controlvm "lab-target" natpf1 delete "juice-test"
```

8. **Define the snapshot policy.** Take `baseline-updated` after patches, `pre-change` before any project that modifies a VM, and `post-change` after it works. Never keep more than three snapshots per VM; snapshot chains grow and slow disks. Write the take, list, and restore commands into `snapshots.md`.

9. **Write the reset procedure.** Decide what "clean" means for the target: remove containers and volumes, rebuild from the base snapshot, or re-run a provisioning script. Test it. Time yourself. A reset you have not tested is a hope, not a procedure.

10. **Write the session runbook.** A one-page checklist: which VMs to start, in what order, which snapshot to restore, how to confirm isolation, where notes go, and how to shut down cleanly. Checkpoint: a friend can follow the runbook and reach the same starting state without asking you a question.

11. **Record resource usage.** Run `htop` and `df -h` inside each guest and note the host's free memory during a full lab session. Adjust RAM and swap before project 03, which adds a sensor.

## Expected results

- Three VMs running, with the workbench and target on `192.168.56.0/24` and all three able to reach the internet only through NAT.
- Juice Shop and DVWA reachable from Kali and unreachable from your phone or another LAN device.
- A connectivity matrix with real outputs, including one failed test that you can explain.
- A snapshot restore that returns the target to a known state in under two minutes.
- A runbook that another person can execute without your help.

## Deliverables

| Artifact | Format | What "good" looks like |
| --- | --- | --- |
| `lab-charter.md` | Markdown | Targets, prohibitions, data rules, review date; one page |
| `network-diagram.png` or `.md` | Diagram | Both networks, all three VMs, addresses, and the internet boundary |
| `inventory.csv` | CSV | Every VM with role, address, resources, and base snapshot |
| `connectivity-matrix.md` | Markdown table | Command, expected result, actual result, interpretation |
| `snapshots.md` | Markdown | Naming convention, take/list/restore commands, retention rule |
| `runbook.md` | Markdown | Start, verify, reset, shutdown, and note-taking steps |
| `lab-notes.md` | Markdown | Started from [the lab notes template](../templates/lab-notes.md) and filled in during the build |

## Skills gained

- Designing a segmented virtual network and explaining its trust boundaries.
- Creating and operating VMs on VirtualBox or VMware, including snapshots and rollback.
- Basic Linux administration: netplan, systemd services, package management, users and groups.
- Running containerized applications with explicit host binding.
- Writing operational documentation that another person can follow.
- Reasoning about blast radius before running a tool.

## Stretch improvements

1. Replace the host-only network with an OPNsense or pfSense VM acting as a router and firewall between segments, and write rules that permit only the traffic your matrix requires.
2. Provision the workbench with Ansible or cloud-init so a rebuild takes minutes and no manual steps.
3. Add a Windows evaluation VM and a domain controller in a second host-only segment for Active Directory exercises.
4. Install Proxmox VE on a spare machine and rebuild the same topology with VLANs.
5. Add a second target that runs an older, intentionally vulnerable service, then document how you would detect it from the network.
6. Write a `lab-reset.ps1` script that restores snapshots, restarts containers, and prints the connectivity test results.

## Troubleshooting

### Virtualization is unavailable or VMs run extremely slowly

VT-x/AMD-V is disabled in firmware, or Windows is holding virtualization through Hyper-V, WSL2, Memory Integrity, or Virtual Machine Platform. Enable virtualization in BIOS/UEFI, then check `Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All`. On Windows 11, turning off Memory Integrity may be required for VirtualBox. Reboot before retesting.

### The host-only adapter is missing or has the wrong subnet

VirtualBox recreates host-only adapters after upgrades and may assign a different name or range. Run `VBoxManage list hostonlyifs`, fix the address with `hostonlyif ipconfig`, and update netplan if the subnet changed. On VMware, check `vmnet1` in the Virtual Network Editor.

### A guest has no internet through NAT

Confirm Adapter 1 is NAT and enabled, then check `ip route` for a default route via `10.0.2.2`. If the guest has two default routes, remove the one on the host-only interface. Also confirm the guest's DNS resolver is reachable; `resolvectl status` or `cat /etc/resolv.conf` will show whether DNS is the actual failure.

### Docker containers start but the page does not load

Check `docker ps` for `Up` versus `Restarting`, then `docker logs juice-shop`. The most common causes are a port already in use, the app still starting (Juice Shop takes several seconds), or a firewall rule on the target blocking the host-only interface. Test locally with `curl http://127.0.0.1:3000` on the target before blaming the network.

### Snapshots consume all free disk space

Snapshots are delta disks that grow with every write; deleting files inside the guest does not shrink them. Keep two or three, remove old ones with `VBoxManage snapshot <vm> delete <name>`, and compact only after reading the documentation. Move the VM folder to a larger drive if the host disk is the constraint.

## Portfolio presentation

Publish a sanitized version of the architecture and the isolation evidence. The story is the design reasoning: why host-only instead of bridged, why the apps bind to a single address, what a snapshot buys you, and how you proved the LAN could not reach the lab. Include the connectivity matrix with the failed test included, because explaining a failure is more convincing than a wall of green checkmarks. Remove or replace any real hostnames, usernames, and hardware identifiers; private lab addresses such as `192.168.56.0/24` are fine to keep because they are not sensitive. Do not publish credentials, even lab ones, or screenshots showing your host's desktop, tabs, or notifications.

## References

1. Oracle VirtualBox user manual, including host-only networking and snapshots — <https://www.virtualbox.org/manual/>
2. Ubuntu Server documentation, netplan and OpenSSH — <https://documentation.ubuntu.com/server/>
3. Kali Linux documentation, including prebuilt VMs — <https://www.kali.org/docs/>
4. Docker Engine installation on Ubuntu — <https://docs.docker.com/engine/install/ubuntu/>
5. OWASP Juice Shop project — <https://owasp.org/www-project-juice-shop/>
6. RFC 1918, address allocation for private internets — <https://www.rfc-editor.org/rfc/rfc1918>

---

**Navigation:** [Practical projects index](README.md) · [Lab notes template](../templates/lab-notes.md) · [Ethics policy](../ETHICS.md) · [Contributing guide](../CONTRIBUTING.md)
