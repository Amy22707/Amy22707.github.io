// Only normalize English translations of explicit Chinese terms, never original
// English paper titles, identifiers, code, or numerical ranges such as long long.
export const isAddress = value => /^(https?:\/\/|[\w.+-]+@[\w-]+(?:\.[\w-]+)+$)/i.test(value);
export const isSourceFallback = (source, translated) => /[\u3400-\u9fff]/.test(source) && typeof translated === 'string' && source.replace(/[\p{P}\p{Z}\s]/gu, '') === translated.replace(/[\p{P}\p{Z}\s]/gu, '');
export const hasUntranslatedEnglish = (source, values) => /[\u3400-\u9fff]/.test(source) && values.some(value => typeof value !== 'string' || !value.trim() || isSourceFallback(source, value));
const normalizePunctuation = value => value
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/\u00a0|\u3000/g, ' ')
  .replace(/【([^【】]*)】/g, (_, inner) => {
    const text = inner.trim();
    return (text.startsWith('[') ? text.replace(/^\[+/, '[') : `[${text}]`) + ' ';
  })
  .replace(/【/g, '[')
  .replace(/】/g, ']')
  .replace(/，/g, ', ')
  .replace(/、/g, ', ')
  .replace(/。/g, '. ')
  .replace(/！/g, '! ')
  .replace(/？/g, '? ')
  .replace(/；/g, '; ')
  .replace(/：/g, ': ')
  .replace(/（/g, ' (')
  .replace(/）/g, ') ')
  .replace(/\s+([,.;:!?])/g, '$1')
  .replace(/\(\s+/g, '(')
  .replace(/\s{2,}/g, ' ')
  .trim();
export function normalizeBoldPadding(text) {
  if (typeof text !== 'string') return text;
  let result = text.replace(/\[\[O(\d+)\]\]([ \t]+)/g, (match, id, spaces, offset, whole) => {
    const before = whole[offset - 1] ?? '';
    const needSpace = before && !/[\s([{"'“‘—–/-]/.test(before);
    return (needSpace ? ' ' : '') + `[[O${id}]]`;
  });
  result = result.replace(/([ \t]+)\[\[C(\d+)\]\]/g, (match, spaces, id, offset, whole) => {
    const after = whole[offset + match.length] ?? '';
    const needSpace = after && !/[\s)\]}"'”’,.;:!?—–/-]/.test(after);
    return `[[C${id}]]` + (needSpace ? ' ' : '');
  });
  return result;
}

export function normalizeTerms(source, english) {
  if (typeof english !== 'string') return english;
  english = normalizePunctuation(english);
  if (!/[\u3400-\u9fff]/.test(source)) return english;
  let result = english;
  const replace = (context, pattern, target) => {
    if (context.test(source)) result = result.replace(pattern, match => /^[A-Z]/.test(match) ? target[0].toUpperCase() + target.slice(1) : target);
  };
  if (!/\blong[- ]range\b/i.test(source)) replace(/长程/, /\blong[- ]range\b/gi, 'long-horizon');
  replace(/显存/, /\bVRAM\b/g, 'GPU memory');
  replace(/显存/, /\bvideo[- ]memory\b/gi, 'GPU memory');
  replace(/缓存抖动/, /\bcache jitter\b/gi, 'cache thrashing');
  replace(/状压|状态压缩/, /\bstate[- ]compressed\s+dp\b/gi, 'bitmask DP');
  replace(/状压|状态压缩/, /\bstate[- ]compress(?:ed|ion)\s+dp\b/gi, 'bitmask DP');
  replace(/攻略截图/, /\b(?:strategy|guide) screenshots\b/gi, 'walkthrough screenshots');
  replace(/扭蛋机/, /\bgacha(?:pon)?[ -]machine\b/gi, 'gashapon machine');
  replace(/扭蛋机/, /\bgachapon\b/gi, 'gashapon');
  replace(/正式服/, /\bformal servers\b/gi, 'official servers');
  replace(/正式服/, /\bformal server\b/gi, 'official server');
  replace(/正式服/, /\blive servers\b/gi, 'official servers');
  replace(/正式服/, /\blive server\b/gi, 'official server');
  replace(/实机/, /\bactual[- ]device testing\b/gi, 'real-device testing');
  replace(/实机/, /\blive testing\b/gi, 'real-device testing');
  replace(/实机/, /\bactual[- ]device\b/gi, 'real device');
  if (/漂流瓶/.test(source)) result = result
    .replace(/\bmessage in a drifting bottle\b/gi, 'message in a bottle')
    .replace(/\b(?:drift(?:ing)?[ -]+|message-in-a-)bottle(s?)\b/gi, (match, plural) => (/^[A-Z]/.test(match) ? 'Message' : 'message') + ' bottle' + plural);
  if (/旅行青蛙·中国之旅/.test(source)) result = result.replace(/\bTravel(?:ing)? Frog:\s*(?:China(?:'s)? (?:Tour|Journey)|Journey to China)\b/gi, 'Travel Frog: A Journey to China');
  return result;
}
