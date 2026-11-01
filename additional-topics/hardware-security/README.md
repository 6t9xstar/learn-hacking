[Repository home](../../README.md) / Additional topics / Hardware security

# Hardware Security

Hardware security is the study of how physical devices — routers, phones, laptops, cars, medical implants, industrial controllers — protect (or fail to protect) the code and secrets inside them. It combines electronics, embedded systems, firmware analysis, and cryptography with the adversarial mindset of penetration testing. This guide is for learners who already understand operating systems and programming and want to move below the OS: onto debug ports, flash chips, and radio links.

The field rewards patience more than expensive equipment. A used router, an inexpensive USB-to-serial adapter, and a careful notebook will teach you more in a month than a shelf of unused probes. What you cannot shortcut is lab discipline: hardware failures are often silent, and a mistake can destroy the device you are studying.

This guide is deliberately ordered like an assessment rather than a catalog of attacks. You will learn to look at a board and reason about what is exposed, then choose the least invasive technique that answers the question. That habit — evidence first, escalation second — is what separates a hardware security professional from someone who owns a lot of adapters.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Intermediate to advanced; electronics and C help enormously |
| Realistic time | 150–250 focused hours to reach competent hobbyist level |
| Cost | $0 to start with emulated firmware; roughly $60–200 for a basic bench (adapter, probes, multimeter, retired hardware) |
| Prerequisites | Linux command line, C, basic digital logic, comfort reading datasheets |
| Lab requirement | Devices you own, an ESD-safe workspace, no mains-voltage work |
| Best for | Embedded engineers, IoT testers, red teamers, firmware analysts |

## Why this field matters

Every network eventually ends at a device someone can physically touch. A router with an open UART console, a camera that boots unsigned firmware from SPI flash, or a door controller whose debug port is protected only by a sticker is a network compromise waiting for a visitor with a screwdriver. Regulators and customers increasingly ask for evidence that a product resists exactly this: signed firmware, disabled or authenticated debug, protected key storage, and a documented update path.

Defensively, hardware skills make you useful in ways software-only analysts are not. You can verify whether a vendor's secure-boot claim is real, determine whether a breach came from a firmware implant, assess a supply-chain sample before it enters a build environment, and tell a product team which of their assumptions collapse when the attacker has the board in hand. Offensively, the same skills support authorized device assessments and physical red-team engagements.

## What you will learn

- Build a threat model for a device that includes a physical adversary, not just a network one.
- Identify and use UART, JTAG, and SWD interfaces safely, and explain how vendors lock them down.
- Read SPI and I2C buses with a logic analyzer and extract flash contents.
- Analyze firmware images for filesystems, credentials, update logic, and boot-chain weaknesses.
- Explain secure boot, measured boot, TPM sealing, and HSM key custody at a design-review level.
- Describe side-channel and fault-injection attacks conceptually and the countermeasures that matter.
- Perform basic RF/SDR reception and understand the legal limits of transmitting.
- Produce a professional hardware assessment report with reproducible evidence.

## Prerequisites and honest expectations

You should be comfortable on a Linux shell, able to read C and a little assembly, and able to follow a schematic. You do not need to be an electrical engineer, but you must understand voltage, ground, and current well enough not to short a rail. Soldering skills are useful; most beginner work needs only a header pin or a test clip.

Expect a slow start. The first teardown will take hours of photographing, identifying chips, and hunting test pads. Many devices are locked down, and "no finding" is a normal result. You will also need to buy or borrow some hardware; you can begin with a free firmware emulator and a single retired router. Side-channel work in particular is a hardware-dependent specialty, not a prerequisite for the rest of the field.

## Core concepts

### Threat modeling hardware

A hardware threat model starts with what the device holds: firmware, device identity keys, cloud credentials, user data, and the integrity of its measurements. Then it maps who can reach what: casual user, thief, repair technician, malicious factory worker, or a compromised supplier. Physical access changes the calculus because many attacks are offline and undetectable: reading a flash chip leaves no log entry. Useful lenses include STRIDE for software components and an attacker-capability scale for physical access (minutes with a screwdriver versus an hour with a hot-air station and an oscilloscope).

