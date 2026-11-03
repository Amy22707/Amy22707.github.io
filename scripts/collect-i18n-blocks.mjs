import { parse } from 'parse5';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { blockTags, protectedNode, inlineRuns, describeRun } from '../public/i18n/inline-blocks.mjs';

export const parse5Adapter = {
  tag: node => node.tagName || '', children: node => node.childNodes || [],
  isText: node => node.nodeName === '#text',
  text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(child => this.text(child)).join(''); },
  attr: (node, key) => node.attrs?.find(attr => attr.name === key)?.value ?? null,
};
const inventory = new Map();
async function inspect(directory, root, prefix = '') {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, file.name);
    if (file.isDirectory()) { await inspect(path, root, prefix); continue; }
    if (!file.name.endsWith('.html')) continue;
    const page = prefix + relative(root, path).replaceAll('\\', '/');
    function walk(node, blocked = false) {
      blocked ||= protectedNode(node, parse5Adapter);
      if (blocked) return;
      if (blockTags.has(node.tagName)) for (const run of inlineRuns(node, parse5Adapter)) {
        const block = describeRun(run, parse5Adapter);
        if (block.units < 2 || !/[\u3400-\u9fff]/.test(block.source)) continue;
        if (!inventory.has(block.key)) inventory.set(block.key, { key: block.key, text: block.source, slots: block.slots.map(({ id, tag, atom, parent, label }) => ({ id, tag, atom, parent, label })), pages: [] });
        const record = inventory.get(block.key);
        if (!record.pages.includes(page)) record.pages.push(page);
      }
      for (const child of node.childNodes || []) walk(child, blocked);
    }
    walk(parse(await readFile(path, 'utf8')));
  }
}
await inspect(resolve('dist'), resolve('dist'));
await inspect(resolve('.studio-workspace/amy-studio/site'), resolve('.studio-workspace/amy-studio/site'), 'studio:');
await mkdir('.studio-workspace/i18n', { recursive: true });
await writeFile('.studio-workspace/i18n/blocks-inventory.json', JSON.stringify([...inventory.values()], null, 2));
const entries = [...inventory.values()];
console.log(`Collected ${entries.length} sentence/run templates; ${entries.reduce((n, row) => n + row.text.length, 0)} characters; longest ${Math.max(...entries.map(row => row.text.length))}.`);
