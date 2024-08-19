"use client";
import { QuestionBoxStairs } from "@textbook/question/question-box-stairs";
import { useSelector } from "@xstate/store/react";
import { useQuestionStore } from "../provider/page-provider";

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
};

export const Question = ({ question, answer, chunkSlug, pageSlug }: Props) => {
	const store = useQuestionStore();
	const chunkStatus = useSelector(
		store,
		(store) => store.context.chunkStatus[chunkSlug],
	);

	if (!chunkStatus || !chunkStatus.hasQuestion) return null;

	return (
		<QuestionBoxStairs
			question={question}
			answer={answer}
			chunkSlug={chunkSlug}
			pageSlug={pageSlug}
		/>
	);
};
