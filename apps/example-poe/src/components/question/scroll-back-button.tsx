"use client";

import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { useQA } from "../context/qa-context";

export const ScrollBackButton = () => {
	const { currentChunk, chunks } = useQA();

	const scrollToCurrentChunk = () => {
		if (chunks) {
			const element = chunks[currentChunk];
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	// disappear is user unlocks all chunks
	if (chunks && currentChunk >= chunks.length - 1) {
		return null;
	}

	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<button
				className={cn(
					buttonVariants({ variant: "secondary" }),
					"bg-emerald-400  hover:bg-emerald-200 text-white m-2 p-2",
				)}
				onClick={scrollToCurrentChunk}
				type="button"
			>
				Click Here to Scroll Back Up to Your Current Subsection
			</button>
			<span className="absolute left-0 w-1/4 h-px bg-emerald-800 opacity-50" />
			<span className="absolute right-0 w-1/4 h-px bg-emerald-800 opacity-50" />
		</div>
	);
};
