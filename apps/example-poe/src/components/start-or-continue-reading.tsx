"use client";

import { useLastVisitedSectionUrl } from "@/lib/hooks/use-last-visited-section";
import { useTransition } from "react";
import { Button } from "./client-components";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";

export const StartOrContinueReading = () => {
	const url = useLastVisitedSectionUrl();
	const text = url ? "Continue Reading" : "Start Reading";
	const href = url || "/module-1/chapter-1";
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					router.push(href);
				});
			}}
			disabled={pending}
			size="lg"
		>
			{pending && <Spinner className="w-4 h-4 mr-2" />} {text}
		</Button>
	);
};
