import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parse } from 'parse5';

test('Product pages use their own existing icons, not the Studio icon', async () => {
  for (const [page, name] of [['jizhi','jizhi-icon.png'],['focusbloom','focusbloom-icon.ico']]) {
    const file=resolve(`.studio-workspace/amy-studio/site/${page}/index.html`);
    const html=await readFile(file,'utf8');
    let icon;
    function walk(n){if(n.tagName==='link'&&n.attrs.some(a=>a.name==='rel'&&a.value==='icon'))icon=n.attrs.find(a=>a.name==='href')?.value;for(const c of n.childNodes||[])walk(c);}
    walk(parse(html));
    assert(icon?.endsWith(name));
    await access(resolve(dirname(file),icon));
  }
});
