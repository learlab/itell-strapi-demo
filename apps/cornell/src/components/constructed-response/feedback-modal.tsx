"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createConstructedResponseFeedback } from "@/lib/constructed-response/actions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Checkbox, Label, TextArea } from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	type: "positive" | "negative";
	chunkSlug: string;
	pageSlug: string;
};

export const FeedbackModal = ({ type, pageSlug, chunkSlug }: Props) => {
	const isPositive = type === "positive";
	const allTags = isPositive
		? ["informative", "supportive", "helpful"]
		: ["nonsensical", "inaccurate", "harmful"];
	const [input, setInput] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [isPending, setIsPending] = useState(false);

	const onSubmit = async () => {
		setIsPending(true);
		await createConstructedResponseFeedback({
			feedback: input,
			chunkSlug,
			pageSlug,
			isPositive,
			tags,
		});
		setIsPending(false);
		toast.success("Thanks for your feedback. We'll review it shortly.");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				{isPositive ? (
					<ThumbsUp className="hover:stroke-emerald-400 hover:cursor-pointer size-4" />
				) : (
					<ThumbsDown className="hover:stroke-rose-700 hover:cursor-pointer size-4" />
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>Provide additional feedback</DialogHeader>
				<div className="w-3/4">
					<TextArea
						value={input}
						onValueChange={setInput}
						className="mb-4"
						rows={3}
						placeholder="Tell us more about your experience and how we can improve iTELL AI."
					/>
					<div className="flex flex-col space-y-2">
						{allTags.map((tag) => (
							<div className="flex items-center space-x-2" key={tag}>
								<Checkbox
									id={tag}
									onCheckedChange={(checked) => {
										if (checked) {
											setTags([...tags, tag]);
										} else {
											setTags(tags.filter((t) => t !== tag));
										}
									}}
								/>
								<Label htmlFor={tag}> {tag}</Label>
							</div>
						))}
					</div>
				</div>
				<DialogFooter>
					<Button variant="secondary" onClick={onSubmit} disabled={isPending}>
						{isPending && <Spinner className="inline mr-2" />}
						Submit feedback
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
