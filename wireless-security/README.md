[Home](../README.md) / Wireless Security

# Wireless Security: Assessing and Defending Wi-Fi and Bluetooth

Last reviewed: 2026-10-31. This guide is part of the learn-hacking curriculum and reflects current Wi-Fi Alliance and IEEE guidance where possible.

Wireless security is the practice of protecting radio-based networks and the devices that use them. It combines radio frequency (RF) engineering, the IEEE 802.11 protocol family, authentication and cryptography, network architecture, and physical security. A wireless network has no wall: every frame you transmit can be received by anyone within range, so confidentiality and authentication must be designed rather than assumed.

This guide is for network engineers who inherited a Wi-Fi estate, security analysts who need to interpret wireless captures, and penetration testers moving into wireless assessments. It explains how Wi-Fi and Bluetooth security actually work, how to assess a network you are authorized to test, and how to harden access points and clients. It deliberately avoids step-by-step attack recipes against third-party networks. Wireless assessment is a discipline of observation, configuration review, and controlled validation, not a list of disruptive tricks.

> **Ethics and law.** Radio travels beyond property lines. Monitor only networks you own or have written authorization to assess, never transmit deauthentication or jamming frames at third parties, and handle captured frames as personal data. See [ETHICS.md](../ETHICS.md).

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Intermediate; the protocol and crypto concepts are approachable, but RF troubleshooting takes practice |
| Realistic time | 6–10 weeks at 6 hours per week for working knowledge; 3–6 months for independent assessments |
| Cost | Free software; a monitor-mode USB adapter costs roughly 30–100 USD and a disposable lab router helps |
| Prerequisites | TCP/IP, IP addressing and subnetting, basic cryptography, Linux command line, Wireshark familiarity |
| Lab requirement | An access point you control, an isolated client, and ideally a second machine for monitoring |
| Best first win | A passive survey and configuration review of your own home or lab WLAN, written up as a remediation plan |

## Why this field matters

Wi-Fi carries business traffic, guest access, point-of-sale terminals, building controls, cameras, and medical devices. A single misconfigured access point can bridge a guest network into a corporate VLAN, expose management interfaces, or accept outdated encryption. Enterprise networks add 802.1X, certificates, and roaming complexity, and a client that skips server certificate validation can be lured into trusting a rogue access point.

Bluetooth is just as relevant. Keyboards, headphones, locks, sensors, and medical peripherals pair with phones and laptops, and weak pairing or an exposed GATT characteristic can leak data or allow unauthorized control. The defensive skill is the same in both cases: understand the protocol, map the trust boundaries, verify the configuration, and monitor for anomalies. That skill is in demand in network engineering, operational technology (OT), healthcare, retail, and any organization with a large physical footprint.

## What you will learn

- How radio bands, channels, signal strength, and interference affect both performance and evidence.
- How 802.11 management, control, and data frames build and tear down a connection.
- How WPA2-PSK, WPA3-SAE, and 802.1X enterprise authentication differ in their trust assumptions.
- How to review a wireless configuration for weak encryption, exposed management, and segmentation gaps.
- How to perform a passive site survey and interpret captures in Wireshark without disrupting users.
- How Bluetooth Low Energy (BLE) pairing, bonding, and GATT services create risk.
- How to detect and respond to rogue access points and evil-twin attempts.
- How to harden access points, routers, and clients and write an assessment report with evidence.

## Prerequisites and honest expectations

You need a solid grasp of IPv4 addressing, subnetting, DHCP, DNS, and NAT. You should understand symmetric and asymmetric encryption at a conceptual level, including what a certificate proves and what a pre-shared key does not. Wireshark experience is important: if you have never followed a TCP stream or read a TLS handshake, start there before tackling 802.11 captures.

Wireless is humbling. Signal strength is not a security metric, captures are noisy, and vendor interfaces hide important details. You will spend time checking adapter chipsets, driver support, and regulatory domains. Monitor mode is not available on every card, and Windows support is limited compared with Linux. Plan to use a Linux virtual machine or a small dedicated laptop with a compatible USB adapter.

Most importantly, you cannot "test" a network you do not own. Wardriving-style discovery of other people's networks may be legal in some places for passive observation, but it is regulated or prohibited in others, and any interference is a serious matter. This guide keeps assessment work inside owned or explicitly authorized environments.

## Core concepts

### RF fundamentals for security work

