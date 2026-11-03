import { readFile, readdir, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const directory = resolve('.studio-workspace/i18n');
const inventory = JSON.parse(await readFile(resolve(directory, 'inventory.json'), 'utf8'));
const cache = Object.create(null);
// Reuse committed dictionaries on fresh checkouts where the local draft cache
// is absent. A generation run must not replace existing translations with source.
const previousCatalogs = [resolve('public/i18n/site.json'), resolve('.studio-workspace/amy-studio/site/i18n/site.json')];
try {
  for (const name of await readdir('public/i18n/pages')) previousCatalogs.push(resolve('public/i18n/pages', name));
} catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const path of previousCatalogs) {
  try {
    for (const [source, entry] of Object.entries(JSON.parse(await readFile(path, 'utf8')))) {
      cache[source] ??= { ...entry, completed: ['en', 'zh'] };
    }
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
for (const file of (await readdir(directory)).filter(name => /^translations(?:-worker-\d+)?\.json$/.test(name))) {
  const entries = JSON.parse((await readFile(resolve(directory, file), 'utf8')).replace(/^\uFEFF/, ''));
  for (const [source, entry] of Object.entries(entries)) {
    cache[source] ||= { en: source, zh: source, completed: [] };
    for (const language of entry.completed || []) {
      cache[source][language] = entry[language];
      if (!cache[source].completed.includes(language)) cache[source].completed.push(language);
    }
  }
}
const overrides = JSON.parse(await readFile('src/i18n/overrides.json', 'utf8'));
const pageOverrides = JSON.parse(await readFile('src/i18n/page-overrides.json', 'utf8'));
const mainShared = {}, studioShared = {}, pageCatalogs = new Map();
const incomplete = [];
for (const row of inventory) {
  const source = row.text;
  const entry = { zh: cache[source]?.zh ?? source, en: cache[source]?.en ?? source, ...overrides[source], ...(overrides[source]?.en ? { reviewedEn: true } : {}) };
  if (/[\u3400-\u9fff]/.test(source) && !cache[source]?.completed.includes('en') && !overrides[source]?.en) incomplete.push(row);
  const studio = row.pages.some(page => page.startsWith('studio:'));
  const shared = row.pages.includes('shared');
  const mainPages = row.pages.filter(page => !page.startsWith('studio:') && page !== 'shared');
  if (studio || shared) studioShared[source] = entry;
  if (shared || mainPages.length > 1) mainShared[source] = entry;
  else if (mainPages.length === 1) {
    const page = mainPages[0];
    if (!pageCatalogs.has(page)) pageCatalogs.set(page, {});
    pageCatalogs.get(page)[source] = entry;
  }
}
for (const [key, entry] of Object.entries(overrides)) {
  mainShared[key] = { zh: key, en: key, ...entry, ...(entry.en ? { reviewedEn: true } : {}) };
  // Only common interface labels go into Studio assets.
  if (Object.hasOwn(studioShared, key) || !/[\u3400-\u9fff]/.test(key) && key.length < 90) studioShared[key] = { zh: key, en: key, ...entry };
}
// Short fragments need sentence-level context; do not change their meaning site-wide.
for (const [page, entries] of Object.entries(pageOverrides)) {
  if (!pageCatalogs.has(page)) pageCatalogs.set(page, {});
  for (const [source, entry] of Object.entries(entries)) {
    pageCatalogs.get(page)[source] = { zh: cache[source]?.zh ?? source, en: cache[source]?.en ?? source, ...overrides[source], ...entry, ...(entry.en || overrides[source]?.en ? { reviewedEn: true } : {}) };
  }
}
const output = resolve('public/i18n');
await mkdir(resolve(output, 'pages'), { recursive: true });
await writeFile(resolve(output, 'site.json'), JSON.stringify(mainShared));
const manifest = {};
for (const [page, catalog] of pageCatalogs) {
  const route = '/' + page.replace(/index\.html$/, '').split('/').map(encodeURIComponent).join('/');
  const filename = page.replace(/\/index\.html$/, '').replace(/^index\.html$/, 'home').replaceAll('/', '--') + '.json';
  manifest[route] = 'pages/' + filename;
  await writeFile(resolve(output, 'pages', filename), JSON.stringify(catalog));
}
await writeFile(resolve(output, 'pages.json'), JSON.stringify(manifest));
const studioOutput = resolve('.studio-workspace/amy-studio/site/i18n');
await mkdir(studioOutput, { recursive: true });
await writeFile(resolve(studioOutput, 'site.json'), JSON.stringify(studioShared));
await writeFile(resolve(studioOutput, 'pages.json'), '{}');
for (const file of ['runtime.js', 'language.css']) await copyFile(resolve(output, file), resolve(studioOutput, file));
await writeFile(resolve(directory, 'review-pending.json'), JSON.stringify(incomplete, null, 2));
await writeFile(resolve(directory, 'merged-translations.json'), JSON.stringify(cache, null, 2));
console.log(`Built language assets: ${inventory.length} strings; ${incomplete.length} English draft translations pending.`);
