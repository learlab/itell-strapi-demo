"use client";

import { useQA } from "../context/qa-context";
import { useSession } from "next-auth/react";
import { createEvent } from "@/lib/server-actions";
import { Button } from "../client-components";
import { useCurrentChunkLocal } from "@/lib/hooks/utils";

interface Props extends React.ComponentPropsWithRef<typeof Button> {
	onClick?: () => void;
	clickEventType: string;
	standalone?: boolean;
	children: React.ReactNode;
}

export const NextChunkButton = ({
	onClick,
	clickEventType,
	children,
	standalone,
	...rest
}: Props) => {
	const { setCurrentChunk, chunks, currentChunk } = useQA();
	const { data: session } = useSession();
	const [_, setCurrentChunkLocal] = useCurrentChunkLocal();

	// submit event
	const submitEvent = async () => {
		if (session) {
			await createEvent({
				eventType: clickEventType,
				page: location.href,
				user: {
					connect: {
						id: session.user.id,
					},
				},
				data: {
					currentChunk: currentChunk,
				},
			});
		}
	};

	const onSubmit = async () => {
		if (chunks && currentChunk < chunks.length - 1) {
			const nextChunk = currentChunk + 1;
			setCurrentChunkLocal(nextChunk);
			setCurrentChunk(nextChunk);
		}
		if (onClick) {
			onClick();
		}
		await submitEvent();
	};

	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<Button variant="secondary" onClick={onSubmit} {...rest}>
				{children}
			</Button>
			{standalone && (
				<>
					<span className="absolute left-0 w-1/4 h-px bg-red-800 opacity-50" />
					<span className="absolute right-0 w-1/4 h-px bg-red-800 opacity-50" />
				</>
			)}
		</div>
	);
};
