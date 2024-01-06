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
import { getChunkElement } from "@/lib/utils";
import { useQA } from "../context/qa-context";

export const EventTracker = () => {
	const { chunks } = useQA();
	const chunkElements = chunks.map((chunkId) => getChunkElement(chunkId));

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
			chunks={chunkElements}
			focusTimeSaveInterval={FOCUS_TIME_SAVE_INTERVAL}
		/>
	);
};
