import { Metadata } from "next";
export const Meta = {
	dashboard: {
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
		description: "Manage account and website settings",
	},
	class: {
		title: "Manage Your Class",
		description: "View students' progress",
	},
	student: {
		title: "Student Details",
		description: "View student details",
	},
} as const satisfies Record<string, Metadata>;
