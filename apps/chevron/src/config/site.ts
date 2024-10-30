export const SiteConfig = {
  title: "Confined Space Entry OE Standard",
  description:
    'This textbook is adopted from Chevron\'s "Confined Space Entry OE Standard". It was adapted for integration with an online learning platform, iTELL.',
  footer:
    "A project by the Language and Educational Analytics Research (Lear)Lab",
  latex: false,
  favicon: "/images/avatars/favicon.png",
  knowledgeCards: [
    {
      text: "Openings large enough to allow a person to enter a permit-required confined space and is readily accessible under normal conditions, shall be visibly identified as a confided space when the attendant is not present. (e.g., signage or other effective means of communication)",
      source: "Confined Space Entry OE Standard",
      href: "/confined-space-entry",
    },
  ],
} as const;

export const TEXTBOOK_SLUG = "chevron";
