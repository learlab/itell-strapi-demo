"use client";

import {
	useQuizStore,
	useSummaryStore,
} from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import { isLastPage } from "@/lib/pages";
import { SelectQuizOpen } from "@/lib/store/quiz-store";
import { PageData } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@itell/ui/dialog";
import { useSelector } from "@xstate/store/react";
import { PageQuiz } from "./page-quiz";

export const PageQuizModal = ({ page }: { page: PageData }) => {
	const quizStore = useQuizStore();
	const summaryStore = useSummaryStore();
	const quizOpen = useSelector(quizStore, SelectQuizOpen);

	return (
		<Dialog open={quizOpen}>
			{/* <DialogTrigger asChild>
				<Button variant={"outline"} className="flex items-center gap-2">
					<BookCheckIcon className="size-4" />
					Quiz
				</Button>
			</DialogTrigger> */}
			<DialogContent
				className="max-w-4xl h-[80vh] overflow-y-auto"
				canClose={!isProduction}
			>
				<DialogHeader>
					<DialogTitle>Quiz</DialogTitle>
					<DialogDescription>
						Test what you learned in this chapter by answering the following
						questions. You will be able to go the next chapter after you finish
						the quiz.
					</DialogDescription>
				</DialogHeader>
				<PageQuiz
					page={page}
					afterSubmit={() => {
						quizStore.send({ type: "toggleQuiz" });
						summaryStore.send({
							type: "finish",
							isNextPageVisible: !isLastPage(page.slug),
							input: "",
						});
					}}
				/>
			</DialogContent>
		</Dialog>
	);
};
