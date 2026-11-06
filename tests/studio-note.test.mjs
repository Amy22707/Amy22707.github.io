import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { parse } from 'parse5';

test('Studio copy omits only the final essay and keeps navigable technical content', async () => {
  const source = await readFile('src/content/blog/Travel-Frog.md', 'utf8');
  const html = await readFile('.studio-workspace/amy-studio/site/notes/travel-frog/index.html', 'utf8');
  assert(source.includes('<summary>折叠区小作文</summary>'));
  assert(!html.includes('折叠区小作文'));
  assert(!html.includes('远行与回归……而回归的路更长'));
  assert(html.includes('自用备忘'));
  assert(html.includes('astro-code'));
  assert(html.includes('travel-frog-diary.png'));
  assert(html.includes('id="year"'));
  const ids = new Set(), anchors = [], assets = [];
  function walk(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    if (attrs.id) ids.add(attrs.id);
    if (node.tagName === 'a' && attrs.href?.startsWith('#')) anchors.push(attrs.href.slice(1));
    if (node.tagName === 'script' && attrs.src) assets.push(attrs.src);
    if (node.tagName === 'img' && attrs.src) assets.push(attrs.src);
    if (node.tagName === 'link' && attrs.href) assets.push(attrs.href);
    for (const child of node.childNodes || []) walk(child);
  }
  walk(parse(html));
  for (const id of anchors) assert(ids.has(id), `Missing heading: ${id}`);
  const page = resolve('.studio-workspace/amy-studio/site/notes/travel-frog/index.html');
  for (const asset of assets) if (!/^(https?:|data:)/.test(asset)) await access(resolve(dirname(page), asset.split('?')[0]));
  const blocks = JSON.parse(await readFile('.studio-workspace/amy-studio/site/i18n/blocks/notes--travel-frog.json', 'utf8'));
  assert(Object.keys(blocks).length > 0);
  assert(!JSON.stringify(blocks).includes('回想起高中时每周末上线收集明信片'));
});