Wi-Fi operates in the 2.4 GHz, 5 GHz, and 6 GHz bands. The 2.4 GHz band has only three non-overlapping channels in North America (1, 6, and 11), so co-channel and adjacent-channel interference are common. The 5 GHz band offers many more channels and is generally cleaner, while 6 GHz adds wide channels and is reserved for newer standards. Channel width trades throughput for spectrum: a 160 MHz channel consumes more airtime and is more sensitive to interference than a 20 MHz channel.

Signal strength is measured in dBm and is negative; values closer to zero are stronger. Roughly, -30 dBm is excellent, -67 dBm is usable for voice and video, and -80 dBm is marginal. Signal-to-noise ratio (SNR) matters more than raw strength because a strong signal in a noisy environment still produces retransmissions. Security work uses these numbers for coverage surveys, rogue AP detection, and explaining why a client roams to a distant access point. Antenna type and placement change coverage shape; a directional antenna can extend a link while reducing spill into neighboring buildings.

### 802.11 frames and the connection lifecycle

802.11 has three frame classes. Management frames include beacons, probe requests and responses, authentication, association, and deauthentication. Control frames coordinate access to the medium: request-to-send, clear-to-send, acknowledgments, and block acknowledgments. Data frames carry the actual payload. A client discovers a network through beacons and probe responses, authenticates, associates, and then derives keys before encrypted data can flow.

Management frames are visible to anyone in range, which is why SSIDs, client MAC addresses, and capabilities can be surveyed passively. The 802.11w amendment added management frame protection (PMF, also called MFP). PMF signs unicast management frames and can encrypt some of them, making forged deauthentication and disassociation frames much harder. WPA3 requires PMF; WPA2 networks should enable it where clients support it. Understanding the lifecycle is essential before interpreting a capture, because a deauthentication followed immediately by a new association is normal roaming in one context and an anomaly in another.

### WPA2-PSK and the four-way handshake

In WPA2-Personal, every client derives a pairwise master key (PMK) from the pre-shared key (PSK) and the SSID. The four-way handshake then derives fresh session keys. The access point sends a random value called ANonce, the client replies with its own SNonce and a message integrity check, the access point sends the group temporal key (GTK) encrypted under the pairwise transient key (PTK), and the client confirms installation. The PTK protects unicast traffic; the GTK protects broadcast and multicast traffic.

The important security property is that a party who captures a complete handshake can test passphrase guesses offline, without touching the network. That is a design consequence of using a human-chosen PSK, not a flaw in AES. The defense is a long, random passphrase, WPA3 where possible, and rotation when a device or passphrase is compromised. This guide does not provide capture-to-cracking workflows; the conceptual risk is enough to justify strong credentials and a migration plan.

### WPA3-SAE and Enhanced Open

WPA3-Personal replaces the PSK handshake with Simultaneous Authentication of Equals (SAE), based on the Dragonfly exchange. SAE provides forward secrecy and resists offline guessing: an attacker who records a handshake cannot test an unlimited number of passwords offline in the same way. It also requires PMF. WPA3-Enterprise adds a 192-bit security mode for environments that need stronger cryptography and management.

Transition mode lets WPA3 access points serve WPA2 clients, but it can weaken the guarantees for those clients and should be treated as a migration state, not an end state. Wi-Fi Enhanced Open (OWE) provides encryption on open networks without a shared password, which is a meaningful improvement over plaintext hotspots but does not authenticate the network. WPA3 is not magic: a weak password is still weak, a compromised client is still compromised, and a malicious access point can still impersonate an SSID if the client does not validate the network properly.

### Enterprise authentication with 802.1X

802.1X separates three roles: the supplicant (client), the authenticator (access point or switch), and the authentication server (usually RADIUS). The client and server negotiate an Extensible Authentication Protocol (EAP) method inside the 802.1X exchange. EAP-TLS uses certificates on both sides and is the strongest common choice because it provides mutual authentication. PEAP and EAP-TTLS create a TLS tunnel and then authenticate the user inside it, often with a password.

The classic enterprise failure is a client that does not validate the server certificate. If the supplicant accepts any certificate, a rogue access point can present its own and capture the inner credentials. Configure the client to trust a specific certificate authority and the expected server name, and test that misconfiguration fails closed. Other design details matter too: use a privacy-preserving outer identity, separate corporate and guest SSIDs, assign VLANs dynamically, and avoid MAC authentication bypass (MAB) as a primary control because MAC addresses are easy to spoof.

### Bluetooth and BLE security

