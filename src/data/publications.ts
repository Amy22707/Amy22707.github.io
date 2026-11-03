interface Resource {
  label: string;
  href: string;
}

export interface ResearchOutput {
  date: string; // YYYY-MM
  title: string;
  authors: string[];
  conference?: string;
  journal?: string;
  awards?: string[];
  type: string;
  description: string;
  image?: string;
  resources: Resource[];
}

// Add papers here with their actual publication or preprint status.
export const publications: ResearchOutput[] = [];

export const ownerAuthorNames = ["Zhiyao Xue", "Xue Zhiyao", "薛之瑶"];

export const presentations: ResearchOutput[] = [
  {
    date: "2026-08",
    title: "Outcome-Weighted Risk-Aware Supervised Learning for Chinese Standard Mahjong",
    authors: ["Zhiyao Xue"],
    conference: "IJCAI 2026 Mahjong AI Competition",
    awards: ["Excellent Award — The 6th International Mahjong AI Competition, IJCAI 2026"],
    type: "Competition presentation",
    description: "Improving offense-defense trade-offs under reproducible paired evaluation.",
    image: "/images/presentations/mahjong-slides.png",
    resources: [
      { label: "Slides · PDF", href: "/presentations/mahjong-ijcai-2026.pdf" },
      { label: "Code", href: "https://github.com/Amy22707/Chinese-Standard-Mahjong" },
    ],
  },
];

export function formatOutputDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}-01T00:00:00Z`));
}
