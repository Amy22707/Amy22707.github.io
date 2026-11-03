// Only normalize English translations of explicit Chinese terms, never original
// English paper titles, identifiers, code, or numerical ranges such as long long.
export const isAddress = value => /^(https?:\/\/|[\w.+-]+@[\w-]+(?:\.[\w-]+)+$)/i.test(value);
export function normalizeTerms(source, english) {
  if (!/[\u3400-\u9fff]/.test(source) || typeof english !== 'string') return english;
  let result = english;
  const replace = (context, pattern, target) => {
    if (context.test(source)) result = result.replace(pattern, match => /^[A-Z]/.test(match) ? target[0].toUpperCase() + target.slice(1) : target);
  };
  if (!/\blong[- ]range\b/i.test(source)) replace(/长程/, /\blong[- ]range\b/gi, 'long-horizon');
  replace(/显存/, /\bVRAM\b/g, 'GPU memory');
  replace(/缓存抖动/, /\bcache jitter\b/gi, 'cache thrashing');
  replace(/状压|状态压缩/, /\bstate[- ]compressed\s+dp\b/gi, 'bitmask DP');
  replace(/攻略截图/, /\b(?:strategy|guide) screenshots\b/gi, 'walkthrough screenshots');
  if (/漂流瓶/.test(source)) result = result
    .replace(/\bmessage in a drifting bottle\b/gi, 'message in a bottle')
    .replace(/\b(?:drift(?:ing)?[ -]+|message-in-a-)bottle(s?)\b/gi, (match, plural) => (/^[A-Z]/.test(match) ? 'Message' : 'message') + ' bottle' + plural);
  if (/旅行青蛙·中国之旅/.test(source)) result = result.replace(/\bTravel(?:ing)? Frog:\s*(?:China(?:'s)? (?:Tour|Journey)|Journey to China)\b/gi, 'Travel Frog: A Journey to China');
  return result;
}
