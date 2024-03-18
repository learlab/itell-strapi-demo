"use client";

import { FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { createEvent, createFocusTime } from "@/lib/event/actions";
import { getChunkElement } from "@/lib/utils";
import { EventTracker as Tracker } from "@itell/core/components";
import {
	ClickEventData,
	FocusTimeEventData,
	ScrollEventData,
} from "@itell/core/types";
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

	const onClick = async (data: ClickEventData) => {
		createEvent({
			eventType: "click",
			pageSlug,
			data,
		});
	};

	const onScroll = async (data: ScrollEventData) => {
		createEvent({
			eventType: "scroll",
			pageSlug,
			data,
		});
	};

	const onFocusTime = async (data: FocusTimeEventData) => {
		createEvent({
			eventType: "focus-time",
			pageSlug,
			data,
		});
		createFocusTime({
			pageSlug,
			data,
		});
	};

	if (!els) {
		return null;
	}

	return (
		<Tracker
			onClickEvent={onClick}
			onScrollEvent={onScroll}
			onFocusTimeEvent={onFocusTime}
			chunks={els}
			focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
		/>
	);
};
