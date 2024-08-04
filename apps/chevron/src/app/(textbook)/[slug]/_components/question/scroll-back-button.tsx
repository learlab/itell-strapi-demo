"use client";

import { useQuestionStore } from "@/components/provider/page-provider";
import { SelectCurrentChunk } from "@/lib/store/question-store";
import { scrollToElement } from "@/lib/utils";
import { Button } from "@itell/ui/client";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { MoveUpIcon } from "lucide-react";

export const ScrollBackButton = () => {
	const store = useQuestionStore();
	const currentChunk = useSelector(store, SelectCurrentChunk);

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
