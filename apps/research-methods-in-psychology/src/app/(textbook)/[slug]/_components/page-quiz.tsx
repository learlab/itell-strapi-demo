"use client";

import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { useState } from "react";
import { Page } from "#content";

export const PageQuiz = ({
	quiz,
	pageSlug,
	afterSubmit,
}: { quiz: Page["quiz"]; pageSlug: string; afterSubmit?: () => void }) => {
	const [pending, setPending] = useState(false);

	if (!quiz) return null;

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPending(true);
		const formData = new FormData(e.currentTarget);
		const answers = Array.from(formData.entries()).map(([key, value]) => [
			key,
			String(value),
		]);
		await createEventAction({
			type: EventType.QUIZ,
			pageSlug,
			data: {
				answers,
			},
		});
		setPending(false);
		afterSubmit?.();
	};

	return (
		<form onSubmit={onSubmit}>
			{quiz.map((item, index) => (
				<div key={index} className="my-8 grid gap-2">
					<h4 className="font-semibold text-lg mb-2">{item.question}</h4>
					<RadioGroup name={index.toString()} required>
						{item.answers.map((answer, answerIndex) => (
							<div
								key={answerIndex}
								className="flex items-center space-x-2 mb-2"
							>
								<RadioGroupItem
									value={answer.answer}
									id={`q${index}-a${answerIndex}`}
								/>
								<Label htmlFor={`q${index}-a${answerIndex}`}>
									{answer.answer}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			))}
			<footer className="flex justify-end">
				<Button pending={pending} disabled={pending}>
					Submit
				</Button>
			</footer>
		</form>
	);
};
