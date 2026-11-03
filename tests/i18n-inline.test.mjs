import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { describeRun, inlineRuns, parseTemplate } from '../public/i18n/inline-blocks.mjs';
import { normalizeTerms, isAddress } from '../scripts/i18n-terms.mjs';
const adapter = {
  tag: node => node.tagName || '', children: node => node.childNodes || [], isText: node => node.nodeName === '#text',
  text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(child => this.text(child)).join(''); },
  attr: (node, name) => node.attrs?.find(attr => attr.name === name)?.value ?? null,
};
const describe = html => describeRun(parseFragment(html).childNodes, adapter);
test('evaluation metrics containing @ are not treated as email addresses', () => {
  assert.equal(isAddress('Acc./pass@1；泄漏分析'), false);
  assert.equal(isAddress('zhiyaoxue25@stu.pku.edu.cn'), true);
});
test('code and math are atomic; an English translation can reorder them', () => {
  const block = describe('把 <code>x</code> 代入 <span class="katex"><math>x+1</math></span>。');
  assert.equal(block.source, '把 [[A0]] 代入 [[A1]]。');
  assert.doesNotThrow(() => parseTemplate('Substitute [[A0]] into [[A1]].', block.slots));
  assert.doesNotThrow(() => parseTemplate('In [[A1]], substitute [[A0]].', block.slots));
});
test('different protected values do not share a contextual translation key', () => {
  assert.notEqual(describe('取 <code>x</code> 的值').key, describe('取 <code>y</code> 的值').key);
});
test('formatting and link labels remain translatable with nesting intact', () => {
  const block = describe('<a href="/paper"><strong>论文</strong></a>说明了 <code>x</code>。');
  assert.doesNotThrow(() => parseTemplate('The [[O0]][[O1]]paper[[C1]][[C0]] explains [[A2]].', block.slots));
  assert.throws(() => parseTemplate('[[O1]][[O0]]paper[[C0]][[C1]] [[A2]]', block.slots));
});
test('missing, duplicated, invented, and malformed placeholders are rejected', () => {
  const block = describe('计算 <code>x</code>。');
  for (const text of ['Compute x.', '[[A0]][[A0]]', '[[A8]]', '[[A0]] [[wat]]', '']) assert.throws(() => parseTemplate(text, block.slots));
});
test('a translated link cannot silently lose its label', () => {
  const block = describe('参考<a href="/paper">论文</a>。');
  assert.throws(() => parseTemplate('See the paper [[O0]] [[C0]].', block.slots));
});
test('translated angle brackets are plain text, not executable markup', () => {
  const block = describe('计算 <code>x</code>。');
  assert.equal(parseTemplate('<img src=x onerror=alert(1)> [[A0]]', block.slots)[0].text, '<img src=x onerror=alert(1)> ');
});
test('nested lists and fenced code split runs rather than being reparented', () => {
  const parent = parseFragment('<li>前缀 <code>x</code><ul><li>子项</li></ul>后缀</li>').childNodes[0];
  assert.equal(inlineRuns(parent, adapter).length, 2);
});
test('scoped technical terminology is normalized without changing source facts', () => {
  assert.equal(normalizeTerms('长程 Agent 与显存、缓存抖动', 'Long-range agents, VRAM, and cache jitter'), 'Long-horizon agents, GPU memory, and cache thrashing');
  assert.equal(normalizeTerms('显存、状压dp、扭蛋机', 'Video memory, State Compression DP, and Gacha Machine'), 'GPU memory, Bitmask DP, and Gashapon machine');
  assert.equal(normalizeTerms('正式服与实机测试', 'The formal server and live testing'), 'The official server and real-device testing');
  assert.equal(normalizeTerms('没怎么打，把简单题写了', 'Didn’t participate much; just solved the easy problems.'), "Didn't participate much; just solved the easy problems.");
  assert.equal(normalizeTerms('测试：数值，结果。', 'Test：value，result。'), 'Test: value, result.');
  assert.equal(normalizeTerms('题解 P1434', 'Solution P1434 【[SHOI2002] Skiing】'), 'Solution P1434 [SHOI2002] Skiing');
  assert.equal(normalizeTerms('英文引号', 'She said “hello”; it’s fine.'), 'She said "hello"; it\'s fine.');
  assert.equal(normalizeTerms('状压dp', 'State-compressed dp.'), 'Bitmask DP.');
  assert.equal(normalizeTerms('攻略截图', 'strategy screenshots and guide screenshots'), 'walkthrough screenshots and walkthrough screenshots');
  assert.equal(normalizeTerms('漂流瓶功能', 'a drifting bottle feature and drift bottles'), 'a message bottle feature and message bottles');
  assert.equal(normalizeTerms('漂流瓶回忆', 'a message in a drifting bottle'), 'a message in a bottle');
  assert.equal(normalizeTerms('long long范围', 'the long long range is 2^64'), 'the long long range is 2^64');
  assert.equal(normalizeTerms('Long-Range Agent Memory', 'Long-Range Agent Memory'), 'Long-Range Agent Memory');
});
