"use client";

import { Button } from "../client-components";
import { useChat } from "../provider/page-provider";

type Props = {
	onExit: () => void;
};

export const ChatExit = ({ onExit }: Props) => {
	const stairsAnswered = useChat((store) => store.stairsAnswered);

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
