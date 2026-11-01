[Repository home](../../README.md) / Additional topics / DevSecOps

# DevSecOps

DevSecOps is the practice of building security into software delivery instead of inspecting it at the end. It combines secure design, automated testing, supply-chain integrity, and pipeline hardening with the cultural goal of making the secure path the easy path for developers. This guide is for engineers, AppSec practitioners, and platform teams who want controls that catch real defects without turning every pull request into a bureaucratic checkpoint.

The hard part is not running a scanner. It is choosing which controls produce trustworthy signal, wiring them into the delivery flow at the right moment, and handling the findings noisily enough to be useful and quietly enough that developers do not route around them.

## At a glance

| Dimension | Reality |
| --- | --- |
| Difficulty | Intermediate; advanced for supply-chain and platform work |
| Realistic time | 100–150 hours to design and operate a basic secure pipeline |
| Cost | Free on public repositories and local tooling; paid CI runners and enterprise scanners optional |
| Prerequisites | Git, CI/CD concepts, Docker, one cloud provider, shell or Python |
| Lab requirement | Repositories and pipelines you control; isolated runners for untrusted code |
| Best for | AppSec engineers, platform engineers, SREs, build engineers |

## Why this field matters

Most organizations deploy many times a day. A vulnerability found in production costs orders of magnitude more to fix than the same defect caught in a pull request, and a compromised build pipeline can poison every artifact downstream. The 2020 SolarWinds incident demonstrated that attackers increasingly target the build system rather than the product: if you can alter the artifact after review, code review does not help.

DevSecOps exists to make those risks visible and controllable. It gives teams reproducible evidence — scan results, signed provenance, SBOMs, policy decisions — that security was considered at each stage. It also gives security teams a scalable way to work: automate the checks that are deterministic and spend human time on design, threat modeling, and the findings that need judgment.

## What you will learn

- Integrate threat modeling, SAST, DAST, SCA, secret scanning, and IaC scanning into a delivery flow.
- Harden CI/CD against untrusted pull requests, script injection, and over-privileged tokens.
- Generate and consume SBOMs, sign artifacts, and verify provenance before deployment.
- Write policy as code and design gates that reduce risk without causing gate fatigue.
- Measure a security program with metrics that reflect risk rather than tool output volume.
- Map practices to OWASP SAMM, OWASP ASVS, and the NIST SSDF.

## Prerequisites and honest expectations

You should be comfortable with Git branches and pull requests, have built or used a CI pipeline, and understand containers and basic cloud identity. You do not need to be a Kubernetes expert, but you should know what a service account and an IAM role are.

Expect to spend more time on workflow design than on tools. Every scanner has a tutorial; the difficult questions are where it runs, what it blocks, who triages the finding, and how exceptions expire. You will also hit organizational resistance if you introduce gates without a remediation path. Plan for that from the beginning.

## Core concepts

### Secure SDLC and the economics of shifting left

A secure software development lifecycle defines security activities at each phase: requirements, design, implementation, verification, release, and operations. "Shift left" means moving detection earlier, where fixes are cheaper, but it does not mean moving every activity to developers. Design-level threat modeling and abuse cases catch classes of bugs that no scanner will find.

The economic argument is simple: a design flaw fixed on a whiteboard costs a meeting; the same flaw in production costs an incident, a patch release, and trust. The practical argument is subtler: too many early gates slow delivery and get disabled. Choose a small number of high-value checks, automate them, and make the results actionable.

### Threat modeling in the delivery flow

Threat modeling identifies assets, trust boundaries, and abuse cases before code exists. For a service, the diagram usually includes the client, API, identity provider, database, message queue, and third-party integrations. STRIDE prompts you to ask about spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege at each boundary.

In DevSecOps, the threat model should be a living artifact in the repository, not a PDF in a shared drive. Review it when the architecture changes, link findings to issues, and use it to decide which automated checks matter. A service that accepts file uploads needs different tests than one that only reads a queue.

### Static analysis (SAST)

