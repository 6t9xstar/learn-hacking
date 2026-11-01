# Contributing to learn-hacking

Thank you for helping make high-quality cybersecurity education free and accessible. Contributions of every size are welcome: fixing a typo, replacing a dead link, writing a lab, translating a guide, or proposing a new learning path.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and the ethical rules in [ETHICS.md](ETHICS.md).

## Ways to contribute

- **Fix a resource.** Replace a dead or outdated link, correct a cost/access label, or clarify prerequisites.
- **Add a free resource.** Use the [resource submission issue](https://github.com/6t9xstar/learn-hacking/issues/new/choose) or edit the relevant page.
- **Write a tutorial or drill.** Keep it original, practical, and safe for a lab.
- **Improve a roadmap.** Add an evidence-based milestone or remove unnecessary duplication.
- **Create a project.** Follow the project structure and include expected results and cleanup.
- **Translate content.** Open an issue first so we can agree on file layout and avoid parallel work.
- **Review a pull request.** Technical accuracy, link validity, clarity, and beginner accessibility all need review.
- **Report a safety problem.** See [SECURITY.md](SECURITY.md). Do not demonstrate harm on third-party systems.

## Before you start

1. Search existing issues and pull requests.
2. For a large addition or reorganization, open an issue to discuss the design.
3. For small fixes, a pull request is enough.
4. Do not include client data, personal information, secrets, pirated material, exam dumps, or live malware.
5. Do not copy text from courses, books, or blogs. Explain concepts in your own words and cite sources.

## Content standards

Every substantial guide should:

- teach a concept in original prose, not only link elsewhere;
- state prerequisites and honest time expectations;
- label resources as Free, Free account, Freemium (with the free part named), or Paid;
- include hands-on practice in an authorized environment;
- name a deliverable or evidence of learning;
- include remediation and defensive understanding for offensive topics;
- link to official documentation;
- use inclusive language and explain acronyms on first use;
- end with references and a path back to the repository.

Avoid:

- "hacking in 24 hours" or guaranteed-job claims;
- unexplained tool dumps;
- instructions for credential theft, evasion, or attacking real systems;
- screenshots containing real personal data or secrets;
- broken anchors and guessed URLs;
- AI-generated filler that has not been fact-checked by a human.

## Resource metadata standard

When adding a course, lab, book, tool, or platform, include:

| Field | Meaning |
|---|---|
| Name | Official product name |
| URL | Canonical HTTPS URL to the resource, not an affiliate link |
| Provider | Organization or maintainer |
| Category | Best-fit directory or topic |
| Level | Beginner, intermediate, advanced, or mixed |
| Cost | Free, Free account, Freemium, or Paid |
| Free details | Exactly what is free if the platform is freemium |
| Account required | Yes or no |
| Hands-on | Whether the learner can practice |
| Description | One accurate sentence on what the learner gains |

The machine-readable schema is documented in [resources/RESOURCE-FORMAT.md](resources/RESOURCE-FORMAT.md). Update `resources/data/resources.json` with the same URL when you add a resource to an index page.

## Link policy

- Use HTTPS and the canonical page, not a search-result redirect.
- Do not use affiliate, referral, URL-shortener, or tracking links.
- Verify the link in a private browser window.
- Check whether the page requires an account or payment.
- For a moved resource, update it instead of adding the old URL as an exception.
- Record the review date as `2026-10-31` or the date you actually checked it.
- A 403 to an automated bot is not proof the page is broken. Open it manually.

## Writing style

- Use sentence case headings.
- Prefer short paragraphs and concrete examples.
- Define acronyms on first use, e.g. Security Information and Event Management (SIEM).
- Use second person and active voice.
- Use fenced code blocks with a language tag.
- Use tables for comparisons, not for entire explanations.
- Use relative links inside the repository.
- Keep one H1 per file.
- Do not use emoji as headings or excessive decoration.

## Local development

You need Node.js 20 or newer and npm.

```bash
git clone https://github.com/6t9xstar/learn-hacking.git
cd learn-hacking
npm install
npm run validate
npm run lint:md
npm run check:links
npm run check:links:external
npm run spellcheck
```

Run `npm run lint:md:fix` to auto-fix safe Markdown issues. Review the diff before committing.

## Pull request process

1. Fork the repository and create a branch: `git switch -c docs/add-cloud-lab`.
2. Make focused changes. One logical change per pull request is easiest to review.
3. Run the checks above.
4. Complete the pull request template, including source verification.
5. Link related issues and explain what changed and why.
6. Be responsive to review comments. Maintainers may ask for changes to safety, accuracy, or scope.
7. Squash or clean up commits if requested. Do not force-push over someone else's work.

A maintainer aims to acknowledge new pull requests within seven days, but this is a volunteer project. Politeness and patience help.

## Commit messages

Use a short imperative subject and explain non-obvious reasoning in the body.

```text
docs(web): add access-control lab and remediation notes

Adds a local Juice Shop exercise, a safe validation checklist, and
OWASP references. Verified links and ran Markdown/link checks.
```

## Review criteria

Reviewers look for:

- technical accuracy against primary sources;
- safety and authorization boundaries;
- clarity for the stated audience;
- accurate cost/access labels;
- working links and anchors;
- no duplicate or contradictory guidance;
- consistent structure and formatting;
- evidence that the author understands the material.

## Adding a roadmap or major section

Open an issue with:

- the target role or learner outcome;
- prerequisites and realistic duration;
- how it differs from existing roadmaps;
- the learning sequence and free resources;
- the lab/project evidence;
- how it will be maintained.

We prefer improving an existing path over creating near-duplicate paths.

## Translations

Translations are valuable. Keep the original English file intact and place translations in a clearly named directory or file once the structure is agreed. Do not machine-translate and publish without human review. Technical terms should remain recognizable, with local-language explanations.

## Recognition

Contributors are credited through Git history, pull request reviews, and release notes. If you want your name or handle listed differently, say so in the pull request.

## Questions

Read [SUPPORT.md](SUPPORT.md) and [FAQ.md](FAQ.md) first. Then open a discussion or issue with enough context to reproduce the problem.

---

[Back to repository home](README.md) · [Ethics](ETHICS.md) · [Security policy](SECURITY.md) · [Resource format](resources/RESOURCE-FORMAT.md)
