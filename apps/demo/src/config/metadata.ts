import { type Metadata } from "next";

type PageMeta = Metadata & { slug: string };

export const Meta = {
  home: {
    title: "Learning Statistics",
    description: "Understand your learning journey",
    slug: "dashboard",
  },
  homeTeacher: {
    title: "Class Statistics",
    description: "View students' progress",
    slug: "class",
  },
  summaries: {
    title: "Summary Submissions",
    description: "Comprehend the text with summarization",
    slug: "summaries",
  },
  summariesTeacher: {
    title: "Summary Submissions",
    description: "Class summary statistics",
    slug: "summaries-teacher",
  },
  questions: {
    title: "Question Answering",
    description: "Answer assessment questions throughout the read",
    slug: "constructed-response",
  },
  questionsTeacher: {
    title: "Question Answering",
    description: "Class question statistics",
    slug: "constructed-response-teacher",
  },
  settings: {
    title: "Settings",
    description: "Manage account settings",
    slug: "settings",
  },
  student: {
    title: "Student Details",
    description: "View student details",
    slug: "student",
  },
  forms: {
    title: "Forms",
    description: "Help us improve iTELL",
    slug: "forms",
  },
} satisfies Record<string, PageMeta>;
