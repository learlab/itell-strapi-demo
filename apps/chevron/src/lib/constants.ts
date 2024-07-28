export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const PAGE_SUMMARY_THRESHOLD = 2;
export const DEFAULT_TIME_ZONE = "America/Chicago";
export const isProduction = process.env.NODE_ENV === "production";

export const EventType = {
	KEYSTROKE: "keystroke",
	CLICK: "click",
	FOCUS_TIME: "focus-time",
	SCROLL: "scroll",
	CHUNK_REVEAL: "chunk-reveal",
	CHUNK_REVEAL_QUESTION: "post-question-chunk-reveal",
	EXPLAIN: "explain-constructed-response",
	STAIRS: "stairs",
	RANDOM_REREAD: "random_reread",
	SIMPLE: "simple",
} as const;

export const Condition = {
	SIMPLE: "simple",
	RANDOM_REREAD: "random_reread",
	STAIRS: "stairs",
};

export const Elements = {
	TEXTBOOK_MAIN: "textbook-main",
	TEXTBOOK_MAIN_WRAPPER: "textbook-main-wrapper",
	PAGE_CONTENT: "page-content",
	PAGE_ASSIGNMENTS: "page-assignments",
} as const;
