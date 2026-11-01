# Mobile Security Specialist Roadmap

**Last reviewed: 2026-10-31** · **Study load: 8–10 hours per week** · **Realistic duration: 12–18 months**

[Home](../README.md) › [Roadmaps](README.md) › Mobile security specialist

Mobile security specialists assess Android and iOS applications, the data they store, and the APIs they call. The work sits at the intersection of application security and platform internals: you need to understand how an app is packaged, how the operating system sandboxes it, how it authenticates to a backend, and what an attacker with a stolen device or a modified app can reach. This roadmap covers both platforms, insists on depth in one, and uses the OWASP Mobile Application Security Verification Standard (MASVS) and Testing Guide (MASTG) as the professional frame.

Mobile testing has a higher equipment barrier than web testing, especially for iOS. Be honest with yourself about what you can lab. Read [ETHICS.md](../ETHICS.md) before instrumenting any app; sideloading, intercepting, or modifying an application you do not own or have permission to test may violate law and platform terms.

## At a glance

| Item | Detail |
|---|---|
| Target role | Mobile application security analyst, mobile penetration tester, application security engineer with a mobile focus |
| Realistic duration | 12–18 months at 8–10 hours per week; 8–12 months with prior web or Android development experience |
| Cost | Free tooling and documentation; iOS depth realistically requires macOS hardware; optional paid labs and exams |
| Lab needs | Android Studio and emulator; a test Android device you own; macOS with Xcode for iOS; MobSF, jadx, Frida, apktool; Burp Suite or mitmproxy |
| Difficulty | High; two platforms, reverse engineering, and instrumentation |
| Main output | A MASVS-mapped assessment report, a static analysis casebook, and a dynamic instrumentation write-up |

This is a map, not a race. iOS work is difficult to practice without Apple hardware, and that constraint is real rather than a failure of effort. Android-only depth is a viable career starting point; add iOS when your equipment allows.

## Who this is for

This roadmap is for application security practitioners who want mobile depth, Android or iOS developers moving into security, and testers who already understand HTTP and web authentication. It also suits QA engineers who work with mobile releases.

Honest prerequisites:

- **Web and API fundamentals.** Sessions, tokens, TLS, authorization, and Burp Suite basics. Mobile bugs frequently live in the API.
- **Programming literacy.** You can read Java or Kotlin, and ideally Swift or Objective-C. You do not need to ship apps, but you must follow code.
- **Linux command line.** Frida, adb, and scripting are command-line tools.
- **Platform access.** Android can be practiced on Windows, Linux, or macOS. Serious iOS dynamic analysis needs macOS and Xcode; a physical iPhone is helpful.
- **Comfort with reverse engineering.** Decompiled code is messy. Patience and note-taking matter more than raw speed.

If you have never built a mobile app, build a small one first. Understanding the build pipeline, signing, and app lifecycle makes the testing stage far more intelligible.

## What you are working toward

| Competency | What it actually means | Evidence you can show |
|---|---|---|
| Platform architecture | Explain sandboxing, permissions, app signing, and inter-process communication on Android and iOS | A written comparison of both platforms |
| Static analysis | Inspect a package, manifest, entitlements, and decompiled code for risky patterns | A static analysis report with file references |
| Dynamic analysis | Observe runtime behaviour, storage, and network traffic on a test device | A dynamic analysis log with evidence |
| Instrumentation | Use Frida or platform tooling to observe and modify app behaviour in a lab | A documented script against an app you built |
| Secure storage assessment | Evaluate keychains, keystores, files, and logs for sensitive data | A storage findings table with severity |
| MASVS assessment | Map observations to MASVS controls and produce a coverage matrix | A completed MASVS checklist for one app |
| API and backend testing | Test authentication, authorization, and token handling behind the app | An API finding with two test accounts |
| Reporting | Write findings that mobile developers and product owners understand | A client-style mobile assessment report |

Typical entry-level tasks:

- Run a static scan, triage the results, and remove false positives.
- Inspect an Android manifest for exported components and weak permissions.
- Check whether tokens or personal data are stored in plaintext on a test device.
- Intercept app traffic with a proxy on an app you are authorized to test.
- Map findings to MASVS controls and propose platform-specific fixes.

## Learning sequence

The sequence gives you both platforms at foundation level, then depth in Android, then iOS and cross-platform frameworks, then a full MASVS-driven assessment.

| Stage | Focus | Typical length | Exit artifact |
|---|---|---|---|
| 1 | Mobile platform foundations | 8–10 weeks | Platform comparison and threat model |
| 2 | Android static and dynamic analysis | 10–12 weeks | Android assessment report |
| 3 | iOS and cross-platform frameworks | 8–10 weeks | iOS or Flutter analysis note |
| 4 | MASVS-driven assessment and APIs | 8–10 weeks | MASVS coverage matrix and API findings |
| 5 | Reporting, portfolio, and interviews | 6–8 weeks | Polished mobile report and casebook |

