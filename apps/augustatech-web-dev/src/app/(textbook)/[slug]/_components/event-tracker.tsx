"use client";

import { type } from "node:os";
import { createEventAction } from "@/actions/event";
import { createFocusTimeAction } from "@/actions/focus-time";
import { EventType, FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { EventTracker as Tracker } from "@itell/core/event-tracker";
import { getChunkElement } from "@itell/utils";
import { useEffect, useState } from "react";
import { map } from "zod";

type Props = {
	chunks: string[];
	pageSlug: string;
};

export const EventTracker = ({ pageSlug, chunks }: Props) => {
	const [mounted, setMounted] = useState(false);
	const [elements, setElements] = useState<HTMLElement[]>([]);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const chunkElements = chunks.map(
			(slug) => getChunkElement(slug) as HTMLElement,
		);
		setElements(chunkElements);
	}, [chunks]);

	if (!mounted || elements.length === 0) return;

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
			chunks={elements}
			attr="subsectionId"
			focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
		/>
	);
};
