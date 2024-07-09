"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/client-components";
import { createConstructedResponseFeedback } from "@/lib/constructed-response/actions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Checkbox, Label, TextArea } from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	userId: string;
	type: "positive" | "negative";
	chunkSlug: string;
	pageSlug: string;
};

export const QuestionFeedback = ({
	userId,
	type,
	pageSlug,
	chunkSlug,
}: Props) => {
	const isPositive = type === "positive";
	const allTags = isPositive
		? ["informative", "supportive", "helpful"]
		: ["nonsensical", "inaccurate", "harmful"];
	const [pending, setPending] = useState(false);
	const [open, setOpen] = useState(false);

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
						await createConstructedResponseFeedback({
							text,
							chunkSlug,
							pageSlug,
							isPositive,
							tags,
							userId,
						});
						setPending(false);
						toast.success("Thanks for your feedback. We'll review it shortly.");
						setOpen(false);
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
