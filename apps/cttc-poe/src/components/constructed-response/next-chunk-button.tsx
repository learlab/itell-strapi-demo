"use client";

import { useSession } from "@/lib/auth/context";
import { createEvent } from "@/lib/event/actions";
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
	const { user } = useSession();

	const onSubmit = async () => {
		advancedChunk(chunkSlug);

		if (onClick) {
			onClick();
		}
		if (user) {
			await createEvent({
				type: clickEventType,
				pageSlug,
				userId: user.id,
				data: {
					currentChunk: chunkSlug,
				},
			});
		}
	};

	if (!standalone) {
		return (
			<Button onClick={onSubmit} {...rest}>
				{children}
			</Button>
		);
	}

	return (
		<div className="flex justify-center items-center p-4 gap-2">
			<Button
				onClick={onSubmit}
				className="bg-red-400  hover:bg-red-200 text-white m-2 p-2"
				{...rest}
			>
				{children}
			</Button>
			<span className="absolute left-0 w-1/4 h-px bg-red-800 opacity-50" />
			<span className="absolute right-0 w-1/4 h-px bg-red-800 opacity-50" />
		</div>
	);
};
