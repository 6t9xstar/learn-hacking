#!/usr/bin/env node
/**
 * Repository link checker.
 *
 * Checks relative links and heading anchors by default. Add --external to also
 * probe HTTP(S) links. External failures are classified so bot protection does
 * not break CI while real 404s do.
 *
 * Usage:
 *   node scripts/link-checker/check-links.mjs
 *   node scripts/link-checker/check-links.mjs --external
 *   node scripts/link-checker/check-links.mjs --external --json
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..", "..");
const args = new Set(process.argv.slice(2));
const EXTERNAL = args.has("--external");
const JSON_OUTPUT = args.has("--json");
const VERBOSE = args.has("--verbose");
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 10;
const IGNORED_DIRS = new Set([".git", "node_modules", ".cache", "coverage"]);
const IGNORED_FILES = new Set(["link-report.json", "link-report.md"]);

const failures = [];
const warnings = [];
const checkedInternal = new Set();
const externalTargets = new Map();
let markdownFiles = 0;
let internalLinks = 0;

function toPosix(value) {
  return value.split(path.sep).join("/");
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") && ![".github", ".markdownlint-cli2.jsonc"].includes(entry.name)) {
      if (entry.isDirectory()) continue;
    }
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      files.push(...(await walk(path.join(directory, entry.name))));
    } else if (entry.isFile() && entry.name.endsWith(".md") && !IGNORED_FILES.has(entry.name)) {
      files.push(path.join(directory, entry.name));
    }
  }
  return files;
}

function stripCode(markdown) {
  return markdown
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`\n]*`/g, "");
}

function extractLinks(markdown) {
  const body = stripCode(markdown);
  const results = [];
  const inline = /!?\[[^\]]*\]\((\s*<[^>]+>|[^)\s]+)(?:\s+["'][^"']*["'])?\s*\)/g;
  let match;
  while ((match = inline.exec(body)) !== null) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    results.push(target);
  }
  const reference = /^\s{0,3}\[[^\]]+\]:\s*(\S+)/gm;
  while ((match = reference.exec(body)) !== null) {
    results.push(match[1].replace(/^<|>$/g, ""));
  }
  const html = /\b(?:href|src)=["']([^"']+)["']/gi;
  while ((match = html.exec(body)) !== null) {
    results.push(match[1]);
  }
  return results;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function headingAnchors(markdown) {
  const anchors = new Set();
  const seen = new Map();
  const body = stripCode(markdown);
  const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  let match;
  while ((match = heading.exec(body)) !== null) {
    const base = slugify(match[2]);
    const count = seen.get(base) ?? 0;
    anchors.add(count === 0 ? base : `${base}-${count}`);
    seen.set(base, count + 1);
  }
  return anchors;
}

function isExternal(target) {
  return /^https?:\/\//i.test(target);
}

function isIgnored(target) {
  return (
    !target ||
    target === "#" ||
    /^(mailto:|tel:|sms:|ftp:|javascript:|data:)/i.test(target) ||
    target.startsWith("{{")
  );
}

async function checkInternal(sourceFile, rawTarget) {
  const withoutFragment = rawTarget.split("#")[0].split("?")[0];
  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    decoded = withoutFragment;
  }
  const targetPath = decoded.startsWith("/")
    ? path.join(ROOT, decoded.slice(1))
    : path.resolve(path.dirname(sourceFile), decoded);
  const relativeSource = toPosix(path.relative(ROOT, sourceFile));
  const relativeTarget = toPosix(path.relative(ROOT, targetPath));
  const key = `${relativeSource} -> ${relativeTarget}`;
  if (checkedInternal.has(key)) return;
  checkedInternal.add(key);
  internalLinks += 1;

  let stat;
  try {
    stat = await fs.stat(targetPath);
  } catch {
    failures.push({
      type: "internal-missing",
      source: relativeSource,
      target: rawTarget,
      message: `Target does not exist: ${relativeTarget}`,
    });
    return;
  }

  const fragment = rawTarget.includes("#") ? rawTarget.split("#").slice(1).join("#") : "";
  if (!fragment || !stat.isFile() || !targetPath.endsWith(".md")) return;

  const markdown = await fs.readFile(targetPath, "utf8");
  const anchors = headingAnchors(markdown);
  let decodedFragment = fragment;
  try {
    decodedFragment = decodeURIComponent(fragment);
  } catch {
    /* keep raw fragment */
  }
  const candidates = [decodedFragment, decodedFragment.toLowerCase()];
  if (!candidates.some((candidate) => anchors.has(candidate))) {
    failures.push({
      type: "internal-anchor",
      source: relativeSource,
      target: rawTarget,
      message: `Heading anchor #${decodedFragment} not found in ${relativeTarget}`,
    });
  }
}

