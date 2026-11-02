interface Resource {
  label: string;
  href: string;
}

interface ResearchOutput {
  year: string;
  title: string;
  authors: string;
  venue: string;
  type: string;
  description: string;
  image?: string;
  resources: Resource[];
}

// Add papers here with their actual publication or preprint status.
export const publications: ResearchOutput[] = [];

export const presentations: ResearchOutput[] = [
  {
    year: "2026",
    title: "Outcome-Weighted Risk-Aware Supervised Learning for Chinese Standard Mahjong",
    authors: "Zhiyao Xue",
    venue: "IJCAI 2026 Mahjong AI Competition",
    type: "Competition presentation",
    description: "Improving offense-defense trade-offs under reproducible paired evaluation.",
    image: "/images/presentations/mahjong-slides.png",
    resources: [
      { label: "Slides · PDF", href: "/presentations/mahjong-ijcai-2026.pdf" },
      { label: "Code", href: "https://github.com/Amy22707/Chinese-Standard-Mahjong" },
    ],
  },
];
