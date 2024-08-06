"use client";

import { useLastVisitedPage } from "@/lib/hooks/use-last-visited-page";
import { firstPage } from "@/lib/pages";
import { Button, StatusButton } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	text?: string;
}

export const ContinueReading = ({ text, ...rest }: Props) => {
	const href = useLastVisitedPage();
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	return (
		<StatusButton
			pending={pending}
			disabled={pending}
			size={"lg"}
			{...rest}
			onClick={() => {
				const dst = href || firstPage.href;
				startTransition(() => router.push(dst));
			}}
		>
			{text || href ? "Continue Reading" : "Start Reading"}
		</StatusButton>
	);
};
