"use client";

import { createQuestionFeedbackAction } from "@/actions/question";
import { InternalError } from "@/components/interval-error";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@itell/ui/client";
import { Button, Checkbox, Label, TextArea } from "@itell/ui/client";
import { SendHorizontalIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

type Props = {
	type: "positive" | "negative";
	chunkSlug: string;
	pageSlug: string;
};

export const QuestionFeedback = ({ type, pageSlug, chunkSlug }: Props) => {
	const isPositive = type === "positive";
	const allTags = isPositive
		? ["informative", "supportive", "helpful"]
		: ["nonsensical", "inaccurate", "harmful"];
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const { isError, execute } = useServerAction(createQuestionFeedbackAction);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onClick={() => setOpen(true)}>
				<button
					type="button"
					aria-label={
						isPositive ? "submit positive feedback" : "submit negative feedback"
					}
				>
					{isPositive ? (
						<ThumbsUp className="hover:stroke-emerald-400  size-4" />
					) : (
						<ThumbsDown className="hover:stroke-rose-700  size-4" />
					)}
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader id="feedback-form-heading">
					Provide feedback to the question
				</DialogHeader>
				<form
					aria-labelledby="feedback-form-heading"
					className="grid gap-2"
					onSubmit={async (e) => {
						e.preventDefault();
						setPending(true);
						const formData = new FormData(e.currentTarget);
						const data = Object.fromEntries(formData.entries());
						const text = String(formData.get("text"));
						const tags = [];
						for (const tag of allTags) {
							if (data[tag] === "on") {
								tags.push(tag);
							}
						}
						const [_, err] = await execute({
							text,
							chunkSlug,
							pageSlug,
							isPositive,
							tags,
						});
						if (!err) {
							setOpen(false);
							toast.success(
								"Thanks for your feedback. We'll review it shortly.",
							);
						}
						setPending(false);
					}}
				>
					<Label>
						<span className="sr-only">your feedback</span>
						<TextArea
							name="text"
							className="mb-4"
							rows={3}
							placeholder="Tell us more about your experience and how we can improve iTELL AI."
						/>
					</Label>

					<div className="flex flex-col space-y-2">
						<p className="sr-only">
							Pick one or more tags that best describes the feedback you had
							(Optional)
						</p>
						{allTags.map((tag) => (
							<Label key={tag} className="inline-flex items-center gap-2">
								<Checkbox name={tag} />
								<span>{tag}</span>
							</Label>
						))}
					</div>
					{isError && (
						<InternalError>
							<p>Failed to submit feedback, please try again later.</p>
						</InternalError>
					)}
					<div className="flex justify-end">
						<Button type="submit" disabled={pending} pending={pending}>
							<span className="flex items-center gap-2">
								<SendHorizontalIcon className="size-4" />
								Submit feedback
							</span>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
