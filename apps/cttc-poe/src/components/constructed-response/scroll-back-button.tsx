"use client";

import { getChunkElement, scrollToElement } from "@/lib/utils";
import { Button } from "@itell/ui/client";
import { MoveUpIcon } from "lucide-react";
import { useConstructedResponse } from "../provider/page-provider";

export const ScrollBackButton = () => {
	const currentChunk = useConstructedResponse((state) => state.currentChunk);

	const scrollToCurrentChunk = () => {
		const element = getChunkElement(currentChunk);
		if (element) {
			scrollToElement(element);
		}
	};

	return (
		<Button
			onClick={scrollToCurrentChunk}
			type="button"
			className="flex gap-2 items-center justify-center uppercase"
		>
			<MoveUpIcon className="size-4" />
			Back to current section
		</Button>
	);
};