Write the model as a data-flow diagram with trust boundaries drawn at the enclosure, the debug header, the boot ROM, and the network. Every boundary is a place to ask: what authenticates the other side, what is encrypted, and what happens when the check fails?

### Debug interfaces: UART, JTAG, and SWD

UART is a two-wire asynchronous serial link (TX, RX, plus ground) that commonly exposes a bootloader console or Linux shell at 115200 or 9600 baud. Finding it is often as simple as locating four pads near the SoC, measuring 3.3 V, and watching traffic at boot with a logic analyzer. JTAG is a synchronous debug bus (TCK, TMS, TDI, TDO, optional TRST) that can halt the CPU, read memory, and reprogram flash. SWD is Arm's two-wire variant (SWDIO, SWCLK) common on microcontrollers.

The security question is not "can I connect?" but "what does the vendor allow?" Production devices may blow eFuses to disable JTAG, enable readout protection, require authenticated debug, or simply omit the header. When debug is open, the finding is not the port itself but the capability behind it: an unauthenticated root shell, readable keys, or writable boot media.

### SPI and I2C buses

SPI is a fast four-wire bus (SCLK, MOSI, MISO, chip select) used by flash chips, displays, and sensors. Firmware usually lives on a serial NOR flash chip in an eight-pin package; with a SOIC-8 clip and a programmer such as flashrom you can often dump it in circuit. I2C is a slower two-wire bus (SDA, SCL) with addressed devices, commonly used for EEPROMs, sensors, and power controllers. Both buses are easy to observe with a logic analyzer and decode in software such as sigrok PulseView.

In-circuit reading has traps. Other devices on the bus may drive lines, the SoC may contend for the flash, and powering the flash while the rest of the board is unpowered can back-power the board through protection diodes. The safer sequence is to identify the part, check its voltage, read the datasheet, and prefer desoldering or a proper clip with the board held in reset when in doubt.

### Firmware extraction and analysis

Firmware arrives by several routes: a vendor update file, an in-circuit flash dump, a bootloader console, or a debug probe. Analysis begins with `binwalk` or `unblob` to locate compressed sections and filesystems, entropy plots to spot encrypted or compressed regions, and `strings` for URLs, keys, and debug messages. Extracting a SquashFS or JFFS2 image then lets you read init scripts, web server code, hardcoded credentials, and update verification logic.

The highest-value questions are architectural. Does the updater verify a signature before writing? Is the signing key checked against a fused hash, or is any well-formed image accepted? Are credentials unique per device or shared across a product line? Does the bootloader expose a recovery console that bypasses verification? Document each answer with the exact file and offset so another analyst can reproduce it.

### Secure boot and the chain of trust

Secure boot is a chain of signature checks: an immutable boot ROM verifies the first-stage bootloader, which verifies the next stage, down to the kernel or application. The root of trust is usually a public-key hash stored in one-time-programmable fuses or ROM. If any link accepts unsigned code, the chain is only as strong as its weakest link.

Two related ideas are often confused. Verified boot checks signatures before execution and refuses bad images. Measured boot records hashes of each stage in TPM PCRs and lets a remote party decide whether the resulting state is trusted. Good designs combine both, add anti-rollback counters so an attacker cannot downgrade to a vulnerable signed image, and keep recovery modes from becoming an unsigned-code path.

### TPMs and measured boot

A Trusted Platform Module is a dedicated security chip (or firmware implementation) that stores keys, performs cryptographic operations, and holds Platform Configuration Registers. PCRs cannot be written arbitrarily; they are extended with a hash chain, so their final values summarize what code ran. A disk-encryption key can be sealed to specific PCR values, and remote attestation can prove a boot state to a server.

