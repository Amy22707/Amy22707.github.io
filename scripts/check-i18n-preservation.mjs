import { readFile, readdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { normalizeTerms } from './i18n-terms.mjs';
const file = '.studio-workspace/i18n/before-sentence-migration.json';
const files = ['public/i18n/site.json', ...(await readdir('public/i18n/pages')).map(name => 'public/i18n/pages/' + name)];
const shared = JSON.parse(await readFile(files[0], 'utf8'));
if (process.argv.includes('--snapshot')) {
  const snapshot = {};
  for (const path of files) snapshot[path] = JSON.parse(await readFile(path, 'utf8'));
  await writeFile(file, JSON.stringify(snapshot));
  console.log('Saved pre-migration dictionary snapshot.');
} else {
  const before = JSON.parse(await readFile(file, 'utf8')); const errors=[]; let checked=0, changed=0;
  for (const [path, entries] of Object.entries(before)) {
    const after = {...shared,...JSON.parse(await readFile(path,'utf8'))};
    for (const [source, value] of Object.entries(entries)) {
      checked++;
      if (!after[source] || after[source].zh !== value.zh || after[source].en !== normalizeTerms(source,value.en)) errors.push({path,source,before:value.en,after:after[source]?.en});
      else if(after[source].en!==value.en)changed++;
    }
  }
  if(process.argv.includes('--restore-regressions')) {
    for(const path of new Set(errors.map(error=>error.path))) {
      const current=JSON.parse(await readFile(path,'utf8'));
      for(const error of errors.filter(error=>error.path===path)) current[error.source]=before[path][error.source];
      await writeFile(path,JSON.stringify(current));
    }
    console.log(`Restored ${errors.length} generated entries to the review snapshot.`);
    process.exit(0);
  }
  for(const error of errors.slice(0,15))console.error(JSON.stringify(error));
  assert.equal(errors.length,0,`${errors.length} reviewed dictionary regressions`);
  console.log(`Preserved ${checked} existing entries; ${changed} scoped terminology updates.`);
}
