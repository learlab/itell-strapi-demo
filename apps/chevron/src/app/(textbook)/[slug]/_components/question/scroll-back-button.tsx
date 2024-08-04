"use client";

import { useQuestion } from "@/components/provider/page-provider";
import { scrollToElement } from "@/lib/utils";
import { Button } from "@itell/ui/client";
import { getChunkElement } from "@itell/utils";
import { MoveUpIcon } from "lucide-react";

export const ScrollBackButton = () => {
	const currentChunk = useQuestion((state) => state.currentChunk);

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
