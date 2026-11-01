[Home](../../README.md) / [Additional topics](../README.md) / OSINT

# Open-Source Intelligence (OSINT)

Open-source intelligence is the disciplined collection and analysis of publicly available information to answer a defined question. It is used in threat intelligence, due diligence, investigative journalism, fraud investigations, missing-person searches, and vulnerability research. The "open" in OSINT refers to the source, not to a lack of rules: legal, ethical, and privacy boundaries still apply.

This guide is for analysts and investigators who want a repeatable method rather than a list of magic websites. It covers the intelligence cycle, verification, corporate and infrastructure research, metadata, geolocation, and reporting. It deliberately excludes techniques for doxxing, stalking, or bypassing privacy controls.

## At a glance

| Attribute | Detail |
| --- | --- |
| Difficulty | Beginner to intermediate; advanced work is in verification and analysis, not tooling |
| Realistic time | 2-4 months to build a reliable workflow; verification skill grows over years |
| Cost | Free tools cover most work; Maltego and some datasets are freemium or paid |
| Prerequisites | Research writing, search literacy, basic networking, strong ethical judgment |
| Lab requirement | Not required, but structured practice cases and a secure research environment are essential |

## Why this field matters

Organizations make decisions with incomplete information: is this vendor legitimate, is this domain impersonating us, who is behind this campaign, is this image really from the claimed location? OSINT provides evidence and context. A threat intelligence team uses it to attribute infrastructure; a due diligence team uses it to screen partners; a newsroom uses it to verify a video before publication.

The same techniques can cause harm. Publicly available information can be aggregated into a profile that enables harassment, stalking, or fraud. That is why this guide treats ethics and privacy as core technical skills, not a disclaimer at the end. A good analyst knows when to stop collecting.

## What you will learn

- How the intelligence cycle turns a question into a sourced, decision-ready product.
- How to plan collection and evaluate source reliability and information credibility.
- How to search the web systematically with operators and structured sources.
- How to research organizations and infrastructure without crossing legal lines.
- How to extract and interpret metadata, including its limitations.
- How to geolocate and chronolocate images using verifiable clues.
- How to verify claims, handle synthetic media, and express confidence honestly.
- How to document sources and protect the privacy of people who appear in your research.

## Prerequisites and honest expectations

You should be able to search effectively, read a company filing, understand DNS and certificates at a basic level, and write a clear analytical paragraph. Familiarity with spreadsheets and link analysis helps. You do not need to be a programmer, but basic scripting makes repetitive collection easier.

Expect ambiguity. OSINT rarely produces a single definitive answer; it produces a confidence assessment with supporting and contradicting evidence. Expect to spend most of your time verifying and documenting, not collecting. And expect ethical dilemmas: the fact that information is public does not automatically make it appropriate to compile or publish.

## Core concepts

### 1. The intelligence cycle

The cycle begins with requirements: what decision will this research inform? Collection gathers sources; processing structures and translates them; analysis tests hypotheses; dissemination delivers a product; feedback refines the next cycle. Skipping requirements is the most common failure. Without a question, collection becomes hoarding.

Write the question in one sentence and list what evidence would support or refute it. Define scope: time period, geography, entities, and exclusions. A tight question produces a useful product; a vague one produces a folder of screenshots.

### 2. Collection planning and source evaluation

