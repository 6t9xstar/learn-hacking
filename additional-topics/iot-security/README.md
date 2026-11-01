[Home](../../README.md) / [Additional topics](../README.md) / IoT Security

# IoT and Embedded Device Security

Internet of Things (IoT) devices are computers with sensors, radios, and unusually long lives. They run in homes, factories, hospitals, farms, and cities, often with minimal computing power, no screen, and no administrator nearby. That combination makes them hard to patch, hard to monitor, and attractive to attackers who want a foothold or a botnet.

This guide is for security practitioners, product engineers, and administrators who need to assess, harden, and monitor connected devices. It covers architecture, firmware, protocols, standards, and lab practice. It is deliberately defensive: every exercise uses devices you own, firmware you are allowed to analyze, and an isolated network.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Intermediate; embedded and network fundamentals are prerequisites |
| Realistic time | 3-6 months to build useful skills; firmware analysis depth takes longer |
| Cost | Free tools; hardware costs vary (a Raspberry Pi and ESP32 are inexpensive but not free) |
| Prerequisites | Linux, networking, basic electronics safety, C or Python reading ability |
| Lab requirement | Essential. An isolated VLAN, a Raspberry Pi, an ESP32, and a broker you control |

## Why this field matters

A compromised camera, router, or building controller can be used to pivot into a corporate network, join a botnet, or disrupt physical operations. Devices are often deployed with default credentials, outdated firmware, and flat network access, then forgotten for a decade. The 2016 Mirai botnet showed how quickly poorly secured devices can be assembled into disruptive infrastructure.

Defenders need to know what these devices expose, how they communicate, and where to place controls. Product teams need to build security into constraints: limited memory, intermittent connectivity, and update mechanisms that must survive field deployment. The regulatory landscape is also tightening, with baseline requirements for consumer devices in several regions.

## What you will learn

- The architecture of an IoT system and where trust boundaries sit.
- How device constraints shape security tradeoffs.
- How firmware is built, signed, updated, and analyzed.
- How MQTT, CoAP, BLE, Zigbee, and Matter are used, and where they fail.
- How identity and provisioning should work for fleets of devices.
- How the OWASP IoT Top 10, NIST IR 8259, and ETSI EN 303 645 frame requirements.
- How to segment, monitor, and harden an IoT network.
- How to assess firmware safely and report findings.

## Prerequisites and honest expectations

You should understand IP networking, DNS, DHCP, VLANs, and TLS basics. You should be comfortable on Linux and able to read C or Python. Some hardware familiarity helps: flashing a microcontroller, using a serial console, and understanding that a device can be damaged by the wrong voltage. If you have never used a soldering iron, you can still do firmware analysis and network monitoring.

Expect proprietary formats, undocumented protocols, and devices that resist inspection. Expect that "secure" consumer devices vary enormously. Also expect legal constraints around radio transmission and device modification; check local rules before transmitting on licensed bands.

## Core concepts

### 1. Architecture and trust boundaries

A typical IoT system has four layers: the device (sensors, actuators, firmware), the gateway or hub (local aggregation and protocol translation), the cloud service (storage, analytics, remote control), and the mobile or web app used by people. Each boundary is a trust boundary: device to gateway, gateway to cloud, app to cloud.

Map the data flow and the control flow. Which component can command an actuator? Where are credentials stored? What happens when the internet is unavailable? Many designs assume the cloud is always reachable, then fail in unsafe ways when it is not. Security review must cover offline behavior and recovery.

### 2. Constraints and their consequences

Embedded devices have limited CPU, memory, storage, and power. They may sleep for long periods, communicate over low-bandwidth links, and run for a decade without physical access. These constraints explain, but do not excuse, weak security: shared keys, disabled updates, no logging, and plaintext protocols.

Design for the constraints instead of ignoring them. Use hardware security features where available, keep firmware small, sign updates, and minimize the attack surface by disabling unused services. A device that cannot be patched needs a compensating control at the network layer, and that limitation should be documented.

### 3. Firmware and the boot chain

