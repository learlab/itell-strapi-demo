"use client";

import { Button } from "@itell/ui/button";
import { Card, CardContent } from "@itell/ui/card";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import { useRef, useState } from "react";

type ScoreResponse = {
	score: number;
	is_passing: boolean;
};

export const Question = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
}: {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
}) => {
	const form = useRef<HTMLFormElement>(null);
	const [response, setResponse] = useState<ScoreResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const input = String(formData.get("input"));
		setPending(true);

		try {
			const response = await getScore(input, chunkSlug, pageSlug);
			setResponse(response);
		} catch (error) {
			console.log(error);
			setError(String(error));
		} finally {
			setPending(false);
		}
	};

	return (
		<Card className="flex flex-col justify-center items-center gap-2 mt-4">
			<CardContent className="space-y-4">
				<h3 id="form-question-heading" className="sr-only">
					Answer the question
				</h3>
				<p>
					<span className="font-semibold">Question</span> : {question}
				</p>
				<form
					ref={form}
					aria-label="form-question-heading"
					className="w-full space-y-2"
					onSubmit={onSubmit}
				>
					<Label>
						<span className="sr-only">Your answer</span>
						<TextArea
							name="input"
							rows={2}
							className="max-w-lg mx-auto rounded-md shadow-md p-4"
							onKeyDown={(e) => {
								if (e.key === "Enter" && e.shiftKey) {
									e.preventDefault();
									insertNewline(e.currentTarget);
									return;
								}

								if (e.key === "Enter") {
									e.preventDefault();
									form.current?.requestSubmit();
									return;
								}
							}}
						/>
					</Label>
					<footer className="flex items-center justify-center">
						<Button pending={pending} disabled={pending} type="submit">
							Submit
						</Button>
					</footer>
					{response && (
						<p className="text-muted-foreground text-center">
							Score: {response.score},{" "}
							{response.is_passing ? "Passing" : "Failing"}
						</p>
					)}
					{error && <p className="text-sm text-red-500">{error}</p>}
				</form>
				<p className="text-sm text-muted-foreground">Answer: {answer}</p>
				<p className="text-sm text-muted-foreground">
					This is a simplified version of the actual question component.
				</p>
			</CardContent>
		</Card>
	);
};

export const insertNewline = (textarea: HTMLTextAreaElement) => {
	textarea.value = `${textarea.value}\n`;
	textarea.selectionStart = textarea.value.length;
	textarea.selectionEnd = textarea.value.length;
};

export const getScore = async (
	answer: string,
	chunkSlug: string,
	pageSlug: string,
) => {
	const response = await fetch("/api/score", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			pageSlug,
			chunkSlug,
			answer,
		}),
	});

	const data = await response.json();
	return data as ScoreResponse;
};
