"use client";

import { ClickEventData, useClick } from "./hooks/use-click";
import { FocusTimeEventData, useFocusTime } from "./hooks/use-focus-time";
import { ScrollEventData, useScroll } from "./hooks/use-scroll";
type Props = {
	chunks: HTMLElement[];
	onFocusTimeEvent: (data: FocusTimeEventData, total: number) => Promise<void>;
	onClickEvent: (data: ClickEventData, event: MouseEvent) => Promise<void>;
	onScrollEvent: (data: ScrollEventData) => Promise<void>;
	attr?: string;
	focusTimeSaveInterval?: number;
	focusTimeUpdateInternal?: number;
};

export const EventTracker = ({
	chunks,
	onScrollEvent,
	onFocusTimeEvent,
	onClickEvent,
	attr = "subsectionId",
	focusTimeSaveInterval = 60000,
	focusTimeUpdateInternal = 1000,
}: Props) => {
	useClick({ onEvent: onClickEvent });

	useScroll({ onEvent: onScrollEvent });

	useFocusTime({
		onEvent: onFocusTimeEvent,
		chunks,
		attr,
		saveInterval: focusTimeSaveInterval,
		updateInterval: focusTimeUpdateInternal,
	});

	return null;
};
