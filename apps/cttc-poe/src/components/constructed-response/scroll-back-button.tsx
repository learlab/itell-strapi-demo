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
		<Button onClick={scrollToCurrentChunk} type="button" className="uppercase">
			<span className="inline-flex items-center gap-2">
				<MoveUpIcon className="size-4" />
				Back to current section
			</span>
		</Button>
	);
};