TPMs are not magic. A discrete TPM communicates over a bus that may be observable, firmware TPMs depend on the CPU's secure environment, and sealing only helps if the PCR policy actually measures the code you care about. Understand the difference between "the TPM is present" and "the platform's boot policy uses it correctly."

### HSMs and key custody

A Hardware Security Module is a hardened appliance or service that generates and uses keys without exposing them to the host. Applications talk to it through interfaces such as PKCS#11, and validation programs such as FIPS 140-3 give buyers evidence about the module's security claims. HSMs matter when the threat includes a compromised server: if the key can be exported, the HSM adds little.

For product design, ask where the device identity private key lives. On a general-purpose SoC with readable flash, it is extractable; in a secure element or HSM-backed keystore with usage restrictions, it is substantially harder. The architecture decision is about cost, attestation, and lifecycle (provisioning, rotation, revocation), not just the chip part number.

### Side channels and fault injection, conceptually

Side-channel attacks infer secrets from physical leakage: execution time, power consumption, electromagnetic emissions, or cache behavior. Simple power analysis looks at a single trace; differential or correlation power analysis statistically correlates many traces with guessed key bytes. Countermeasures include masking (randomizing intermediate values), hiding (constant-time code, noise), and limiting the number of usable traces.

Fault injection deliberately disturbs execution — a voltage glitch, clock glitch, electromagnetic pulse, or laser — to skip an instruction or corrupt a check. A single skipped comparison can turn a signature failure into a success. Defenses include redundancy, glitch detectors, randomized timing, and post-check verification. Tools such as ChipWhisperer make these experiments accessible on your own hardware; they are not a first project, and they require careful setup to avoid damaging equipment.

### Physical tamper resistance and supply chain

Physical security is a spectrum. A plastic case and a warranty sticker stop curiosity, not determination. Better designs use potting, shields, tamper switches, mesh layers, and zeroization of keys when the enclosure is opened. The threat model should state which attacker you are defending against, because a determined lab adversary with unlimited time is very hard to stop.

Supply chain is the other physical dimension. Counterfeit components, substituted flash chips, and firmware modified before delivery can undermine every software control. NIST SP 800-193 describes platform firmware resiliency through protection, detection, and recovery; NIST SP 800-218 frames secure development practices; provenance and signed artifacts help you prove what you received. Ask vendors for component provenance, firmware signing details, and a documented recovery path.

### RF and SDR basics

Software-defined radio turns sampled radio signals into digital data you can process on a computer. An SDR captures in-phase and quadrature (IQ) samples; a tuner selects a center frequency and sample rate, and software demodulates. Common device radios include sub-GHz links at 315, 433, 868, and 915 MHz, 2.4 GHz Bluetooth Low Energy, Zigbee, and Wi-Fi.

Start by receiving only. Replay attacks against fixed-code remotes are a classic weakness, but transmitting on frequencies you do not own can be illegal and can disrupt nearby systems. Use a shielded enclosure or dummy load for transmit experiments, check local regulations, and never test against devices or infrastructure you do not own. Great Scott Gadgets' HackRF documentation and SDR course are good starting points.

### Bench instrumentation and lab safety

A basic bench includes a multimeter, a current-limited bench supply or USB power meter, a logic analyzer, a USB-to-UART adapter, jumper wires, probes, and a way to hold boards still. An oscilloscope is useful but not required at the start. Label everything, photograph the board before and after probing, and keep a lab notebook with voltage measurements and pin mappings.

Safety is non-negotiable. Work on unplugged, low-voltage devices; never open mains-powered equipment; use an ESD strap and mat; avoid lithium battery puncture; keep soldering fumes away from your face; and use a current limit so a reversed connection does not become a fire. If a device uses a large capacitor or a battery, discharge or disconnect it according to the service manual before probing.

### The hardware assessment workflow

A repeatable workflow keeps you from jumping straight to the flash chip because it is the part you recognize.

