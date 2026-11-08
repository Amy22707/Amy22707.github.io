import test from 'node:test';
import assert from 'node:assert/strict';
import { isSourceFallback, hasUntranslatedEnglish } from '../scripts/i18n-terms.mjs';
test('Punctuation-only Chinese fallbacks are not English translations', () => {
  assert(isSourceFallback('保留存档，继续旅行。', '保留存档, 继续旅行.'));
  assert(isSourceFallback('用 [[A0]] 描述 Cache。', '用 [[A0]] 描述 Cache.'));
  assert(!isSourceFallback('保留存档，继续旅行。', 'Keep your save and continue the journey.'));
  assert(!isSourceFallback('Cache', 'Cache'));
});
test('Pending counts use effective translations for every page, including page overrides', () => {
  assert(!hasUntranslatedEnglish('七天', ['Seven days']));
  assert(hasUntranslatedEnglish('七天', ['Seven days', '七天']));
  assert(hasUntranslatedEnglish('七天', [undefined]));
  assert(!hasUntranslatedEnglish('GitHub', ['GitHub']));
});
