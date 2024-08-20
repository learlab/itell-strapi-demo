"use client";

import { createEventAction } from "@/actions/event";
import {
	useChunks,
	useQuestionStore,
} from "@/components/provider/page-provider";
import { Condition, EventType } from "@/lib/constants";
import {
	SelectCurrentChunk,
	SelectSummaryReady,
} from "@/lib/store/question-store";
import { Button } from "@itell/ui/client";
import { Card, CardContent } from "@itell/ui/server";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";

type Props = {
	question: string;
	answer: string;
	pageSlug: string;
	chunkSlug: string;
};

export const QuestionBoxSimple = ({
	question,
	answer,
	pageSlug,
	chunkSlug,
}: Props) => {
	const store = useQuestionStore();
	const currentChunk = useSelector(store, SelectCurrentChunk);
	const isSummaryReady = useSelector(store, SelectSummaryReady);
	const disabled = isSummaryReady || currentChunk !== chunkSlug;
	const chunks = useChunks();
	const isLastQuestion = chunkSlug === chunks[chunks.length - 1];
	return (
		<Card
			className={cn(
				"flex justify-center items-center flex-col py-4 px-6 space-y-2",
			)}
		>
			<CardContent className="flex flex-col justify-center items-start space-y-1 w-4/5 mx-auto">
				<p className="text-sm text-muted-foreground">
					Below is a question related to the content you just read. When you
					finished reading its answer, click the finish button below to move on.
				</p>
				<p>
					<span className="font-bold">Question: </span>
					{question}
				</p>
				<p>
					<span className="font-bold">Answer: </span>
					{answer}
				</p>

				<h2 id="question-form-heading" className="sr-only">
					Finish reading
				</h2>
				<form
					aria-labelledby="question-form-heading"
					onSubmit={(e) => {
						e.preventDefault();
						if (isLastQuestion) {
							store.send({ type: "finishPage" });
						} else {
							store.send({ type: "advanceChunk", chunkSlug });
						}
						createEventAction({
							type: EventType.CHUNK_REVEAL_QUESTION,
							pageSlug,
							data: {
								chunkSlug,
								condition: Condition.SIMPLE,
							},
						});
					}}
					className="w-full space-y-2"
				>
					<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
						<Button type="submit" variant={"outline"} disabled={disabled}>
							Continue
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
