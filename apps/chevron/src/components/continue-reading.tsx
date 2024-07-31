"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { firstPage } from "@/lib/pages";
import { Button, StatusButton } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	text?: string;
}

export const ContinueReading = ({ text, ...rest }: Props) => {
	const url = useLastVisitedPageUrl();
	const href = url || firstPage.url;
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	return (
		<StatusButton
			pending={pending}
			disabled={pending}
			size={"lg"}
			{...rest}
			onClick={() => {
				startTransition(() => router.push(href));
			}}
		>
			{text ? text : url ? "Continue Reading" : "Start Reading"}
		</StatusButton>
	);
};
