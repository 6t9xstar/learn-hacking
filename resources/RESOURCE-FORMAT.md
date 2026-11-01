# Resource Metadata Format

[Repository home](../README.md) / [Resources](README.md) / Resource format

The resource indexes are for humans; [data/resources.json](data/resources.json) is for tools. This page defines the metadata contract so the two stay consistent. The JSON Schema is [data/resources.schema.json](data/resources.schema.json), and `npm run validate` checks every record.

> **Ethics reminder:** Metadata must not make a dangerous resource look harmless. Describe offensive tools and labs with their authorised purpose, and never add pirated material, exam dumps, live malware, or links that encourage unauthorised access.

## File layout

| Path | Purpose |
| --- | --- |
| `resources/data/resources.json` | The catalog: an array of resource objects |
| `resources/data/resources.schema.json` | JSON Schema used by validation |
| `resources/*/README.md` | Human-readable indexes with the same resources |
| `resources/README.md` | Collection overview and usage guidance |

Every resource with a canonical URL should appear in both the relevant index page and the JSON catalog. Paid books without purchase links are the deliberate exception: they stay in [books/README.md](books/README.md) and are not given invented retailer URLs.

## Required fields

Every object must contain these fields. The schema sets `additionalProperties` to `false`, so adding an unofficial field will fail validation.

| Field | Type | Meaning |
| --- | --- | --- |
| `name` | string | Official product or resource name, at least two characters |
| `url` | string | Canonical HTTPS URL, without affiliate, referral, or tracking parameters |
| `provider` | string | Organisation, author, or maintainer that owns the resource |
| `category` | string | Best-fit value from the category enum below |
| `level` | string | `beginner`, `intermediate`, `advanced`, or `mixed` |
| `cost` | string | `free`, `free-account`, `freemium`, or `paid` |
| `account_required` | boolean | Whether an account is required to use the core resource |
| `hands_on` | boolean | Whether the learner can practise rather than only read or watch |
| `free_details` | string | Exactly what is available without payment, including limitations |
| `description` | string | One accurate sentence on what the learner gains |
| `verified` | string | ISO date `YYYY-MM-DD` when the URL and cost label were checked |
| `notes` | string, optional | Prerequisites, caveats, regional limits, or safety notes |

## Category values

Choose the category that best describes the learner's goal. A hands-on platform may belong to a topic category because topic filters are more useful than a generic "platform" label.

| Group | Allowed values |
| --- | --- |
| Foundations | `foundations` |
| Offensive | `ethical-hacking`, `network-security`, `web-security`, `red-team`, `bug-bounty`, `exploit-development` |
| Platform and application | `mobile-security`, `wireless-security`, `cloud-security`, `active-directory`, `linux-security`, `iot-security`, `hardware-security`, `blockchain-security`, `ai-security`, `devsecops`, `application-security` |
| Defensive | `digital-forensics`, `malware-analysis`, `soc-blue-team`, `threat-intelligence`, `security-architecture`, `governance-risk-compliance` |
| Specialist | `cryptography`, `osint`, `career-development` |
| Resource type | `training-grounds`, `documentation`, `books`, `certifications`, `ctf`, `communities`, `tools` |

If a resource genuinely spans two topic categories, choose the one a learner would use to find it, and mention the other in `description` or `notes`. Do not create duplicate records for the same URL.

## Level values

| Value | Use when |
| --- | --- |
| `beginner` | The resource assumes little or no prior security knowledge |
| `intermediate` | The learner needs foundations, a lab, or some tool fluency |
| `advanced` | The resource assumes substantial experience or specialised prerequisites |
| `mixed` | The resource deliberately spans levels, or the source page covers a range |

Do not inflate a level to make a resource look prestigious. A beginner-friendly lab is more useful when labelled honestly.

## Cost values

| Value | Use when |
| --- | --- |
| `free` | No payment and no account required for the core learning value |
| `free-account` | No payment, but registration is required |
| `freemium` | A usable free portion exists and a paid tier adds material |
| `paid` | The useful part requires payment, such as an exam, course, book, or ticket |