### Stage 1 — Mobile platform foundations

| Element | Detail |
|---|---|
| Goal | Understand how mobile apps are built, signed, installed, sandboxed, and updated on each platform. |
| Topics | Android app packaging (APK, AAB), signing, permissions, sandbox, intents, exported components; iOS app bundles, code signing, entitlements, keychain, URL schemes; mobile threat models; privacy basics; emulator versus physical device. |
| Free learning | [Android security best practices](https://developer.android.com/privacy-and-security/security-tips), [Apple Platform Security](https://support.apple.com/guide/security/welcome/web), [OWASP MASVS](https://mas.owasp.org/MASVS/), [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/). |
| Labs | Build a "hello world" Android app in Android Studio and inspect its APK. Build a simple iOS app in Xcode if you have macOS. Compare the permission models in writing. |
| Deliverable | A platform comparison and a threat model for a fictional banking app covering data at rest, in transit, and on a lost device. |
| Exit criteria | You can explain app signing, sandbox boundaries, and the main data stores on both platforms. |

### Stage 2 — Android static and dynamic analysis

| Element | Detail |
|---|---|
| Goal | Take an Android app apart, understand its components, and observe its runtime behaviour in a lab. |
| Topics | APK structure; manifest and resources; decompilation with jadx; smali basics; exported activities, services, receivers, and providers; hardcoded secrets; insecure storage; logging; network security configuration; Frida instrumentation; adb. |
| Free learning | [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF), [jadx](https://github.com/skylot/jadx), [Frida documentation](https://frida.re/docs/home/), [apktool](https://apktool.org/), [OWASP MASTG](https://mas.owasp.org/MASTG/). |
| Labs | Build a deliberately insecure Android app or use an open-source app you have permission to test. Scan it with MobSF, decompile with jadx, inspect exported components, intercept traffic with Burp, and observe a method call with Frida. |
| Deliverable | An Android assessment report with static findings, dynamic evidence, and MASVS mappings. |
| Exit criteria | You can explain how an exported component becomes reachable and demonstrate the risk on your own test app. |

### Stage 3 — iOS and cross-platform frameworks

| Element | Detail |
|---|---|
| Goal | Understand iOS app structure and the extra considerations introduced by Flutter and React Native. |
| Topics | IPA structure; entitlements and code signing; keychain and data protection; URL schemes and universal links; jailbreak detection concepts; iOS instrumentation options; Flutter and React Native packaging; shared secrets and API exposure in cross-platform apps. |
| Free learning | [Apple developer security](https://developer.apple.com/security/), [Apple Platform Security](https://support.apple.com/guide/security/welcome/web), [OWASP MASTG](https://mas.owasp.org/MASTG/), [Project Zero blog](https://googleprojectzero.blogspot.com/). |
| Labs | On macOS, build a small iOS app and inspect its bundle and entitlements. Use the simulator and Xcode tooling. If you lack macOS, analyze an open-source iOS app's public source and published security documentation instead, and state the limitation. |
| Deliverable | An iOS or cross-platform analysis note covering storage, transport, authentication, and platform-specific risks. |
| Exit criteria | You can describe how iOS protects data at rest and where app-level mistakes undermine those protections. |

### Stage 4 — MASVS-driven assessment and APIs

| Element | Detail |
|---|---|
| Goal | Run a structured assessment against MASVS controls and test the backend the app trusts. |
| Topics | MASVS categories: storage, cryptography, authentication, network communication, platform interaction, code quality, anti-tampering, privacy; MASTG test procedures; API authentication and authorization; certificate pinning and its limits; token lifetime and revocation; rate limiting. |
| Free learning | [OWASP MASVS](https://mas.owasp.org/MASVS/), [OWASP MASTG](https://mas.owasp.org/MASTG/), [OWASP API Security Top 10](https://owasp.org/www-project-api-security/), [PortSwigger Academy](https://portswigger.net/web-security) for API foundations. |
| Labs | Complete a MASVS checklist for one app. Test the app's API with two accounts. Evaluate certificate pinning on your own app and document how the backend behaves when a client is modified. |
| Deliverable | A MASVS coverage matrix with pass, fail, and not-tested entries, plus an API finding with impact. |
| Exit criteria | You can defend every "fail" with evidence and explain which controls were out of scope and why. |

Ethics reminder: only instrument apps you built or have written permission to test. Do not bypass protections on apps you use for banking, work, or personal data. Do not publish another developer's secrets, tokens, or user data. Mobile assessments often involve personal information; handle it as sensitive evidence and delete it when the engagement ends.

### Stage 5 — Reporting, portfolio, and interviews

| Element | Detail |
|---|---|
| Goal | Produce a report a mobile team can act on and present your work credibly. |
| Topics | Finding structure for mobile; severity and exploitability; screenshot and log evidence; remediation patterns for Android and iOS; privacy impact; retesting; portfolio redaction; interview case studies. |
| Free learning | [OWASP MASTG](https://mas.owasp.org/MASTG/), [OWASP MASVS](https://mas.owasp.org/MASVS/), [lab notes template](../templates/lab-notes.md), [FIRST CVSS](https://www.first.org/cvss/). |
| Labs | Write a full report for your Stage 2 app. Have a developer review the fixes. Practice a ten-minute walkthrough of one finding. |
| Deliverable | A 10–15 page mobile assessment report with executive summary, MASVS matrix, and prioritized remediation. |
| Exit criteria | A mobile developer can reproduce the top finding and implement the fix without a call. |

## Sequence diagram

```text
Stage 1  Mobile platform foundations
  Android | iOS | signing | sandbox | threat model
        |
        v
Stage 2  Android static + dynamic
  APK -> manifest -> jadx -> MobSF -> proxy -> Frida
        |
        v
Stage 3  iOS + cross-platform
  IPA | entitlements | keychain | Flutter / React Native
        |
        v
Stage 4  MASVS assessment + APIs
  controls -> storage -> crypto -> network -> auth -> backend
        |
        v
Stage 5  Reporting + portfolio
  evidence -> severity -> fixes -> retest -> interview
```

## Recommended free resources

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
|---|---|---|---|---|---|
| [OWASP MASTG](https://mas.owasp.org/MASTG/) | OWASP | Intermediate | Free | Test procedures | The reference testing methodology for mobile |
| [OWASP MASVS](https://mas.owasp.org/MASVS/) | OWASP | Intermediate | Free | No | Security requirements to assess against |
| [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/) | OWASP | Beginner–intermediate | Free | No | Risk categories and vocabulary |
| [Android security best practices](https://developer.android.com/privacy-and-security/security-tips) | Google | Beginner–intermediate | Free | Guidance | Platform security model and developer controls |
| [Android security bulletins](https://source.android.com/docs/security/bulletin) | Google | Intermediate | Free | No | Patch levels and platform vulnerabilities |
| [Apple Platform Security](https://support.apple.com/guide/security/welcome/web) | Apple | Intermediate | Free | No | iOS security architecture in detail |
| [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) | MobSF | Beginner–intermediate | Free, open source | Yes | Automated static and dynamic triage |
| [jadx](https://github.com/skylot/jadx) | jadx | Intermediate | Free, open source | Yes | APK decompilation and code reading |
| [Frida](https://frida.re/docs/home/) | Frida | Advanced | Free, open source | Yes | Runtime instrumentation in a lab |
| [apktool](https://apktool.org/) | apktool | Intermediate | Free, open source | Yes | APK decoding and rebuilding |
| [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) | OWASP | Intermediate | Free | No | Backend risks the app exposes |

## Hands-on labs

| # | Lab | Where | Focus | Cost |
|---|---|---|---|---|
| 1 | Build and inspect a hello-world APK | Android Studio | Packaging, signing, manifest | Free |
| 2 | MobSF scan and triage | Local Docker | Static analysis workflow | Free |
| 3 | Decompile an app you built | jadx | Code reading and secret discovery | Free |
| 4 | Proxy interception on an emulator | Burp or mitmproxy | TLS, pinning, API calls | Free |
| 5 | Frida observation on your own app | Local test device or emulator | Runtime instrumentation | Free |
| 6 | iOS bundle inspection | macOS and Xcode | Entitlements and keychain concepts | Requires macOS |
| 7 | MASVS checklist for one app | Local | Structured coverage and evidence | Free |
| 8 | Full mobile report | Local | Severity, fixes, communication | Free |

Safe-lab caveat: use apps you wrote, open-source apps whose maintainers permit testing, or deliberately vulnerable training apps. Rooting or jailbreaking a device voids warranties and can expose real data; use a dedicated test device with no personal accounts. Keep test devices off untrusted networks, and do not install untrusted apps on a device that holds your identity or banking credentials. Never test an app from an app store just because it is downloadable; permission is required.

## Portfolio projects

1. **Android assessment report.** A MASVS-mapped review of an app you built, with static and dynamic evidence, severity, and fixes. Include the vulnerable code and the patched code.
2. **Mobile threat model.** A data-flow diagram for a fictional banking app covering device loss, malicious apps, network interception, and backend trust. Pair each threat with a control and a test.
3. **Instrumentation notebook.** Three Frida scripts against your own test app that observe storage, authentication, and network calls, with an explanation of what each hook reveals.
4. **Cross-platform analysis note.** A Flutter or React Native app reviewed for shared secrets, API exposure, and platform-specific storage differences.
5. **MASVS checklist template.** A reusable evidence spreadsheet with control IDs, test procedures, status, and evidence references. This is useful to teams, not just hiring managers.

## Milestones and self-assessment

**Months 0–4**

- [ ] I can explain Android and iOS app signing and sandboxing.
- [ ] I built and inspected an APK and, if possible, an iOS app bundle.
- [ ] I wrote a threat model for a mobile app with five credible threats.
- [ ] I can navigate adb and an emulator without help.

**Months 4–8**

- [ ] I ran MobSF and validated three of its findings manually.
- [ ] I decompiled an app and found an exported component or hardcoded value.
- [ ] I intercepted app traffic with a proxy and explained the authentication flow.
- [ ] I wrote an Android assessment report with MASVS mappings.

**Months 8–13**

- [ ] I used Frida to observe a method call in an app I built.
- [ ] I completed a MASVS checklist with evidence for every status.
- [ ] I tested an API behind a mobile app with two accounts.
- [ ] I documented an iOS or cross-platform analysis with clear limitations.

**Months 13–18**

- [ ] I wrote a full mobile report and had a developer review the fixes.
- [ ] My portfolio contains a redacted Android report and an instrumentation notebook.
- [ ] I can explain certificate pinning, keychain storage, and exported components in an interview.
- [ ] I completed a mock walkthrough of one finding in ten minutes.

## Certifications

Mobile-specific certifications are limited and optional. Every exam below is paid; free study material exists for most. Practical evidence usually outweighs a certificate in this niche.

| Certification | Provider | Level | Free study available | Exam model | Honest note |
|---|---|---|---|---|---|
| [Security+](https://www.comptia.org/certifications/security) | CompTIA | Beginner | Professor Messer and community notes | Paid exam | General baseline, not mobile-specific |
| [eMAPT](https://ine.com/security/certifications/emapt-certification) | INE | Intermediate | Some free INE material | Paid exam | Practical mobile application testing credential; verify current format |
| [GMOB](https://www.giac.org/certifications/mobile-device-security-analyst-gmob/) | GIAC | Intermediate–advanced | SANS posters and whitepapers; course is paid | Paid exam | Enterprise mobile security focus; expensive |
| [OSWA](https://www.offsec.com/courses/web-200/) | OffSec | Intermediate | Syllabus and community resources | Paid course and exam | Web and API skills that support mobile backend testing |
| [Burp Suite Certified Practitioner](https://portswigger.net/web-security/certification) | PortSwigger | Intermediate–advanced | Academy labs are free | Paid practical exam | Useful for the API side of mobile work |

## Common detours and mistakes

- **Automated scan as the assessment.** MobSF output is a starting point. Every finding needs manual validation and context.
- **Ignoring the backend.** Many mobile weaknesses are API authorization flaws. The app is a client, not the trust boundary.
- **Testing store apps without permission.** Downloading an APK does not grant authorization. Use your own apps or explicit programs.
- **Assuming an emulator is enough.** Emulators miss hardware-backed keystores, biometrics, and real network conditions. Use a test device when you can.
- **Underestimating iOS constraints.** Without macOS, iOS dynamic work is limited. Be honest in reports about what you could not test.
- **Publishing secrets.** Screenshots and logs often contain tokens or personal data. Redact before sharing.
- **Rooting a personal phone.** A rooted daily driver with banking apps is a real risk. Use a dedicated test device.
- **Memorizing Frida scripts.** Understand what a hook does and why. Interviewers ask you to adapt, not recite.

## Next steps

1. Set up Android Studio, MobSF, jadx, and Burp, then work through [01-home-lab.md](../practical-projects/01-home-lab.md) with a mobile VM or host.
2. Read the [mobile security guide](../mobile-security/README.md) and the [OWASP MASTG](https://mas.owasp.org/MASTG/) before your first assessment.
3. Build one deliberately insecure app, find its flaws, fix them, and document both versions.
4. If your interest is broader application security, continue with the [web security specialist roadmap](web-security-specialist.md); for backend and cloud exposure, see the [cloud security engineer roadmap](cloud-security-engineer.md).
5. Use the [exercises](../exercises/README.md) and [lab notes template](../templates/lab-notes.md) to keep evidence consistent.

## References

- [OWASP Mobile Application Security](https://mas.owasp.org/)
- [OWASP MASVS](https://mas.owasp.org/MASVS/)
- [OWASP MASTG](https://mas.owasp.org/MASTG/)
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)
- [Android security best practices](https://developer.android.com/privacy-and-security/security-tips)
- [Apple Platform Security](https://support.apple.com/guide/security/welcome/web)
- [NIST SP 800-163: Vetting the Security of Mobile Applications](https://csrc.nist.gov/pubs/sp/800/163/final)

---

**Continue:** [Repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Training grounds](../resources/training-grounds/README.md) · [Contributing](../CONTRIBUTING.md)
