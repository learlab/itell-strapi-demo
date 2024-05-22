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

	const onClick = async (data: ClickEventData) => {
		createEvent({
			type: "click",
			pageSlug,
			userId,
			data,
		});
	};

	const onScroll = async (data: ScrollEventData) => {
		createEvent({
			type: "scroll",
			userId,
			pageSlug,
			data,
		});
	};

	const onFocusTime = async (data: FocusTimeEventData) => {
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
	};

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
