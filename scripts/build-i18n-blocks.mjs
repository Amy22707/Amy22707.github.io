import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseTemplate } from '../public/i18n/inline-blocks.mjs';
import { normalizeTerms } from './i18n-terms.mjs';
const inventory = JSON.parse(await readFile('.studio-workspace/i18n/blocks-inventory.json', 'utf8'));
let drafts = {};
try { drafts = JSON.parse((await readFile('.studio-workspace/i18n/blocks-translations.json', 'utf8')).replace(/^\uFEFF/, '')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const file of (await readdir('.studio-workspace/i18n')).filter(name => /^blocks-translations-worker-\d+\.json$/.test(name))) {
  Object.assign(drafts, JSON.parse((await readFile(resolve('.studio-workspace/i18n', file), 'utf8')).replace(/^\uFEFF/, '')));
}
let overrides = {};
try { overrides = JSON.parse(await readFile('src/i18n/block-overrides.json', 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const catalogs = new Map(), pending = [];
for (const row of inventory) {
  const en = normalizeTerms(row.text, overrides[row.key]?.en ?? overrides[row.text]?.en ?? drafts[row.text]?.en);
  try { parseTemplate(en, row.slots); }
  catch { pending.push(row); continue; }
  for (const page of row.pages) {
    if (!catalogs.has(page)) catalogs.set(page, {});
    catalogs.get(page)[row.key] = { en };
  }
}
for (const [prefix, output] of [['', 'public/i18n/blocks'], ['studio:', '.studio-workspace/amy-studio/site/i18n/blocks']]) {
  await mkdir(output, { recursive: true });
  const manifest = {};
  for (const [page, catalog] of catalogs) {
    if (page.startsWith('studio:') !== Boolean(prefix)) continue;
    const routePage = page.replace(/^studio:/, '');
    const route = '/' + routePage.replace(/index\.html$/, '').split('/').map(encodeURIComponent).join('/');
    const filename = routePage.replace(/\/index\.html$/, '').replace(/^index\.html$/, 'home').replaceAll('/', '--') + '.json';
    manifest[route] = 'blocks/' + filename;
    await writeFile(resolve(output, filename), JSON.stringify(catalog));
  }
  await writeFile(resolve(output, 'pages.json'), JSON.stringify(manifest));
}
await writeFile('.studio-workspace/i18n/blocks-pending.json', JSON.stringify(pending, null, 2));
await writeFile('.studio-workspace/i18n/blocks-translations.json', JSON.stringify(drafts));
console.log(`Sentence dictionaries: ${inventory.length - pending.length}/${inventory.length}; ${pending.length} pending.`);
