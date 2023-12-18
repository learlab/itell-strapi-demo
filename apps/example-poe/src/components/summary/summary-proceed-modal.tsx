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
import { Spinner } from "../spinner";
import { incrementLocation } from "@/lib/location";
import { makeLocationHref } from "@/lib/utils";
import { SectionLocation } from "@/types/location";

type Props = {
	// when this is false, the user writes enough summaries more than the threshold
	isPassed: boolean;
	location: SectionLocation;
	children?: React.ReactNode;
	title: string;
};

export const SummaryProceedModal = ({
	title,
	isPassed,
	location,
	children,
}: Props) => {
	const [open, setOpen] = useState(true);
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(() => {
			router.push(makeLocationHref(incrementLocation(location)));
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
					<Button onClick={handleClick} disabled={pending}>
						{pending && <Spinner className="mr-2 inline" />} Next Section
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
