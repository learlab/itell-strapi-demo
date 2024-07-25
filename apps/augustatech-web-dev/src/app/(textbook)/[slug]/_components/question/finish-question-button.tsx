"use client";

import { createEventAction } from "@/actions/event";
import { useQuestion } from "@/components/provider/page-provider";
import { Condition, EventType } from "@/lib/constants";
import { Button } from "@itell/ui/client";

type Props = {
	chunkSlug: string;
	pageSlug: string;
	isLastQuestion: boolean;
	condition: string;
};

export const FinishQuestionButton = ({
	chunkSlug,
	pageSlug,
	isLastQuestion,
	condition,
}: Props) => {
	const { currentChunk, advanceChunk } = useQuestion((state) => ({
		advanceChunk: state.advanceChunk,
		currentChunk: state.currentChunk,
	}));
	const text = isLastQuestion ? "Unlock summary" : "Continue reading";
	const disabled = currentChunk !== chunkSlug;

	return (
		<Button
			disabled={disabled}
			onClick={() => {
				advanceChunk(chunkSlug);
				createEventAction({
					pageSlug,
					type: EventType.CHUNK_REVEAL_QUESTION,
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
