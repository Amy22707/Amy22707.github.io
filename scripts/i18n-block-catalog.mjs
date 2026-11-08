import { parseTemplate } from '../public/i18n/inline-blocks.mjs';
import { isSourceFallback, normalizeTerms } from './i18n-terms.mjs';

export function selectBlockTranslation(row, { overrides = {}, existing, draft } = {}) {
  const reviewed = overrides[row.key]?.en ?? overrides[row.text]?.en;
  const candidates = reviewed === undefined ? [existing?.en, draft?.en] : [reviewed];
  for (const candidate of candidates) {
    const en = normalizeTerms(row.text, candidate);
    if (typeof en !== 'string' || isSourceFallback(row.text, en)) continue;
    try { parseTemplate(en, row.slots); return en; } catch { /* Try the next unreviewed candidate. */ }
  }
  return undefined;
}