Plan sources by type: primary (the organization's own site, filings, official records), secondary (news, reports), and technical (DNS, certificates, exposed services). For each source, record the URL, capture time, and what it claims. Web pages change; a screenshot without a timestamp is weak evidence.

Evaluate source reliability and information credibility separately. A usually reliable source can pass on a false rumor; an unreliable source can accidentally provide a true document. Use Admiralty-style grading (A-F for source reliability, 1-6 for information credibility) or a simpler high/medium/low scheme, and state it in the report.

### 3. Legal and ethical boundaries

Public availability is not consent. Privacy laws such as the GDPR restrict processing personal data even when it is online, and harassment, stalking, and doxxing are illegal in many jurisdictions. Platform terms of service prohibit scraping or fake accounts in some contexts. Employment, journalism, and law enforcement have additional rules.

Do not research private individuals unless there is a legitimate, documented purpose and a lawful basis. Do not compile home addresses, personal phone numbers, family members, or daily routines. Do not use OSINT to intimidate, locate, or expose someone. If your work involves a missing person or a safety threat, follow the protocols of a recognized organization and involve authorities.

### 4. Search operators and structured search

Search engines support operators such as `site:`, `filetype:`, `intitle:`, `inurl:`, and exact-phrase quotes. They are useful for finding documents, exposed directories, and mentions on specific domains. Combine operators with synonyms and local-language terms. Results are personalized and incomplete; use multiple engines and log the query.

Do not use search operators to find vulnerabilities or private data at scale. The Google Hacking Database is a catalogue of sensitive patterns; use it to understand what not to expose on your own site, not to browse other people's misconfigurations. If you stumble on exposed personal data, stop and report it.

### 5. Organizational research

Start with the organization's own disclosures: website, annual reports, regulatory filings, press releases, and investor materials. Company registries and open corporate databases reveal ownership, directors, and incorporation history. Procurement portals and job postings reveal technology stacks, vendors, and upcoming projects.

Build an entity map: parent company, subsidiaries, brands, domains, key public personnel, and locations. Verify relationships with primary documents rather than assuming a logo on a website implies ownership. Record negative findings too; "no filing found in this registry" is evidence.

### 6. Domain and infrastructure research

Passive DNS, certificate transparency logs, WHOIS/RDAP records, and search engines reveal domains and subdomains. Services such as Shodan and Censys index exposed services; use them to understand an organization's internet footprint, not to probe systems. ASN and IP registration data show hosting relationships.

Be careful with attribution. Shared hosting, CDNs, reverse proxies, and privacy services mean an IP address rarely identifies a person. A certificate can be reused across campaigns. Infrastructure overlaps are leads, not proof. Document the observation, the source, and the alternative explanations.

### 7. Metadata and file analysis

Files carry metadata: author, software, creation time, GPS coordinates, and edit history. ExifTool extracts it from images, documents, and media. Metadata can corroborate a source or reveal that a photo was edited. It can also be stripped by platforms, so absence is not proof of manipulation.

Interpret carefully. A camera's clock may be wrong; GPS may be absent or spoofed; document author fields are often default values. Combine metadata with visual and contextual evidence. Never publish metadata that reveals a private individual's location.

### 8. Geolocation and chronolocation

Geolocation identifies where an image or video was taken using landmarks, signage, terrain, vegetation, architecture, and reflections. Chronolocation identifies when, using shadows, weather, construction progress, and event timelines. Sun-position tools and weather archives help test hypotheses.

Work from the general to the specific: country, region, city, street, exact spot. Corroborate with multiple independent clues and, where possible, a ground-level or satellite image. State your confidence and the assumptions. Do not geolocate a private person's home or routine; use these skills on public events, verified landmarks, or your own practice images.

### 9. Verification and synthetic media

Verification asks: what is the original source, when was it first published, has it been altered, and does the context match? Reverse image search, metadata, archive snapshots, and local-language reporting help. Find the earliest version, not the most viral one.

Synthetic media complicates verification. Look for inconsistencies in lighting, reflections, text, hands, and background; use detection tools as inputs, not verdicts. Provenance signals such as Content Credentials can help when present. Always report uncertainty and the limits of your methods.

### 10. Social media research

Social media can provide primary evidence of public events, organizational announcements, and networks. Use official APIs or platform search where permitted, respect terms of service, and avoid fake accounts that deceive people. Sock puppets can violate platform rules and create legal risk.

Archive what you find, because posts are deleted. Capture the URL, timestamp, author handle, and content. Do not engage, harass, or entrap. If a post reveals a safety threat, follow escalation procedures rather than investigating alone.

### 11. People research and privacy

Legitimate people research includes verifying a public professional's role, checking a job candidate's public professional footprint with consent, or identifying a missing person through an approved organization. It does not include building a dossier on a private individual, finding their home, or mapping their family.

Apply data minimization: collect only what the question requires, store it securely, and delete it when no longer needed. Redact personal data in reports. Avoid re-identification of anonymized datasets. If you would not want the same research done about you, that is a signal to stop.

### 12. Analysis, attribution, and reporting

Analysis separates observation from inference. Use structured techniques such as competitor hypotheses or key assumptions checks to avoid anchoring on the first explanation. Assign confidence levels (for example, low, moderate, high) and state what would change your assessment.

Attribution is especially fragile.Technical indicators can be shared, spoofed, or reused. Public reporting by vendors can be wrong or politically shaped. Attribute behavior and infrastructure carefully, distinguish "consistent with" from "proves", and cite sources. A good report includes alternative hypotheses and gaps.

### 13. Researcher operational security

Your research can expose you and your sources. Use a separate browser profile or virtual machine, avoid logging into personal accounts while researching sensitive topics, and be cautious with browser extensions. Use a VPN or proxy where lawful and appropriate, and understand that it does not make illegal activity legal.

Store notes and captures encrypted. Use a consistent naming convention and a source log. Be careful with links sent by unknown parties; they can be phishing or tracking. If a subject notices you, stop and escalate rather than escalating the confrontation.

## Legal and safe practice

Collect only public information and only for a legitimate purpose. Do not access private accounts, bypass authentication, or use stolen credentials. Do not scrape in violation of terms of service or applicable law. Respect robots.txt and rate limits as a matter of professional courtesy, even where not legally binding.

Do not compile or publish personal data that could enable harm. Never post home addresses, phone numbers, family details, or location patterns. Do not conduct surveillance of individuals. If you find evidence of a crime or a credible threat, preserve it and contact the appropriate authorities or your organization's safety team.

Use practice targets: your own accounts, public companies, known landmarks, and official exercise datasets. Trace Labs runs OSINT searches for missing persons with clear rules and authorization; that is a legitimate way to apply the skills. Follow their code of conduct.

## Structured learning path

| Stage | Focus | What to do | Evidence of completion |
| --- | --- | --- | --- |
| 1. Method | Intelligence cycle and requirements | Write a research plan for a public company profile | A one-page plan with question, scope, and sources |
| 2. Search | Operators and source discovery | Build a source list for a sector and practice advanced search | A query log with results and relevance notes |
| 3. Verification | Provenance and geolocation | Verify five public images or claims from start to finish | A verification memo per item with confidence levels |
| 4. Technical | Domains and metadata | Map a public organization's domains and inspect sample metadata | An entity and infrastructure map with sources |
| 5. Analysis | Hypotheses and bias | Produce a full assessment with alternative explanations | A report reviewed by a peer for logical gaps |
| 6. Ethics | Privacy and harm | Red-team your own report for privacy risk | A redaction and minimization checklist |

## Free courses and guided learning

| Resource | Provider | Level | Cost / access | Hands-on | What you gain |
| --- | --- | --- | --- | --- | --- |
| [Bellingcat guides](https://www.bellingcat.com/) | Bellingcat | Beginner to advanced | Free | Some guided exercises | Investigative techniques from working researchers |
| [Bellingcat Online Investigation Toolkit](https://bellingcat.gitbook.io/toolkit) | Bellingcat | Beginner to advanced | Free | No | A curated, frequently updated tool directory |
| [OSINT Framework](https://osintframework.com/) | Community project | Beginner | Free | No | A visual map of sources by category |
| [Verification Handbook](https://verificationhandbook.com/) | European Journalism Centre | Beginner to intermediate | Free | No | A structured method for verifying user-generated content |
| [Trace Labs](https://www.tracelabs.org/) | Trace Labs | Intermediate | Free volunteer participation | Yes, authorized searches | Real-world OSINT for missing persons with strict rules |
| [TryHackMe OSINT rooms](https://tryhackme.com/) | TryHackMe | Beginner | Freemium; some rooms free | Yes | Guided search and documentation practice |

## Official documentation and standards

- [Berkeley Protocol on Digital Open Source Investigations](https://www.ohchr.org/en/publications/policy-and-methodological-publications/berkeley-protocol-digital-open-source-investigations) — the leading professional standard for digital open-source investigations.
- [EU General Data Protection Regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj) — the legal text on personal data processing in the EU.
- [European Commission data protection guidance](https://commission.europa.eu/law/law-topic/data-protection_en) — accessible explanations of GDPR obligations.
- [UK Information Commissioner's Office](https://ico.org.uk/) — practical guidance on lawful research and privacy.
- [Bellingcat toolkit](https://bellingcat.gitbook.io/toolkit) — a maintained catalogue of verified tools and methods.
- [OSINT Framework](https://osintframework.com/) — a taxonomy of open sources for planning collection.

## Hands-on labs and training grounds

| Lab | Type | Cost | Safe-lab note |
| --- | --- | --- | --- |
| [Trace Labs](https://www.tracelabs.org/) | Volunteer missing-person OSINT | Free | Authorized, rule-bound searches; follow their code of conduct |
| [TryHackMe](https://tryhackme.com/) | Guided OSINT rooms | Freemium | Platform-provided fictional targets |
| [GeoGuessr](https://www.geoguessr.com/) | Geolocation practice | Freemium | Practice visual geolocation without targeting people |
| [Bellingcat guides](https://www.bellingcat.com/) | Self-directed exercises | Free | Use public events and your own images |
| [CyberChef](https://gchq.github.io/CyberChef/) | Data transformation and decoding | Free | Local browser tool for metadata and encoding practice |

## Essential open-source tools

Tools accelerate collection; they do not replace verification. Every automated result needs a human source check.

| Tool | Purpose | Official link |
| --- | --- | --- |
| Maltego CE | Link analysis and entity mapping with a free community edition | [maltego.com](https://www.maltego.com/) |
| SpiderFoot | Automated OSINT collection and correlation | [spiderfoot.net](https://www.spiderfoot.net/) |
| ExifTool | Metadata extraction and editing for files and images | [exiftool.org](https://exiftool.org/) |
| Sherlock | Username discovery across public sites, with caveats about false positives | [github.com/sherlock-project/sherlock](https://github.com/sherlock-project/sherlock) |
| theHarvester | Public source collection for domains, emails, and hosts | [github.com/laramies/theHarvester](https://github.com/laramies/theHarvester) |
| Recon-ng | Modular reconnaissance framework with a database | [github.com/lanmaster53/recon-ng](https://github.com/lanmaster53/recon-ng) |
| Google Earth | Satellite and historical imagery for geolocation | [google.com/earth](https://www.google.com/earth/) |
| Wayback Machine | Archived snapshots for provenance and deleted content | [web.archive.org](https://web.archive.org/) |

## Practical projects and exercises

### Exercise 1: Public company profile

Objective: produce a sourced profile of a publicly traded company using only public records.

Constraints: no personal data about employees beyond public executive roles; cite every claim; distinguish observation from inference.

Deliverable: a two-page report with corporate structure, subsidiaries, domains, public technology signals, key filings, and an assessment of confidence. Include a source table with URL, access date, and what the source supports. Add a section on what you could not verify.

### Exercise 2: Geolocation and chronolocation of a public image

Objective: determine where and when a public photo was taken, using at least three independent clues.

Constraints: use a landmark, a public event, or one of your own photos; do not geolocate a private individual's home or routine; do not publish anything that identifies a bystander.

Deliverable: a step-by-step methodology note with candidate locations, rejected hypotheses, the clues that confirmed the answer, sun or weather evidence for the time, and a confidence statement. Include the tools used and their limits.

### Exercise 3: Verification of a viral claim

Objective: trace a widely shared image or claim to its earliest source and assess whether it is authentic and correctly contextualized.

Constraints: do not contact the subject; use archives, reverse image search, and local-language sources; note dead ends.

Deliverable: a verification memo with first-seen date, original source, repost timeline, metadata findings, visual inconsistencies, alternative explanations, and a final confidence assessment. Add a short paragraph on what would change your conclusion.

## Common mistakes and misconceptions

1. **Confusing public with permissible.** Public data can still be personal data. Legality and ethics are separate tests.
2. **Skipping the question.** Collecting everything feels productive but produces unusable research. Start with a decision and a hypothesis.
3. **Trusting the first source.** Viral posts, aggregators, and AI-generated summaries propagate errors. Find the original.
4. **Over-reading metadata.** Platforms strip it, clocks are wrong, and fields are often defaults. Absence is not proof.
5. **Attributing infrastructure to a person.** Shared hosting, VPNs, and compromised servers break naive attribution.
6. **Ignoring the privacy of bystanders.** A useful image can still expose someone who did not consent to attention.
7. **Using sock puppets or deception without authorization.** This can violate platform rules, journalism ethics, and law.
8. **Presenting inference as fact.** Confidence levels and alternative hypotheses make analysis credible.
9. **Failing to archive.** Pages change and disappear. Capture sources with timestamps as you go.
10. **Continuing when you should stop.** If research starts to feel like surveillance of a private person, stop and escalate.

## Career paths and roles

OSINT skills support threat intelligence analyst, investigative analyst, due diligence and compliance analyst, fraud investigator, trust and safety specialist, and security researcher roles. Newsrooms and human rights organizations also employ open-source investigators. Law enforcement and intelligence roles have additional clearance and legal requirements.

What employers value: a documented method, strong writing, source criticism, and ethical judgment. A portfolio of sanitized verification reports or public-company profiles is persuasive. Tool familiarity helps, but judgment is the differentiator. Certifications exist but are optional; practical evidence and references matter more.

Be realistic about the work: much of it is reading, note-taking, and checking. The exciting "find the person" cases are rare and tightly regulated. The steady work is due diligence, monitoring, and verification.

## Next steps

1. Write the company profile in Exercise 1 and have a peer check every citation.
2. Complete the verification memo in Exercise 3 on a claim you have seen recently.
3. Read the Berkeley Protocol and compare your method to its standards.
4. Review the [threat intelligence guide](../threat-intelligence/README.md) to see how OSINT feeds intelligence production.
5. Read the [ethics policy](../../ETHICS.md) and [intermediate training grounds](../../resources/training-grounds/intermediate.md) before expanding your practice.

## References

1. UN OHCHR, [Berkeley Protocol on Digital Open Source Investigations](https://www.ohchr.org/en/publications/policy-and-methodological-publications/berkeley-protocol-digital-open-source-investigations).
2. EUR-Lex, [General Data Protection Regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
3. European Commission, [data protection guidance](https://commission.europa.eu/law/law-topic/data-protection_en).
4. UK ICO, [data protection guidance](https://ico.org.uk/).
5. Bellingcat, [investigative guides](https://www.bellingcat.com/).
6. Bellingcat, [Online Investigation Toolkit](https://bellingcat.gitbook.io/toolkit).
7. European Journalism Centre, [Verification Handbook](https://verificationhandbook.com/).
8. Trace Labs, [OSINT for missing persons](https://www.tracelabs.org/).

---

Last reviewed: 2026-10-31

[Repository home](../../README.md) | [Ethics policy](../../ETHICS.md) | [Additional topics](../README.md) | [Roadmaps](../../roadmaps/) | [Resources](../../resources/) | [Contributing](../../CONTRIBUTING.md)
