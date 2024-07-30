"use client";

import { useChat } from "@/components/provider/page-provider";
import { Elements } from "@/lib/constants";
import { Button } from "@itell/ui/client";

type Props = {
	onClick: () => void;
};

export const StairsReadyButton = ({ onClick }: Props) => {
	const ready = useChat((state) => state.stairsReady);
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
