import { parse } from 'parse5';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { isAddress } from './i18n-terms.mjs';

const records = new Map();
const skip = new Set(['script', 'style', 'pre', 'code', 'math', 'svg', 'noscript', 'textarea']);
const add = (value, page) => {
  const text = value.replace(/\s+/g, ' ').trim();
  if (!/[A-Za-z\u3400-\u9fff]/.test(text) || isAddress(text)) return;
  if (!records.has(text)) records.set(text, { text, pages: [] });
  if (!records.get(text).pages.includes(page)) records.get(text).pages.push(page);
};
async function inspect(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await inspect(path, prefix);
    else if (entry.name.endsWith('.html')) {
      const page = prefix + relative(prefix === 'studio:' ? resolve('.studio-workspace/amy-studio/site') : resolve('dist'), path).replaceAll('\\', '/');
      const walk = (node, blocked = false) => {
        const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
        blocked ||= skip.has(node.tagName) || /\bkatex\b/.test(attrs.class || '') || attrs.translate === 'no';
        if (!blocked && node.nodeName === '#text') add(node.value, page);
        if (!blocked) {
          for (const key of ['aria-label', 'title', 'alt', 'placeholder']) if (attrs[key]) add(attrs[key], page);
          if (node.tagName === 'meta' && attrs.name === 'description') add(attrs.content || '', page);
        }
        for (const child of node.childNodes || []) walk(child, blocked);
      };
      walk(parse(await readFile(path, 'utf8')));
    }
  }
}
await inspect(resolve('dist'), '');
await inspect(resolve('.studio-workspace/amy-studio/site'), 'studio:');
const studio = JSON.parse(await readFile('.studio-workspace/amy-studio/site/data/studio.json', 'utf8'));
for (const project of studio.projects) {
  for (const key of ['title', 'description', 'details', 'imageAlt', 'notice', 'version']) add(project[key] || '', 'studio:data');
  for (const item of project.highlights || []) add(item, 'studio:data');
}
for (const update of studio.updates || []) {
  for (const key of ['title', 'description']) add(update[key] || '', 'studio:data');
}
for (const label of ['PLACEHOLDER ART', 'Email the studio ↗', 'Send feedback ↗']) add(label, 'shared');
for (const label of ['Copy', 'Copied', 'Copy failed', 'Copy snippet', 'Published', 'Updated', 'Switch to dark mode', 'Switch to light mode', 'Dark', 'Light', 'Project page', 'Project preview ↗', 'View details', 'Download ↓', 'Play ↗', 'Download', 'Play online', 'Release notes', 'Source code', 'GAME', 'TOOL', 'AVAILABLE', 'PREVIEW · TESTING', 'ON THE WORKBENCH', 'A game, coming soon', 'A tool, coming soon', 'A new space on the workbench. More details will be shared when it is ready.', 'Testing in progress. Downloads and online play are not yet available.', 'This space is waiting for its first release. Check back soon.', 'A LITTLE PLAY', 'AN EVERYDAY TOOL', 'Nothing here yet. Come back soon.', 'The collection could not be loaded. Please refresh or try again later.']) add(label, 'shared');
await mkdir('.studio-workspace/i18n', { recursive: true });
await writeFile('.studio-workspace/i18n/inventory.json', JSON.stringify([...records.values()], null, 2));
console.log(`Collected ${records.size} unique translatable strings.`);
