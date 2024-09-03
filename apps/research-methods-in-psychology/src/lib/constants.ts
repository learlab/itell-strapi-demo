import type { AnimationProps } from "framer-motion";

export const FOCUS_TIME_SAVE_INTERVAL = 60000;
export const PAGE_SUMMARY_THRESHOLD = 2;
export const SIDEBAR_STATE_COOKIE = "sidebar:state";
export const SIDEBAR_ROLE_COOKIE = "sidebar:role";
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

export const animationProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	},
} as AnimationProps;
