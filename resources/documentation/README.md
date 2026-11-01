# Official Documentation, Standards, and References

Primary sources beat blog summaries. This page collects 36 authoritative documents that define how security is measured, tested, and reported: standards bodies, government guidance, protocol specifications, and vendor security documentation. Every entry is free to read.

> Ethics reminder: standards describe controls and tests, not permission. Applying a testing methodology to a system you do not own is still unauthorised access. See [../../ETHICS.md](../../ETHICS.md).

## How to use this page

Standards are reference material, not reading lists. Nobody reads SP 800-53 from cover to cover, and you should not try.

- **Start from a question.** "How should I structure an incident response plan?" leads to SP 800-61. "What should I check in a web app?" leads to the WSTG.
- **Read the scope and audience section first.** Every serious standard states what it covers and, more usefully, what it does not.
- **Check the version and date.** Control catalogs are revised; an outdated mapping is worse than none.
- **Extract, do not absorb.** Copy the clauses relevant to your task into your own notes with the section number.
- **Trace the source.** A vendor blog claiming a requirement usually paraphrases one of these documents; cite the original.

## At a glance

| Family | Entries | Best for |
| --- | --- | --- |
| NIST publications | 7 | Risk management, control catalogs, incident response, testing, zero trust, secure development, identity |
| MITRE knowledge bases | 5 | Adversary behaviour, defensive countermeasures, weakness taxonomy, attack patterns, vulnerability identifiers |
| OWASP projects | 6 | Application security verification, testing, mobile testing, implementation guidance, programme maturity |
| CISA guidance | 3 | Exploited vulnerabilities, baseline hygiene, ransomware response |
| Control frameworks and compliance | 5 | Auditable controls, benchmarks, payment card scope, information security management |
| IETF RFCs | 4 | Exact protocol behaviour for TLS, HTTP, OAuth, and JWT |
| Vendor and platform documentation | 4 | Cloud, operating system, container, and orchestrator specifics |
| Supply chain | 2 | Build integrity and open-source project posture |

## NIST publications

