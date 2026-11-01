# Cybersecurity Resource Library

[Repository home](../README.md) / Resources

This is the curated resource library for the curriculum. It is organised by what you are trying to learn, not by who pays the largest affiliate commission. Every listing names the provider, level, cost and access model, hands-on value, and what you gain. Free resources come first, and paid material is labelled plainly.

> **Ethics reminder:** A resource gives you knowledge, not permission. Use offensive techniques only in labs you own or systems you are explicitly authorised to test. See [ETHICS.md](../ETHICS.md) and the [security ethics guide](../foundations/security-ethics/README.md).

## At a glance

| Collection | Listings | Best for |
| --- | --- | --- |
| [Free courses](free-courses/README.md) | 60 | Structured learning with little or no cost |
| [Training grounds](training-grounds/README.md) | 44 | Guided labs and safe practice environments |
| [Open-source tools](open-source-tools/README.md) | 77 | Choosing and installing tools for a defined task |
| [Documentation](documentation/README.md) | 36 | Primary sources, standards, and vendor references |
| [Books](books/README.md) | 30 | Deep reading, including free and paid titles |
| [Certifications](certifications/README.md) | 24 | Exam planning and free preparation |
| [CTF platforms](ctf-platforms/README.md) | 19 | Competition practice and progressive challenges |
| [Communities](communities/README.md) | 18 | Conferences, forums, newsletters, and peer learning |

The eight indexes contain **308 listings**. Several platforms are deliberately cross-listed, so the metadata catalog contains **245 unique linkable resources**. The difference is not duplication in the catalog: it reflects a resource that serves more than one learning purpose, such as a lab platform that also appears in a course list.

## Start with a goal

| If your goal is… | Start with | Then use |
| --- | --- | --- |
| Understand a new topic | [Free courses](free-courses/README.md) | [Documentation](documentation/README.md) for primary sources |
| Practise safely | [Training grounds](training-grounds/README.md) | [CTF platforms](ctf-platforms/README.md) for independent challenges |
| Build or fix something | [Open-source tools](open-source-tools/README.md) | [Project guides](../practical-projects/README.md) for the workflow |
| Go deeper than tutorials | [Books](books/README.md) | [Documentation](documentation/README.md) for current details |
| Plan a certification | [Certifications](certifications/README.md) | The relevant [roadmap](../roadmaps/README.md) for sequencing |
| Meet other practitioners | [Communities](communities/README.md) | Local chapters, conferences, and study groups |

## How this library is organised

- **Task first, brand second.** Each page is arranged around a learning need: a course, a lab, a tool, a standard, a book, a certification, a competition, or a community.
- **Free before paid.** Freemium platforms state exactly what is free and what requires payment or an account.
- **One canonical link per resource.** The catalog uses the official HTTPS page, not a search result, affiliate link, URL shortener, or tracking redirect.
- **Labels are part of the content.** A resource marked “Freemium” without an explanation is not finished. Every entry should let you decide before you create an account or pay.
- **Review dates matter.** A link can be live and the offer can still be stale. Cost and access labels are reviewed alongside the URL.

## Access labels

| Label | Meaning |
| --- | --- |
| **Free** | No payment and no account required to use the core learning material |
| **Free account** | No payment, but registration is required to access the resource |
| **Freemium** | A usable free portion exists; the page states what is free and what needs a subscription |
| **Paid** | Payment is required for the useful part, such as an exam, course, book, or ticket |

Free trials are not labelled as free. A trial that expires before you finish the useful lab is a paid product with a sample, not a free resource.

## Resource collections

### Courses and books

- [Free courses](free-courses/README.md) covers foundations, offensive security, web, network, cloud, forensics, malware, mobile, wireless, red teaming, blue teaming, and adjacent topics.
- [Books](books/README.md) separates legally free books from paid titles worth buying, with a reason to read each one and an honest level.

### Practice and competition

- [Training grounds](training-grounds/README.md) links beginner, intermediate, and advanced labs, including a four-week starter plan.
- [CTF platforms](ctf-platforms/README.md) covers year-round practice, competition calendars, major events, team conduct, and turning a result into evidence.

### Tools and primary sources

- [Open-source tools](open-source-tools/README.md) groups tools by task and includes licence, platform, authorised purpose, installation hygiene, and the limits of tool-driven learning.
- [Documentation](documentation/README.md) points to NIST, MITRE, OWASP, CISA, IETF, vendor documentation, and supply-chain standards.

### Credentials and people

- [Certifications](certifications/README.md) separates free study from paid exams and explains what employers actually check.
- [Communities](communities/README.md) lists forums, conferences, villages, newsletters, and podcasts, with practical guidance on asking questions and contributing back.

## Machine-readable catalog

The same collection is available as structured data:

- [resources.json](data/resources.json) contains 245 unique resources with name, URL, provider, category, level, cost, account requirement, hands-on status, free details, description, and verification date.
- [resources.schema.json](data/resources.schema.json) defines the JSON Schema.
- [RESOURCE-FORMAT.md](RESOURCE-FORMAT.md) explains every field, the allowed values, and the review process.

Use the JSON if you want to filter by cost or level, build a study plan, or generate your own catalog view. Do not treat the count as a completion target: a learner needs a sequence and evidence, not every link.

The catalog contains resources with a canonical URL. Paid books without purchase links remain in the [books index](books/README.md) by design, because inventing or rotating retailer links would create stale, commercial noise.

## Quality and freshness

- Every index carries a `Last reviewed` date.
- Automated checks detect dead links, missing anchors, duplicate URLs, invalid metadata, and broken Markdown.
- External link audits run on a schedule because providers move pages without redirects.
- Cost labels are reviewed with the link. A live page with a changed paywall is still a stale resource.
- Removed resources are replaced rather than left as exceptions.

If a link is broken, open an issue or submit a pull request with the canonical replacement. If a free resource becomes paid, update the label and say what changed.

## Contributing a resource

1. Confirm that the resource is legal, free of piracy, and safe to recommend.
2. Verify the canonical HTTPS URL in a private browser window.
3. Identify the provider, level, cost, account requirement, hands-on value, and what the learner gains.
4. Add it to the best-fit index page and update [resources.json](data/resources.json) with the same URL.
5. Run `npm run validate`, `npm run lint:md`, and `npm run check:links`.
6. State the date you actually checked the link.

Read [RESOURCE-FORMAT.md](RESOURCE-FORMAT.md) before editing the JSON, and [CONTRIBUTING.md](../CONTRIBUTING.md) for the full contribution standard.

## Safe and ethical use

- Use labs and vulnerable applications only on infrastructure you own or are authorised to test.
- Follow each platform's terms of service and scope, including bug bounty safe-harbour rules.
- Keep malware, forensic images, and potentially harmful samples in an isolated lab.
- Do not upload client data, credentials, or personal information to third-party tools.
- Report real vulnerabilities privately and in good faith; never use a learning resource as an excuse to test a system without permission.

## Further learning

- [Learning guide](../LEARNING-GUIDE.md): how to use the repository as a curriculum rather than a bookmark folder.
- [Roadmaps](../roadmaps/README.md): role-based sequences that connect resources to milestones.
- [Practical projects](../practical-projects/README.md): evidence-producing exercises.
- [Ethics and law](../ETHICS.md): the boundaries that apply to every technical skill here.

Last reviewed: 2026-10-31

---

[Back to repository home](../README.md) · [Learning guide](../LEARNING-GUIDE.md) · [Roadmaps](../roadmaps/README.md) · [Practical projects](../practical-projects/README.md) · [Contributing](../CONTRIBUTING.md)
