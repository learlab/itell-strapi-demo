"use client";

import { createQuestionFeedbackAction } from "@/actions/question";
import { InternalError } from "@/components/interval-error";
import { Spinner } from "@/components/spinner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@itell/ui/client";
import { Button, Checkbox, Label, TextArea } from "@itell/ui/client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
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
				{isPositive ? (
					<ThumbsUp className="hover:stroke-emerald-400 hover:cursor-pointer size-4" />
				) : (
					<ThumbsDown className="hover:stroke-rose-700 hover:cursor-pointer size-4" />
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Provide additional feedback</DialogHeader>
				<form
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
					<TextArea
						name="text"
						className="mb-4"
						rows={3}
						placeholder="Tell us more about your experience and how we can improve iTELL AI."
					/>
					<div className="flex flex-col space-y-2">
						{allTags.map((tag) => (
							<div className="flex items-center space-x-2" key={tag}>
								<Checkbox id={tag} name={tag} />
								<Label htmlFor={tag}> {tag}</Label>
							</div>
						))}
					</div>
					{isError && (
						<InternalError>
							<p>Failed to submit feedback, please try again later.</p>
						</InternalError>
					)}
					<div className="flex justify-end">
						<Button type="submit" disabled={pending}>
							{pending && <Spinner className="inline mr-2" />}
							Submit feedback
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
