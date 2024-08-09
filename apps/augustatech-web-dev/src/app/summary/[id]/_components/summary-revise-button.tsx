"use client";

import { makePageHref } from "@/lib/utils";
import { Button } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const SummaryReviseButton = ({
	pageSlug,
	text,
}: { pageSlug: string; text: string }) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const navigate = () => {
		const buf = Buffer.from(text);
		startTransition(() => {
			router.push(
				`${makePageHref(pageSlug)}?summary=${buf.toString("base64")}`,
			);
		});
	};

	return (
		<Button onClick={navigate} disabled={pending} pending={pending}>
			Revise this summary
		</Button>
	);
};
