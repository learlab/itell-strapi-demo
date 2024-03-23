"use client";

import { useChatStore } from "@/lib/store/chat";
import { Button } from "../client-components";

type Props = {
	onClick: () => void;
};

export const StairsReadyButton = ({ onClick }: Props) => {
	const ready = useChatStore((state) => state.stairsReady);
	return (
		<div className="space-y-2">
			<p>When you are ready for the question, click the button below.</p>
			<Button
				size={"sm"}
				variant={"outline"}
				className="animate-out duration-200 ease-out bg-background text-foreground"
				id="chunk-question-ready"
				onClick={onClick}
				disabled={ready}
			>
				I'm ready for question
			</Button>
		</div>
	);
};
