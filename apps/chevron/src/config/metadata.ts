import { Metadata } from "next";
export const Meta = {
	home: {
		title: "Learning Statistics",
		description: "Understand your learning journey",
	},
	questions: {
		title: "Question Answering",
		description:
			"You will receive content-related questions as assessment items throughout the read",
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
