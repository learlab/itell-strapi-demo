"use client";

import { useChatStore } from "@/lib/store/chat";
import { Button } from "../client-components";

type Props = {
	onExit: () => void;
};

export const ChatExit = ({ onExit }: Props) => {
	const stairsAnswered = useChatStore((store) => store.stairsAnswered);

	if (!stairsAnswered) {
		return null;
	}

	return (
		<div className="flex justify-end mt-4">
			<Button size="sm" onClick={onExit}>
				Return to summary
			</Button>
		</div>
	);
};
