# Link checker

The repository uses a dependency-free Node.js checker for internal paths, heading anchors, and external URLs.

## Run locally

```bash
npm run check:links             # internal links and anchors
npm run check:links:external    # also probe every external URL
node scripts/link-checker/check-links.mjs --external --json
```

The JSON report is written to `link-report.json`, which is gitignored.

## Exit behavior

- Missing repository files and missing heading anchors fail the check.
- HTTP 404 and 410 responses fail external checks.
- HTTP 401, 403, 406, 409 and 429 are reported as `bot-protected` warnings, because many reputable sites block automated agents.
- Timeouts and server errors are warnings. Inspect them manually before assuming a link is dead.
- Redirects are followed. A link that redirects to a generic home page should still be reviewed because it may no longer point to the intended resource.

## Maintenance

External checking runs weekly and can be triggered manually from the Actions tab. When a site permanently moves, update the canonical URL in both the Markdown page and `resources/data/resources.json`, then record the review in `resources/RESOURCE-FORMAT.md`.

Do not silence a real 404 by adding it to an ignore list. Remove or replace the resource instead.
