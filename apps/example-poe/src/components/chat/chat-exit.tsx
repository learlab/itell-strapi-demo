"use client";

import { useChatStore } from "@/lib/store/chat";
import { Button } from "../client-components";

type Props = {
	onExit: () => void;
};

export const ChatExit = ({ onExit }: Props) => {
	const chunkQuestionAnswered = useChatStore(
		(store) => store.chunkQuestionAnswered,
	);

	if (!chunkQuestionAnswered) {
		return null;
	}

	return (
		<div className="flex justify-end mt-4">
			<Button size="sm" onClick={onExit}>
				Go back to summary
			</Button>
		</div>
	);
};