`free_details` is required even for `free` and `paid` resources. Use it to state the boundary precisely:

- free: "Free to access; no account or payment required."
- free account: "Free with a registered account."
- freemium: "Free rooms are available; full paths require a subscription."
- paid: "Paid exam; free study resources may be available."

A free trial is not `free`. If the trial expires before the learner can complete a meaningful exercise, classify the resource as `paid` or `freemium` and explain the limit.

## Account and hands-on flags

- Set `account_required` to `true` when registration is needed to reach the core material, not merely to post in a forum or save progress.
- Set `hands_on` to `true` when the learner performs an exercise, uses a tool, investigates evidence, or completes a challenge. Watching a video or reading a standard is not hands-on by itself.
- For communities and newsletters, `hands_on` is usually `false`; for labs, CTFs, tools, and exercises it is usually `true`.

## URL rules

- Use HTTPS. The schema rejects `http://`.
- Link to the canonical page, not a search result, redirect, shortener, affiliate link, or tracking URL.
- Remove fragments and tracking parameters unless they identify the actual resource.
- Verify the page in a private browser window so an existing session does not hide a login or paywall.
- A 403 from an automated bot is not proof that a page is broken. Open it manually before removing it.
- Replace a moved resource instead of adding a permanent exception for the old URL.
- Never link to pirated books, course dumps, exam dumps, leaked data, or live malware samples.

## Description rules

- Write one accurate sentence, not a marketing slogan.
- Explain what the learner gains, not only what the resource contains.
- Do not repeat the provider and name as the whole description.
- Do not claim features, prices, or outcomes you have not verified.
- Prefer plain text. Strip Markdown links and emphasis from text copied out of an index page.
- State the lab-only boundary for offensive tools and vulnerable applications.

## Duplicate handling

The catalog has one record per URL. Cross-listed resources are merged:

1. Keep the richest description.
2. Keep the most specific topic category.
3. Keep the most conservative cost label if two pages disagree.
4. Mention additional uses in `description` or `notes`.
5. Run validation to catch exact duplicates.

Do not solve duplicates by adding a trailing slash, a query string, or a fragment to create a second record.

## Example record

```json
{
  "name": "CISA Cyber Essentials Toolkit",
  "url": "https://www.cisa.gov/resources-tools/resources/cyber-essentials-toolkits",
  "provider": "Cybersecurity and Infrastructure Security Agency (CISA)",
  "category": "documentation",
  "level": "beginner",
  "cost": "free",
  "account_required": false,
  "hands_on": false,
  "free_details": "Free to access; no account or payment required.",
  "description": "A practical toolkit for building foundational cyber hygiene controls in a small organisation.",
  "verified": "2026-10-31"
}
```

The object must stand alone. Do not rely on a neighbouring record for context, and do not add HTML or Markdown formatting to field values.

## Adding or updating a resource

1. Find the best-fit index page and confirm the resource meets the [contribution standards](../CONTRIBUTING.md).
2. Verify the URL, cost, account requirement, and hands-on value.
3. Add the row to the index page using the existing table columns.
4. Add or update the object in `data/resources.json`.
5. Use the actual review date in `verified`.
6. Run the checks below and fix failures before opening a pull request.

```bash
npm run validate
npm run lint:md
npm run check:links
npm run check:links:external
```

## Review and removal

- Recheck links when the automated audit reports a failure, not only during a quarterly review.
- Remove or replace resources that become paid without a usable free portion, disappear, change ownership, or add predatory terms.
- Preserve a short note in the pull request explaining a removal; the public changelog records material changes.
- Do not silently change a cost label. State what changed and when you verified it.
- Keep the `verified` date honest. A bulk date update without checking the URL is worse than no date because it creates false confidence.

Last reviewed: 2026-10-31

---

[Back to resources](README.md) · [Catalog](data/resources.json) · [Schema](data/resources.schema.json) · [Repository home](../README.md) · [Contributing](../CONTRIBUTING.md)