Firmware is the software that runs the device: bootloader, kernel, root filesystem, and applications. A secure boot chain verifies each stage against a trusted key, ideally anchored in hardware. Secure boot prevents unauthorized code from running, but only if the keys are protected and the update process verifies signatures before flashing.

Updates need confidentiality, integrity, authenticity, and rollback protection. A/B partitioning allows a failed update to roll back. The update server must authenticate devices too, or an attacker can serve malicious firmware. Check whether updates are signed, whether downgrades are allowed, and how the device behaves if the update is interrupted.

### 4. Firmware analysis workflow

Firmware analysis starts with acquisition: a vendor download, a flash dump from a device you own, or a provided sample. Verify the hash and record the source. Use `binwalk` or `unblob` to identify and extract filesystems and compressed archives. Mount filesystems read-only in a virtual machine.

Then inspect: operating system and version, init scripts, network services, hardcoded credentials and keys, certificate stores, update logic, and known vulnerable components. EMBA and FACT automate large parts of this workflow and produce reports. Ghidra helps with binaries when source is unavailable. Treat extracted binaries as untrusted; analyze in a VM or sandbox, not on your workstation.

### 5. MQTT, CoAP, and application protocols

MQTT is a publish/subscribe protocol widely used in IoT. A broker manages topics; clients publish and subscribe. Security depends on authentication, authorization per topic, TLS, and careful handling of retained messages and last-will messages. A broker that allows anonymous access or wildcard subscriptions exposes every device's data and control channel.

CoAP is a lightweight request/response protocol for constrained devices, often used with DTLS. HTTP APIs are common on gateways and cameras. Regardless of protocol, check authentication, authorization, replay protection, input validation, and whether commands are idempotent. Plaintext protocols on a flat network are an invitation to interception and injection.

### 6. Wireless protocols

BLE uses pairing and bonding; some pairing modes have no authentication, and "just works" pairing is vulnerable to man-in-the-middle attacks. Zigbee uses network keys and trust-center link keys; a leaked network key compromises the mesh. Thread and Matter add IP-based interoperability with certificate-based device identity and commissioning.

Wi-Fi devices depend on WPA2 or WPA3 and network segmentation. LoRaWAN has its own key hierarchy and replay concerns. Radio testing requires care: jamming, deauthentication, and unauthorized transmission can be illegal and can disrupt safety systems. Only test radios you own, in a shielded or isolated setting, within local regulations.

### 7. Identity and provisioning

Every device should have a unique identity and unique credentials, provisioned during manufacturing or onboarding. Shared default passwords are a systemic risk. Certificates should be issued per device, stored in a secure element or TPM where possible, and rotated or revoked when a device is retired or lost.

Onboarding is the hardest part: how does a new device join a network without exposing a universal secret? Use a commissioning process with proof of possession (a QR code, a physical button, or a temporary network), bind the device to the owner's account, and prevent one user from claiming another's device. Test the unhappy paths, including re-provisioning and resale.

### 8. Standards and the OWASP IoT Top 10

The OWASP IoT Top 10 lists common failure areas: weak passwords, insecure network services, insecure ecosystem interfaces, lack of secure update, insecure or outdated components, insufficient privacy protection, insecure data transfer and storage, lack of device management, insecure default settings, and lack of physical hardening.

NIST IR 8259 defines foundational cybersecurity activities for IoT devices and is accompanied by profiles for consumer and federal use. ETSI EN 303 645 sets baseline consumer IoT requirements, including no universal default passwords, vulnerability disclosure, update support, and secure communication. The IoT Security Foundation publishes best-practice guidelines. Map product requirements to one or more of these frameworks and document evidence.

### 9. Network segmentation and monitoring

Put IoT devices on a separate VLAN or network segment with restrictive firewall rules. Allow only the destinations they need, and block inbound connections from user networks. Separate guest, corporate, and operational technology networks. For industrial environments, follow Purdue-model segmentation and never bridge IT and OT without controls.

