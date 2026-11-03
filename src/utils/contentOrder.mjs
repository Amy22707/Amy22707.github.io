export function comparePins(a, b) {
  const pinned = Number(Boolean(b.data.pinned)) - Number(Boolean(a.data.pinned));
  if (pinned) return pinned;
  return a.data.pinned && b.data.pinned ? (a.data.pinOrder ?? 100) - (b.data.pinOrder ?? 100) : 0;
}
export function compareProjects(a, b) {
  const pin = comparePins(a, b);
  if (pin) return pin;
  const date = value => value ? new Date(value).valueOf() : -Infinity;
  const left = date(a.data.publishedAt ?? a.data.date), right = date(b.data.publishedAt ?? b.data.date);
  if (left !== right) return left < right ? 1 : -1;
  return a.id.localeCompare(b.id, 'en');
}
export function projectPublishedAt(project) {
  const value = project.data.publishedAt ?? project.data.date;
  return value ? new Date(value) : undefined;
}
export function formatProjectDate(value) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  const get = type => parts.find(part => part.type === type).value;
  return `${get('year')}.${get('month')}.${get('day')}`;
}
export function comparePosts(a, b) {
  return comparePins(a, b) || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
}
