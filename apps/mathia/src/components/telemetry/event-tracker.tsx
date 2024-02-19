"use client";

import {
	ClickEventData,
	FocusTimeEventData,
	ScrollEventData,
} from "@itell/core/types";
import { createEvent, createFocusTime } from "@/lib/server-actions";
import { EventTracker as Tracker } from "@itell/core/components";
import { FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { getChunkElement } from "@/lib/utils";
import { useQA } from "../context/qa-context";
import { useEffect, useState } from "react";

export const EventTracker = () => {
	const { chunks } = useQA();
	const [els, setEls] = useState<HTMLDivElement[] | undefined>();

	useEffect(() => {
		const chunkElements = chunks.map((chunkId) => getChunkElement(chunkId));
		setEls(chunkElements);
	}, []);

	const onClick = async (data: ClickEventData) => {
		createEvent({
			eventType: "click",
			page: location.href,
			data,
		});
	};

	const onScroll = async (data: ScrollEventData) => {
		createEvent({
			eventType: "scroll",
			page: location.href,
			data,
		});
	};

	const onFocusTime = async (data: FocusTimeEventData) => {
		if (data.totalViewTime !== 0) {
			createEvent({
				eventType: "focus-time",
				page: location.href,
				data,
			});

			createFocusTime({
				totalViewTime: data.totalViewTime,
			});
		}
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
