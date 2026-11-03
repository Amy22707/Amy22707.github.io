export function comparePins(a, b) {
  const pinned = Number(Boolean(b.data.pinned)) - Number(Boolean(a.data.pinned));
  if (pinned) return pinned;
  return a.data.pinned && b.data.pinned ? (a.data.pinOrder ?? 100) - (b.data.pinOrder ?? 100) : 0;
}
export function compareProjects(a, b) {
  const pin = comparePins(a, b);
  if (pin) return pin;
  const date = value => value ? new Date(value).valueOf() : -Infinity;
  const left = date(a.data.date), right = date(b.data.date);
  if (left !== right) return left < right ? 1 : -1;
  return a.id.localeCompare(b.id, 'en');
}
export function comparePosts(a, b) {
  return comparePins(a, b) || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
}
