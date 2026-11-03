import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { parse } from 'parse5';
import { blockTags, protectedNode, inlineRuns, describeRun, parseTemplate } from '../public/i18n/inline-blocks.mjs';
const adapter = {
  tag: node => node.tagName || '', children: node => node.childNodes || [], isText: node => node.nodeName === '#text',
  text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(child => this.text(child)).join(''); },
  attr: (node, key) => node.attrs?.find(attr => attr.name === key)?.value ?? null,
};
let count=0; const errors=[];
async function inspect(root, dictionary) {
  const manifest=JSON.parse(await readFile(resolve(dictionary,'pages.json'),'utf8'));
  async function directory(path) {
    for(const entry of await readdir(path,{withFileTypes:true})){
      const file=resolve(path,entry.name);if(entry.isDirectory()){await directory(file);continue;}if(!entry.name.endsWith('.html'))continue;
      const page=relative(root,file).replaceAll('\\','/');
      const route='/'+page.replace(/index\.html$/,'').split('/').map(encodeURIComponent).join('/');
      const catalog=manifest[route]?JSON.parse(await readFile(resolve(dictionary,'../',manifest[route]),'utf8')):{};
      function walk(node){
        if(protectedNode(node,adapter))return;
        if(blockTags.has(node.tagName))for(const run of inlineRuns(node,adapter)){
          const block=describeRun(run,adapter);if(block.units<2||!/[\u3400-\u9fff]/.test(block.source))continue;count++;
          try{parseTemplate(catalog[block.key]?.en,block.slots);}catch(error){errors.push({page,source:block.source,error:error.message});}
        }
        for(const child of node.childNodes||[])walk(child);
      }
      walk(parse(await readFile(file,'utf8')));
    }
  }
  await directory(root);
}
await inspect(resolve('dist'),resolve('public/i18n/blocks'));
await inspect(resolve('.studio-workspace/amy-studio/site'),resolve('.studio-workspace/amy-studio/site/i18n/blocks'));
for(const error of errors.slice(0,10))console.error(JSON.stringify(error));
assert.equal(errors.length,0,`${errors.length} mixed-content sentences are missing valid translations.`);
console.log(`Validated ${count} rendered sentence occurrences: every inline slot is present, balanced, and structurally valid.`);
