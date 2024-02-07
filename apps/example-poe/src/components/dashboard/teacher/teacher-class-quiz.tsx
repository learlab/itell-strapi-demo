import { QuizRecord } from "@/components/quiz/quiz-record";
import { StudentStats } from "@/lib/dashboard";
import { allPagesSorted } from "@/lib/pages";
import { AnswerData, QuizData, getQuizCorrectCount } from "@/lib/quiz";
import { groupby } from "@itell/core/utils";
import { Skeleton } from "@itell/ui/server";
import data from "public/quiz-info.json";
import { z } from "zod";
import { QuizTableData, columns } from "./quiz-columns";
import { QuizTabs } from "./quiz-tabs";
import { StudentsTable } from "./students-table";

const QuizInfo = data as Record<string, QuizData>;

type Props = {
	students: StudentStats;
};

const AnswerDataSchema = z.object({
	choices: z.record(z.string(), z.array(z.number())),
	correctCount: z.number(),
});

export const TeacherClassQuiz = async ({ students }: Props) => {
	const quizPages = allPagesSorted
		.filter((page) => page.quiz)
		.map((page) => ({
			pageSlug: page.page_slug,
			title: `${page.location.chapter}.${page.location.section} ${page.title}`,
		}));

	const quizTableData: QuizTableData[] = students.flatMap((student) => {
		return student.QuizAnswer.map((entry) => {
			const parsed = AnswerDataSchema.safeParse(entry.data);
			const correctCount = parsed.success
				? parsed.data.correctCount
				: getQuizCorrectCount(
						QuizInfo[entry.pageSlug],
						entry.data as AnswerData,
				  );
			const totalCount = parsed.success
				? Object.keys(parsed.data.choices).length
				: Object.keys(entry.data as AnswerData).length;
			const accuracy = (correctCount / totalCount) * 100;

			return {
				id: student.id,
				name: student.name,
				quizTitle: quizPages.find((page) => page.pageSlug === entry.pageSlug)
					?.title as string,
				quizPageSlug: entry.pageSlug,
				quizAnswers: parsed.success
					? parsed.data.choices
					: (entry.data as AnswerData),
				created_at: entry.created_at,
				accuracy,
			};
		});
	});

	const accGrouped = groupby(
		quizTableData,
		(entry) => entry.quizPageSlug,
		(entry) => entry.accuracy,
	);

	for (const pageSlug in QuizInfo) {
		if (!accGrouped[pageSlug]) {
			accGrouped[pageSlug] = [];
		}
	}

	const tabsData = Object.keys(accGrouped).map((key) => ({
		pageSlug: key,
		accuracies: accGrouped[key],
	}));

	return (
		<>
			<h3 className="mb-4 text-lg font-medium">Quiz</h3>
			<QuizTabs data={tabsData} />

			<StudentsTable columns={columns} data={quizTableData} />
		</>
	);
};

TeacherClassQuiz.Skeleton = () => (
	<>
		<h3 className="mb-4 text-lg font-medium">Quiz</h3>
		<div className="flex items-center py-4 justify-between">
			<Skeleton className="rounded-md h-12 w-64" />
			<Skeleton className="rounded-md h-12 w-40 " />
		</div>

		<Skeleton className="rounded-md h-[300px]" />
		<div className="flex items-center justify-end space-x-2 py-4">
			<Skeleton className="rounded-md h-12 w-28" />
			<Skeleton className="rounded-md h-12 w-16" />
		</div>
	</>
);