SAST inspects source code for patterns such as tainted data reaching a dangerous sink, missing authorization checks, or weak cryptography. Semgrep is approachable and fast, with rules that are readable and easy to customize. CodeQL builds a queryable database of the code and supports deeper interprocedural analysis.

SAST's weakness is false positives and missing context. A rule that flags every string concatenation into SQL will bury the team. Start with a curated ruleset for the languages and frameworks you use, run it in diff-aware mode on pull requests, and establish a baseline for existing code so the gate applies to new risk rather than historical debt.

### Dynamic analysis (DAST)

DAST tests a running application from the outside, sending requests and looking for vulnerabilities such as injection, broken authentication, and misconfiguration. OWASP ZAP is the common open-source choice; it can run in baseline mode against a URL or in full active mode with authentication. DAST finds issues that SAST cannot see, including runtime configuration and framework behavior.

DAST needs a deployed target, test data, and authentication. Without an authenticated scan, coverage is shallow. Run baseline scans on every pull request preview environment, and reserve active scans for scheduled jobs against isolated staging. Never point a scanner at production without explicit authorization and rate limits.

### Software composition analysis and dependency risk

Most modern applications are mostly third-party code. SCA identifies dependencies, their versions, and known vulnerabilities from advisory databases. It also surfaces license risk and abandoned packages. The hard parts are transitive dependencies, false positives from unreachable code, and the sheer volume of alerts.

Prioritize by exploitability and exposure: a vulnerable library in a build-only tool is different from one parsing untrusted input on the public internet. Use reachability analysis where available, track mean time to remediate, and pin versions with a lockfile. Watch for typosquatting and dependency confusion, especially in internal package registries.

### Secrets management and scanning

Secrets leak through commits, CI logs, container images, and configuration files. Gitleaks scans repositories and history for patterns such as API keys and private keys. Prevention matters more than detection: use short-lived credentials, OIDC federation to the cloud instead of long-lived keys, a secrets manager, and pre-commit hooks.

When a secret is committed, treat it as compromised even if the commit was force-pushed; history and forks may retain it. Rotate first, then remove from history, then add detection for the pattern. Never paste a real secret into a ticket, chat, or scanner report. Configure scanning to redact values and restrict who can view findings.

### Infrastructure as code and policy as code

IaC scanning checks Terraform, Kubernetes manifests, CloudFormation, and Helm charts for insecure defaults: public buckets, open security groups, missing encryption, privileged containers. Checkov is a widely used open-source scanner with a large policy library. Policy as code goes further: Open Policy Agent evaluates structured input against rules you write, so you can enforce organizational requirements consistently.

Policy should be versioned, tested, and reviewed like software. Start with a small set of high-confidence rules (no public storage buckets, no wildcard IAM actions, no privileged pods), and make the failure message explain the fix. Policy that nobody can debug will be bypassed.

### CI/CD pipeline security

The pipeline is production infrastructure. It has credentials, network access, and the authority to deploy. Threats include malicious pull requests that execute code in the build context, script injection through untrusted variables, over-privileged tokens, compromised third-party actions, and self-hosted runners that persist across jobs.

Practical controls: set least-privilege `GITHUB_TOKEN` permissions, pin actions to commit SHAs, avoid `pull_request_target` with untrusted checkout, never interpolate untrusted input into `run` scripts, require approval for fork PR workflows, isolate runners, and use OIDC for short-lived cloud credentials. Review workflow changes as carefully as application code.

### Artifact signing, provenance, and SLSA

Signing proves who produced an artifact; provenance describes how and from what. Sigstore provides keyless signing with short-lived certificates tied to an OIDC identity, plus a transparency log. Cosign signs and verifies container images and other artifacts. SLSA defines levels of supply-chain integrity, from a documented build process to hardened, isolated builds with non-falsifiable provenance.

Verification is the point. Signing without an admission check that rejects unsigned or unverifiable images provides little protection. Start by signing release artifacts and verifying them at deploy time; then improve provenance and isolate build environments. Be honest about the trust root: if an attacker can compromise the signing identity, signatures alone will not save you.

### SBOM, VEX, and vulnerability response

