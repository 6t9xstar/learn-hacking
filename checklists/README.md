# Checklists: Authorization, Assessment, Response, Cloud, and Lab Safety

[Home](../README.md) / Checklists

These checklists turn good intentions into documented decisions. They are written for penetration testers, web assessors, incident responders, cloud reviewers, and home-lab builders who need to prove that scope, authorization, evidence handling, and stop conditions were considered before work began.

> **Responsible use warning.** A checklist is not authorization. No item here permits testing, scanning, accessing, or changing a system you do not own or have explicit written permission to assess. If authorization is unclear, stop and resolve it in writing before touching the target. Unauthorized access is illegal in most jurisdictions and violates [this repository's ethics policy](../ETHICS.md).

## Checklist index

| Checklist | Use it when | Primary outcome |
| --- | --- | --- |
| [Pre-engagement](pre-engagement.md) | Before any assessment or red-team engagement | Signed scope, rules of engagement, contacts, data handling |
| [Web assessment](web-assessment.md) | Testing an authorized web application or API | Consistent coverage, evidence, reporting, retest |
| [Incident response](incident-response.md) | Preparing for or handling a security incident | NIST SP 800-61r3-aligned decisions and records |
| [Cloud review](cloud-review.md) | Reviewing an authorized cloud tenant | Identity, logging, network, data, compute, container, cost findings |
| [Home lab](home-lab.md) | Building or tearing down a practice environment | Isolation, snapshots, host safety, licensing, clean teardown |

## How to use a checklist

1. Read the whole checklist before starting. Some items depend on earlier decisions.
2. Record an owner and an evidence reference for every item, even when the answer is "not applicable".
3. Mark items as `Done`, `Not applicable`, `Blocked`, or `Open`. Do not leave silent blanks.
4. Attach the artifact that proves the item: a signed scope document, a screenshot, a command transcript, a ticket, or a policy link.
5. Review open and blocked items with the engagement or incident owner before proceeding.
6. Store completed checklists with the engagement or incident record, not in a personal drive.

### Status values

| Status | Meaning | Required next action |
| --- | --- | --- |
| Done | Verified and evidenced | None |
| N/A | Does not apply, with a reason | Record the reason |
| Blocked | Cannot proceed without a decision or access | Escalate to the named owner |
| Open | Not yet started | Assign an owner and due date |

## Scope reminders

- Authorization must name the systems, time window, techniques, and people allowed to test.
- A verbal "go ahead" is not a substitute for written authorization.
- Third-party hosting, APIs, and cloud accounts may require separate permission from the provider or account owner.
- Production testing needs a rollback plan and a way to stop immediately.
- Personal data, credentials, and customer records require a handling plan before collection.
- Rules of engagement must state what is explicitly out of scope, including social engineering, physical access, denial of service, and data exfiltration.

## Stop conditions that apply to every checklist

Stop work and escalate if any of these occur:

- The target is not clearly inside the authorized scope.
- You cannot reach the named authorization owner.
- Testing causes an unexpected outage, data loss, or safety impact.
- You encounter real personal data, live credentials, or regulated data beyond the agreed handling plan.
- A technique would affect a third party, shared infrastructure, or a supply chain.
- You are asked to hide a finding, bypass a control, or continue without a required approval.
- You cannot explain the expected impact of the next action.

## Evidence and record keeping

Use a consistent folder and naming scheme. Include the date, checklist name, engagement or incident ID, and a short slug. Hash exported evidence and record who collected it, when, and from where. Redact secrets and personal data before sharing. Retain records according to the engagement contract and applicable law; do not keep copies longer than necessary.

## Adaptation and compliance

These checklists are educational starting points, not legal advice or a certification. Adapt them to your organization's policies, contractual obligations, and local law. Completing a checklist does not guarantee compliance with NIST, ISO, PCI DSS, HIPAA, GDPR, or any other framework. A qualified legal, privacy, or compliance professional should review obligations that apply to your engagement or incident.

## References

- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) — incident response recommendations aligned to CSF 2.0.
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) — Govern, Identify, Protect, Detect, Respond, Recover functions.
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/) — web assessment methodology.
- [CIS Controls](https://www.cisecurity.org/controls) — prioritized safeguards for cloud and endpoint reviews.
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks) — configuration baselines to adapt, not to apply blindly.

---

**Related:** [Repository home](../README.md) · [Exercises](../exercises/README.md) · [Templates](../templates/README.md) · [Ethics](../ETHICS.md) · [Contributing](../CONTRIBUTING.md) · [Security policy](../SECURITY.md)

Last reviewed: 2026-10-31
