#!/usr/bin/env node
/**
 * Repository structure and content integrity checks.
 * No third-party dependencies.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const notes = [];

const requiredFiles = [
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "SUPPORT.md",
  "CHANGELOG.md",
  "ROADMAP.md",
  "LEARNING-GUIDE.md",
  "FAQ.md",
  "ETHICS.md",
  ".gitignore",
  "package.json",
];

const requiredDirectories = [
  "foundations",
  "ethical-hacking",
  "network-penetration-testing",
  "web-application-security",
  "mobile-security",
  "wireless-security",
  "cloud-security",
  "digital-forensics",
  "malware-analysis",
  "soc-blue-team",
  "red-team",
  "additional-topics",
  "roadmaps",
  "resources",
  "practical-projects",
  "exercises",
  "glossary",
  "checklists",
  "templates",
  ".github",
  "scripts",
];

const guidePairs = [
  ["foundations/networking/README.md", ["DNS", "TCP", "HTTP"]],
  ["foundations/linux/README.md", ["permission", "systemd"]],
  ["foundations/windows/README.md", ["registry", "PowerShell"]],
  ["foundations/programming/README.md", ["Python"]],
  ["foundations/cybersecurity-fundamentals/README.md", ["CIA"]],
  ["foundations/security-ethics/README.md", ["authorization"]],
  ["ethical-hacking/README.md", ["scope", "report"]],
  ["network-penetration-testing/README.md", ["enumeration", "segmentation"]],
  ["web-application-security/README.md", ["OWASP", "authentication"]],
  ["mobile-security/README.md", ["Android", "MASVS"]],
  ["wireless-security/README.md", ["WPA", "Bluetooth"]],
  ["cloud-security/README.md", ["IAM", "Kubernetes"]],
  ["digital-forensics/README.md", ["chain of custody", "memory"]],
  ["malware-analysis/README.md", ["static", "YARA"]],
  ["soc-blue-team/README.md", ["SIEM", "incident response"]],
  ["red-team/README.md", ["rules of engagement", "MITRE ATT&CK"]],
  ["additional-topics/bug-bounty/README.md", ["scope", "report"]],
  ["additional-topics/active-directory/README.md", ["Kerberos", "Group Policy"]],
  ["additional-topics/linux-security/README.md", ["SELinux", "auditd"]],
  ["additional-topics/cryptography/README.md", ["TLS", "hash"]],
  ["additional-topics/osint/README.md", ["verification", "privacy"]],
  ["additional-topics/iot-security/README.md", ["firmware", "MQTT"]],
  ["additional-topics/hardware-security/README.md", ["JTAG", "firmware"]],
  ["additional-topics/blockchain-security/README.md", ["reentrancy", "Solidity"]],
  ["additional-topics/ai-security/README.md", ["prompt injection", "LLM"]],
  ["additional-topics/devsecops/README.md", ["CI/CD", "SBOM"]],
  ["additional-topics/application-security/README.md", ["threat model", "ASVS"]],
  ["additional-topics/exploit-development/README.md", ["memory", "mitigation"]],
  ["additional-topics/threat-intelligence/README.md", ["intelligence cycle", "STIX"]],
  ["additional-topics/security-architecture/README.md", ["zero trust", "segmentation"]],
  ["additional-topics/governance-risk-compliance/README.md", ["risk", "NIST"]],
  ["additional-topics/career-development/README.md", ["portfolio", "interview"]],
];

const roadmapFiles = [
  "beginner-to-ethical-hacker.md",
  "network-pentester.md",
  "web-security-specialist.md",
  "mobile-security-specialist.md",
  "cloud-security-engineer.md",
  "digital-forensics.md",
  "malware-analyst.md",
  "soc-analyst.md",
  "blue-team-engineer.md",
  "red-team-operator.md",
  "bug-bounty-hunter.md",
  "cybersecurity-engineer.md",
];

const projectFiles = [
  "01-home-lab.md",
  "02-linux-hardening.md",
  "03-network-monitoring.md",
  "04-log-analysis-siem.md",
  "05-web-vuln-assessment.md",
  "06-security-report.md",
  "07-incident-investigation.md",
  "08-forensics-timeline.md",
  "09-malware-analysis-report.md",
  "10-cloud-security-review.md",
  "11-secure-web-app.md",
  "12-security-portfolio.md",
];

const guideHeadings = [
  "At a glance",
  "Why this field matters",
  "What you will learn",
  "Core concepts",
  "Legal and safe practice",
  "Structured learning path",
  "Free courses and guided learning",
  "Official documentation and standards",
  "Hands-on labs and training grounds",
  "Essential open-source tools",
  "Practical projects and exercises",
  "Common mistakes and misconceptions",
  "Career paths and roles",
  "Next steps",
  "References",
];

const placeholderPatterns = [
  /\bTODO\b/,
  /\bTBD\b/,
  /\bFIXME\b/,
  /lorem ipsum/i,
  /coming soon/i,
  /placeholder section/i,
  /placeholder content/i,
  /\[insert[^\]]*\]/i,
];

async function exists(relativePath) {
  try {
    await fs.access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function walk(directory, results = []) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if ([".git", "node_modules", ".cache"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(full, results);
    else if (entry.isFile() && entry.name.endsWith(".md")) results.push(full);
  }
  return results;
}

function stripCode(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "")
    .replace(/`[^`\n]*`/g, "");
}

async function main() {
  for (const file of requiredFiles) {
    if (!(await exists(file))) errors.push(`Missing required file: ${file}`);
  }
  for (const directory of requiredDirectories) {
    if (!(await exists(directory))) errors.push(`Missing required directory: ${directory}`);
  }
  for (const roadmap of roadmapFiles) {
    if (!(await exists(`roadmaps/${roadmap}`))) errors.push(`Missing roadmap: roadmaps/${roadmap}`);
  }
  for (const project of projectFiles) {
    if (!(await exists(`practical-projects/${project}`))) {
      errors.push(`Missing project: practical-projects/${project}`);
    }
  }

  for (const [file, concepts] of guidePairs) {
    if (!(await exists(file))) {
      errors.push(`Missing guide: ${file}`);
      continue;
    }
    const content = await fs.readFile(path.join(ROOT, file), "utf8");
    if (content.split("\n").length < 60) errors.push(`Guide looks too short: ${file}`);
    if (!/^#\s+/m.test(content)) errors.push(`Guide has no H1: ${file}`);
    for (const concept of concepts) {
      if (!content.toLowerCase().includes(concept.toLowerCase())) {
        errors.push(`Guide ${file} is missing required concept: ${concept}`);
      }
    }
    for (const heading of guideHeadings) {
      if (!new RegExp(`^## ${heading}\\s*$`, "m").test(content)) {
        errors.push(`Guide ${file} is missing required section: ${heading}`);
      }
    }
    if (!/authoriz|legal|ethic/i.test(content)) {
      errors.push(`Guide ${file} lacks an authorization/ethics reminder`);
    }
  }

  const markdownFiles = await walk(ROOT);
  for (const file of markdownFiles) {
    const relative = path.relative(ROOT, file).split(path.sep).join("/");
    const content = await fs.readFile(file, "utf8");
    if (content.trim().length === 0) {
      errors.push(`Empty Markdown file: ${relative}`);
      continue;
    }
    const prose = stripCode(content);
    const h1Count =
      (prose.match(/^#\s+/gm) ?? []).length + (content.match(/<h1\b/gi) ?? []).length;
    if (h1Count !== 1) errors.push(`${relative} has ${h1Count} H1 headings (expected exactly 1)`);
    for (const pattern of placeholderPatterns) {
      if (pattern.test(prose)) errors.push(`${relative} contains placeholder text: ${pattern}`);
    }
    if (/\]\(https?:\/\/[^)]*\)\s*https?:\/\//.test(content)) {
      notes.push(`${relative} may contain a bare URL adjacent to a link`);
    }
  }

  const resourcesPath = path.join(ROOT, "resources/data/resources.json");
  if (await exists("resources/data/resources.json")) {
    try {
      const raw = await fs.readFile(resourcesPath, "utf8");
      const resources = JSON.parse(raw);
      if (!Array.isArray(resources)) {
        errors.push("resources/data/resources.json must contain an array");
      } else {
        const urls = new Set();
        const required = [
          "name",
          "url",
          "provider",
          "category",
          "level",
          "cost",
          "account_required",
          "hands_on",
          "description",
          "verified",
        ];
        resources.forEach((resource, index) => {
          for (const field of required) {
            if (!(field in resource)) {
              errors.push(`Resource ${index} (${resource.name ?? "unnamed"}) missing ${field}`);
            }
          }
          if (!/^https:\/\//.test(resource.url ?? "")) {
            errors.push(`Resource ${index} has a non-HTTPS URL`);
          }
          if (urls.has(resource.url)) errors.push(`Duplicate resource URL: ${resource.url}`);
          urls.add(resource.url);
          if (!["free", "free-account", "freemium", "paid"].includes(resource.cost)) {
            errors.push(`Resource ${resource.name} has invalid cost value: ${resource.cost}`);
          }
          if (!["beginner", "intermediate", "advanced", "mixed"].includes(resource.level)) {
            errors.push(`Resource ${resource.name} has invalid level: ${resource.level}`);
          }
        });
        notes.push(`Resource catalog: ${resources.length} entries, ${urls.size} unique URLs.`);
      }
    } catch (error) {
      errors.push(`Invalid resources JSON: ${error.message}`);
    }
  } else {
    errors.push("Missing resources/data/resources.json");
  }

  const roadmapCount = roadmapFiles.filter((file) => file).length;
  const projectCount = projectFiles.length;
  notes.push(`Markdown files: ${markdownFiles.length}.`);
  notes.push(`Roadmaps: ${roadmapCount}. Projects: ${projectCount}.`);

  process.stdout.write("learn-hacking repository validation\n");
  process.stdout.write("==================================\n");
  for (const note of notes) process.stdout.write(`INFO  ${note}\n`);

  if (errors.length > 0) {
    process.stdout.write(`\nFAIL: ${errors.length} issue(s)\n`);
    for (const error of errors) process.stdout.write(`ERROR ${error}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write("\nPASS: structure and content checks succeeded.\n");
}

await main();
