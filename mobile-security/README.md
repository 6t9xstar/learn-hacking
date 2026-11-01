[Home](../README.md) / Mobile Security

# Mobile Security: Auditing Android and iOS Applications

Last reviewed: 2026-10-31. This guide is part of the learn-hacking curriculum and is updated as platform guidance changes.

Mobile security is the practice of protecting the applications, data, and platform configuration on smartphones and tablets. It sits where application security, operating system internals, networking, and privacy meet. A mobile app is not a smaller website: it ships executable code to a device you do not control, stores credentials on that device, talks to APIs over hostile networks, and can be reverse engineered by anyone who downloads it.

This guide is for developers who want to build safer apps, testers moving from web or network security into mobile, and blue teamers who need to assess mobile risk without disrupting users. It covers Android and iOS at a conceptual and practical level. It does not turn you into an iOS kernel researcher, and it will not teach you to jailbreak or root devices; authorized lab work and defensible engineering are the focus.

> **Ethics first.** Assess only applications you own or have explicit written permission to test. App store binaries, banking apps, and employer devices are not practice targets. Read [ETHICS.md](../ETHICS.md) before you install a single tool.

## At a glance

| Question | Answer |
| --- | --- |
| Difficulty | Beginner to intermediate; advanced for native code, custom crypto, and platform internals |
| Realistic time | 8–12 weeks at 6–8 hours per week to reach working junior competency |
| Cost | Free for Android and most tooling; iOS dynamic testing needs a Mac, and a used lab iPhone helps |
| Prerequisites | One mobile language (Kotlin/Java or Swift), HTTP and JSON, TLS basics, command line comfort |
| Lab requirement | An isolated Android emulator plus a physical test device; a Mac or macOS VM for iOS tooling |
| Best first win | A static review of an intentionally vulnerable Android app with findings mapped to OWASP MASVS |

## Why this field matters

Phones and tablets are the primary computer for most users, and they hold session tokens, photos, location history, health records, and corporate mail. A single insecure token storage decision can expose thousands of accounts. Mobile apps also sit inside supply chains: third-party SDKs collect data, advertising libraries phone home, and enterprise mobility management (EMM) platforms push configuration to fleets of devices. Regulators expect privacy controls and breach notification. App stores require declarations about data collection. Enterprises need to prove that BYOD mail and file access are separated from personal data. Meanwhile, attackers target mobile users with phishing, malicious profiles, repackaged apps, and overlay interfaces. Most real-world mobile findings are not exotic exploits; they are exported components, secrets in the package, weak transport rules, broken object-level authorization on the API, and tokens stored where any backup or malicious app can read them. Learning to find and fix those issues is immediately useful.

## What you will learn

- How Android and iOS isolate apps, sign code, store data, and expose functionality to other apps.
- How to read an APK or IPA as an auditor, including manifest, resources, native libraries, and entitlements.
- How local storage, logging, backups, deep links, URL schemes, and exported components leak data or create attack surface.
- How to evaluate TLS, certificate pinning, API authorization, and OAuth 2.0 token flows.
- How to run authorized static and dynamic analysis with MobSF, jadx, apktool, Frida, and a proxy.
- How to structure an assessment around OWASP MASVS and MASTG and write findings a developer can act on.
- How to threat model a mobile feature and propose platform-appropriate mitigations.

## Prerequisites and honest expectations

You should be comfortable writing a small Android or iOS app, or at least reading one. You need to understand HTTP requests, cookies, JSON Web Tokens (JWTs), and the difference between authentication and authorization. Basic Linux command line skills are assumed because most tooling runs on macOS or Linux, and Windows users will spend time in WSL or a Linux virtual machine.

Be realistic about the learning curve. Android is far more open: you can decompile, repackage, and instrument apps in a lab. iOS tooling is more constrained and generally requires macOS, Xcode, and a dedicated test device. Dynamic analysis of App Store builds is limited by code signing and platform protections, and that is by design. You will spend more time reading manifests and API behavior than running clever exploits. An emulator is not a phone either: it misses hardware-backed keystore behavior, biometrics, and some anti-tampering logic, so confirm important findings on a physical lab device and never test untrusted builds on your daily-driver phone.

