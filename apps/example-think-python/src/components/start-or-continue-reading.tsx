"use client";

import { useLastVisitedChapterUrl } from "@/lib/hooks/use-last-visited-chapter";
import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";

export const StartOrContinueReading = () => {
	const url = useLastVisitedChapterUrl();
	const text = url ? "Continue Reading" : "Start Reading";
	const href = url || "/chapter-0";

	return (
		<Link href={href} className={buttonVariants({ size: "lg" })}>
			{text}
		</Link>
	);
};
