export enum ScoreType {
	content = "content",
	wording = "wording",
	similarity = "topic similarity",
	containment = "topic borrowing",
}

export const ScoreThreshold: Record<ScoreType, number> = {
	[ScoreType.content]: 0,
	[ScoreType.wording]: -1,
	[ScoreType.similarity]: 0.5,
	[ScoreType.containment]: 0.6,
};

export const FOCUS_TIME_COUNT_INTERVAL = 1000;
export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const TELEMETRY_SAVE_INTERVAL = 30000;
export const TEXTBOOK_NAME = "think-python-2e";
export const PAGE_SUMMARY_THRESHOLD = 2;
export const DEFAULT_TIME_ZONE = "America/Chicago";