## Core concepts

### Android architecture and the app sandbox

Android runs on a Linux kernel with a hardware abstraction layer, the Android Runtime (ART), native libraries, and the Java/Kotlin framework. Each installed app normally receives a unique Linux user ID (UID), so the kernel enforces file-level isolation between apps. SELinux adds mandatory access control on top, and scoped storage limits what an app can read from shared storage. Apps declare capabilities through permissions, and since Android 6.0 dangerous permissions are granted at runtime.

The security model also includes verified boot, which checks the integrity of the boot chain, and the Android Keystore, which can hold cryptographic keys in hardware-backed storage. Google Play Protect scans installed apps, but it is a safety net rather than a guarantee. For an auditor, the practical question is: what is this app allowed to access, what does it actually need, and what does it do with the data once it has it?

### iOS architecture and the app sandbox

iOS is built on Darwin and the XNU kernel. Every app runs inside a sandbox profile that restricts file system, network, and IPC access. On stock devices all executable code must be signed by Apple or by a trusted developer identity, and entitlements grant specific capabilities such as Keychain access groups, push notifications, or App Groups. Data Protection encrypts files with class keys tied to the device passcode and the Secure Enclave.

iOS adds address space layout randomization, pointer authentication on newer chips, and a tightly controlled app distribution model. These controls raise the cost of exploitation but do not remove application-layer bugs. A perfectly sandboxed app can still leak a token into a world-readable backup, log a password, or trust an unvalidated deep link. Auditors should separate platform guarantees from app responsibilities, because most findings live in the latter.

### App packages: APK, AAB, and IPA

An Android Package (APK) is a ZIP archive. It contains `classes.dex` (compiled bytecode for ART), `AndroidManifest.xml` in binary XML form, `resources.arsc`, resource files, native libraries under `lib/`, and signing material under `META-INF/`. Modern distribution often uses split APKs for density, language, and architecture, and the Android App Bundle (AAB) is the publishing format that stores generates splits from. An AAB is not directly installable on a device, so testers usually work with an APK built from the same source or extracted split set.

An iOS App Store package (IPA) is also a ZIP. It contains a `Payload/` directory with the `.app` bundle, including the Mach-O executable, `Info.plist`, asset catalogs, frameworks, and an embedded provisioning profile in development or ad hoc builds. Store builds are encrypted with FairPlay, so static analysis of the binary is limited unless you have a decrypted build for authorized testing. The package still reveals permissions, URL schemes, SDKs, and configuration, which is often enough for a first-pass review.

### Code signing and integrity

Android supports multiple APK signature schemes. Version 1 uses JAR signing; versions 2 and 3 sign the whole APK with stronger digests and support key rotation; version 4 supports incremental installation. Google Play App Signing lets Google hold the app signing key while the developer keeps an upload key. Debug builds are signed with a well-known debug key and must never be shipped.

iOS code signing binds the binary to a signing identity, a provisioning profile, and a set of entitlements. The profile lists allowed devices and capabilities, and the Team ID ties the app to an Apple Developer account. Signature validation is a platform control, not an app security feature: it proves who signed the build, not that the build is safe. Repackaging, resigning, and tampering detection belong in a threat model, but resistance to reverse engineering should never substitute for server-side authorization.

### Data storage and secrets

Android apps write to internal storage, which is private to the app, and to shared storage through scoped storage APIs. Common leak points include `SharedPreferences`, SQLite databases, cache directories, logcat output, and files copied to external storage. Auto Backup can copy app data to Google Drive unless the app excludes sensitive files, and keyboard caching or screenshots can expose secrets outside the app sandbox.