Monitor the segment. Zeek and Suricata can log flows, DNS, TLS metadata, and known-bad signatures. A baseline of normal destinations and protocols makes anomalies visible: a camera contacting an unknown server at 3 a.m., a device using DNS tunneling, or a sudden scan from a smart speaker. Keep logs long enough to investigate.

### 10. Hardening devices and gateways

Change default credentials, disable unused services and debug interfaces, and restrict management access to trusted networks. Enable automatic updates where appropriate and verify signatures. Lock the bootloader on production devices if it does not block legitimate recovery. Remove serial consoles or protect them physically.

On gateways, apply the same discipline as any Linux server: patch, minimize services, use a firewall, and monitor. A gateway is often a single point of compromise for every device behind it. Back up configuration and test recovery before deployment.

### 11. Cloud and mobile companion risks

The cloud API is often the weakest link. Check authentication, per-device authorization, rate limiting, and whether one account can access another's devices by changing an identifier. Mobile apps may store tokens insecurely, trust invalid certificates, or expose debug endpoints. Push notification systems and voice assistants add more paths to control.

Apply least privilege to cloud roles and rotate secrets. Log device commands and administrative actions. Treat firmware update signing keys and cloud service credentials as high-value secrets; a leak can compromise an entire fleet.

### 12. Incident response and lab safety

IoT incidents have availability and physical-safety dimensions. Isolating a device may disable a medical monitor, a lock, or a cooling system. Response plans must include manual fallbacks and coordination with facilities or clinical staff. Preserve evidence before power-cycling if the device is not safety-critical.

Build a lab with a Raspberry Pi, an ESP32, a managed switch or isolated VLAN, and a local MQTT broker such as Mosquitto. Use IoTGoat or vendor firmware you are allowed to analyze. Keep the lab off the internet, label it clearly, and never connect a device with default credentials to your home network.

## Legal and safe practice

Only analyze devices you own or have written permission to assess. Buying a device does not give you permission to attack the manufacturer's cloud service or other customers' devices. Do not test devices on a network you do not control, including neighbors' Wi-Fi, building systems, or public infrastructure.

Radio transmission is regulated. Do not jam, spoof, or transmit on frequencies without authorization. Even receiving some signals may be restricted in your jurisdiction. Use shielded enclosures or conducted testing where possible, and follow local spectrum rules.

