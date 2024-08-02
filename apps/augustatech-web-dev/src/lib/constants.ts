import { UserPreferences } from "@/drizzle/schema";

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

export const Elements = {
	TEXTBOOK_MAIN: "textbook-main",
	TEXTBOOK_MAIN_WRAPPER: "textbook-main-wrapper",
	DASHBOARD_MAIN: "dashboard-main",
	PAGE_CONTENT: "page-content",
	PAGE_ASSIGNMENTS: "page-assignments",
	SUMMARY_FORM: "summary-form",
	SUMMARY_INPUT: "summary-input",
	STAIRS_HIGHLIGHTED_CHUNK: "stairs-highlighted-chunk",
	STAIRS_CONTAINER: "stairs-container",
	STAIRS_ANSWER_LINK: "stairs-answer-link",
	STAIRS_READY_BUTTON: "stairs-ready-button",
	STAIRS_RETURN_BUTTON: "stairs-return-button",
} as const;

export const Tags = {
	GET_SESSION: "get-session",
} as const;

export const lightColors = [
	"#FFEB99",
	"#99CCFF",
	"#99FF99",
	"#FF99CC",
	"#FFCC99",
	"#CC99FF",
	"#FFD966",
	"#66B2FF",
	"#66FF66",
	"#FF66B2",
	"#FFA366",
	"#A366FF",
	"#FFE066",
	"#66FFFF",
	"#66FFB2",
	"#FF66A3",
] as const;

export const darkColors = [
	"#FFD700",
	"#FF4500",
	"#32CD32",
	"#1E90FF",
	"#FF69B4",
	"#8A2BE2",
	"#FFA500",
	"#00CED1",
	"#ADFF2F",
	"#FF6347",
	"#BA55D3",
	"#40E0D0",
	"#FFDAB9",
	"#98FB98",
	"#FFB6C1",
	"#87CEFA",
] as const;

export const DefaultPreferences = {
	time_zone: "America/Chicago",
	note_color_light: "#FFEB99",
	note_color_dark: "#BA55D3",
	theme: "light",
};
