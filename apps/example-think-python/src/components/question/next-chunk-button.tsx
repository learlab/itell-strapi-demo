"use client";

import { cn } from "@itell/core/utils";
import { useQA } from "../context/qa-context";
import { buttonVariants } from "@itell/ui/server";

export const NextChunkButton = () => {
	const { goToNextChunk } = useQA();
	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<button
				className={cn(
					buttonVariants({ variant: "secondary" }),
					"bg-red-400  hover:bg-red-200 text-white m-2 p-2",
				)}
				onClick={goToNextChunk}
			>
				Click Here to Continue Reading
			</button>
			<span className="absolute left-0 w-1/4 h-px bg-red-800 opacity-50" />
			<span className="absolute right-0 w-1/4 h-px bg-red-800 opacity-50" />
		</div>
	);
};