iOS apps use Documents, Library, and tmp directories, with Data Protection classes controlling when files are readable. `UserDefaults` is a property list and is not a secret store. The Keychain is the right place for credentials and tokens, with accessibility options such as when-unlocked-this-device-only. Both platforms offer encrypted storage APIs, but encryption at rest does not help if the app puts a token in a log or a screenshot. Treat secrets as toxic data: minimize collection, shorten lifetime, and never embed long-lived API keys in the client.

### IPC, intents, and deep links

Android components can be exported to other apps through inter-process communication (IPC). An activity with an intent filter, a broadcast receiver, a content provider, or a bound service may be reachable by any app on the device unless protected by permission checks. Since Android 12, components that declare intent filters must explicitly set `android:exported`. PendingIntent mutability flags matter because an immutable PendingIntent prevents another app from filling in the inner intent.

iOS apps communicate through URL schemes, Universal Links, App Groups, shared keychains, and extensions. Custom URL schemes are not owned globally: another app can register the same scheme, so a scheme handler must validate every parameter and never treat the caller as trusted. Universal Links use the `apple-app-site-association` file on the associated domain to prove ownership, which makes them phishing-resistant when configured correctly. Deep links should be treated as untrusted input, exactly like query parameters on a web endpoint.

### Transport and API security

Android 9 and later block cleartext traffic by default for apps targeting modern SDK levels, and apps can define a network security configuration with per-domain rules. iOS App Transport Security (ATS) enforces secure connections by default. Certificate pinning can raise the bar against interception with a user-installed proxy, but it also creates operational risk: a pinned app breaks when the certificate rotates unexpectedly. Pinning is a defense-in-depth control, not a replacement for proper server authentication.

The API is usually the real attack surface. Test object-level authorization by changing identifiers, not just by checking whether a token is present. Look for predictable resource IDs, missing rate limits, verbose errors, mass assignment, and debug endpoints. Mobile clients are public clients: anything shipped in the app can be extracted, so server-side checks must assume the client is hostile.

### Authentication and token handling

Native apps should use OAuth 2.0 with Proof Key for Code Exchange (PKCE) as described in RFC 8252. The app opens the system browser, receives an authorization code through a verified redirect URI, and exchanges it for tokens. Public clients cannot keep a client secret confidential, so a secret embedded in an app is not a secret. Prefer the system browser over an embedded web view because the browser shares the user's existing session and gives the user a trustworthy address bar.

Store access and refresh tokens in the Keychain or Android Keystore-backed storage, not in preferences or plain files. Use short-lived access tokens, rotate refresh tokens, and revoke tokens on logout. Biometrics can unlock a key or approve a step-up action, but a local biometric check is not a substitute for server-side authentication. JWTs deserve scrutiny: reject `alg: none`, verify signatures with the correct key, check issuer, audience, and expiry, and never trust claims that the server has not validated.

### Reverse engineering in authorized labs

Static analysis starts with the package. MobSF performs automated triage, jadx decompiles DEX to readable Java, apktool decodes resources and smali, and Ghidra helps with native libraries. Dynamic analysis runs the app on a lab device or emulator while you observe files, logs, network traffic, and IPC. Frida and objection can instrument an app you own or are authorized to test, and mitmproxy can show API traffic when the app permits a user-installed certificate.

The goal is evidence, not tricks. Record the build hash, device image, tools, and steps so another tester can reproduce the finding. Do not use root or jailbreak workarounds, do not bypass platform security on a device you do not own, and do not publish instructions for defeating other people's apps. If a control blocks analysis, document the limitation and test the backend or the source instead. This guide deliberately omits evasion techniques.

### OWASP MASVS and MASTG

The OWASP Mobile Application Security Verification Standard (MASVS) defines security requirements grouped into categories: storage, cryptography, authentication, network communication, platform interaction, code quality, resilience, and privacy. The Mobile Application Security Testing Guide (MASTG) turns those requirements into test procedures, tooling guidance, and platform-specific notes. MASWE, the mobile weaknesses enumeration, provides a common vocabulary for findings.

