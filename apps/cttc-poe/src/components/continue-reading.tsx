"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { firstPage } from "@/lib/pages";
import { delay } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button, StatusButton } from "./client-components";
import { Spinner } from "./spinner";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	text?: string;
}

export const ContinueReading = ({ text, ...rest }: Props) => {
	const url = useLastVisitedPageUrl();
	const href = url || firstPage.url;
	const router = useRouter();
	const [_, action] = useFormState(() => {
		router.push(href);
	}, undefined);

	return (
		<form action={action}>
			<SubmitButton size={"lg"} {...rest}>
				{text ? text : url ? "Continue Reading" : "Start Reading"}
			</SubmitButton>
		</form>
	);
};

const SubmitButton = ({
	children,
	...rest
}: React.ComponentPropsWithoutRef<typeof Button>) => {
	const { pending } = useFormStatus();
	return (
		<StatusButton pending={pending} {...rest}>
			{children}
		</StatusButton>
	);
};
