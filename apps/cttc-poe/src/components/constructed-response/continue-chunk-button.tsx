"use client";

import { createEvent } from "@/lib/event/actions";
import { LoginButton } from "@auth/auth-form";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { type AnimationProps, motion } from "framer-motion";
import { MoveDownIcon } from "lucide-react";
import { useConstructedResponse } from "../provider/page-provider";

const animationProps = {
	initial: { "--x": "100%", scale: 0.8 },
	animate: { "--x": "-100%", scale: 1 },
	whileTap: { scale: 0.95 },
	transition: {
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
		repeatDelay: 1,
		type: "spring",
		stiffness: 20,
		damping: 15,
		mass: 2,
		scale: {
			type: "spring",
			stiffness: 200,
			damping: 5,
			mass: 0.5,
		},
	},
} as AnimationProps;

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
	userId: string | null;
	chunkSlug: string;
	pageSlug: string;
	condition: string;
}

export const ContinueChunkButton = ({
	userId,
	chunkSlug,
	pageSlug,
	condition,
}: Props) => {
	const { advancedChunk, chunkData } = useConstructedResponse((state) => ({
		advancedChunk: state.advanceChunk,
		chunkData: state.chunkData,
		currentChunk: state.currentChunk,
	}));
	const currentData = chunkData[chunkSlug];
	const disabled = currentData?.question && !currentData.status;

	const onSubmit = async () => {
		advancedChunk(chunkSlug);

		if (userId) {
			createEvent({
				type: "chunk-reveal",
				pageSlug,
				userId,
				data: {
					chunkSlug,
					condition,
				},
			});
		}
	};

	if (!userId) {
		return <LoginButton />;
	}

	return (
		<motion.button
			{...animationProps}
			className={cn(
				"relative w-56 rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
				buttonVariants({ variant: "default" }),
			)}
			data-no-event={true}
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
