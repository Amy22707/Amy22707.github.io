import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { formatProjectDate } from '../src/utils/contentOrder.mjs';
import { cleanGitEnvironment } from './studio-sync-core.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = resolve(root, 'src/content/projects');
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(arg => arg !== '--check')) throw new Error('Use --check for a read-only preview, or no options to update dates.');

function existingToken() {
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) return process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const result = spawnSync('git', ['-c', 'credential.interactive=never', 'credential', 'fill'], {
    cwd: root, input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', windowsHide: true, timeout: 15000,
    env: { ...cleanGitEnvironment(), GIT_TERMINAL_PROMPT: '0' },
  });
  return result.status === 0 ? result.stdout.split(/\r?\n/).find(line => line.startsWith('password='))?.slice(9) : undefined;
}

function setDate(header, key, value, newline) {
  const pattern = new RegExp(`^${key}:[^\\r\\n]*`, 'm');
  if (!pattern.test(header)) return header + newline + `${key}: ${value}`;
  return header.replace(pattern, line => `${key}: ${value}${line.match(/\s+#.*$/)?.[0] || ''}`);
}

try {
  const token = existingToken();
  const headers = { 'User-Agent': 'Amy-homepage-project-dates', Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const updates = [];
  for (const file of (await readdir(directory)).filter(file => /\.mdx?$/.test(file))) {
    const path = resolve(directory, file), source = await readFile(path, 'utf8');
    const frontmatter = source.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)(?=\r?\n|$)/);
    if (!frontmatter) throw new Error(`${file}: missing Markdown frontmatter.`);
    const value = frontmatter[2].match(/^repository:\s*([^\r\n]+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
    if (!value) continue;
    const url = new URL(value);
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/, '').split('/');
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || parts.length !== 2) throw new Error(`${file}: expected a GitHub repository URL.`);
    const repo = parts.join('/');
    const response = await fetch('https://api.github.com/repos/' + parts.map(encodeURIComponent).join('/'), {
      headers, redirect: 'error', signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`Cannot read ${repo} (HTTP ${response.status}). Check your GitHub login/repository access; no project files were updated.`);
    const metadata = await response.json();
    const preservePublishedAt = /^preservePublishedAt:\s*true\s*(?:#.*)?$/m.test(frontmatter[2]);
    const savedPublishedAt = frontmatter[2].match(/^publishedAt:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*(?:#.*)?$/m)?.[1];
    if (preservePublishedAt && !savedPublishedAt) throw new Error(`${file}: preservePublishedAt requires a publishedAt date in YYYY-MM-DD format.`);
    const publishedAt = preservePublishedAt ? savedPublishedAt : formatProjectDate(new Date(metadata.created_at)).replaceAll('.', '-');
    const updatedAt = formatProjectDate(new Date(metadata.pushed_at || metadata.created_at)).replaceAll('.', '-');
    const newline = frontmatter[1].includes('\r\n') ? '\r\n' : '\n';
    const publicationHeader = preservePublishedAt ? frontmatter[2] : setDate(frontmatter[2], 'publishedAt', publishedAt, newline);
    const header = setDate(publicationHeader, 'updatedAt', updatedAt, newline);
    const next = frontmatter[1] + header + frontmatter[3] + source.slice(frontmatter[0].length);
    updates.push({ path, source, next, file, repo, publishedAt, updatedAt });
  }
  // Check all sources again before applying a complete metadata snapshot.
  for (const item of updates) if (await readFile(item.path, 'utf8') !== item.source) throw new Error(`${item.file} changed during lookup; rerun to keep that edit.`);
  let changed = 0;
  for (const item of updates) {
    if (item.source !== item.next) { changed++; if (!check) await writeFile(item.path, item.next); }
    console.log(`${item.file}: published ${item.publishedAt}; updated ${item.updatedAt}`);
  }
  console.log(`${check ? 'Preview' : 'Synchronized'} ${updates.length} GitHub repositories; ${changed} ${check ? 'files would change' : 'files changed'}. No commits or pushes made.`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
