"use client";

import { createEventAction } from "@/actions/event";
import { useQuestionStore } from "@/components/provider/page-provider";
import { EventType, animationProps } from "@/lib/constants";
import { SelectChunkStatus } from "@/lib/store/question-store";
import { Button } from "@itell/ui/client";
import { buttonVariants } from "@itell/ui/server";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { type AnimationProps, motion } from "framer-motion";
import { MoveDownIcon } from "lucide-react";

interface Props extends React.ComponentPropsWithRef<typeof Button> {
	chunkSlug: string;
	pageSlug: string;
	condition: string;
}

export const ContinueChunkButton = ({
	chunkSlug,
	pageSlug,
	condition,
}: Props) => {
	const store = useQuestionStore();
	const status = useSelector(store, SelectChunkStatus);
	const currentData = status[chunkSlug];
	const disabled = currentData.question && !currentData.status;

	const onSubmit = async () => {
		store.send({ type: "advanceChunk", chunkSlug });

		createEventAction({
			type: EventType.CHUNK_REVEAL,
			pageSlug,
			data: {
				chunkSlug,
				condition,
			},
		});
	};

	return (
		<motion.button
			{...animationProps}
			className={cn(
				"relative w-56 rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
				buttonVariants({ variant: "default" }),
			)}
			onClick={onSubmit}
			disabled={disabled}
		>
			<span
				className="relative flex justify-center gap-2 items-center h-full w-full uppercase tracking-wide"
				style={{
					maskImage:
						"linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
				}}
			>
				<MoveDownIcon className="size-4" />
				Continue Reading
			</span>
			<span
				style={{
					mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
					maskComposite: "exclude",
				}}
				className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
			/>
		</motion.button>
	);
};
