"use client";

import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { LoginButton } from "@auth//auth-form";
import { cn } from "@itell/utils";

import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { Card, CardContent } from "@itell/ui/card";
import { useConstructedResponse } from "../provider/page-provider";

type Props = {
	userId: string | null;
	question: string;
	answer: string;
	pageSlug: string;
	chunkSlug: string;
};

export const QuestionBoxSimple = ({
	userId,
	question,
	answer,
	pageSlug,
	chunkSlug,
}: Props) => {
	const { advanceChunk, currentChunk, isSummaryReady } = useConstructedResponse(
		(state) => ({
			advanceChunk: state.advanceChunk,
			currentChunk: state.currentChunk,
			isSummaryReady: state.isSummaryReady,
		}),
	);
	const disabled = currentChunk !== chunkSlug || isSummaryReady;

	if (!userId) {
		return (
			<Warning>
				<p>You need to be logged in to view this question and move forward</p>
				<LoginButton />
			</Warning>
		);
	}

	return (
		<>
			<Card
				className={cn(
					"flex justify-center items-center flex-col py-4 px-6 space-y-2",
				)}
			>
				<CardContent className="flex flex-col justify-center items-start space-y-1 w-4/5 mx-auto">
					<p className="text-sm text-muted-foreground">
						Below is a question related to the content you just read. When you
						finished reading its answer, click the finish button below to move
						on.
					</p>
					<p>
						<span className="font-bold">Question: </span>
						{question}
					</p>
					<p>
						<span className="font-bold">Answer: </span>
						{answer}
					</p>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							advanceChunk(chunkSlug);
							createEvent({
								userId,
								type: "post-question-chunk-reveal",
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
		</>
	);
};