function registerExternal(sourceFile, rawTarget) {
  let parsed;
  try {
    parsed = new URL(rawTarget);
  } catch {
    failures.push({
      type: "external-malformed",
      source: toPosix(path.relative(ROOT, sourceFile)),
      target: rawTarget,
      message: "Malformed external URL",
    });
    return;
  }
  parsed.hash = "";
  const url = parsed.toString();
  if (!externalTargets.has(url)) externalTargets.set(url, new Set());
  externalTargets.get(url).add(toPosix(path.relative(ROOT, sourceFile)));
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; learn-hacking-link-checker/1.0; +https://github.com/6t9xstar/learn-hacking)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    return { status: response.status, finalUrl: response.url };
  } finally {
    clearTimeout(timer);
  }
}

async function probeExternal(url) {
  let result;
  try {
    result = await fetchWithTimeout(url);
    if ([405, 501].includes(result.status)) {
      const head = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        headers: { "user-agent": "learn-hacking-link-checker/1.0" },
      });
      result = { status: head.status, finalUrl: head.url };
    }
  } catch (error) {
    return {
      url,
      classification: "unreachable",
      detail: error.name === "AbortError" ? "timed out" : error.message,
    };
  }

  const { status, finalUrl } = result;
  if (status >= 200 && status < 400) return { url, status, classification: "ok", finalUrl };
  if ([401, 403, 406, 409, 429].includes(status)) {
    return { url, status, classification: "bot-protected", finalUrl };
  }
  if ([404, 410].includes(status)) return { url, status, classification: "broken", finalUrl };
  if (status >= 500) return { url, status, classification: "server-error", finalUrl };
  return { url, status, classification: "unexpected", finalUrl };
}

async function runPool(items, worker) {
  let index = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      await worker(items[current], current);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const started = Date.now();
  const files = await walk(ROOT);
  markdownFiles = files.length;

  for (const file of files) {
    const markdown = await fs.readFile(file, "utf8");
    for (const target of extractLinks(markdown)) {
      if (isIgnored(target)) continue;
      if (isExternal(target)) {
        if (EXTERNAL) registerExternal(file, target);
      } else if (!target.startsWith("//")) {
        await checkInternal(file, target);
      }
    }
  }

  const externalResults = [];
  if (EXTERNAL) {
    const urls = [...externalTargets.keys()].sort();
    process.stdout.write(`Checking ${urls.length} external URLs with concurrency ${CONCURRENCY}...\n`);
    await runPool(urls, async (url) => {
      const result = await probeExternal(url);
      result.sources = [...externalTargets.get(url)];
      externalResults.push(result);
      if (result.classification === "broken") {
        failures.push({
          type: "external-broken",
          source: result.sources.join(", "),
          target: url,
          message: `HTTP ${result.status}`,
        });
      } else if (result.classification !== "ok") {
        warnings.push({
          type: `external-${result.classification}`,
          source: result.sources.join(", "),
          target: url,
          message: result.detail || `HTTP ${result.status}`,
        });
      }
      if (VERBOSE) {
        process.stdout.write(`${result.classification.padEnd(14)} ${url}\n`);
      }
    });
  }

  if (JSON_OUTPUT) {
    const report = {
      generatedAt: new Date().toISOString(),
      markdownFiles,
      internalLinks,
      externalChecked: EXTERNAL ? externalResults.length : 0,
      externalOk: externalResults.filter((result) => result.classification === "ok").length,
      externalWarnings: warnings.length,
      failures,
      warnings,
    };
    await fs.writeFile(path.join(ROOT, "link-report.json"), JSON.stringify(report, null, 2));
    process.stdout.write("Wrote link-report.json\n");
  }

  process.stdout.write(
    `\nScanned ${markdownFiles} Markdown files and ${internalLinks} unique internal links.\n`,
  );
  if (EXTERNAL) {
    const ok = externalResults.filter((result) => result.classification === "ok").length;
    const protectedCount = externalResults.filter(
      (result) => result.classification === "bot-protected",
    ).length;
    process.stdout.write(
      `External: ${ok}/${externalResults.length} OK, ${warnings.length} warnings (${protectedCount} bot-protected).\n`,
    );
  }

  if (failures.length > 0) {
    process.stdout.write(`\nFAIL: ${failures.length} broken link(s)\n`);
    for (const failure of failures) {
      process.stdout.write(`- [${failure.type}] ${failure.source}: ${failure.target} (${failure.message})\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write("PASS: no broken links detected.\n");
  if (warnings.length > 0 && VERBOSE) {
    process.stdout.write(`\n${warnings.length} non-fatal warning(s):\n`);
    for (const warning of warnings) {
      process.stdout.write(`- [${warning.type}] ${warning.target} (${warning.message})\n`);
    }
  }
  process.stdout.write(`Completed in ${((Date.now() - started) / 1000).toFixed(1)}s.\n`);
}

await main();
