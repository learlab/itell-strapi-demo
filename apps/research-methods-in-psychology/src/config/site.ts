export const SiteConfig = {
  title: "Research Methods in Psychology",
  description:
    "A comprehensive textbook for research methods classes. A peer-reviewed inter-institutional project",
  footer:
    "A project by the Language and Educational Analytics Research (Lear)Lab",
  latex: false,
  favicon: "/images/avatars/favicon.png",
  knowledgeCards: [
    {
      text: "The scientific method is a process of systematically collecting and evaluating evidence to test ideas and answer questions. While scientists may use intuition, authority, rationalism, and empiricism to generate new ideas they don’t stop there.",
      source: "1. Methods of Knowing",
      href: "/1-methods-of-knowing",
    },
    {
      text: "Once again, one of the most common sources of inspiration is previous research. Therefore, it is important to review the literature early in the research process. The research literature in any field is all the published research in that field. ",
      source: "8. Finding a Research Topic",
      href: "/8-finding-a-research-topic",
    },
    {
      text: "Ethics is the branch of philosophy that is concerned with morality—what it means to behave morally and how people can achieve that goal. It can also refer to a set of principles and practices that provide moral guidance in a particular field.",
      source: "15. Moral Foundations of Ethical Research",
      href: "/15-moral-foundations-of-ethical-research",
    },
  ],
} as const;

export const TEXTBOOK_SLUG = "research-methods-in-psychology";
