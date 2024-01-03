"use client";

import {
	ClickEventData,
	FocusTimeEventData,
	ScrollEventData,
} from "@itell/core/types";
import { createEvent, createFocusTime } from "@/lib/server-actions";
import { EventTracker as Tracker } from "@itell/core/components";
import { FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { useEffect, useState } from "react";
import { getChunks } from "@/lib/chunks";

export const EventTracker = () => {
	const [chunks, setChunks] = useState<HTMLDivElement[]>([]);

	useEffect(() => {
		setChunks(getChunks());
	}, []);

	if (typeof window === "undefined" || chunks.length === 0) return null;

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

	return (
		<Tracker
			onClickEvent={onClick}
			onScrollEvent={onScroll}
			onFocusTimeEvent={onFocusTime}
			chunks={chunks}
			focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
		/>
	);
};
