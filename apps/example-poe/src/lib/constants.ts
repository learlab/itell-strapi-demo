export enum ScoreType {
	content = "Content",
	wording = "Wording",
	similarity = "Topic Similarity",
	containment = "Topic Borrowing",
}

export const ScoreThreshold: Record<ScoreType, number> = {
	[ScoreType.content]: 0,
	[ScoreType.wording]: -1,
	[ScoreType.similarity]: 0.5,
	[ScoreType.containment]: 0.6,
};

export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const TEXTBOOK_NAME = "think-python-2e";
export const PAGE_SUMMARY_THRESHOLD = 2;
export const DEFAULT_TIME_ZONE = "America/Chicago";
export const isProduction = process.env.NODE_ENV === "production";