Bluetooth Classic and Bluetooth Low Energy (BLE) serve different use cases. BLE devices advertise, connect, and expose a Generic Attribute Profile (GATT) hierarchy of services and characteristics. Pairing establishes keys; bonding stores them for later reconnections. LE Secure Connections uses stronger pairing than the legacy scheme, and numeric comparison or passkey entry provides man-in-the-middle resistance when the device has a display or keyboard. "Just Works" pairing has no user verification and should be treated as unauthenticated.

Common risks include devices left in discoverable or pairing mode, default PINs, unauthenticated GATT writes, sensitive data exposed in readable characteristics, and trackers that randomize addresses poorly. BLE address randomization reduces long-term tracking but is not a privacy guarantee. Defensive measures include firmware updates, disabling unused profiles, requiring pairing for sensitive characteristics, isolating IoT devices on a separate network, and monitoring for unexpected pairing or connection attempts. This guide does not cover offensive Bluetooth tooling; the goal is to recognize weak configurations and design them out.

### Rogue access points and evil twins

A rogue access point is any access point not under the organization's management. It may be an employee's travel router, a misconfigured device, or an attacker's evil twin that copies a legitimate SSID to harvest credentials or relay traffic. An evil twin is especially effective against open networks and captive portals, and against clients that do not validate 802.1X server certificates.

Defenses are architectural and operational. Use WPA3 or 802.1X with certificate validation, enable PMF, deploy wireless intrusion detection or prevention (WIDS/WIPS) if the budget allows, monitor the airspace around sensitive areas, and educate users about captive portals. Network access control (NAC) can limit what an unknown device reaches, and VLAN segmentation limits the blast radius. Detection is not just a tool purchase: it requires a baseline of legitimate access points and a process for investigating anomalies.

### Monitoring and capture in owned labs

Monitor mode lets a wireless adapter pass raw 802.11 frames to the operating system, including management and control frames that a normal connection would filter. Captures are usually stored as pcapng with radiotap headers that record channel, signal strength, and data rate. Channel hopping lets one adapter observe multiple channels, at the cost of missing frames on channels it is not currently visiting. For focused analysis, lock the channel and capture only what you need.

The Aircrack-ng suite is a well-known collection of wireless tools. `airmon-ng` helps manage monitor-mode interfaces, `airodump-ng` captures and displays nearby networks, and `airdecap-ng` can decrypt captures when you already hold the key. Wireshark is the analyzer of choice for frame-level inspection. Use these tools only on your own lab or an authorized engagement, and remember that capture files may contain personal data from bystanders. Minimize collection, encrypt storage, and delete captures when the engagement ends.

### Wireless assessment methodology

A professional wireless assessment starts before any radio is transmitted. Define scope: which SSIDs, buildings, channels, and time windows are in scope, and which actions are prohibited. Agree on rules of engagement that exclude denial-of-service testing, deauthentication, and interference unless explicitly authorized and supervised. Collect a baseline of access points and clients, then review configuration: encryption mode, PMF, Wi-Fi Protected Setup (WPS), management access, firmware, and segmentation.

Next, validate the design with passive observation and controlled client testing. Check whether guest clients can reach internal resources, whether client isolation works, whether management VLANs are separated, and whether rogue access points are visible. Test 802.1X with a lab client and a test certificate, and verify that a client with the wrong CA fails to connect. Document signal coverage and dead zones because they affect roaming and rogue AP placement. Finish with a report that ranks risks, explains evidence, and gives configuration-level fixes, then retest after remediation.

### Router and access point hardening

Start with firmware: apply vendor updates, replace end-of-support hardware, and enable automatic updates where the vendor supports them and you can monitor their effect. Change default administrative credentials, disable remote management from the internet, and restrict management to a dedicated VLAN or wired interface. Use WPA3-Personal or WPA2 with a long random passphrase, disable WPS, and turn off Universal Plug and Play (UPnP) unless a specific application requires it. Enable PMF and, for enterprise networks, 802.1X with EAP-TLS.

Segment the network. Put guests on a separate SSID and VLAN with client isolation and bandwidth limits. Put IoT and building systems on their own VLAN with restrictive firewall rules. Disable unused services such as Telnet, unneeded file sharing, and legacy protocols. Enable logging to a central collector, monitor for new access points, and keep an inventory of authorized hardware. A consumer router in a small office deserves the same discipline as an enterprise controller, just with fewer knobs.

## Legal and safe practice

