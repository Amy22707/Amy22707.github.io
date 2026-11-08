import test from 'node:test';
import assert from 'node:assert/strict';
import { selectBlockTranslation } from '../scripts/i18n-block-catalog.mjs';

const row = { key: 'context-key', text: '缓存里的内容。', slots: [] };
test('Existing page translations survive missing or older local draft caches', () => {
  assert.equal(selectBlockTranslation(row, { existing: { en: 'Cached content.' } }), 'Cached content.');
  assert.equal(selectBlockTranslation(row, { existing: { en: 'Cached content.' }, draft: { en: 'Older draft.' } }), 'Cached content.');
});
test('Current reviewed overrides take precedence over existing pages and drafts', () => {
  assert.equal(selectBlockTranslation(row, { overrides: { [row.key]: { en: 'Reviewed wording.' } }, existing: { en: 'Cached content.' } }), 'Reviewed wording.');
});
test('Untranslated or structurally invalid page entries do not mask new translations', () => {
  for (const en of ['缓存里的内容.', '[[A9]]']) {
    assert.equal(selectBlockTranslation(row, { existing: { en }, draft: { en: 'New translation.' } }), 'New translation.');
  }
  assert.equal(selectBlockTranslation(row, { overrides: { [row.key]: { en: '[[A9]]' } }, existing: { en: 'Old wording.' } }), undefined);
});
