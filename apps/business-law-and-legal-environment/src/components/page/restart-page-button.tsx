"use client";

import { RotateCcwIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";

export const RestartPageButton = () => {
	const [pending, startTransition] = useTransition();
	const reset = useConstructedResponse((state) => state.reset);
	return (
		<Button
			className="flex flex-wrap justify-start items-center gap-2 pl-0"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					reset();
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
