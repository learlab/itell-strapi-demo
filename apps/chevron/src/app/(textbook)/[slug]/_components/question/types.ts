export enum AnswerStatusStairs {
	UNANSWERED = 0,
	BOTH_CORRECT = 1,
	SEMI_CORRECT = 2,
	BOTH_INCORRECT = 3,
	PASSED = 4, // fallback when api call fails
}

export enum AnswerStatusReread {
	UNANSWERED = 0,
	ANSWERED = 1,
}

export type QuestionScore = 0 | 1 | 2;

// state for border color
enum BorderColor {
	BLUE = "border-blue-400",
	RED = "border-red-400",
	GREEN = "border-green-400",
	YELLOW = "border-yellow-400",
	NEUTRAL = "border-zinc-500",
}

export const borderColors: Record<AnswerStatusStairs, BorderColor> = {
	[AnswerStatusStairs.UNANSWERED]: BorderColor.BLUE,
	[AnswerStatusStairs.BOTH_CORRECT]: BorderColor.GREEN,
	[AnswerStatusStairs.SEMI_CORRECT]: BorderColor.YELLOW,
	[AnswerStatusStairs.BOTH_INCORRECT]: BorderColor.RED,
	[AnswerStatusStairs.PASSED]: BorderColor.NEUTRAL,
};