Do not flash firmware onto a device you cannot recover. Verify power requirements and pinouts before connecting anything. Keep lithium batteries away from heat and damage. If a device is safety-critical (medical, automotive, industrial control), do not experiment on it; use a vendor-provided test unit and follow the organization's safety process.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations | Networking and embedded Linux | Learn VLANs, DHCP, DNS, TLS, and Linux on a Raspberry Pi | A working segmented lab with a diagram |
| 2. Protocols | MQTT and CoAP | Run a local broker, publish and subscribe, enable TLS and ACLs | A packet capture analysis and a broker hardening note |
| 3. Firmware | Extraction and inspection | Extract IoTGoat firmware with binwalk and EMBA | A firmware findings report with hashes |
| 4. Standards | Requirements mapping | Map a device to OWASP IoT Top 10 and ETSI EN 303 645 | A gap assessment with evidence |
| 5. Monitoring | Network detection | Baseline traffic and write two Zeek or Suricata detections | A detection note with before/after traffic |
| 6. Assessment | End-to-end review | Assess a device you own and write a responsible report | A sanitized report with risk ratings and fixes |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [OWASP Internet of Things project](https://owasp.org/www-project-internet-of-things/) | OWASP | Beginner to intermediate | Free | No | The IoT Top 10 and supporting guidance |
| [IoT Security Foundation best-practice guidelines](https://www.iotsecurityfoundation.org/best-practice-guidelines/) | IoT Security Foundation | Intermediate | Free | No | Practical product-security guidance across the lifecycle |
| [NIST Cybersecurity for IoT Program](https://www.nist.gov/itl/applied-cybersecurity/nist-cybersecurity-iot-program) | NIST | Intermediate | Free | No | Foundational device activities and federal profiles |
| [ENISA](https://www.enisa.europa.eu/) | EU Agency for Cybersecurity | Intermediate | Free | No | Baseline recommendations and threat landscape reports |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; some rooms free | Yes | Introductory IoT and network rooms |
| [OWASP Firmware Security Testing Methodology](https://github.com/scriptingxss/owasp-fstm) | OWASP | Intermediate | Free | Yes, with samples | A structured firmware assessment methodology |

## Official documentation and standards

- [NIST IR 8259: Foundational Cybersecurity Activities for IoT Device Manufacturers](https://csrc.nist.gov/pubs/ir/8259/final) — the baseline device security activities.
- [NIST IR 8259A: IoT Device Cybersecurity Capability Core Baseline](https://csrc.nist.gov/pubs/ir/8259/a/final) — the capability baseline for devices.
- [NIST IR 8259B: IoT Non-Technical Supporting Capability Core Baseline](https://csrc.nist.gov/pubs/ir/8259/b/final) — supporting capabilities such as documentation and update policy.
- [ETSI EN 303 645](https://www.etsi.org/technologies/consumer-iot-security) — baseline requirements for consumer IoT security.
- [OWASP Internet of Things project](https://owasp.org/www-project-internet-of-things/) — the IoT Top 10 and testing resources.
- [MQTT 5.0 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html) — protocol behavior, including security-relevant options.
- [RFC 7252: CoAP](https://www.rfc-editor.org/rfc/rfc7252) — the constrained application protocol specification.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [IoTGoat](https://github.com/OWASP/IoTGoat) | Deliberately vulnerable firmware | Free | Flash only to a device you own; isolate it |
| [Raspberry Pi](https://www.raspberrypi.com/) | Lab gateway and broker | Hardware cost | Keep on an isolated VLAN; change default credentials |
| [ESP32](https://www.espressif.com/en/products/socs/esp32) | Microcontroller for sensor and BLE labs | Hardware cost | Use your own code and a separate access point |
| [OWASP FSTM](https://github.com/scriptingxss/owasp-fstm) | Firmware testing methodology | Free | Analyze samples in a VM, never on a production host |
| [TryHackMe](https://tryhackme.com/) | Guided rooms | Freemium | Platform targets only |
| Isolated VLAN | Network monitoring practice | Free with managed switch | No route to production or the public internet |

## Essential open-source tools

Tools do not replace a threat model. A device with a clean scanner report can still have an unauthenticated debug port and a shared cloud key.

| Tool | Purpose | Official link |
| --- | --- | --- |
| binwalk | Firmware extraction and signature analysis | [github.com/ReFirmLabs/binwalk](https://github.com/ReFirmLabs/binwalk) |
| EMBA | Automated firmware security analysis and reporting | [github.com/e-m-b-a/emba](https://github.com/e-m-b-a/emba) |
| FACT | Firmware analysis and comparison framework | [github.com/fkie-cad/FACT_core](https://github.com/fkie-cad/FACT_core) |
| unblob | Robust extraction of firmware and archive formats | [github.com/onekey-sec/unblob](https://github.com/onekey-sec/unblob) |
| Ghidra | Reverse engineering and binary analysis | [ghidra-sre.org](https://ghidra-sre.org/) |
| Wireshark | Protocol capture and analysis, including MQTT and BLE | [wireshark.org](https://www.wireshark.org/) |
| Zeek | Network security monitoring with structured logs | [zeek.org](https://www.zeek.org/) |
| Nmap | Network service discovery on authorized segments | [nmap.org](https://nmap.org/) |

## Practical projects and exercises

### Exercise 1: Firmware teardown report

Objective: analyze IoTGoat firmware or a vendor image you are permitted to inspect.

Constraints: download from an official source or dump your own device; verify the hash; extract in a virtual machine; do not run unknown binaries on your host.

Deliverable: a report with firmware hash, extraction steps, filesystem layout, init and startup behavior, exposed services, hardcoded secrets or keys (redacted), outdated components, update mechanism, and a risk table. Include the exact commands and tool versions so another analyst can reproduce the work.

### Exercise 2: Segmented IoT lab with broker hardening

Objective: build an isolated network with a Raspberry Pi gateway, an ESP32 sensor, and a local MQTT broker.

Constraints: no internet route for devices; use per-device credentials; enable TLS; define topic ACLs; capture traffic on the segment.

Deliverable: a network diagram, broker configuration, device code, TLS certificate setup, ACL matrix, packet capture showing a rejected unauthorized publish, and a short analysis of what an attacker on the same VLAN could still do. This is a strong portfolio piece for IoT or network security roles.

### Exercise 3: Standards gap assessment

Objective: assess a consumer device you own against OWASP IoT Top 10 and ETSI EN 303 645, and propose a remediation plan.

Constraints: do not disassemble a device under warranty or a safety-critical device; use public documentation and non-invasive observation only.

Deliverable: a mapping table from requirement to evidence to status, a risk rating for each gap, compensating controls, and a prioritized roadmap. Include a privacy section covering data collection and retention by the companion app and cloud.

## Common mistakes and misconceptions

1. **Leaving default credentials.** It remains the most common IoT weakness. Force a unique credential at onboarding and verify it.
2. **Putting devices on a flat network.** A compromised camera should not be able to reach file servers or管理工作站. Segment and restrict.
3. **Trusting the cloud to be secure by default.** Per-device authorization and API testing are essential; account takeover can expose every device.
4. **Ignoring update signing.** An unsigned update path is a remote code execution channel. Verify signatures and rollback protection.
5. **Treating BLE pairing as authentication.** Some pairing modes provide no protection against a man in the middle.
6. **Testing random devices in the wild.** You need authorization, and radio testing can be illegal and unsafe.
7. **Forgetting physical interfaces.** UART, JTAG, and debug consoles often bypass every network control.
8. **Assuming the vendor will patch.** Many devices never receive updates. Plan compensating controls and a replacement cycle.
9. **Discarding devices without wiping them.** Resale or recycling can leak credentials and data.

## Career paths and roles

Roles include IoT security engineer, embedded security engineer, product security engineer, firmware analyst, OT security engineer, and security consultant specializing in connected devices. Adjacent paths include network security, hardware security, and cloud security for device platforms.

What employers value: the ability to read firmware and network traffic, knowledge of standards, and evidence of safe lab practice. A firmware teardown report, a hardened device design, or a standards gap assessment is compelling. Certifications are optional; practical artifacts and careful write-ups matter more.

Be realistic: pure IoT roles are fewer than general security roles, and many are product-security roles inside manufacturers. Field experience with embedded Linux, C, and radio systems is a strong differentiator.

## Next steps

1. Build the segmented lab and complete the broker hardening exercise.
2. Extract and analyze one firmware image, then write the teardown report.
3. Map a device you own to ETSI EN 303 645 and fix or document the top gap.
4. Read the [hardware security guide](../hardware-security/README.md) for physical and side-channel topics.
5. Review the [ethics policy](../../ETHICS.md) and [intermediate training grounds](../../resources/training-grounds/intermediate.md) before expanding the lab.

## References

1. NIST, [IR 8259: Foundational Cybersecurity Activities for IoT Device Manufacturers](https://csrc.nist.gov/pubs/ir/8259/final).
2. NIST, [IR 8259A: IoT Device Cybersecurity Capability Core Baseline](https://csrc.nist.gov/pubs/ir/8259/a/final).
3. NIST, [IR 8259B: Non-Technical Supporting Capability Core Baseline](https://csrc.nist.gov/pubs/ir/8259/b/final).
4. ETSI, [consumer IoT security standards](https://www.etsi.org/technologies/consumer-iot-security).
5. OWASP, [Internet of Things project](https://owasp.org/www-project-internet-of-things/).
6. OASIS, [MQTT 5.0 specification](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html).
7. IETF, [RFC 7252: CoAP](https://www.rfc-editor.org/rfc/rfc7252).
8. IoT Security Foundation, [best-practice guidelines](https://www.iotsecurityfoundation.org/best-practice-guidelines/).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
