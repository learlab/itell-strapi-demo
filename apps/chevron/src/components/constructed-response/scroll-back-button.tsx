"use client";

import { getChunkElement, scrollToElement } from "@/lib/utils";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";

export const ScrollBackButton = () => {
	const { currentChunk, chunks } = useConstructedResponse((state) => ({
		currentChunk: state.currentChunk,
		chunks: state.chunks,
	}));

	const scrollToCurrentChunk = () => {
		const element = getChunkElement(currentChunk);
		if (element) {
			scrollToElement(element);
		}
	};

	// disappear as user unlocks all chunks
	if (chunks.at(-1) === currentChunk) {
		return null;
	}

	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<Button variant={"outline"} onClick={scrollToCurrentChunk} type="button">
				Scroll back to current section
			</Button>
			<span className="absolute left-0 w-1/4 h-0.5 bg-accent-foreground opacity-50" />
			<span className="absolute right-0 w-1/4 h-0.5 bg-accent-foreground opacity-50" />
		</div>
	);
};
