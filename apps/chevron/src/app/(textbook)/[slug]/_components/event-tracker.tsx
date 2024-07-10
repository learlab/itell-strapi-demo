"use client";

import { FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { createEvent, createFocusTime } from "@/lib/event/actions";
import { getChunkElement } from "@/lib/utils";
import { EventTracker as Tracker } from "@itell/core/components";
import { useEffect, useState } from "react";

type Props = {
	userId: string | null;
	chunks: string[];
	pageSlug: string;
};

export const EventTracker = ({ pageSlug, chunks, userId }: Props) => {
	const [els, setEls] = useState<HTMLElement[] | undefined>();

	useEffect(() => {
		const chunkElements = chunks
			.map((chunkId) => getChunkElement(chunkId))
			.filter(Boolean);
		setEls(chunkElements);
	}, []);

	if (!els || !userId) {
		return null;
	}

	return (
		<Tracker
			onClickEvent={async (data, event) => {
				const target = event.target as HTMLElement;
				const buttonContainer = target.closest("button");
				if (buttonContainer) {
					if (buttonContainer.dataset.noEvent === "true") {
						return;
					}
				}

				createEvent({
					type: "click",
					pageSlug,
					userId,
					data,
				});
			}}
			onScrollEvent={async (data) => {
				createEvent({
					type: "scroll",
					userId,
					pageSlug,
					data,
				});
			}}
			onFocusTimeEvent={async (data, total) => {
				if (total > 0) {
					createEvent({
						type: "focus-time",
						userId,
						pageSlug,
						data,
					});
					createFocusTime({
						userId,
						pageSlug,
						data,
					});
				}
			}}
			chunks={els}
			focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
		/>
	);
};