Radio communication is regulated. In the United States, the Federal Communications Commission (FCC) governs unlicensed spectrum, and interfering with licensed or unlicensed communications can violate federal law. In the United Kingdom, Ofcom enforces similar rules. Unauthorized access to a network can violate computer misuse laws such as the U.S. Computer Fraud and Abuse Act or the UK Computer Misuse Act, and intercepting communications can violate wiretap and privacy statutes. These rules differ by country and by state; this guide is not legal advice, so consult qualified counsel for a real engagement.

Get written authorization that names the SSIDs, physical locations, date and time windows, test devices, and permitted techniques. Explicitly prohibit jamming, deauthentication, and denial-of-service testing unless the client has authorized a supervised, isolated test. Passive monitoring of third-party networks is still a privacy risk and may be unlawful; do not collect frames from networks outside scope, and filter captures to the authorized BSSIDs where possible.

Handle capture data as sensitive. PCAP files can contain unencrypted metadata, device names, and sometimes payloads. Store them encrypted, limit access, retain them only as long as the engagement requires, and redact MAC addresses and hostnames in reports when they are not essential. If you discover a vulnerability, report it through the agreed channel and do not publish details that could harm the client or its users.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Networking foundations (weeks 1–2) | IP, DHCP, DNS, VLANs | Build a small routed lab with a consumer router and two clients; capture a DHCP and DNS exchange | A network diagram and an annotated capture of a full client onboarding |
| 2. RF and 802.11 (weeks 3–4) | Frames, channels, signal | Perform a passive survey of your own home; identify channels, BSSIDs, and client behavior | A channel plan and a survey map with SNR measurements |
| 3. Crypto and authentication (weeks 5–6) | WPA2, WPA3, 802.1X | Read the four-way handshake and SAE descriptions; configure WPA3 on a lab AP and test client compatibility | A comparison table of modes and a working WPA3 client |
| 4. Enterprise lab (weeks 7–8) | RADIUS and EAP-TLS | Build hostapd plus FreeRADIUS with a private CA; connect a Linux and a mobile client | A working EAP-TLS setup and a failed-connection test with the wrong CA |
| 5. Monitoring and detection (weeks 9–10) | Captures and anomalies | Capture your own lab traffic, analyze it in Wireshark, and baseline legitimate access points | An anomaly report with frame-level evidence |
| 6. Assessment and reporting (weeks 11–12) | Methodology and communication | Run a full self-assessment of your lab WLAN and present findings to a peer | A report with risk ratings, fixes, and a retest plan |

