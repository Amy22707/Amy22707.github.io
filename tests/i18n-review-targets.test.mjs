import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeTerms } from '../scripts/i18n-terms.mjs';

const targets = [
  ['Normal Edition daily loop', 'blog--travel-frog.json', '[[O0]]普通版日常循环[[C0]]'],
  ['Prefetching', 'blog--agent-systems-wiki.json', '[[O0]]预取或提前准备：[[C0]]'],
  ['PoS claims', 'blog--agent-systems-wiki.json', 'PoS 将'],
  ['Execution-only objective', 'blog--agent-systems-wiki.json', '[[O0]]只优化执行部分。[[C0]]'],
];
for (const [name, filename, fragment] of targets) {
  test(`Reviewed override is used in the actual page: ${name}`, async () => {
    const overrides = JSON.parse(await readFile('src/i18n/block-overrides.json', 'utf8'));
    const catalog = JSON.parse(await readFile(`public/i18n/blocks/${filename}`, 'utf8'));
    const key = Object.keys(catalog).find(key => JSON.parse(key)[0].includes(fragment));
    assert(key, `Missing rendered context for ${fragment}`);
    const source = JSON.parse(key)[0];
    const reviewed = overrides[key]?.en ?? overrides[source]?.en;
    assert(reviewed, `Override must match the rendered context for ${fragment}`);
    assert.equal(catalog[key].en, normalizeTerms(source, reviewed));
    if (name === 'Normal Edition daily loop') assert(!catalog[key].en.includes('will follow'));
  });
}
