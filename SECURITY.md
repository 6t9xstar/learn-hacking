# Security Policy

## About this repository

`learn-hacking` is an educational documentation repository. It does not run a production service and does not authorize anyone to test third-party systems. This policy covers vulnerabilities in the repository itself, its automation, and unsafe educational content.

## Reporting a vulnerability

Please **do not open a public issue** for a security-sensitive problem.

Use GitHub's private vulnerability reporting:

1. Open the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Describe the issue, affected files or workflows, impact, and a minimal reproduction.
4. Include a suggested fix if you have one.

If private reporting is unavailable, contact the maintainer through the contact options on the [GitHub profile](https://github.com/6t9xstar) and ask for a private channel. Do not include secrets or sensitive data in a public message.

## What is in scope

- Malicious links, redirects, or downloaded files recommended by the repository.
- Instructions that could cause harm outside an authorized lab.
- Supply-chain risks in GitHub Actions, npm dependencies, or scripts.
- Cross-site scripting or other injection risks in repository-rendered content.
- Workflow injection, excessive token permissions, or secret exposure.
- Privacy violations, including real personal data in examples.
- Copyright violations or pirated material.
- Misleading security claims that could cause financial or operational harm.

## What is out of scope

- Testing vulnerabilities on training platforms, vendors, or other third-party sites.
- Social engineering of maintainers or contributors.
- Denial-of-service testing against GitHub or repository infrastructure.
- Reports generated only by an automated scanner without a plausible impact.
- Requests for help attacking a target; those will be closed.
- Disagreements about the difficulty or cost of a certification.

## Safe harbor

We support good-faith security research on this repository. If you make a reasonable effort to avoid privacy violations, data destruction, and service disruption, and you report promptly, we will not pursue legal action or ask GitHub to restrict your account for the research itself. This safe harbor does not apply to third-party systems, extortion, malware, or activity beyond the scope above, and it is not a legal guarantee.

## Response process

This is a volunteer project. We aim to:

- acknowledge a private report within 7 days;
- provide an initial assessment within 14 days;
- coordinate a public disclosure date after a fix or mitigation;
- credit reporters who want recognition.

These are targets, not contractual commitments.

## Handling reports about educational content

If a page teaches a dangerous technique without a clear authorized-lab boundary, we treat that as a content safety issue. Send the file path and a short explanation. Do not demonstrate the technique on a live system. We may rewrite, add warnings, or remove the material.

## Supported versions

The repository is continuously updated. Security fixes are applied to the default branch; there are no maintained release branches.

## Dependency and workflow security

The repository uses pinned GitHub Actions major versions, least-privilege workflow permissions, and dependency review where available. Contributors should avoid adding unnecessary dependencies, unpinned remote scripts, or workflows that expose secrets to pull requests from forks.

## Related policies

- [ETHICS.md](ETHICS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

[Back to repository home](README.md)