| Document | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework) | NIST | A governance-level structure for organising security outcomes across an organisation | Beginner to intermediate | Free |
| [SP 800-53 Rev. 5: Security and Privacy Controls](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) | NIST | The control catalog most enterprise security programmes map to | Advanced | Free |
| [SP 800-61 Rev. 3: Incident Response Recommendations](https://csrc.nist.gov/pubs/sp/800/61/r3/final) | NIST | How to plan, run, and improve incident response | Intermediate | Free |
| [SP 800-115: Technical Guide to Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final) | NIST | The disciplined structure behind penetration testing and assessment | Intermediate | Free |
| [SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) | NIST | What zero trust means precisely, and what it does not | Advanced | Free |
| [SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) | NIST | Practices to build into a development lifecycle, and the basis for SSDF attestations | Intermediate | Free |
| [SP 800-63-4: Digital Identity Guidelines](https://pages.nist.gov/800-63-4/) | NIST | Authenticator assurance levels, federation, and identity proofing | Advanced | Free |

## MITRE knowledge bases

| Resource | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [MITRE ATT&CK](https://attack.mitre.org/) | MITRE | The common vocabulary for adversary tactics and techniques, used by both red and blue teams | Beginner to advanced | Free |
| [MITRE D3FEND](https://d3fend.mitre.org/) | MITRE | A countermeasure taxonomy that pairs with ATT&CK techniques | Intermediate | Free |
| [Common Weakness Enumeration (CWE)](https://cwe.mitre.org/) | MITRE | The naming system for software weakness classes; use it to make findings comparable | Beginner to advanced | Free |
| [Common Attack Pattern Enumeration and Classification (CAPEC)](https://capec.mitre.org/) | MITRE | Attack patterns described from the attacker's perspective | Intermediate | Free |
| [CVE Program](https://www.cve.org/) | MITRE | The identifier system for publicly disclosed vulnerabilities | Beginner | Free |

## OWASP projects

| Resource | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [OWASP Top 10](https://owasp.org/www-project-top-ten/) | OWASP | Awareness-level ranking of web application risk categories | Beginner | Free |
| [Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Testable requirements for verifying an application's security level | Intermediate to advanced | Free |
| [Web Security Testing Guide (WSTG)](https://owasp.org/www-project-web-security-testing-guide/) | OWASP | The test-case catalog that structures a professional web assessment | Intermediate | Free |
| [Mobile Application Security Testing Guide (MASTG)](https://mas.owasp.org/MASTG/) | OWASP | Android and iOS testing methodology and tooling | Intermediate | Free |
| [Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | OWASP | Concise implementation guidance you can hand to a developer | Beginner to intermediate | Free |
| [Software Assurance Maturity Model (SAMM)](https://owasp.org/www-project-samm/) | OWASP | A way to measure and improve an application security programme | Intermediate | Free |

## CISA guidance

| Resource | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | CISA | The list to prioritise against when you cannot patch everything at once | Beginner | Free |
| [Cyber Essentials](https://www.cisa.gov/cyber-essentials) | CISA | Baseline hygiene practices for small and mid-sized organisations | Beginner | Free |
| [StopRansomware Guide](https://www.cisa.gov/stopransomware/ransomware-guide) | CISA | Preparation, response, and recovery guidance for ransomware incidents | Intermediate | Free |

CISA pages frequently block automated requests. If a link returns an error in a script but loads in a browser, treat the browser result as authoritative.

## Control frameworks and compliance

| Framework | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [CIS Critical Security Controls](https://www.cisecurity.org/controls) | Center for Internet Security | A prioritised, prescriptive control set with clear implementation groups | Beginner to intermediate | Free |
| [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) | Center for Internet Security | Hardening baselines for operating systems, clouds, and applications | Intermediate | Free account for some benchmarks |
| [PCI DSS](https://www.pcisecuritystandards.org/standards/pci-dss/) | PCI Security Standards Council | Requirements for systems that store, process, or transmit cardholder data | Intermediate | Free |
| [ISO/IEC 27001](https://www.iso.org/standard/27001) | ISO/IEC | The international standard for an information security management system | Advanced | Paid standard, free overview |
| [NIST Glossary](https://csrc.nist.gov/glossary) | NIST | Authoritative definitions when a term is used loosely across sources | Beginner | Free |

Compliance is not security. A system can pass an audit and still be trivially compromisable; use frameworks to organise work, not to conclude it.

## IETF RFCs

| Specification | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [RFC 8446: TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) | IETF | Exact handshake and record-layer behaviour when you need to reason about TLS | Advanced | Free |
| [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) | IETF | The definition of methods, status codes, and header semantics behind most web findings | Intermediate | Free |
| [RFC 6749: OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) | IETF | The authorisation flows that most modern web applications implement incorrectly | Intermediate | Free |
| [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519) | IETF | What a JWT actually guarantees, and the many things it does not | Intermediate | Free |

When a report claims "the server mishandles X", the RFC is how you prove it.

## Vendor and platform documentation

| Document | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [AWS Well-Architected: Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) | Amazon Web Services | Design review questions that map to real cloud findings | Intermediate | Free |
| [Windows security baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines) | Microsoft | The vendor's own hardening configuration for Windows | Intermediate | Free |
| [Kubernetes security concepts](https://kubernetes.io/docs/concepts/security/) | Kubernetes project | Pod security, RBAC, secrets, and admission control from the source | Intermediate | Free |
| [Docker Engine security](https://docs.docker.com/engine/security/) | Docker | Daemon, namespace, and image security as implemented | Intermediate | Free |

## Supply chain and open-source posture

| Resource | Publisher | What it is for | Level | Access |
| --- | --- | --- | --- | --- |
| [SLSA](https://slsa.dev/) | OpenSSF | A graded framework for build integrity and provenance | Intermediate to advanced | Free |
| [OpenSSF](https://openssf.org/) | Open Source Security Foundation | Projects and guidance for securing the open-source supply chain | Intermediate | Free |

## Reading a standard without drowning

1. **Read the introduction and scope.** Ten minutes here saves hours later.
2. **Find the control or test that matches your task**, using the table of contents or search.
3. **Copy the exact clause number into your notes.** Reports that cite "SP 800-53 AC-6" are auditable; reports that cite "least privilege, somewhere in NIST" are not.
4. **Note the assumptions.** Many controls assume an asset inventory, an identity provider, or logging that your environment may not have.
5. **Write a one-sentence translation into your context.** "AC-6 means our service accounts should not be domain administrators."
6. **Check the revision history** if you are comparing against an older internal policy.

## Mapping between frameworks

Organisations rarely use one framework. Common mappings:

- CIS Controls to NIST CSF: use the CIS controls as the "how" and the CSF as the "why".
- SP 800-53 to ISO 27001: map control families to Annex A themes, then document the gaps.
- OWASP ASVS to internal secure coding standards: use ASVS levels to set the bar per application tier.
- ATT&CK to detection content: every detection rule should name the technique it covers, or state that it covers none.

Mappings are lossy. Record where a mapping is approximate; future auditors will ask.

## Common mistakes

- **Citing a framework instead of a control.** "Aligned with NIST" means nothing without the clause.
- **Using the OWASP Top 10 as a test plan.** It is an awareness document; the WSTG and ASVS are the testable ones.
- **Treating compliance as completeness.** Audits sample; attackers do not.
- **Using an outdated benchmark.** Hardening guidance for a version you no longer run creates false confidence.
- **Ignoring the RFCs.** Half of "weird server behaviour" findings become obvious once you read the specification.
- **Quoting a blog that quotes a standard.** Go to the source and cite it.
- **Forgetting accessibility of the document itself.** If a colleague cannot access a paid standard, summarise the relevant clause instead of linking it as required reading.

## Next steps

1. Bookmark the three documents most relevant to your current work, not all 36.
2. Add clause numbers to the next report you write.
3. Pair standards with practice: [../training-grounds/README.md](../training-grounds/README.md).
4. Use the [glossary](../../glossary/README.md) when a standard's terminology conflicts with a vendor's.
5. Review [../open-source-tools/README.md](../open-source-tools/README.md) to see which tools implement these controls.

## Catalog status

Catalog status: 36 official documents and standards across 8 sections.

Last reviewed: 2026-10-31

---

Back to the [resources index](../README.md), the [learning guide](../../LEARNING-GUIDE.md), and [contribution guidance](../../CONTRIBUTING.md).
