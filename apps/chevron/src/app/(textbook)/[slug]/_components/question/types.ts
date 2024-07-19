export const StatusStairs = {
	UNANSWERED: 0,
	BOTH_CORRECT: 1,
	SEMI_CORRECT: 2,
	BOTH_INCORRECT: 3,
	PASSED: 4, // fallback when api call fails
} as const;

export type StatusStairs = (typeof StatusStairs)[keyof typeof StatusStairs];

export const StatusReread = {
	UNANSWERED: 0,
	ANSWERED: 1,
} as const;
export type StatusReread = (typeof StatusReread)[keyof typeof StatusReread];

export type QuestionScore = 0 | 1 | 2;

export const borderColors: Record<string, string> = {
	[StatusStairs.UNANSWERED]: "border-blue-400",
	[StatusStairs.BOTH_CORRECT]: "border-green-400",
	[StatusStairs.SEMI_CORRECT]: "border-yellow-400",
	[StatusStairs.BOTH_INCORRECT]: "border-red-400",
	[StatusStairs.PASSED]: "border-zinc-500",
} as const;
