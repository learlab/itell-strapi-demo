export enum Condition {
	SIMPLE = "simple",
	RANDOM_REREAD = "random_reread",
	STAIRS = "stairs",
}

export const getUserCondition = (prolificId: string): Condition => {
	return Condition.STAIRS;
};
