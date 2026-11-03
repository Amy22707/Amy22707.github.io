import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { parse } from 'parse5';

const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const normalize = value => value.replace(/\s+/g, ' ').trim();
const shared = await readJson('public/i18n/site.json');
const manifest = await readJson('public/i18n/pages.json');
const studio = await readJson('.studio-workspace/amy-studio/site/i18n/site.json');
const errors = new Set();
let pages = 0, strings = 0, protectedBlocks = 0;
const skip = new Set(['script', 'style', 'pre', 'code', 'math', 'svg', 'noscript', 'textarea']);
const properNames = new Set(['薛之瑶']);

async function inspect(directory, isStudio = false) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) { await inspect(path, isStudio); continue; }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const page = relative(resolve(isStudio ? '.studio-workspace/amy-studio/site' : 'dist'), path).replaceAll('\\', '/');
    const route = '/' + page.replace(/index\.html$/, '').split('/').map(encodeURIComponent).join('/');
    const catalog = { ...(isStudio ? studio : shared) };
    if (!isStudio && manifest[route]) Object.assign(catalog, await readJson(resolve('public/i18n', manifest[route])));
    function check(value) {
      const source = normalize(value);
      if (!/[A-Za-z\u3400-\u9fff]/.test(source) || /^(https?:\/\/|[^\s@]+@[^\s@]+$)/.test(source)) return;
      strings++;
      const translation = catalog[source];
      if (!translation || typeof translation.en !== 'string' || typeof translation.zh !== 'string') {
        errors.add(`${page}: missing translation for ${source.slice(0, 100)}`);
        return;
      }
      if (!translation.en.trim() || !translation.zh.trim()) errors.add(`${page}: empty translation for ${source.slice(0, 100)}`);
      if (/[\u3400-\u9fff]/.test(translation.en) && !properNames.has(source)) errors.add(`${page}: untranslated Chinese in English: ${source.slice(0, 100)}`);
      if (/薛[志智植]/.test(translation.zh)) errors.add(`${page}: incorrect personal name`);
      if (/__SEGMENT_\d|literal translation|as an AI language model/i.test(translation.en)) errors.add(`${page}: translation service artifact`);
      if (source.includes('数算术') && translation.en.includes('Data Structures and Algorithms')) errors.add(`${page}: arithmetic mistranslated as a course name`);
      if (source.includes('短程设') && translation.en.includes('Programming Practice')) errors.add(`${page}: short-horizon settings mistranslated as a course name`);
    }
    function walk(node, blocked = false) {
      const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
      const protectedHere = skip.has(node.tagName) || /\bkatex\b/.test(attrs.class || '') || attrs.translate === 'no';
      if (!blocked && protectedHere) protectedBlocks++;
      blocked ||= protectedHere;
      if (!blocked && node.nodeName === '#text') check(node.value);
      if (!blocked) {
        for (const key of ['aria-label', 'title', 'alt', 'placeholder']) if (attrs[key]) check(attrs[key]);
        if (node.tagName === 'meta' && attrs.name === 'description') check(attrs.content || '');
      }
      for (const child of node.childNodes || []) walk(child, blocked);
    }
    walk(parse(await readFile(path, 'utf8')));
  }
}
await inspect(resolve('dist'));
await inspect(resolve('.studio-workspace/amy-studio/site'), true);
const data = await readJson('.studio-workspace/amy-studio/site/data/studio.json');
for (const project of data.projects) {
  for (const text of [project.title, project.description, project.details, ...(project.highlights || [])].filter(Boolean)) {
    assert.ok(studio[normalize(text)], `Missing Studio project translation: ${text}`);
  }
}
const links = await readFile('dist/links/index.html', 'utf8');
assert.match(links, /class="link-card"[^>]*translate="no"/);
const frog = await readFile('dist/studio/travel-frog/index.html', 'utf8');
assert.match(frog, /src="\/i18n\/runtime\.js"/);
assert.match(frog, /aria-disabled="true"/);
for (const error of errors) console.error(error);
assert.equal(errors.size, 0, `Language validation found ${errors.size} issues.`);
console.log(`Language validation passed: ${pages} pages, ${strings} text occurrences, ${protectedBlocks} protected code/math/friend blocks.`);