Use MASVS as a coverage map, not a score. Decide with the product owner which categories matter for the app's risk profile. A offline note-taking app and a banking app do not need identical resilience testing. For each test, record whether it passed, failed, was not applicable, or could not be tested, and include the evidence. That structure makes reports comparable across releases and gives developers a clear remediation target.

### Tooling workflow from package to finding

A repeatable workflow beats a bag of commands. Start with acquisition: record the package name, version, build hash, and source. Run automated static triage, then read the manifest and entitlement files by hand. Look for exported components, dangerous permissions, cleartext exceptions, backup settings, debuggable flags, hardcoded endpoints, and third-party SDKs. Decompile and search for secrets, API keys, and authentication logic.

Move to dynamic testing on a clean lab device. Create test accounts, capture traffic through a proxy you control, exercise deep links and IPC entry points, and inspect local storage after each flow. Validate every suspected issue by reproducing it and identifying the concrete impact. Finally, write the finding with the affected component, reproduction steps, evidence, severity, and a fix that fits the platform. A finding a developer cannot reproduce is a rumor, not a report.

### Mobile threat modeling and platform hardening

A useful mobile threat model names the assets (tokens, personal data, business documents), the actors (network attacker, malicious app, thief, abusive SDK), and the trust boundaries (app to API, app to other apps, app to OS). Then it asks how each flow fails. Lost-device scenarios need remote wipe and short screen-lock timeouts. Malicious-app scenarios need component permissions and validated deep links. Network scenarios need TLS and sane pinning. Supply-chain scenarios need SDK inventory and privacy review.

Platform hardening complements app security: keep OS versions current, enable Play Protect or iOS security responses, use Lockdown Mode for high-risk users, require device encryption and a passcode, enroll corporate devices in MDM with compliance policies, and separate work data from personal data. No single control is sufficient. The best mobile programs combine secure app design, platform configuration, and monitoring of the backend APIs the app depends on.

## Legal and safe practice

Authorization is not optional. Testing an app you downloaded from a store can violate the store's terms, the developer's rights, and computer misuse laws even if you only inspect network traffic. Get written scope that lists package names, build versions, backend domains, test accounts, time windows, and prohibited actions such as denial-of-service testing or accessing real user data. If you find a vulnerability during authorized work, follow the agreed disclosure process and never exfiltrate personal data.

Use isolated lab infrastructure. Prefer emulators and dedicated test devices with no personal accounts, no corporate mail, and no shared cloud backups. Keep captured traffic and decompiled code in an encrypted work area, minimize retention, and delete test data when the engagement ends. Be careful with public write-ups: a screenshot can contain a token, a customer identifier, or an internal hostname. Redact before publishing.

Respect platform boundaries. This curriculum does not cover jailbreaking, rooting, or bypassing code signing to inspect third-party apps. If your engagement requires testing a production iOS build, agree with the client on a development or enterprise-signed build and a test device. On Android, use a debuggable build when possible. If you cannot test a control legitimately, say so in the report rather than working around the platform.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Foundations (weeks 1–2) | Mobile platforms and HTTP | Build a small Android app that stores a token and calls an API; read the Android security overview and Apple Platform Security introduction | A working app, a diagram of its trust boundaries, and notes on where secrets live |
| 2. Static analysis (weeks 3–4) | Packages and manifests | Triage the MASVS Hacking Playground with MobSF, jadx, and apktool; inspect manifest, resources, and native libraries | An inventory of components, permissions, SDKs, and suspected issues with file references |
| 3. Dynamic analysis (weeks 5–6) | Runtime behavior | On an emulator, exercise the lab app with a proxy, inspect storage after each flow, and capture logcat | A reproducible test log with screenshots, traffic notes, and storage evidence |
| 4. API and auth (weeks 7–8) | OAuth, tokens, authorization | Review a test API's object-level authorization, token lifetime, and redirect URI handling; test with two accounts | A findings table covering authentication, authorization, and session management |
| 5. iOS fundamentals (weeks 9–10) | Apple platform controls | On a Mac, build a small Swift app, inspect its entitlements and Info.plist, and review Keychain usage | An iOS checklist with platform-specific evidence and limitations |
| 6. Reporting and specialization (weeks 11–12) | MASVS audit and communication | Convert notes into a MASVS-mapped report with severity, impact, and fixes; present it to a developer for feedback | A polished report and a remediation retest plan |