1. **Reconnaissance.** Identify the product, FCC/regulatory filings, publicly available firmware, teardown photos, and known vulnerabilities. Read the manual for recovery and update procedures.
2. **External inspection.** Photograph the enclosure and ports, then open it carefully. Note shields, potting, tamper switches, battery holders, and unpopulated headers.
3. **Interface discovery.** Map test pads, measure voltages, and capture boot traffic. Identify UART, JTAG, SWD, SPI, and I2C candidates before connecting anything.
4. **Access and extraction.** Prefer the least invasive route: vendor update, then UART console, then in-circuit flash read, then desoldering. Record every connection you make.
5. **Analysis and validation.** Analyze offline, form a hypothesis about a weakness, and prove it with a repeatable test. Distinguish what you observed from what you inferred.
6. **Reporting and disclosure.** Write the finding, its impact, and the fix. If the device is not yours, follow coordinated disclosure and redact sensitive data.

The workflow is iterative. A boot log often reveals a filesystem name that changes your extraction plan, and a flash dump often explains why the UART console was disabled.

### Choosing a first target device

Not every device is a good teacher. Look for a target that is cheap or already broken, documented online, low voltage, and non-critical. A retired home router is ideal: it has flash, UART pads, a Linux firmware image, and no safety-critical function. Avoid laptops, phones, and anything with a lithium battery for your first attempt; they add complexity and risk without teaching the fundamentals faster.

Check the regulatory label and search for the model plus "teardown" and "firmware" before you start. If the vendor publishes firmware updates, you can practice analysis without opening the case at all, which is the safest possible beginning.

## Legal and safe practice

> Work only on devices you own or have explicit written permission to assess. "I bought it" does not grant permission to attack the vendor's cloud services or other customers.

Hardware assessment often touches data that is not yours: neighboring Wi-Fi networks, a vendor's update servers, or personal files on a second-hand device. Keep the scope to the device in front of you, use a Faraday bag or shielded box for radios, and never connect a test device to a production network. If you find a vulnerability in a vendor product, follow coordinated disclosure: contact the vendor privately, give them time to fix it, and avoid publishing exploit details or customer data. Redact serial numbers, keys, and personal information from screenshots. For repository-wide expectations, read [ETHICS.md](../../ETHICS.md).

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Electronics and embedded basics | Voltage, ground, buses, reading schematics, blinking an LED on a microcontroller | A working microcontroller project and a labeled schematic |
| 2. Identify interfaces | UART, JTAG, SWD pinouts; logic analyzer capture; baud detection | A logic capture with decoded UART boot log |
| 3. Extract and inspect firmware | Flash dump, binwalk, filesystem extraction, strings triage | Firmware analysis note with file offsets and findings |
| 4. Analyze the boot chain | Secure boot, update verification, debug locks, TPM concepts | A threat model and control assessment for one device |
| 5. Specialize | Side channels, RF, automotive, medical, or industrial | A reproducible lab report or conference-style write-up |

