"use client";

import { makePageHref } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../client-components";
import { Spinner } from "../spinner";

type Props = {
	pageSlug: string;
	text: string;
};

export const ReviseSummaryButton = ({ pageSlug, text }: Props) => {
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
		<Button onClick={navigate} disabled={pending}>
			{pending && <Spinner className="size-4" />}
			Go to textbook and revise the summary
		</Button>
	);
};
