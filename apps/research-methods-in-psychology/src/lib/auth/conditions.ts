import { shuffle } from "es-toolkit";
import { User } from "lucia";
import { Page } from "#content";
import { Condition } from "../constants";

export const getUserCondition = (user: User, pageSlug: string) => {
	return user.conditionAssignments[pageSlug];
};

export const getPageConditions = (pages: Page[]): Record<string, string> => {
	const groups = getUniqueGroups(pages);
	const shuffledGroups = shuffle(groups);
	const groupConditions = assignConditionsToGroups(shuffledGroups);

	return pages.reduce(
		(acc, page) => {
			const group = page.parent?.slug || page.slug;
			acc[page.slug] = groupConditions[group];
			return acc;
		},
		{} as Record<string, string>,
	);
};

const getUniqueGroups = (pages: Page[]) => {
	return Array.from(
		new Set(pages.map((page) => page.parent?.slug || page.slug)),
	);
};
const assignConditionsToGroups = (groups: string[]): Record<string, string> => {
	const halfLength = Math.floor(groups.length / 2);
	const conditions: string[] = [
		...Array(halfLength).fill(Condition.STAIRS),
		...Array(groups.length - halfLength).fill(Condition.RANDOM_REREAD),
	];

	return groups.reduce(
		(acc, group, index) => {
			acc[group] = conditions[index];
			return acc;
		},
		{} as Record<string, string>,
	);
};
