import { type Page } from "#content";
import { shuffle } from "es-toolkit";
import { type User } from "lucia";

import { Condition } from "../constants";

export const getUserCondition = (user: User, pageSlug: string) => {
  return user.conditionAssignments[pageSlug];
};

export const getPageConditions = (pages: Page[]): Record<string, string> => {
  return Object.fromEntries(pages.map((page) => [page.slug, Condition.STAIRS]));
  // const groups = getUniqueGroups(pages);
  // const shuffledGroups = shuffle(groups);
  // const groupConditions = assignConditionsToGroups(shuffledGroups);

  // return pages.reduce<Record<string, string>>((acc, page) => {
  //   const group = page.parent?.slug ?? page.slug;
  //   acc[page.slug] = groupConditions[group];
  //   return acc;
  // }, {});
};

const getUniqueGroups = (pages: Page[]) => {
  return Array.from(
    new Set(pages.map((page) => page.parent?.slug ?? page.slug))
  );
};
const assignConditionsToGroups = (groups: string[]): Record<string, string> => {
  const halfLength = Math.floor(groups.length / 2);
  const conditions: string[] = [
    ...(Array(halfLength).fill(Condition.STAIRS) as string[]),
    ...(Array(groups.length - halfLength).fill(
      Condition.RANDOM_REREAD
    ) as string[]),
  ];

  return groups.reduce<Record<string, string>>((acc, group, index) => {
    acc[group] = conditions[index];
    return acc;
  }, {});
};
