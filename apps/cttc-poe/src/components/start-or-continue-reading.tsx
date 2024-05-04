"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { firstPage } from "@/lib/pages";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { Button } from "./client-components";
import { Spinner } from "./spinner";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	text?: string;
}

export const StartOrContinueReadingButton = ({ text, ...rest }: Props) => {
	const url = useLastVisitedPageUrl();

	const href = url || firstPage.url;
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
			{...rest}
		>
			{pending && <Spinner className="size-4 mr-2" />}{" "}
			{text ? text : url ? "Continue Reading" : "Start Reading"}
		</Button>
	);
};
