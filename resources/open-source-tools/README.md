# Open-Source and Free Security Tools

A function-organised index of 77 tools that practitioners actually use, with the licence and supported platforms stated so you know what you are installing. Each entry names one legitimate purpose. Tools are amplifiers: they do not replace scoping, methodology, or a written report.

> Ethics reminder: running any tool against a system you do not own or have written permission to test is potential computer misuse. The purpose column describes authorised use only. See [../../ETHICS.md](../../ETHICS.md).

## How to read this index

- **Function first.** Tools are grouped by the job they do, not by vendor or popularity.
- **Licence matters.** Some entries are copyleft, some are permissive, and two are source-available rather than open source. Read the licence before you redistribute or embed a tool.
- **Platform** lists where the tool runs natively; container support is noted where it exists.
- **Purpose** is deliberately narrow. It is the defensible use, not every possible use.
- **Versions change.** The index describes capability, not a specific release.

## At a glance

| Category | Tools | Typical use |
| --- | --- | --- |
| Reconnaissance and OSINT | 10 | Mapping owned or authorised attack surface |
| Web application testing | 9 | Finding and confirming web flaws in scope |
| Network discovery and monitoring | 7 | Understanding traffic and exposed services |
| Identity and Active Directory | 5 | Testing directory and authentication exposure |
| Adversary emulation | 3 | Rehearsing techniques to validate detection |
| Cloud and container security | 8 | Auditing configuration and workload risk |
| Forensics and incident response | 7 | Reconstructing what happened from evidence |
| Malware analysis | 5 | Understanding hostile code safely |
| Blue team and detection | 8 | Turning telemetry into detection |
| DevSecOps | 10 | Embedding checks into the build pipeline |
| Hardening and compliance | 5 | Reducing exposure and proving baseline |

