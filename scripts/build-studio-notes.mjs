import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { parse } from 'parse5';
import { blockTags, inlineRuns, describeRun } from '../public/i18n/inline-blocks.mjs';

const site = resolve('.studio-workspace/amy-studio/site');
const body = await readFile('src/studio-notes/travel-frog.md', 'utf8');
const renderer = await createMarkdownProcessor({
  remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex],
  shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
});
const rendered = await renderer.render(body);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const guide = await readFile(resolve(site, 'jizhi/index.html'), 'utf8');
const prefix = guide.slice(0, guide.indexOf('  <main'))
  .replaceAll('../', '../../').replace('./guide.css', '../../jizhi/guide.css').replace('./guide.js', '../../jizhi/guide.js')
  .replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="../../favicon.svg" type="image/svg+xml">')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')
  .replace('title="跟随系统主题"', 'title="Follow your device theme"')
  .replace('>跟随系统</button>', '>Auto</button>')
  .replace(/<title>.*?<\/title>/, '<title>旅行青蛙开发日志 — Studio Notes</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="把青蛙和它的明信片留下来：旅行青蛙本地版的开发记录。">')
  .replace(/<nav aria-label="页面导航">[\s\S]*?<\/nav>/, '<nav aria-label="Main navigation"><a href="../../#updates">Studio Notes</a><a href="../../#work">Work</a></nav>')
  .replace('</head>', '<link rel="stylesheet" href="../article.css"></head>');
const toc = rendered.metadata.headings.filter(h => h.depth <= 2).map(h => `<a class="depth-${h.depth}" href="#${escape(h.slug)}">${escape(h.text)}</a>`).join('');
const html = `${prefix}
<main id="main" class="shell note-page">
<header class="note-header"><p class="eyebrow">STUDIO NOTES · TRAVEL FROG</p><h1>《旅行青蛙·中国之旅》开发日志</h1><p>把青蛙和它的明信片留下来。</p><p><time datetime="2026-09-10">2026.09.10</time> · 更新于 <time datetime="2026-11-06">2026.11.06</time></p><img class="note-cover" src="../../images/travel-frog-diary.png" alt="旅行青蛙的旅行日记界面"></header>
<div class="note-layout"><aside class="note-toc"><details open><summary>文章目录</summary><nav aria-label="文章目录">${toc}</nav></details></aside><article class="note-prose">${rendered.code}</article></div>
</main><footer class="shell site-footer"><a class="brand" href="../../#updates">Studio Notes</a><p>Small things, thoughtfully made.</p><span>© <span id="year">2026</span> Amy Studio</span></footer></body></html>`;
await mkdir(resolve(site, 'notes/travel-frog'), { recursive: true });
await writeFile(resolve(site, 'notes/travel-frog/index.html'), html);

// Reuse only translations present in this copy, never the omitted essay.
const adapter = {
  tag: n => n.tagName || '', children: n => n.childNodes || [], isText: n => n.nodeName === '#text',
  text(n) { return n.nodeName === '#text' ? n.value : (n.childNodes || []).map(c => this.text(c)).join(''); },
  attr: (n, key) => n.attrs?.find(a => a.name === key)?.value ?? null,
};
const strings = new Set(), templates = new Set();
const norm = text => text.replace(/\s+/g, ' ').trim();
function walk(node, blocked = false) {
  blocked ||= ['pre','code','script','style','math','svg'].includes(node.tagName) || /\bkatex\b/.test(adapter.attr(node,'class') || '');
  if (!blocked) {
    if (node.nodeName === '#text') strings.add(norm(node.value));
    for (const attr of node.attrs || []) if (['alt','title','aria-label','content'].includes(attr.name)) strings.add(norm(attr.value));
    if (blockTags.has(node.tagName)) for (const run of inlineRuns(node, adapter)) {
      const description = describeRun(run, adapter); if (description) templates.add(description.key);
    }
  }
  for (const child of node.childNodes || []) walk(child, blocked);
}
walk(parse(html));
const pick = (catalog, keys) => Object.fromEntries(Object.entries(catalog).filter(([key]) => keys.has(key)));
const page = JSON.parse(await readFile('public/i18n/pages/blog--travel-frog.json', 'utf8'));
const shared = JSON.parse(await readFile('public/i18n/site.json', 'utf8'));
const studioShared = JSON.parse(await readFile(resolve(site, 'i18n/site.json'), 'utf8'));
await mkdir(resolve(site, 'i18n/pages'), { recursive: true });
await writeFile(resolve(site, 'i18n/pages/notes--travel-frog.json'), JSON.stringify(pick({ ...shared, ...page, ...studioShared }, strings)));
const pagesPath = resolve(site, 'i18n/pages.json');
const pages = JSON.parse(await readFile(pagesPath, 'utf8'));
pages['/amy-studio/notes/travel-frog/'] = 'pages/notes--travel-frog.json';
await writeFile(pagesPath, JSON.stringify(pages));
const blocksPath = resolve(site, 'i18n/blocks/pages.json');
const blocks = JSON.parse(await readFile(blocksPath, 'utf8'));
const originalBlocks = { ...JSON.parse(await readFile('public/i18n/blocks/blog--travel-frog.json', 'utf8')), ...JSON.parse(await readFile(resolve(site, 'i18n/blocks/notes--travel-frog.json'), 'utf8')) };
await writeFile(resolve(site, 'i18n/blocks/notes--travel-frog.json'), JSON.stringify(pick(originalBlocks, templates)));
blocks['/notes/travel-frog/'] = 'blocks/notes--travel-frog.json';
await writeFile(blocksPath, JSON.stringify(blocks));
console.log('Built the player-facing Studio development log. Technical blog original unchanged.');
