"use client";

import { useChatStore } from "@/components/provider/page-provider";
import { SelectStairsReady } from "@/lib/store/chat-store";
import { Elements } from "@itell/constants";
import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";

type Props = {
	onClick: () => void;
};

export const StairsReadyButton = ({ onClick }: Props) => {
	const store = useChatStore();
	const ready = useSelector(store, SelectStairsReady);
	return (
		<Button
			size={"sm"}
			variant={"outline"}
			className="animate-out duration-200 ease-out bg-background text-foreground"
			id={Elements.STAIRS_READY_BUTTON}
			onClick={onClick}
			disabled={ready}
		>
			I'm ready for question
		</Button>
	);
};