## Reconnaissance and OSINT

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Nmap](https://nmap.org/) | Nmap Public Source License (NPSL) | Linux, macOS, Windows | Map reachable hosts and services to confirm what an approved scope actually exposes |
| [Masscan](https://github.com/robertdavidgraham/masscan) | AGPL-3.0 | Linux, macOS | Inventory ports across large ranges you own, faster than a full Nmap sweep |
| [Amass](https://github.com/owasp-amass/amass) | Apache-2.0 with some subcomponent variation | Linux, macOS, Windows | Map external attack surface from public sources before an engagement |
| [Subfinder](https://github.com/projectdiscovery/subfinder) | MIT | Linux, macOS, Windows | Passive subdomain discovery to define the real scope of an assessment |
| [httpx](https://github.com/projectdiscovery/httpx) | MIT | Linux, macOS, Windows | Probe HTTP services at scale and fingerprint what is responding |
| [Nuclei](https://github.com/projectdiscovery/nuclei) | MIT | Linux, macOS, Windows | Run template-based checks to validate known exposures and misconfigurations |
| [Katana](https://github.com/projectdiscovery/katana) | MIT | Linux, macOS, Windows | Crawl modern applications to build a complete endpoint map for testing |
| [theHarvester](https://github.com/laramies/theHarvester) | GPL-2.0 | Linux, macOS, Windows | Collect publicly available hosts and addresses during authorised OSINT work |
| [Recon-ng](https://github.com/lanmaster53/recon-ng) | GPL-3.0 | Linux, macOS | Run a modular OSINT workflow that stores findings in a queryable database |
| [SpiderFoot](https://github.com/smicallef/spiderfoot) | MIT | Linux, macOS, Windows, Docker | Correlate open sources automatically to find forgotten or unknown assets |

## Web application testing

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [OWASP ZAP](https://www.zaproxy.org/) | Apache-2.0 | Linux, macOS, Windows, Docker | Intercept and scan web traffic, including automated baseline scans in CI |
| [sqlmap](https://sqlmap.org/) | GPL-2.0 | Linux, macOS, Windows | Confirm SQL injection and demonstrate its impact on an in-scope application |
| [Nikto](https://github.com/sullo/nikto) | GPL-2.0 | Linux, macOS, Windows | Flag server misconfiguration and outdated components quickly |
| [ffuf](https://github.com/ffuf/ffuf) | MIT | Linux, macOS, Windows | Fuzz directories, parameters, and virtual hosts within an approved scope |
| [Gobuster](https://github.com/OJ/gobuster) | Apache-2.0 | Linux, macOS, Windows | Enumerate directories, DNS names, and virtual hosts during discovery |
| [WPScan](https://github.com/wpscanteam/wpscan) | WPScan Public Source License (source-available, not OSI open source) | Linux, macOS, Docker | Enumerate WordPress versions, plugins, and users on sites you administer |
| [Commix](https://github.com/commixproject/commix) | GPL-3.0 | Linux, macOS | Test for command injection in authorised applications |
| [Dalfox](https://github.com/hahwul/dalfox) | MIT | Linux, macOS, Windows | Find and verify cross-site scripting with minimal false positives |
| [jwt_tool](https://github.com/ticarpi/jwt_tool) | GPL-3.0 | Linux, macOS, Windows | Analyse and test JSON Web Token implementations for common design flaws |

## Network discovery and monitoring

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Scapy](https://github.com/secdev/scapy) | GPL-2.0 | Linux, macOS, Windows | Craft and inspect packets to test protocol handling and generate PCAP evidence |
| [Bettercap](https://github.com/bettercap/bettercap) | GPL-3.0 | Linux, macOS | Test man-in-the-middle resilience on network segments you control |
| [Responder](https://github.com/lgandx/Responder) | GPL-3.0 | Linux | Demonstrate name-resolution credential exposure inside an isolated lab |
| [mitmproxy](https://github.com/mitmproxy/mitmproxy) | MIT | Linux, macOS, Windows | Intercept TLS traffic from your own clients to test application behaviour |
| [Zeek](https://github.com/zeek/zeek) | BSD-3-Clause | Linux, macOS | Produce structured network telemetry for monitoring and investigation |
| [tcpdump](https://www.tcpdump.org/) | BSD-3-Clause | Linux, macOS | Capture traffic on hosts without a GUI for troubleshooting or evidence |
| [RustScan](https://github.com/RustScan/RustScan) | GPL-3.0 | Linux, macOS, Docker | Discover open ports quickly, then hand results to Nmap for detail |

## Identity and Active Directory

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Impacket](https://github.com/fortra/impacket) | Apache-2.0 (modified) | Linux, macOS, Windows | Exercise SMB, Kerberos, and directory protocols to validate authentication controls |
| [NetExec](https://github.com/Pennyw0rth/NetExec) | BSD-2-Clause | Linux, macOS, Windows | Enumerate and validate Active Directory access with authorised credentials |
| [BloodHound](https://github.com/SpecterOps/BloodHound) | Apache-2.0 | Linux, macOS, Windows | Graph identity attack paths so permissions can be reduced systematically |
| [Kerbrute](https://github.com/ropnop/kerbrute) | Apache-2.0 | Linux, macOS, Windows | Test Kerberos account enumeration and password policy with explicit authorisation |
| [Evil-WinRM](https://github.com/Hackplayers/evil-winrm) | LGPL-3.0 | Linux, macOS, Windows | Obtain a remote shell during authorised Windows post-exploitation validation |

## Adversary emulation

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Caldera](https://caldera.mitre.org/) | Apache-2.0 | Linux, macOS, Windows, Docker | Automate ATT&CK-mapped emulation against lab hosts to measure detection coverage |
| [Atomic Red Team](https://atomicredteam.io/) | MIT | Windows, Linux, macOS | Run small, reversible technique tests that prove a detection works |
| [Sliver](https://github.com/BishopFox/sliver) | GPL-3.0 | Linux, macOS, Windows | Operate a command-and-control framework during authorised red-team exercises, fully isolated |

## Cloud and container security

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Prowler](https://github.com/prowler-cloud/prowler) | Apache-2.0 | Linux, macOS, Docker | Assess cloud accounts against CIS benchmarks and security best practice |
| [ScoutSuite](https://github.com/nccgroup/ScoutSuite) | GPL-2.0 | Linux, macOS, Windows | Review multi-cloud configuration and surface risky settings |
| [Pacu](https://github.com/RhinoSecurityLabs/pacu) | BSD-3-Clause | Linux, macOS | Test AWS exploitation paths during an authorised cloud assessment |
| [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | BSD-3-Clause | Linux, macOS | Practise cloud attack scenarios in a deliberately vulnerable AWS account |
| [Trivy](https://github.com/aquasecurity/trivy) | Apache-2.0 | Linux, macOS, Windows, Docker | Scan images, filesystems, and infrastructure-as-code for known issues |
| [kube-bench](https://github.com/aquasecurity/kube-bench) | Apache-2.0 | Linux, Docker | Check Kubernetes clusters against the CIS benchmark |
| [Checkov](https://github.com/bridgecrewio/checkov) | Apache-2.0 | Linux, macOS, Windows | Catch insecure infrastructure-as-code before it reaches production |
| [Falco](https://github.com/falcosecurity/falco) | Apache-2.0 | Linux, Docker, Kubernetes | Detect suspicious runtime behaviour using system call rules |

## Forensics and incident response

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Autopsy](https://www.autopsy.com/) | Apache-2.0 | Windows, Linux, macOS | Triage disk images and build a defensible timeline quickly |
| [The Sleuth Kit](https://www.sleuthkit.org/) | IPL, CPL, and GPL components | Linux, macOS, Windows | Analyse file systems at a low level when a GUI is not enough |
| [Volatility 3](https://github.com/volatilityfoundation/volatility3) | Volatility Software License (open source, custom terms) | Linux, macOS, Windows | Recover processes, connections, and injected code from memory images |
| [Plaso](https://github.com/log2timeline/plaso) | Apache-2.0 | Linux, macOS, Docker | Build a super-timeline from disparate artifact sources |
| [MISP](https://github.com/MISP/MISP) | AGPL-3.0 | Linux, Docker | Share and correlate threat intelligence inside a trusted community |
| [TheHive](https://github.com/TheHive-Project/TheHive) | AGPL-3.0 | Linux, Docker | Manage incident response cases with consistent evidence handling |
| [IRIS](https://github.com/dfir-iris/iris-web) | LGPL-3.0 | Linux, Docker | Track DFIR cases, evidence, and findings in one collaborative workspace |

## Malware analysis

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [YARA](https://github.com/VirusTotal/yara) | BSD-3-Clause | Linux, macOS, Windows | Write pattern rules that identify malware families and variants |
| [capa](https://github.com/mandiant/capa) | Apache-2.0 | Linux, macOS, Windows | Identify the capabilities of an executable without full reverse engineering |
| [FLOSS](https://github.com/mandiant/flare-floss) | Apache-2.0 | Linux, macOS, Windows | Extract obfuscated strings that reveal command-and-control infrastructure |
| [Cuckoo3](https://github.com/cert-ee/cuckoo3) | EUPL-1.2 | Linux | Automate sandbox analysis of suspicious files in an isolated environment |
| [Ghidra](https://ghidra-sre.org/) | Apache-2.0 | Linux, macOS, Windows | Disassemble and decompile binaries for vulnerability research and malware triage |

## Blue team and detection

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Suricata](https://github.com/OISF/suricata) | GPL-2.0 | Linux, macOS, Windows | Inspect network traffic for known-bad patterns and generate alert data |
| [Sigma](https://github.com/SigmaHQ/sigma) | Detection Rule License (DRL) | Platform-independent rules | Write vendor-neutral detection logic that converts to many SIEM query languages |
| [Wazuh](https://wazuh.com/) | GPL-2.0 and AGPL-3.0 components | Linux, Docker, Windows agents | Run open-source SIEM and endpoint monitoring with built-in compliance checks |
| [OpenCanary](https://github.com/thinkst/opencanary) | BSD-3-Clause | Linux, macOS | Detect unauthorised access with a low-interaction honeypot |
| [Velociraptor](https://github.com/Velocidex/velociraptor) | Apache-2.0 | Linux, macOS, Windows | Collect endpoint evidence and hunt across fleets at scale |
| [Chainsaw](https://github.com/WithSecureLabs/chainsaw) | GPL-3.0 | Linux, macOS, Windows | Triage Windows event logs rapidly with Sigma detection rules |
| [Hayabusa](https://github.com/Yamato-Security/hayabusa) | AGPL-3.0 | Windows, Linux | Hunt through Windows event logs using a large built-in Sigma rule set |
| [Timesketch](https://github.com/google/timesketch) | Apache-2.0 | Linux, Docker | Analyse and share timelines collaboratively during an investigation |

## DevSecOps

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Semgrep](https://github.com/semgrep/semgrep) | LGPL-2.1 | Linux, macOS, Windows, Docker | Run fast pattern-based static analysis inside the pipeline |
| [Bandit](https://github.com/PyCQA/bandit) | Apache-2.0 | Linux, macOS, Windows | Find common security issues in Python code before review |
| [Gitleaks](https://github.com/gitleaks/gitleaks) | MIT | Linux, macOS, Windows, Docker | Detect secrets committed to git history and block them in future commits |
| [TruffleHog](https://github.com/trufflesecurity/trufflehog) | AGPL-3.0 | Linux, macOS, Windows | Find and verify leaked credentials across repositories and storage |
| [detect-secrets](https://github.com/Yelp/detect-secrets) | Apache-2.0 | Linux, macOS, Windows | Apply a baseline secret scan as a pre-commit hook |
| [OWASP Dependency-Check](https://github.com/jeremylong/DependencyCheck) | Apache-2.0 | Linux, macOS, Windows | Identify known vulnerable dependencies in a build |
| [Syft](https://github.com/anchore/syft) | Apache-2.0 | Linux, macOS, Windows, Docker | Generate a software bill of materials from images and filesystems |
| [Grype](https://github.com/anchore/grype) | Apache-2.0 | Linux, macOS, Windows, Docker | Scan images and SBOMs for vulnerabilities that matter to you |
| [Cosign](https://github.com/sigstore/cosign) | Apache-2.0 | Linux, macOS, Windows | Sign and verify container images to protect the supply chain |
| [OpenSSF Scorecard](https://github.com/ossf/scorecard) | Apache-2.0 | Linux, macOS, Windows | Assess the security posture of open-source dependencies before adopting them |

## Hardening and compliance

| Tool | Licence | Platform | Authorised purpose |
| --- | --- | --- | --- |
| [Lynis](https://github.com/Cisofy/lynis) | GPL-3.0 | Linux, macOS | Audit a host's hardening state and track improvements over time |
| [OpenSCAP](https://github.com/OpenSCAP/openscap) | LGPL-2.1 | Linux | Evaluate systems and containers against SCAP compliance content |
| [Chef InSpec](https://github.com/inspec/inspec) | Apache-2.0 | Linux, macOS, Windows | Express compliance requirements as executable tests |
| [Fail2ban](https://github.com/fail2ban/fail2ban) | GPL-2.0 | Linux | Reduce brute-force exposure by reacting to authentication logs |
| [ModSecurity with OWASP CRS](https://github.com/coreruleset/coreruleset) | Apache-2.0 | Linux, Windows, Docker | Add a web application firewall layer with community-maintained rules |

## Licence literacy

Licences determine what you may do with a tool, not just whether it is free.

| Licence family | Examples here | Practical consequence |
| --- | --- | --- |
| Permissive (MIT, BSD, Apache-2.0) | Nuclei, YARA, Trivy | Easy to embed and redistribute with attribution obligations |
| Copyleft (GPL, AGPL, LGPL) | Nikto, Sliver, MISP, Semgrep | Distribution or network use can trigger source-sharing obligations |
| Source-available, non-OSI | WPScan, Nmap (NPSL) | Free to use with conditions; not the same freedom as open source |
| Custom open-source terms | Volatility 3, Sleuth Kit components | Read the actual text before commercial deployment |

If you plan to use a tool in a product or a client deliverable, have someone confirm the licence rather than assuming "open source" means unrestricted.

## Installation hygiene

- **Prefer official sources.** Project site, official repository, or your distribution's signed package repository.
- **Verify what you download.** Check release signatures or checksums where the project publishes them.
- **Pin versions in automation.** A scanner that changes behaviour silently will eventually break your pipeline or your evidence.
- **Isolate offensive tooling.** Run it in a dedicated VM or container, not on your daily-driver host.
- **Read the install script before running it.** Many tools ask for elevated privileges; know why.

## Principles that outlast tooling

1. A tool answers the question you ask. Bad scoping produces confident, useless output.
2. Automated findings need human confirmation before they become report claims.
3. The absence of findings is not the absence of vulnerabilities; it may be the absence of coverage.
4. Detection tools and offensive tools are two views of the same behaviour. Learn both.
5. Write down what you ran, when, and against what. Reproducibility is a professional obligation.

## Further reading

- Learning paths that use these tools: [../free-courses/README.md](../free-courses/README.md)
- Practice environments: [../training-grounds/README.md](../training-grounds/README.md)
- Standards these tools map to: [../documentation/README.md](../documentation/README.md)
- Project ideas that produce portfolio evidence: [../../practical-projects/README.md](../../practical-projects/README.md)

## Catalog status

Catalog status: 77 tools across 11 functional categories.

Last reviewed: 2026-10-31

---

Back to the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
