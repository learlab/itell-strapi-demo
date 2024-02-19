"use client";

import { Button } from "../client-components";
import { useChat } from "../context/chat-context";

type Props = {
	onExit: () => void;
};

export const ChatExit = ({ onExit }: Props) => {
	const { chunkQuestionAnswered } = useChat();

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
