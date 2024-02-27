"use client";

import { createEvent } from "@/lib/server-actions";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";

interface Props extends React.ComponentPropsWithRef<typeof Button> {
	onClick?: () => void;
	chunkSlug: string;
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
	chunkSlug,
	pageSlug,
	...rest
}: Props) => {
	const advancedChunk = useConstructedResponse((state) => state.advanceChunk);

	const onSubmit = async () => {
		advancedChunk(chunkSlug);

		if (onClick) {
			onClick();
		}
		await createEvent({
			eventType: clickEventType,
			pageSlug,
			data: {
				currentChunk: chunkSlug,
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
