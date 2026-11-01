# Home Lab Checklist: Isolation, Snapshots, Hardening, and Teardown

[Home](../README.md) / [Checklists](README.md) / Home lab

A home lab is where curiosity becomes skill, but only if it is isolated, recoverable, and legal. This checklist covers the decisions that keep a lab from becoming an accidental exposure: network separation, snapshots, host hardening, software licensing, and clean teardown.

> **Isolation is a safety control.** A lab with a bridged network adapter, default credentials, and an exposed service is not a lab; it is a vulnerable host on your network. Build the boundary first, then install the target.

**Lab name:** `[LAB-NAME]`
**Owner:** `[Name]`
**Host hardware:** `[CPU, RAM, storage]`
**Hypervisor / container runtime:** `[VirtualBox / VMware / Hyper-V / KVM / Docker]`

## 1. Purpose and scope

- [ ] The lab has a stated learning goal and a list of systems it will contain. — Owner: ___; Evidence: ___
- [ ] The target applications and their known risks are documented. — Owner: ___; Evidence: ___
- [ ] The lab is not used to attack public systems or third-party networks. — Owner: ___; Evidence: ___
- [ ] A rebuild path exists if the lab is compromised or corrupted. — Owner: ___; Evidence: ___
- [ ] The owner understands the legal boundaries of security testing. — Owner: ___; Evidence: ___

## 2. Isolation

- [ ] The lab uses a host-only, internal, or NAT network that is not bridged to the physical LAN. — Owner: ___; Evidence: ___
- [ ] The hypervisor's DHCP and DNS are under the owner's control. — Owner: ___; Evidence: ___
- [ ] The lab subnet is documented and does not overlap the home or corporate network. — Owner: ___; Evidence: ___
- [ ] The host firewall blocks inbound access to lab management interfaces. — Owner: ___; Evidence: ___
- [ ] Lab services bind to loopback or the lab interface, not `0.0.0.0` by habit. — Owner: ___; Evidence: ___
- [ ] Wireless, USB passthrough, and shared folders are disabled unless required. — Owner: ___; Evidence: ___
- [ ] The lab cannot reach production accounts, shared storage, or smart-home devices. — Owner: ___; Evidence: ___
- [ ] A network diagram shows the host, hypervisor, lab subnet, and external path. — Owner: ___; Evidence: ___

## 3. Snapshots and backups

- [ ] A clean snapshot exists before installing tools or vulnerable apps. — Owner: ___; Evidence: ___
- [ ] Snapshots are named with date and purpose. — Owner: ___; Evidence: ___
- [ ] A restore has been tested, not just created. — Owner: ___; Evidence: ___
- [ ] Important notes and evidence are stored outside the VM. — Owner: ___; Evidence: ___
- [ ] Snapshot storage usage is monitored. — Owner: ___; Evidence: ___
- [ ] A documented rebuild procedure exists for each VM. — Owner: ___; Evidence: ___

## 4. Host hardening

- [ ] The hypervisor and host OS are patched. — Owner: ___; Evidence: ___
- [ ] The host uses full-disk encryption. — Owner: ___; Evidence: ___
- [ ] The host account uses a strong password and screen lock. — Owner: ___; Evidence: ___
- [ ] Unused host services and USB devices are disabled. — Owner: ___; Evidence: ___
- [ ] Endpoint protection and logging are active on the host. — Owner: ___; Evidence: ___
- [ ] Lab VMs use non-default credentials and no shared passwords. — Owner: ___; Evidence: ___
- [ ] Guest additions or integration tools are installed from a trusted source. — Owner: ___; Evidence: ___
- [ ] Clipboard and drag-and-drop sharing are disabled for untrusted guests. — Owner: ___; Evidence: ___

## 5. Software and licensing

- [ ] Operating systems and tools are obtained from official sources. — Owner: ___; Evidence: ___
- [ ] Licenses permit lab use; trial and evaluation limits are recorded. — Owner: ___; Evidence: ___
- [ ] No pirated software, cracks, or unlicensed key generators are used. — Owner: ___; Evidence: ___
- [ ] Vulnerable applications are intentionally isolated and never internet-facing. — Owner: ___; Evidence: ___
- [ ] Container images are pulled from official registries and pinned. — Owner: ___; Evidence: ___
- [ ] Third-party data sets are synthetic or licensed for the lab. — Owner: ___; Evidence: ___
- [ ] Tool versions are recorded for reproducibility. — Owner: ___; Evidence: ___

## 6. Network services and access

- [ ] Lab DNS resolves only the names the lab needs. — Owner: ___; Evidence: ___
- [ ] DHCP leases are documented or statically assigned. — Owner: ___; Evidence: ___
- [ ] Remote access to the lab uses a VPN or host-only path with MFA where possible. — Owner: ___; Evidence: ___
- [ ] Default web panels and databases are bound to the lab network only. — Owner: ___; Evidence: ___
- [ ] Logs are collected somewhere the target cannot delete them. — Owner: ___; Evidence: ___
- [ ] The lab has no route to production cloud credentials or personal accounts. — Owner: ___; Evidence: ___

## 7. Teardown

- [ ] A teardown checklist exists and names the VMs, networks, volumes, and snapshots to remove. — Owner: ___; Evidence: ___
- [ ] Evidence and notes are exported and hashed before deletion. — Owner: ___; Evidence: ___
- [ ] The lab network is removed or disabled. — Owner: ___; Evidence: ___
- [ ] Port forwards and firewall exceptions are removed. — Owner: ___; Evidence: ___
- [ ] Cloud lab resources are destroyed and billing is checked. — Owner: ___; Evidence: ___
- [ ] Docker containers, volumes, and custom networks are removed. — Owner: ___; Evidence: ___
- [ ] Credentials created for the lab are revoked. — Owner: ___; Evidence: ___
- [ ] The host is checked for leftover services and open ports. — Owner: ___; Evidence: ___

## 8. Safety and stop conditions

Stop and fix the environment if:

- A lab VM is reachable from the physical LAN or the internet.
- A vulnerable app is bound to `0.0.0.0` on a bridged adapter.
- Real personal data or production credentials appear in the lab.
- A snapshot restore fails or the only copy of evidence is inside the VM.
- A tool or image comes from an untrusted source.
- The lab interferes with work, family, or emergency services on the network.

## References

- [VirtualBox documentation](https://www.virtualbox.org/) — virtual machine and network configuration.
- [Docker documentation](https://docs.docker.com/) — containers, networks, and volumes.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — deliberately vulnerable local target.
- [Kali documentation](https://www.kali.org/docs/) — common lab tooling reference.
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — host hardening baselines to adapt.

---

**Related:** [Checklist index](README.md) · [Linux drills](../exercises/linux-drills.md) · [Networking drills](../exercises/networking-drills.md) · [Lab notes template](../templates/lab-notes.md) · [Repository home](../README.md) · [Ethics](../ETHICS.md)

Last reviewed: 2026-10-31
