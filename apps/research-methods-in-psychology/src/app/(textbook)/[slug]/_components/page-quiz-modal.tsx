"use client";

import { Button } from "@itell/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@itell/ui/dialog";
import { ScrollArea } from "@itell/ui/scroll-area";
import { BookCheckIcon } from "lucide-react";
import { useState } from "react";
import { Page } from "#content";
import { PageQuiz } from "./page-quiz";

export const PageQuizModal = ({ quiz }: { quiz: Page["quiz"] }) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"} className="flex items-center gap-2">
					<BookCheckIcon className="size-3" />
					Quiz
				</Button>
			</DialogTrigger>
			<DialogContent
				className="max-w-4xl h-[80vh] overflow-y-auto"
				canClose={false}
			>
				<DialogHeader>
					<DialogTitle>Quiz</DialogTitle>
					<DialogDescription>
						Test your knowledge by answering the following questions. When you
						are finished, you will be able to finish assignments for this page
					</DialogDescription>
				</DialogHeader>
				<PageQuiz quiz={quiz} />
			</DialogContent>
		</Dialog>
	);
};
