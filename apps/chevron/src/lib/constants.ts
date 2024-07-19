export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const PAGE_SUMMARY_THRESHOLD = 2;
export const DEFAULT_TIME_ZONE = "America/Chicago";
export const isProduction = process.env.NODE_ENV === "production";

export enum EventType {
	KEYSTROKE = "keystroke",
	CLICK = "click",
	FOCUS_TIME = "focus-time",
	SCROLL = "scroll",
	CHUNK_REVEAL = "chunk-reveal",
	CHUNK_REVEAL_QUESTION = "post-question-chunk-reveal",
	EXPLAIN = "explain-constructed-response",
	STAIRS = "stairs",
	RANDOM_REREAD = "random_reread",
	SIMPLE = "simple",
}

export enum Condition {
	SIMPLE = "simple",
	RANDOM_REREAD = "random_reread",
	STAIRS = "stairs",
}
