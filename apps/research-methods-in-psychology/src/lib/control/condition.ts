export enum Condition {
	SIMPLE = "simple",
	RANDOM_REREAD = "random_reread",
	STAIRS = "stairs",
}

export const getUserCondition = (): Condition => {
	return Condition.STAIRS;
};
