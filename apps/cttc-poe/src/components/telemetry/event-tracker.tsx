"use client";

import { SessionUser } from "@/lib/auth";
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
	user: SessionUser;
	chunks: string[];
	pageSlug: string;
};

export const EventTracker = ({ pageSlug, chunks, user }: Props) => {
	const [els, setEls] = useState<HTMLElement[] | undefined>();

	useEffect(() => {
		const chunkElements = chunks
			.map((chunkId) => getChunkElement(chunkId))
			.filter(Boolean);
		setEls(chunkElements);
	}, []);

	if (!els || !user) {
		return null;
	}

	const onClick = async (data: ClickEventData) => {
		createEvent({
			type: "click",
			pageSlug,
			userId: user.id,
			data,
		});
	};

	const onScroll = async (data: ScrollEventData) => {
		createEvent({
			type: "scroll",
			userId: user.id,
			pageSlug,
			data,
		});
	};

	const onFocusTime = async (data: FocusTimeEventData) => {
		createEvent({
			type: "focus-time",
			userId: user.id,
			pageSlug,
			data,
		});
		createFocusTime({
			userId: user.id,
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
