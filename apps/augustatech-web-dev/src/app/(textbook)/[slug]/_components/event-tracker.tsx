"use client";

import { createEventAction } from "@/actions/event";
import { createFocusTimeAction } from "@/actions/focus-time";
import { EventType, FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { EventTracker as Tracker } from "@itell/core/event-tracker";
import { getChunkElement } from "@itell/utils";
import { useEffect, useState } from "react";

type Props = {
	chunks: string[];
	pageSlug: string;
};

export const EventTracker = ({ pageSlug, chunks }: Props) => {
	const [els, setEls] = useState<HTMLElement[] | undefined>();

	useEffect(() => {
		const chunkElements = chunks
			.map((chunkId) => getChunkElement(chunkId))
			.filter(Boolean);
		setEls(chunkElements);
	}, []);

	if (!els) {
		return null;
	}

	return (
		<Tracker
			onClickEvent={async (data, event) => {
				const target = event.target as HTMLElement;
				const buttonContainer = target.closest("button");
				if (buttonContainer) {
					if (buttonContainer.dataset.event === "true") {
						createEventAction({
							type: EventType.CLICK,
							pageSlug,
							data,
						});
					}
				}
			}}
			onScrollEvent={async (data) => {
				createEventAction({
					type: EventType.SCROLL,
					pageSlug,
					data,
				});
			}}
			onFocusTimeEvent={async (data, total) => {
				if (total > 0) {
					createFocusTimeAction({
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
