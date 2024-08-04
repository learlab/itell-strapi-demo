"use client";

import { createEventAction } from "@/actions/event";
import { useQuestionStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import { SelectCurrentChunk } from "@/lib/store/question-store";
import { Button } from "@itell/ui/client";
import { useSelector } from "@xstate/store/react";

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
	const store = useQuestionStore();
	const currentChunk = useSelector(store, SelectCurrentChunk);
	const text = isLastQuestion ? "Unlock summary" : "Continue reading";
	const disabled = currentChunk !== chunkSlug;

	return (
		<Button
			disabled={disabled}
			onClick={() => {
				store.send({ type: "advanceChunk", chunkSlug });
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
