export function getTagSlug(tag: string) {
  return tag
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/\s+/g, "-")
    .replace(/[\\/?#%]+/g, "-");
}

export function getTagHref(tag: string) {
  return `/blog/tag/${encodeURIComponent(getTagSlug(tag))}/`;
}
