"use client";

import { FOCUS_TIME_SAVE_INTERVAL } from "@/lib/constants";
import { createEvent, createFocusTime } from "@/lib/server-actions";
import { getChunkElement } from "@/lib/utils";
import { EventTracker as Tracker } from "@itell/core/components";
import {
	ClickEventData,
	FocusTimeEventData,
	ScrollEventData,
} from "@itell/core/types";
import { useEffect, useState } from "react";
import { useQA } from "../context/qa-context";

type Props = {
	pageSlug: string;
};

export const EventTracker = ({ pageSlug }: Props) => {
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
		createEvent({
			eventType: "focus-time",
			page: location.href,
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
