"use client";

import { useLastVisitedSectionUrl } from "@/lib/hooks/use-last-visisted-section";
import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";

export const StartOrContinueReading = () => {
	const url = useLastVisitedSectionUrl();
	const text = url ? "Continue Reading" : "Start Reading";
	const href = url || "/module-1/chapter-1";

	return (
		<Link href={href} className={buttonVariants({ size: "lg" })}>
			{text}
		</Link>
	);
};
