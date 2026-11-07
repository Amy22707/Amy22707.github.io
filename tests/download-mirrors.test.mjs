import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'parse5';

const studio = '.studio-workspace/amy-studio/site';
const cases = [
  [`${studio}/jizhi/index.html`, '1Bv3PWHZSU9fIsm_wXYTidA', 'spty'],
  [`${studio}/focusbloom/index.html`, '1UOU3WqT5PbKhp4UvbXO69A', 'ucc7'],
  ['public/studio/travel-frog/index.html', '1bnk9wREXjQfCz1Zxtxq4XA', 'ubi2'],
  ['public/studio/travel-frog/en.html', '1bnk9wREXjQfCz1Zxtxq4XA', 'ubi2'],
];
test('All download mirrors share styling and retain their links and codes', async () => {
  assert.equal(await readFile('public/studio/download-mirror.css','utf8'), await readFile(`${studio}/download-mirror.css`,'utf8'));
  for(const [file, share, code] of cases) {
    const html = await readFile(file,'utf8');
    assert(html.includes('href="../download-mirror.css"'),file);
    let block;
    function walk(node) {
      if(node.attrs?.some(a=>a.name==='class' && a.value.split(/\s+/).includes('download-mirror')))block=node;
      for(const child of node.childNodes||[])walk(child);
    }
    walk(parse(html));
    assert(block,file);
    const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
    assert(text(block).includes(code),file);
    const children=block.childNodes.filter(n=>n.tagName);
    assert.equal(children[0].tagName,'h3',file);
    const links=[];
    function check(node){if(node.tagName==='a')links.push(node);for(const c of node.childNodes||[])check(c);}
    check(block);
    assert.equal(links.length,1,file);
    assert(links[0].attrs.some(a=>a.name==='href'&&a.value===`https://pan.baidu.com/s/${share}`),file);
    assert(!links[0].attrs.some(a=>a.name==='class'&&a.value.includes('button')),file);
  }
});