Each stage should produce an artifact. A folder of screenshots is not evidence; a short report with the device model, method, observations, and limitations is.

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Hardware Security](https://www.coursera.org/learn/hardware-security) | University of Maryland via Coursera | Intermediate | Free to audit; certificate paid | No | Threat models, side channels, physical attacks, trusted computing |
| [Computation Structures (6.004)](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/) | MIT OpenCourseWare | Beginner | Free | Problem sets | Digital logic and processor fundamentals that make datasheets readable |
| [Nand2Tetris](https://www.nand2tetris.org/) | Nand2Tetris team | Beginner | Free | Yes, software projects | Building a computer from logic gates to an OS, demystifying hardware |
| [Software Defined Radio with HackRF](https://greatscottgadgets.com/sdr/) | Great Scott Gadgets | Intermediate | Free | Yes, with HackRF hardware | IQ sampling, modulation, and receive-side SDR workflow |
| [ChipWhisperer tutorials](https://chipwhisperer.readthedocs.io/) | NewAE Technology | Advanced | Free docs; hardware paid | Yes, with hardware | Side-channel capture and fault-injection methodology |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [NIST SP 800-193: Platform Firmware Resiliency Guidelines](https://csrc.nist.gov/pubs/sp/800/193/final) | NIST | Protection, detection, and recovery requirements for firmware |
| [NIST SP 800-147: BIOS Protection Guidelines](https://csrc.nist.gov/pubs/sp/800/147/final) | NIST | Baseline controls for firmware update authentication and integrity |
| [TPM 2.0 Library Specification](https://trustedcomputinggroup.org/resource/tpm-library-specification/) | Trusted Computing Group | The normative reference for TPM structures, PCRs, and commands |
| [OWASP Internet of Things Project](https://owasp.org/www-project-internet-of-things/) | OWASP | IoT attack surface, firmware, and companion app guidance |
| [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) | NIST | Connects device firmware practices to a secure development program |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [Microcorruption](https://microcorruption.com/) | Square | Free, browser | A fictional embedded lock; debugger-based challenges teach memory and peripheral reasoning |
| [OWASP IoTGoat](https://github.com/OWASP/IoTGoat) | OWASP | Free, self-hosted | Deliberately vulnerable firmware; run on your own router or isolated VM, never a production network |
| [DVRF](https://github.com/praetorian-inc/DVRF) | Praetorian | Free, emulated | Vulnerable router firmware for QEMU; keep emulation host-only |
| [ChipWhisperer target labs](https://github.com/newaetech/chipwhisperer) | NewAE | Open source; hardware paid | Side-channel and glitching on dedicated targets only; never on live equipment |

## Essential open-source tools

Tools do not replace methodology. A logic analyzer without a threat model produces pretty captures and no findings.

| Tool | Purpose | Link |
| --- | --- | --- |
| Saleae Logic | Logic capture and protocol decoding with a polished UI | [saleae.com](https://www.saleae.com/) |
| sigrok PulseView | Open-source logic analyzer front end with many decoders | [sigrok.org](https://sigrok.org/) |
| OpenOCD | Open on-chip debugger for JTAG and SWD targets | [openocd.org](https://openocd.org/) |
| binwalk | Firmware image inspection and extraction | [github.com/ReFirmLabs/binwalk](https://github.com/ReFirmLabs/binwalk) |
| Ghidra | Reverse engineering and decompilation for firmware binaries | [ghidra-sre.org](https://ghidra-sre.org/) |
| flashrom | Read and write SPI NOR flash chips | [flashrom.org](https://www.flashrom.org/) |
| ChipWhisperer | Open-source side-channel and fault-injection platform | [chipwhisperer.readthedocs.io](https://chipwhisperer.readthedocs.io/) |

## Practical projects and exercises

### Project 1: Own-device teardown and interface map

Objective: document the physical attack surface of a retired router, camera, or set-top box you own.

Constraints: unplug the device, photograph before probing, use only low-voltage measurement, and do not connect it to any network. Identify the SoC, flash, RAM, and any test pads. Measure voltages, find UART if present, and record the pinout.

Deliverable: a four-to-six page PDF with high-resolution photos, a component table, a pin map, and a short section on what each exposed interface would allow an attacker to do. This is a strong portfolio piece because it shows method, not just a result.

Include these evidence items:

- A photo of the unopened device and the model/regulatory label.
- Chip identifiers and datasheet links for the SoC, flash, and radio.
- Voltage measurements for each pad you probed, with the probe's ground reference.
- A short "what I would try next" section that names the risk and the safety limit.

### Project 2: Firmware extraction and secret audit

Objective: obtain firmware for a device you own, either from the vendor's public update file or from a flash dump, and audit it.

Constraints: work in an isolated VM, do not execute untrusted binaries on your host, and redact any real credentials or keys. Use binwalk, a filesystem extractor, and strings triage. Look for update verification logic, default accounts, private keys, and debug endpoints.

Deliverable: an analysis report mapping each finding to a file path or offset, a risk rating, and a remediation recommendation. If the finding is in a vendor product, include your disclosure plan and keep the report private until the vendor responds.

A useful report separates three things: facts (a key is present at offset X), interpretation (the update client trusts any image signed with it), and recommendation (rotate the key, pin the public key in the bootloader, and publish a new advisory). Reviewers trust reports that make this distinction explicit.

### Project 3: Secure boot and debug threat model

Objective: design the security architecture for a hypothetical connected sensor, then attack your own design on paper.

Constraints: assume the attacker can buy the device, open it, and spend a day with common tools. Include provisioning, update, recovery, and decommissioning.

Deliverable: a data-flow diagram, a STRIDE table covering physical and network boundaries, a control set (signed boot, debug authentication, key storage, rollback protection), and three architecture decision records explaining tradeoffs. This is the artifact that hiring managers for embedded security roles actually want to read.

Ask a peer to attack the design on paper. The gaps they find are the best measure of whether your threat model is honest, and the revision history makes the document more credible.

## Common mistakes and misconceptions

- Buying an expensive bench before completing one teardown. Skill, not equipment, is the bottleneck at the start.
- Connecting a USB-to-UART adapter's VCC to a pad without checking voltage. Use ground and TX/RX first, and verify 3.3 V versus 5 V.
- Assuming a UART pad is safe to probe while the device is running from mains. Use low-voltage devices and unplug before soldering.
- Treating an open debug port as the whole finding. The impact is what the port exposes: keys, shell, or writable firmware.
- Believing secure boot is unbreakable. Look for unsigned recovery modes, downgrade paths, and keys stored on the same flash.
- Ignoring the supply chain. A signed firmware image means little if the signing key was shared across products or leaked.
- Publishing extracted credentials or customer data in a write-up. Redact first, disclose privately, and follow the law.

## Career paths and roles

Hardware skills feed several roles. Embedded security engineers design and review device firmware and boot chains. IoT penetration testers assess consumer and industrial products under contract. Firmware analysts support incident response and supply-chain due diligence. Physical red teams test facilities and device access. Silicon and platform security teams validate secure boot, debug policy, and key provisioning.

Adjacent entry points include embedded software development, hardware validation, and electronics repair; each gives you transferable intuition. Certifications are optional in this niche; a documented teardown, a firmware analysis report, and a clear threat model outperform a stack of badges. Expect interviews to include a device walkthrough and questions about how you would prove a secure-boot claim.

| Role | Typical focus | Portfolio evidence that helps |
| --- | --- | --- |
| Embedded security engineer | Boot chain, key storage, secure update | Threat model plus secure-boot design review |
| IoT penetration tester | Device, mobile app, cloud, radio | Teardown and firmware analysis report |
| Firmware analyst | Extraction, reverse engineering, implants | Annotated disassembly or comparison write-up |
| Physical red teamer | Access, tamper, lock and sensor bypass | Method write-up with clear authorization |
| Product security engineer | Reviews, standards, disclosure | Control mapping and advisory history |

## Next steps

- Complete one teardown of a device you own and publish a redacted interface map.
- Work through Microcorruption end to end and keep notes on each debugging technique.
- Read NIST SP 800-193 and write a one-page summary of protection, detection, and recovery for a product you use.
- Build the firmware analysis lab in an isolated VM and practice on DVRF or IoTGoat.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and the [advanced training grounds](../../resources/training-grounds/advanced.md).

## References

- NIST, [Platform Firmware Resiliency Guidelines (SP 800-193)](https://csrc.nist.gov/pubs/sp/800/193/final).
- NIST, [BIOS Protection Guidelines (SP 800-147)](https://csrc.nist.gov/pubs/sp/800/147/final).
- Trusted Computing Group, [TPM 2.0 Library Specification](https://trustedcomputinggroup.org/resource/tpm-library-specification/).
- OWASP, [Internet of Things Project](https://owasp.org/www-project-internet-of-things/).
- Great Scott Gadgets, [Software Defined Radio with HackRF](https://greatscottgadgets.com/sdr/).
- NewAE Technology, [ChipWhisperer documentation](https://chipwhisperer.readthedocs.io/).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
