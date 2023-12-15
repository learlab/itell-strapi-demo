"use client";

import { useLastVisitedChapterUrl } from "@/lib/hooks/use-last-visited-chapter";
import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";
import { useTransition } from "react";
import { Spinner } from "./spinner";
import { Button } from "./client-components";
import { useRouter } from "next/navigation";

export const StartOrContinueReading = () => {
	const url = useLastVisitedChapterUrl();
	const router = useRouter();
	const text = url ? "Continue Reading" : "Start Reading";
	const href = url || "/chapter-0";
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
