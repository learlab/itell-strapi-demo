"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";

type Props = {
	// when false, the user writes enough summaries more than the threshold
	isPassed: boolean;
	pageSlug: string;
	children?: React.ReactNode;
	title: string;
};

export const SummaryProceedModal = ({
	title,
	isPassed,
	pageSlug,
	children,
}: Props) => {
	const [open, setOpen] = useState(true);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
};
