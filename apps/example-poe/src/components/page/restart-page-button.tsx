"use client";

import { RotateCcwIcon } from "lucide-react";
import { Button } from "../client-components";
import { useTransition } from "react";
import { Spinner } from "../spinner";
import { resetPageChunk } from "@/lib/hooks/utils";

type Props = {
	pageSlug: string;
};

export const RestartPageButton = ({ pageSlug }: Props) => {
	const [pending, startTransition] = useTransition();
	return (
		<Button
			className="flex flex-wrap justify-start items-center gap-2 pl-0"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					resetPageChunk(pageSlug);
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
			<span>Reset blurred text</span>
		</Button>
	);
};
