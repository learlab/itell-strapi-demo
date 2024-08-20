"use client";
import { QuestionBoxReread } from "@/app/(textbook)/[slug]/_components/question/question-box-reread";
import { QuestionBoxSimple } from "@/app/(textbook)/[slug]/_components/question/question-box-simple";
import { Condition } from "@/lib/constants";
import { QuestionBoxStairs } from "@textbook/question/question-box-stairs";
import { useSelector } from "@xstate/store/react";
import { useCondition, useQuestionStore } from "../provider/page-provider";

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
};

export const Question = ({ question, answer, chunkSlug, pageSlug }: Props) => {
	const store = useQuestionStore();
	const condition = useCondition();
	const chunkStatus = useSelector(
		store,
		(store) => store.context.chunkStatus[chunkSlug],
	);

	if (!chunkStatus || !chunkStatus.hasQuestion) return null;

	if (condition === Condition.STAIRS) {
		return (
			<QuestionBoxStairs
				question={question}
				answer={answer}
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
			/>
		);
	}

	if (condition === Condition.RANDOM_REREAD) {
		return (
			<QuestionBoxReread
				question={question}
				answer={answer}
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
			/>
		);
	}

	if (condition === Condition.SIMPLE) {
		return (
			<QuestionBoxSimple
				question={question}
				answer={answer}
				chunkSlug={chunkSlug}
				pageSlug={pageSlug}
			/>
		);
	}
};
