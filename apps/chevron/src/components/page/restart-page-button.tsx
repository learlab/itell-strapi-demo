"use client";

import { RotateCcwIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";
import { clearSummaryLocal } from "../summary/summary-input";

type Props = {
	pageSlug: string;
};

export const RestartPageButton = ({ pageSlug }: Props) => {
	const [pending, startTransition] = useTransition();
	const resetPage = useConstructedResponse((state) => state.resetPage);
	return (
		<Button
			className="flex justify-start items-center gap-2 px-1 py-2 w-full"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					resetPage();
					clearSummaryLocal(pageSlug);
					window.location.reload();
				});
			}}
			disabled={pending}
		>
			{pending ? (
				<Spinner className="size-4" />
			) : (
				<RotateCcwIcon className="size-4" />
			)}
			<span>Reset page</span>
		</Button>
	);
};