The stages overlap in practice. Do not wait until week 11 to start writing: keep a lab notebook from day one, using the [lab notes template](../templates/lab-notes.md). If you already have web application experience, compress stage 1 and spend the saved time on platform internals and iOS.

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [OWASP MASTG](https://mas.owasp.org/MASTG/) | OWASP | Intermediate | Free, open source | Yes, with lab apps | Concrete Android and iOS test procedures with expected results |
| [OWASP MASVS](https://mas.owasp.org/MASVS/) | OWASP | Beginner | Free, open source | No | A requirements baseline for scoping and reporting |
| [Android security best practices](https://developer.android.com/topic/security/best-practices) | Google | Beginner–intermediate | Free | Code samples | Platform APIs for storage, permissions, networking, and keystore use |
| [Apple Platform Security](https://support.apple.com/guide/security/welcome/web) | Apple | Beginner–intermediate | Free | No | The security architecture behind iOS sandboxing, signing, and Data Protection |
| [Web Security Academy](https://portswigger.net/web-security) | PortSwigger | Intermediate | Free | Yes, browser labs | API, JWT, and access-control fundamentals that mobile backends share |

The MASTG is the closest thing to a free textbook for this field. Read the sections that match your current platform, then use its references to go deeper. Vendor documentation is not a course, but the Android and Apple guides are the authoritative source for how the platforms actually behave, and they are updated more often than third-party tutorials.

## Official documentation and standards

| Source | Owner | Why it matters |
| --- | --- | --- |
| [OWASP MASVS](https://mas.owasp.org/MASVS/) | OWASP | The requirement categories used to scope a mobile assessment |
| [OWASP MASTG](https://mas.owasp.org/MASTG/) | OWASP | Test procedures, tooling, and platform-specific verification guidance |
| [Android security best practices](https://developer.android.com/topic/security/best-practices) | Google | Current guidance on storage, permissions, crypto, and network security |
| [Android platform security](https://source.android.com/docs/security) | Google | Verified boot, SELinux, keystore, and update architecture |
| [Apple Platform Security](https://support.apple.com/guide/security/welcome/web) | Apple | Secure boot, Data Protection, Keychain, and app security guarantees |
| [RFC 8252: OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252) | IETF | The correct browser-based authorization flow for mobile clients |
| [NIST SP 800-163 Rev. 1](https://csrc.nist.gov/pubs/sp/800/163/r1/final) | NIST | A vetting framework for mobile app security in organizations |
| [MITRE ATT&CK Mobile](https://attack.mitre.org/matrices/mobile/) | MITRE | Adversary techniques to consider when threat modeling mobile incidents |

Standards are useful only when you can trace a finding back to a requirement and forward to a fix. When a client asks "are we secure", point to the scope, the tests performed, the exceptions accepted, and the residual risk. No checklist can answer that question on its own.

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | What you practice | Safety note |
| --- | --- | --- | --- | --- |
| [MASTG Hacking Playground](https://github.com/OWASP/MASTG-Hacking-Playground) | OWASP | Free, open source | Static and dynamic testing against intentionally vulnerable Android and iOS builds | Use only the provided builds on an isolated device |
| [InsecureShop](https://github.com/optiv/InsecureShop) | Optiv | Free, open source | Android storage, logging, and component issues | Run in an emulator with no personal accounts |
| [InjuredAndroid](https://github.com/B3nac/InjuredAndroid) | B3nac | Free, open source | A progression of Android challenges mapped to common weaknesses | Treat it as a lab app, not a template for production code |
| [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) | MobSF | Free, open source | Automated static and dynamic triage you can self-host | Keep the instance off the public internet and delete uploaded builds |
| [TryHackMe](https://tryhackme.com/) | TryHackMe | Freemium | Guided rooms on Linux, networking, and web fundamentals | Prefer rooms that explicitly provide a target app or VM |

A lab is only useful if you record what you did. For each exercise, save the build hash, the device image, the tools and versions, the steps, and the evidence. Compare your findings with the app's documented vulnerabilities only after you have written your own conclusion; that habit trains independent judgment.

## Essential open-source tools

| Tool | Purpose | Official link |
| --- | --- | --- |
| MobSF | Automated static and dynamic analysis for Android and iOS packages | [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) |
| jadx | Decompiles DEX bytecode into readable Java for static review | [jadx](https://github.com/skylot/jadx) |
| apktool | Decodes APK resources and smali, and rebuilds packages for authorized testing | [apktool](https://apktool.org/) |
| Frida | Dynamic instrumentation for apps you own or are authorized to test | [Frida](https://frida.re/) |
| objection | Runtime mobile exploration built on Frida, for authorized lab work | [objection](https://github.com/sensepost/objection) |
| mitmproxy | Intercepts and inspects HTTP traffic from a device you control | [mitmproxy](https://mitmproxy.org/) |
| Ghidra | Disassembles and decompiles native libraries shipped in mobile packages | [Ghidra](https://ghidra-sre.org/) |

Tools do not replace methodology. A decompiler produces thousands of lines; a tester produces a threat model, a test plan, and evidence. Learn what each tool cannot see: MobSF misses business logic, jadx struggles with obfuscated or native code, and a proxy sees only traffic the app chooses to send. Combine sources and state your confidence.

## Practical projects and exercises

### Project 1: MASVS audit of a vulnerable Android app

**Objective:** Produce a professional assessment of the OWASP MASTG Hacking Playground or InsecureShop, mapped to MASVS categories.

**Setup and constraints:** Use an isolated emulator or test device with no personal accounts. Record the build hash and tool versions. Test only the provided lab app; do not pivot to its backend if the backend is shared or third-party. Limit yourself to static analysis, local storage review, component testing, and traffic observation through your own proxy.

**Deliverable:** A report with an executive summary, scope, methodology, a findings table (title, MASVS category, severity, evidence, impact, remediation), and at least one retest after you fix or mitigate an issue in a fork of the app. Include screenshots with secrets redacted. This is portfolio-worthy because it shows judgment, not just tool output.

### Project 2: Deep link and exported component threat model

**Objective:** Design and test the inter-process communication (IPC) surface of a small app you build yourself.

**Setup and constraints:** Create an Android app with one exported activity that accepts a deep link, one content provider, and one broadcast receiver. Deliberately include a parameter that changes behavior. Write a threat model before testing. Then test with adb and a second app you also control. Do not publish a toolkit for attacking other apps; keep the harness private and describe defensive lessons.

**Deliverable:** A data-flow diagram, a table of entry points with validation rules, a list of confirmed issues, and a hardened version of the manifest and handler code. Explain why each fix works and what residual risk remains. Developers value this more than a list of exported components because it shows how to close the gap.

### Project 3: Token storage and transport comparison

**Objective:** Compare an insecure and a secure implementation of token storage and API authentication in a mobile client.

**Setup and constraints:** Build two variants of a small app: one stores a token in plain preferences and logs it, the other uses Keystore or Keychain-backed storage, short-lived tokens, and a PKCE flow against a local test identity provider. Run both on a lab device, inspect backups and logs, and capture traffic through mitmproxy. Never use a real identity provider or real user credentials.

**Deliverable:** A before-and-after write-up with the code diff, evidence that the insecure variant leaks the token, evidence that the secure variant does not, and a list of operational caveats such as token rotation and logout revocation. Add a short section on what the client cannot protect against, such as a compromised server or a malicious OS.

## Common mistakes and misconceptions

- **"You need root or jailbreak to test a mobile app."** Most application-layer findings come from static review, authorized instrumentation, proxies, and storage inspection on normal lab devices. Rooting is a platform modification, not a prerequisite for good testing.
- **"Certificate pinning makes the app secure."** Pinning raises the cost of traffic interception, but it does nothing for broken authorization, insecure storage, or a malicious SDK. It also breaks easily if certificate rotation is not planned.
- **"Obfuscation is a security control."** Obfuscation slows analysis; it does not protect secrets shipped in the client. Anything in the package can eventually be recovered.
- **"The client validates it, so the server is safe."** Client-side checks are UX. Attackers can call the API directly, so every sensitive decision must be enforced server-side.
- **"A MASVS checklist is a security program."** The checklist is a coverage tool. Without a threat model, scope, and evidence, it produces false confidence.
- **"UserDefaults or SharedPreferences is fine for a short-lived token."** Short-lived still means readable by backups, debug tooling, or a compromised app. Use platform secret storage and minimize lifetime.
- **"iOS is secure, so iOS apps do not need testing."** The platform is hardened, but app logic, deep links, data sharing, and backend authorization still fail in predictable ways.
- **"An emulator finding is a production finding."** Emulators lack hardware-backed security and real device behavior. Confirm impact on a physical device before assigning severity.

## Career paths and roles

Mobile application security engineer: builds secure mobile features, reviews SDKs, and owns the mobile security standard. Entry often comes from Android or iOS development, and the strongest candidates can point to shipped apps and a security review they led.

Mobile penetration tester or security consultant: performs authorized assessments, often as part of an application security team. Consultancies hire from web penetration testing, development, or QA backgrounds. Demonstrate a MASVS-mapped report, reproducible evidence, and clear remediation advice.

Product security or MASVS auditor: runs mobile security programs, reviews releases, tracks risk across an app portfolio, and may also own EMM device fleets, app protection policies, and compliance. This role needs communication and program management as much as technical depth, and a sample audit with a retest plan is excellent evidence.

Mobile malware or forensic analyst: analyzes malicious apps, profiles, and device artifacts in a SOC, CERT, or forensic lab. It overlaps heavily with reverse engineering and forensics; see the [malware analysis guide](../malware-analysis/README.md) and the [digital forensics guide](../digital-forensics/README.md).

## Next steps

1. Read the [mobile security specialist roadmap](../roadmaps/mobile-security-specialist.md), pick the first two stages that match your current skills, and build the token-storing app from stage 1.
2. Complete a MASVS-mapped review of the MASTG Hacking Playground and publish a redacted version in your portfolio.
3. Practice the API side with the [web application security guide](../web-application-security/README.md) and the network side with the [network penetration testing guide](../network-penetration-testing/README.md).
4. Keep a repeatable notebook using the [lab notes template](../templates/lab-notes.md), and review the [intermediate training grounds](../resources/training-grounds/intermediate.md) for your next lab.

## References

1. OWASP Mobile Application Security, <https://mas.owasp.org/>.
2. OWASP Mobile Application Security Testing Guide, <https://mas.owasp.org/MASTG/>.
3. OWASP Mobile Application Security Verification Standard, <https://mas.owasp.org/MASVS/>.
4. Android Developers, security best practices, <https://developer.android.com/topic/security/best-practices>.
5. Android Open Source Project, platform security, <https://source.android.com/docs/security>.
6. Apple, Platform Security Guide, <https://support.apple.com/guide/security/welcome/web>.
7. IETF RFC 8252, OAuth 2.0 for Native Apps, <https://www.rfc-editor.org/rfc/rfc8252>.
8. NIST SP 800-163 Rev. 1, Vetting the Security of Mobile Applications, <https://csrc.nist.gov/pubs/sp/800/163/r1/final>.
9. MITRE ATT&CK Mobile Matrix, <https://attack.mitre.org/matrices/mobile/>.

---

Continue with the [repository home](../README.md), the [foundations track](../foundations/README.md), the [resource library](../resources/README.md), or the [contribution guide](../CONTRIBUTING.md).