Do not skip the networking stage. Most wireless troubleshooting is actually routing, DHCP, VLAN, or DNS troubleshooting, and an assessor who cannot explain why a client got the wrong address will misdiagnose a security issue.

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Networking Basics](https://www.netacad.com/courses/networking-basics) | Cisco Networking Academy | Beginner | Free | Yes, Packet Tracer labs | IP addressing, Ethernet, and wireless fundamentals |
| [Professor Messer Network+ training](https://www.professormesser.com/) | Professor Messer | Beginner | Free videos | No | A structured networking vocabulary and exam-oriented review |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark Foundation | Beginner–advanced | Free | Yes, sample captures | Capture, display filters, and protocol dissection |
| [Wi-Fi Alliance resources](https://www.wi-fi.org/) | Wi-Fi Alliance | Beginner | Free | No | How WPA3, Wi-Fi 6, and Wi-Fi 7 are specified and certified |
| [Aircrack-ng documentation](https://www.aircrack-ng.org/doku.php?id=documentation) | Aircrack-ng | Intermediate | Free | Yes, in owned labs | Monitor mode, capture handling, and suite internals |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; some rooms free | Yes | Guided networking and security fundamentals |

Formal wireless certifications such as CWNA and CWSP are respected but paid; they are optional, not prerequisites. The free material above plus a home lab covers more ground than most introductory courses because you can break and rebuild the network yourself.

## Official documentation and standards

| Source | Owner | Why it matters |
| --- | --- | --- |
| [IEEE 802.11 working group](https://www.ieee802.org/11/) | IEEE | The authoritative standards process for Wi-Fi amendments |
| [Wi-Fi Alliance](https://www.wi-fi.org/) | Wi-Fi Alliance | Certification programs and WPA3/OWE specification summaries |
| [Wireshark documentation](https://www.wireshark.org/docs/) | Wireshark Foundation | Frame dissection, capture filters, and analysis workflow |
| [Aircrack-ng documentation](https://www.aircrack-ng.org/doku.php?id=documentation) | Aircrack-ng | Tool behavior, monitor mode, and capture formats |
| [NIST SP 800-153](https://csrc.nist.gov/pubs/sp/800/153/final) | NIST | Guidelines for securing wireless local area networks |
| [Bluetooth technology overview](https://www.bluetooth.com/learn-about-bluetooth/) | Bluetooth SIG | Classic versus BLE, profiles, and security features |
| [hostapd documentation](https://w1.fi/hostapd/) | hostapd project | Building a software access point for enterprise labs |
| [FreeRADIUS documentation](https://freeradius.org/documentation/) | FreeRADIUS | RADIUS configuration and EAP testing |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What you practice | Safety note |
| --- | --- | --- | --- | --- |
| Home or office WLAN audit | Your own equipment | Free if you own the AP | Survey, configuration review, segmentation checks, and reporting | Only assess networks you own or are authorized to test |
| hostapd and FreeRADIUS lab | Open source | Free | 802.1X, EAP-TLS, certificate validation, and VLAN assignment | Keep the lab isolated; do not bridge it to production |
| mac80211_hwsim virtual wireless | Linux kernel | Free | Multi-node 802.11 experiments without physical radios | Advanced; expect driver and namespace troubleshooting |
| Wireshark sample captures | Wireshark Foundation | Free | Frame analysis and protocol comparison using public captures | Use synthetic or public captures, not bystander traffic |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium | Guided networking and security rooms | Stay inside the provided target environment |
| [Kismet](https://www.kismetwireless.net/) | Kismet | Free | Passive wireless detection and logging | Configure it to ignore networks outside your scope |

A virtual wireless lab is excellent for protocol study but cannot reproduce RF propagation, antenna behavior, or client driver quirks. Pair it with at least one physical access point you control. If you live in a dense apartment building, filter your captures to your own BSSIDs and avoid collecting neighbors' traffic.

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| Wireshark | Protocol analyzer for frame-level wireless and Bluetooth captures | [Wireshark](https://www.wireshark.org/) |
| Kismet | Passive wireless detector, sniffer, and logging platform | [Kismet](https://www.kismetwireless.net/) |
| Aircrack-ng | Suite for monitor mode, capture, and analysis in authorized labs | [Aircrack-ng](https://www.aircrack-ng.org/) |
| hcxtools | Converts and inspects wireless capture formats for analysis | [hcxtools](https://github.com/ZerBea/hcxtools) |
| hostapd | Software access point and 802.1X authenticator for lab builds | [hostapd](https://w1.fi/hostapd/) |
| FreeRADIUS | RADIUS server for enterprise authentication labs | [FreeRADIUS](https://www.freeradius.org/) |
| OpenWrt | Open router firmware for building a controllable lab AP | [OpenWrt](https://openwrt.org/) |
| Bettercap | Network reconnaissance and monitoring framework for authorized labs | [Bettercap](https://www.bettercap.org/) |

Tools are not a methodology. A capture without a baseline cannot tell you whether an access point is rogue, and a scanner without authorization is a legal problem. Learn the configuration review and the reporting process first; the tools then become evidence collectors rather than magic buttons.

## Practical projects and exercises

### Project 1: Home or lab WLAN security assessment

**Objective:** Assess a wireless network you own and produce a remediation plan that a non-technical household or small-business owner could follow.

**Setup and constraints:** Use your own access point, a client, and a passive survey. Do not capture traffic from neighboring networks; if your adapter sees them, filter them out of the analysis and redact them from the report. Do not run deauthentication, injection, or denial-of-service tests.

**Deliverable:** A report with a network diagram, a configuration checklist (encryption, PMF, WPS, admin access, firmware, guest network, UPnP), a passive survey summary, risk-ranked findings, and before/after screenshots after you apply fixes. This is portfolio-worthy because it demonstrates end-to-end assessment and remediation, not just scanning.

### Project 2: Enterprise 802.1X lab with EAP-TLS

**Objective:** Build a working WPA2/WPA3-Enterprise network with hostapd and FreeRADIUS, then prove that certificate validation matters.

**Setup and constraints:** Use a private certificate authority and test certificates only. Keep the lab on an isolated network with no route to production. Configure a Linux supplicant and a mobile test device. Do not use real corporate credentials or certificates.

**Deliverable:** A configuration walkthrough, a test matrix showing successful authentication with the correct CA and failure with an untrusted CA, a packet capture of the EAP exchange, and a short explanation of why PEAP without server validation is unsafe. Advanced learners can add dynamic VLAN assignment and test that a client lands in the correct VLAN.

### Project 3: Capture-based investigation

**Objective:** Reconstruct what happened on a wireless network from a capture, separating normal behavior from anomalies.

**Setup and constraints:** Use a public sample capture or a capture from your own lab. If you generate your own, perform only normal association, roaming, and DHCP traffic. Do not include third-party frames. Work from a copy of the capture and record its hash before analysis.

**Deliverable:** A timeline of association, authentication, and address assignment; a table of observed BSSIDs and clients with redacted identifiers; an assessment of at least three anomalies or noteworthy events; and a limitations section explaining what the capture cannot prove. This exercise trains the interpretation skill that separates a useful analyst from someone who only runs tools.

## Common mistakes and misconceptions

- **"Hidden SSIDs improve security."** Hiding a network name only makes casual discovery slightly harder; the SSID still appears in probe and association traffic. It creates operational problems and no meaningful protection.
- **"MAC filtering stops unauthorized clients."** MAC addresses are visible and easy to imitate. Use 802.1X or WPA3-SAE, not a list of hardware addresses.
- **"WPA3 is unhackable."** WPA3 raises the bar against offline guessing and requires PMF, but weak passwords, misconfigured transition mode, and compromised clients remain risks.
- **"WPA2-Enterprise is automatically secure."** If the client does not validate the RADIUS server certificate, an evil twin can harvest credentials. The supplicant configuration is part of the security boundary.
- **"More signal is always better."** Oversized coverage spills into parking lots and neighboring buildings. Tune power and antenna placement to the intended area.
- **"Deauthentication is a harmless test."** It disconnects users, can disrupt medical or safety systems, and may be illegal. Treat it as a denial-of-service technique requiring explicit supervised authorization.
- **"A scanner's alert means there is a rogue AP."** False positives are common in dense environments. Validate with a baseline, physical location, and switch-port correlation before escalating.

## Career paths and roles

Wireless network engineer: designs, deploys, and troubleshoots Wi-Fi estates, often with vendor controllers and survey tools. Entry comes from network operations or help desk, and the role values CWNA-level knowledge even if certification is optional.

Wireless security consultant: performs authorized assessments, rogue AP investigations, and architecture reviews. Consultancies and specialist firms hire experienced network engineers and penetration testers. Demonstrate a survey report, an 802.1X lab, and clear writing.

Network security engineer: owns firewalls, segmentation, NAC, and monitoring across wired and wireless networks. Wireless is one domain in a broader role; pair it with routing, switching, and identity skills.

IoT and OT security engineer: secures Bluetooth, Zigbee, and Wi-Fi devices in buildings, factories, and healthcare. The work blends wireless protocol knowledge with embedded systems and network segmentation.

Penetration tester with a wireless specialty: adds radio assessments to internal network tests. The best evidence is a supervised, authorized report that shows methodology and restraint, not a collection of capture files.

## Next steps

1. Build the hostapd and FreeRADIUS lab; enterprise authentication is the highest-value wireless skill for defenders.
2. Run a passive survey of your own home and write a one-page remediation plan with before/after evidence.
3. Study 802.11 frame captures in Wireshark until you can explain association, roaming, and encryption without notes.
4. Read the [network penetration testing guide](../network-penetration-testing/README.md) for the wired side of segmentation and NAC.
5. Record every lab in the [lab notes template](../templates/lab-notes.md), and use the [intermediate training grounds](../resources/training-grounds/intermediate.md) when you want a structured challenge.

## References

1. IEEE 802.11 working group, <https://www.ieee802.org/11/>.
2. Wi-Fi Alliance, <https://www.wi-fi.org/>.
3. Wireshark documentation, <https://www.wireshark.org/docs/>.
4. Aircrack-ng documentation, <https://www.aircrack-ng.org/doku.php?id=documentation>.
5. NIST SP 800-153, Guidelines for Securing Wireless Local Area Networks, <https://csrc.nist.gov/pubs/sp/800/153/final>.
6. Bluetooth SIG, Learn About Bluetooth, <https://www.bluetooth.com/learn-about-bluetooth/>.
7. hostapd project documentation, <https://w1.fi/hostapd/>.
8. FreeRADIUS documentation, <https://freeradius.org/documentation/>.
9. Kismet wireless, <https://www.kismetwireless.net/>.
10. OpenWrt project, <https://openwrt.org/>.

---

Continue with the [repository home](../README.md), the [foundations track](../foundations/README.md), the [resource library](../resources/README.md), or the [contribution guide](../CONTRIBUTING.md).
