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

export const FOCUS_TIME_SAVE_INTERVAL = 10000;
export const TEXTBOOK_NAME = "Business-Law-and-the-Legal-Environment";
export const PAGE_SUMMARY_THRESHOLD = 2;
export const DEFAULT_TIME_ZONE = "America/Chicago";
export const isProduction = process.env.NODE_ENV === "production";
export const firstPageUrl = "/introduction-to-law-and-legal-systems";
