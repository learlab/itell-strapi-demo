"use client";

import { useQA } from "../context/qa-context";
import { createEvent } from "@/lib/server-actions";
import { Button } from "../client-components";

interface Props extends React.ComponentPropsWithRef<typeof Button> {
	onClick?: () => void;
	pageSlug: string;
	clickEventType: string;
	standalone?: boolean;
	children: React.ReactNode;
}

export const NextChunkButton = ({
	onClick,
	clickEventType,
	children,
	standalone,
	pageSlug,
	...rest
}: Props) => {
	const { chunks, currentChunk, setCurrentChunk } = useQA();

	const onSubmit = async () => {
		if (chunks && currentChunk < chunks.length - 1) {
			const nextChunk = currentChunk + 1;
			setCurrentChunk(nextChunk);
		}
		if (onClick) {
			onClick();
		}
		await createEvent({
			eventType: clickEventType,
			page: location.href,
			data: {
				currentChunk: currentChunk,
			},
		});
	};

	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<Button variant="secondary" type="button" onClick={onSubmit} {...rest}>
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
