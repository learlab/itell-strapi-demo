"use client";

import { useSession } from "@/lib/auth/context";
import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { PageStatus } from "@/lib/page-status";
import { cn } from "@itell/core/utils";
import { Card, CardContent, Warning } from "@itell/ui/server";
import { useState } from "react";
import { LoginButton } from "../auth/auth-form";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";

type Props = {
	question: string;
	answer: string;
	pageSlug: string;
	chunkSlug: string;
	pageStatus: PageStatus;
};

export const QuestionBoxSimple = ({
	question,
	answer,
	pageSlug,
	chunkSlug,
	pageStatus,
}: Props) => {
	const { user } = useSession();
	const [finished, setFinished] = useState(pageStatus.unlocked);
	const advanceChunk = useConstructedResponse((state) => state.advanceChunk);

	if (!user) {
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
					{!finished && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								advanceChunk(chunkSlug);
								setFinished(true);
								createEvent({
									userId: user.id,
									type: "post-question-chunk-reveal",
									pageSlug,
									data: {
										chunkSlug,
										condition: Condition.STAIRS,
									},
								});
							}}
							className="w-full space-y-2"
						>
							<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
								<Button type="submit" variant={"outline"}>
									Continue
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</>
	);
};
