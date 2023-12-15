"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { useRouter } from "next/navigation";
import pluralize from "pluralize";
import { Button } from "../client-components";
import { useState, useTransition } from "react";
import { makeChapterHref } from "@/lib/utils";
import { Spinner } from "../spinner";

type Props = {
	// when this is false, the user writes enough summaries more than the threshold
	isPassed: boolean;
	chapter: number;
	children?: React.ReactNode;
	title: string;
};

export const SummaryProceedModal = ({
	title,
	isPassed,
	chapter,
	children,
}: Props) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(() => {
			router.push(makeChapterHref(chapter + 1));
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
				<DialogFooter>
					<Button onClick={handleClick}>
						{pending && <Spinner className="mr-2 inline" />} Next Chapter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
