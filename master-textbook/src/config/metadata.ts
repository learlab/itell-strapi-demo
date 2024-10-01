import { Metadata } from "next";

type PageMeta = Metadata & { slug: string };

export const Meta = {
	home: {
		title: "Learning Statistics",
		description: "Understand your learning journey",
		slug: "dashboard",
	},
	summaries: {
		title: "Summary Submissions",
		description: "Comprehend the text by summarizing it",
		slug: "summaries",
	},
	questions: {
		title: "Question Answering",
		description: "Answer assessment questions throughout the read",
		slug: "constructed-response",
	},
	settings: {
		title: "Settings",
		description: "Manage account settings",
		slug: "settings",
	},
	class: {
		title: "Class Statistics",
		description: "View students' progress",
		slug: "class",
	},
	student: {
		title: "Student Details",
		description: "View student details",
		slug: "student",
	},
} satisfies Record<string, PageMeta>;
