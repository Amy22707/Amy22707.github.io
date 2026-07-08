import { getTagHref as getBlogTagHref, getTagSlug } from "./blogTags";

export const PROJECT_TAGS = {
  featured: "Featured",
  project: "Projects",
  notes: "Notes",
} as const;

export function getProjectTags(data: {
  featured: boolean;
  kind: "project" | "notes";
  technologies: string[];
}) {
  return [
    ...(data.featured ? [PROJECT_TAGS.featured] : []),
    PROJECT_TAGS[data.kind],
    ...data.technologies,
  ];
}

export function getProjectTagHref(tag: string) {
  return getBlogTagHref(tag).replace("/blog/tag/", "/projects/tag/");
}

export { getTagSlug as getProjectTagSlug };
