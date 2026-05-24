#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = resolve(root, '..');
const docsDir = resolve(root, 'src/content/docs');

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function write(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, 'utf8');
}

function sourceExists(path, label) {
  if (existsSync(path)) return true;
  console.warn(`Skipping ${label}: source path not found at ${path}`);
  return false;
}

function escapeMd(text) {
  return String(text || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function catalogTable(headers, rows) {
  const thead = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
  const tbody = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('\n');
  return `<table>
<thead>
<tr>${thead}</tr>
</thead>
<tbody>
${tbody}
</tbody>
</table>`;
}

function codeCell(text) {
  return `<code>${escapeHtml(text)}</code>`;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  const data = {};
  if (!match) return data;
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    data[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return data;
}

function listFiles(dir, predicate, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function syncSuperpowersSkills() {
  const skillsRoot = resolve(workspace, 'superpowers-ja/skills');
  if (!sourceExists(skillsRoot, 'superpowers-ja skills sync')) return;
  const files = listFiles(skillsRoot, (file) => basename(file) === 'SKILL.md');
  const rows = files.map((file) => {
    const rel = relative(skillsRoot, dirname(file));
    const fm = parseFrontmatter(readFileSync(file, 'utf8'));
    return {
      name: fm.name || rel,
      description: fm.description || '',
      path: rel,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const table = rows
    .map((row) => `| \`${escapeMd(row.name)}\` | ${escapeMd(row.description)} | \`${escapeMd(row.path)}\` |`)
    .join('\n');

  write(resolve(docsDir, 'superpowers-ja/generated-skills.mdx'), `---
title: Generated Skill Catalog
description: superpowers-ja skills directory から自動生成した skill catalog。
---

# Generated Skill Catalog

この page は \`npm run sync:content\` で \`../superpowers-ja/skills\` から生成します。

| Skill | Description | Path |
| --- | --- | --- |
${table}
`);
}

function syncAgencyAgents() {
  const repoRoot = resolve(workspace, 'agency-agents-ja');
  if (!sourceExists(repoRoot, 'agency-agents-ja agent sync')) return;
  const ignore = new Set(['.claude', 'docs', 'examples', 'scripts', 'workflows']);
  const files = listFiles(repoRoot, (file) => {
    if (!file.endsWith('.md')) return false;
    const rel = relative(repoRoot, file);
    const [top] = rel.split('/');
    return !ignore.has(top) && !['AGENT-LIST.md', 'README.md', 'ROADMAP.md', 'CLAUDE.md'].includes(rel);
  });

  const rows = files.map((file) => {
    const rel = relative(repoRoot, file);
    const fm = parseFrontmatter(readFileSync(file, 'utf8'));
    const category = rel.split('/')[0];
    const source = fm.source || 'unknown';
    return {
      name: fm.name || basename(file, '.md'),
      description: fm.description || '',
      category,
      source,
      translationStatus: fm.translation_status || '',
      upstreamName: fm.upstream_name || '',
      path: rel,
    };
  }).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.source !== b.source) {
      if (a.source === 'japan-original') return -1;
      if (b.source === 'japan-original') return 1;
    }
    return a.name.localeCompare(b.name);
  });

  const total = rows.length;
  const japanOriginal = rows.filter((r) => r.source === 'japan-original').length;
  const upstream = rows.filter((r) => r.source === 'upstream').length;

  const byCategory = new Map();
  for (const row of rows) {
    if (!byCategory.has(row.category)) byCategory.set(row.category, []);
    byCategory.get(row.category).push(row);
  }

  const sections = [...byCategory.entries()].map(([category, agents]) => {
    const jaCount = agents.filter((r) => r.source === 'japan-original').length;
    const upCount = agents.filter((r) => r.source === 'upstream').length;
    const table = catalogTable(['', 'Agent', 'Source', 'Description', 'Path'], agents.map((row) => [
      row.source === 'japan-original' ? '⭐' : '',
      codeCell(row.name),
      row.source === 'japan-original'
        ? 'japan-original'
        : (row.upstreamName ? `upstream (${escapeHtml(row.upstreamName)})` : 'upstream'),
      escapeHtml(row.description),
      codeCell(row.path),
    ]));
    return `## ${category}

Total: ${agents.length} (⭐ ${jaCount} japan-original + ${upCount} upstream-aligned)

${table}`;
  }).join('\n\n');

  write(resolve(docsDir, 'agency-agents-ja/generated-agent-catalog.mdx'), `---
title: Generated Agent Catalog
description: agency-agents-ja の agent files から自動生成した catalog。
---

# Generated Agent Catalog

Total: **${total}** agents (⭐ **${japanOriginal}** japan-original + **${upstream}** upstream-aligned)

この page は \`npm run sync:content\` で \`../agency-agents-ja\` から生成します。
⭐ は日本市場向けに独自設計された agent (\`source: japan-original\`)、それ以外は上流 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) 由来 (\`source: upstream\`) です。

${sections}
`);
}

function syncAgencyWorkflows() {
  const workflowsRoot = resolve(workspace, 'agency-agents-ja/workflows');
  if (!sourceExists(workflowsRoot, 'agency-agents-ja workflow sync')) return;
  const files = listFiles(workflowsRoot, (file) => file.endsWith('.yaml') || file.endsWith('.yml'));
  const rows = files.map((file) => {
    const text = readFileSync(file, 'utf8');
    const name = text.match(/^name:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || basename(file);
    const description = text.match(/^description:\s*(.+)$/m)?.[1]?.replace(/^["']|["']$/g, '') || '';
    return {
      name,
      description,
      path: relative(resolve(workspace, 'agency-agents-ja'), file),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const table = catalogTable(['Workflow', 'Description', 'Path'], rows.map((row) => [
    codeCell(row.name),
    escapeHtml(row.description),
    codeCell(row.path),
  ]));

  write(resolve(docsDir, 'agency-agents-ja/generated-workflows.mdx'), `---
title: Generated Workflow Catalog
description: agency-agents-ja workflows directory から自動生成した workflow catalog。
---

# Generated Workflow Catalog

この page は \`npm run sync:content\` で \`../agency-agents-ja/workflows\` から生成します。

${table}
`);
}

syncSuperpowersSkills();
syncAgencyAgents();
syncAgencyWorkflows();

console.log('Generated docs from superpowers-ja and agency-agents-ja.');
