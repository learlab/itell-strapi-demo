export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const PAGE_SUMMARY_THRESHOLD = 2;

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
export const Tags = {
	GET_SESSION: "get-session",
} as const;