A software bill of materials lists components and versions in a standard format such as SPDX or CycloneDX. It lets you answer "are we affected?" quickly when a new vulnerability is announced. Generation should be automatic in the build, stored with the artifact, and linked to the release.

An SBOM without context creates alert fatigue. VEX (Vulnerability Exploitability eXchange) records whether a product is affected by a specific vulnerability and why. Combine SBOM, VEX, and reachability to prioritize. Regulated customers and public-sector buyers increasingly require SBOMs, so treat them as a product deliverable, not a compliance afterthought.

### Supply-chain trust and open-source risk

Open-source dependencies are maintained by people, often without security resources. Risks include compromised maintainer accounts, malicious releases, protestware, and abandoned projects. OpenSSF Scorecard scores repositories on practices such as code review, pinned dependencies, and security policy. It is a signal, not a verdict.

Use a private registry proxy, verify package integrity, review new dependencies before adoption, and monitor for unusual release behavior. For critical projects, fund maintenance or contribute. The goal is not to eliminate open source; it is to know what you depend on and how quickly you can respond.

### Gates, metrics, and program maturity

A gate is a control that blocks progress until a condition is met. Gates work when they are fast, deterministic, and paired with a clear remediation path. They fail when they are slow, noisy, or owned by a team with no capacity to fix findings. Design gates around new risk, not historical backlog, and provide a time-bound exception process with an owner.

