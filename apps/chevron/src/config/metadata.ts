import { Metadata } from "next";
export const Meta = {
	home: {
		title: "Learning Statistics",
		description: "Understand your learning journey",
	},
	summaries: {
		title: "Summary Submissions",
		description: "Comprehend the text by summarizing it",
	},
	questions: {
		title: "Question Answering",
		description: "Answer assessment questions throughout the read",
	},
	settings: {
		title: "Settings",
		description: "Manage account settings",
	},
	class: {
		title: "Class Statistics",
		description: "View students' progress",
	},
	student: {
		title: "Student Details",
		description: "View student details",
	},
} as const satisfies Record<string, Metadata>;
