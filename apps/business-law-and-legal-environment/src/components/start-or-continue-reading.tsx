"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { useTransition } from "react";
import { Button } from "./client-components";
import { useRouter } from "next/navigation";
import { Spinner } from "./spinner";
import { firstPageUrl } from "@/lib/constants";

export const StartOrContinueReading = () => {
	const url = useLastVisitedPageUrl();
	const text = url ? "Continue Reading" : "Start Reading";
	const href = url || firstPageUrl;
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
			{pending && <Spinner className="size-4 mr-2" />} {text}
		</Button>
	);
};