Metrics should reflect risk and program health: percentage of services with threat models, median time to remediate critical findings, scan coverage, exception age, and escaped defects. Avoid vanity metrics such as total alerts or lines scanned. [OWASP SAMM](https://owaspsamm.org/) provides a maturity model across governance, design, implementation, verification, and operations; [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) gives verifiable application security requirements.

## Choosing controls by risk

No team can adopt everything at once. Start where the blast radius is largest and the signal is cleanest.

| Context | Start with | Defer until later |
| --- | --- | --- |
| Small product team | Secret scanning, dependency updates, branch protection | Full active DAST and formal provenance |
| Regulated enterprise | SBOM, signed artifacts, audit-ready exceptions | Custom policy for every cloud resource |
| Open-source maintainer | Dependabot, Scorecard, security policy, signed releases | Authenticated DAST environments |
| Platform team | OIDC, runner isolation, action pinning, admission policy | Organization-wide SAST tuning |
| Pre-production startup | Threat model, SAST on diffs, least-privilege CI tokens | Maturity assessments and control catalogs |

The pattern is consistent: prevent the catastrophic and the irreversible first — leaked credentials, unsigned deployments, over-privileged pipelines — then improve detection breadth.

## A worked pipeline threat model

Consider a GitHub Actions pipeline that builds a container image and deploys it to Kubernetes. The trust boundaries are the pull request, the workflow, the build runner, the registry, and the cluster.

| Boundary | Threat | Control |
| --- | --- | --- |
| Fork PR to workflow | Malicious code execution in CI | Require approval, no secrets, read-only token |
| Workflow to runner | Script injection via issue or branch names | Pass untrusted values through environment variables, not inline expressions |
| Runner to cloud | Long-lived credentials stolen | OIDC federation with short-lived, scoped roles |
| Build to registry | Artifact tampering after build | Sign image, verify signature at admission |
| Registry to cluster | Unsigned or vulnerable image deployed | Admission policy plus image scanning |
| Dependency to build | Malicious package or action | Pin versions and SHAs, proxy registry, review updates |

The exercise is not complete until each control has an owner, a test, and a failure mode. A control that silently fails open is worse than no control, because it creates false assurance.

## Legal and safe practice

> Scan only repositories, images, and infrastructure you own or are authorized to test. Running a scanner against a third-party service can violate terms and law.

Handle findings as sensitive data. A secret-scanning alert contains a credential; restrict access, rotate immediately, and avoid reproducing the value in reports. When testing in CI, use disposable accounts and test data. Do not exfiltrate source code or build artifacts from a client environment, and do not use pipeline access to reach systems outside the engagement scope.

If you find a vulnerability in an open-source project, follow its security policy and use coordinated disclosure. If you find one in a commercial dependency, report it to the vendor rather than publishing exploit details. The repository's [ETHICS.md](../../ETHICS.md) applies to all labs and client work.

## Structured learning path

| Stage | Focus | Evidence of completion |
| --- | --- | --- |
| 1. Delivery basics | Git, containers, CI, least privilege | A pipeline that builds and tests a small service |
| 2. Code and dependency checks | SAST, SCA, secrets, IaC | A pull request with findings triaged and fixed |
| 3. Pipeline hardening | Tokens, OIDC, action pinning, runners | A workflow that passes a self-review checklist |
| 4. Supply chain | SBOM, signing, provenance, verification | A signed image with an SBOM and admission check |
| 5. Program design | Gates, exceptions, metrics, SAMM | A one-page program proposal with measures |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) | OWASP | Beginner to intermediate | Free | Some | A lifecycle model and control catalog for delivery |
| [OpenSSF training courses](https://openssf.org/training/courses/) | OpenSSF | Beginner | Free | Some | Secure software development fundamentals and supply-chain practices |
| [Semgrep Learn](https://semgrep.dev/learn) | Semgrep | Beginner | Free | Yes | Writing and running custom static analysis rules |
| [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use) | GitHub | Intermediate | Free | Yes, in your repo | Hardening workflows and handling untrusted input |
| [Sigstore documentation](https://www.sigstore.dev/) | Sigstore | Intermediate | Free | Yes, local | Keyless signing, transparency logs, and verification |

## Official documentation and standards

| Document | Owner | Why it matters |
| --- | --- | --- |
| [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) | NIST | A vendor-neutral baseline for secure development practices |
| [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/) | OWASP | Practical integration guidance across the delivery lifecycle |
| [SLSA](https://slsa.dev/) | OpenSSF | Levels and requirements for supply-chain integrity |
| [Sigstore](https://www.sigstore.dev/) | OpenSSF | Signing, verification, and transparency infrastructure |
| [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use) | GitHub | Concrete CI/CD hardening guidance |
| [OWASP SAMM](https://owaspsamm.org/) | OWASP | A maturity model for software assurance programs |

## Hands-on labs and training grounds

| Lab | Provider | Cost / access | Safe-lab note |
| --- | --- | --- | --- |
| [OWASP WrongSecrets](https://owasp.org/www-project-wrongsecrets/) | OWASP | Free, self-hosted | A deliberately insecure secrets challenge; run locally or in an isolated cluster |
| [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | OWASP | Free, self-hosted | Use its CI/CD and Docker challenges on your own instance |
| [Kubernetes Goat](https://github.com/madhuakula/kubernetes-goat) | Kubernetes Goat | Free, self-hosted | Intentionally vulnerable cluster; never expose it to the internet |
| [Cosign keyless tutorial](https://docs.sigstore.dev/) | Sigstore | Free, local | Sign and verify your own test images in a disposable registry |
| [Trivy](https://trivy.dev/) | Aqua Security | Free, local | Scan your own images, filesystems, and IaC in a sandbox |

## Essential open-source tools

No single tool covers the lifecycle. Automate the deterministic checks, then invest human review where judgment matters.

| Tool | Purpose | Link |
| --- | --- | --- |
| Semgrep | Fast, customizable static analysis for many languages | [semgrep.dev](https://semgrep.dev/) |
| Trivy | Vulnerability, misconfiguration, secret, and SBOM scanning | [trivy.dev](https://trivy.dev/) |
| Gitleaks | Secret detection in repositories and history | [github.com/gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) |
| Checkov | Infrastructure-as-code misconfiguration scanning | [github.com/bridgecrewio/checkov](https://github.com/bridgecrewio/checkov) |
| Cosign | Container signing and verification | [sigstore.dev](https://www.sigstore.dev/) |
| Syft | SBOM generation in SPDX and CycloneDX | [github.com/anchore/syft](https://github.com/anchore/syft) |
| Open Policy Agent | Policy as code for admission and pipeline decisions | [openpolicyagent.org](https://www.openpolicyagent.org/) |

## Practical projects and exercises

### Project 1: Pipeline threat model and hardened workflow

Objective: threat model a real build pipeline you control, then implement the highest-value controls.

Constraints: use a personal repository and a small containerized service. Map the pull request, workflow, runner, registry, and deployment boundaries. Include at least one untrusted-input path and one credential path.

Deliverable: a STRIDE table, a before-and-after workflow file, and a test that demonstrates a blocked attack (for example, a fork PR that cannot read secrets). Document residual risk and what you deliberately did not fix. This is portfolio-worthy because it shows both design and implementation.

### Project 2: End-to-end supply-chain integrity

Objective: build a pipeline that generates an SBOM, signs the image, attaches provenance, and verifies it before deployment.

Constraints: use a local registry or a free tier, keyless signing where possible, and a policy that rejects unsigned images. Do not use production credentials. Keep the demo reproducible with a single command.

Deliverable: a repository with the pipeline, verification script, sample SBOM, and a README explaining the trust root and failure modes. Add a short section on what an attacker would need to compromise to bypass the chain.

### Project 3: Gate-fatigue review

Objective: evaluate an existing set of security gates and propose a better design.

Constraints: use a real project you have access to, or simulate one with three scanners. Collect two weeks of findings, false-positive rates, and time-to-fix. Interview one developer if possible.

Deliverable: a memo with a current-state table, a proposed gate design (blocking versus advisory, new-code-only versus whole-repo), an exception process with expiry, and three metrics to track. This exercise teaches the organizational half of DevSecOps, which is usually the deciding half.

## Common mistakes and misconceptions

- Installing every scanner and blocking on all of them, which produces alert fatigue and eventual bypass.
- Running SAST only on a nightly full scan instead of on pull request diffs, so feedback arrives too late.
- Treating a clean scan as proof of security while ignoring design flaws and business logic.
- Using `pull_request_target` with a checkout of untrusted code and secrets in scope.
- Pinning actions to tags instead of commit SHAs, or granting `write-all` permissions by habit.
- Signing artifacts but never verifying signatures at deployment.
- Generating an SBOM and filing it away without a process to use it during a vulnerability response.
- Forcing secrets rotation only after a leak, instead of issuing short-lived credentials by design.

## Career paths and roles

DevSecOps engineers build and operate the security controls in the delivery pipeline. Platform security engineers focus on the shared infrastructure: CI runners, artifact registries, identity, and policy. Supply-chain security specialists work on provenance, SBOMs, and open-source risk. Application security engineers pair pipeline work with threat modeling and code review. SRE and cloud security roles increasingly include pipeline hardening.

Entry points include software engineering, CI/CD administration, cloud engineering, and AppSec. A strong portfolio shows a working pipeline, a threat model, a signed artifact with verification, and a thoughtful write-up of tradeoffs. Certifications can help with cloud fundamentals but rarely substitute for a reproducible project. Expect interviews to include a workflow review and a question about how you would roll out a gate without stopping delivery.

## Next steps

- Add Semgrep, Gitleaks, and Trivy to one repository and triage the findings.
- Harden a GitHub Actions workflow using the secure-use checklist, then write down what you changed and why.
- Sign and verify a test image with Cosign, and add an admission policy in a local cluster.
- Read NIST SP 800-218 and map five practices to your current project.
- Continue with the [cybersecurity engineer roadmap](../../roadmaps/cybersecurity-engineer.md) and [practical projects](../../practical-projects/README.md).

## References

- NIST, [Secure Software Development Framework (SP 800-218)](https://csrc.nist.gov/pubs/sp/800/218/final).
- OWASP, [DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/).
- OpenSSF, [SLSA](https://slsa.dev/).
- Sigstore, [Documentation](https://www.sigstore.dev/).
- GitHub, [Secure use of GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use).
- OWASP, [SAMM](https://owaspsamm.org/).

*Last reviewed: 2026-10-31.*

---

[Repository home](../../README.md) · [Learning guide](../../LEARNING-GUIDE.md) · [Advanced training grounds](../../resources/training-grounds/advanced.md) · [Practical projects](../../practical-projects/README.md) · [Contributing](../../CONTRIBUTING.md) · [Ethics and rules](../../ETHICS.md)
