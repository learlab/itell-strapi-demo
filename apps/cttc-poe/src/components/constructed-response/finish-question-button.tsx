"use client";

import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { Button } from "@itell/ui/client";
import { useConstructedResponse } from "../provider/page-provider";

export const FinishQuestionButton = ({
	userId,
	chunkSlug,
	pageSlug,
	isLastQuestion,
	condition,
}: {
	userId: string;
	chunkSlug: string;
	pageSlug: string;
	isLastQuestion: boolean;
	condition: Condition;
}) => {
	const { currentChunk, advanceChunk, isSummaryReady } = useConstructedResponse(
		(state) => ({
			advanceChunk: state.advanceChunk,
			currentChunk: state.currentChunk,
			isSummaryReady: state.isSummaryReady,
		}),
	);
	const text = isLastQuestion ? "Unlock summary" : "Continue reading";
	const disabled = isSummaryReady || currentChunk !== chunkSlug;

	return (
		<Button
			disabled={disabled}
			onClick={() => {
				advanceChunk(chunkSlug);
				createEvent({
					userId,
					pageSlug,
					type: "post-question-chunk-reveal",
					data: {
						chunkSlug,
						condition,
					},
				});
			}}
		>
			{text}
		</Button>
	);
};
