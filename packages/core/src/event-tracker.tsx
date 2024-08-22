"use client";

import { ClickEventData, useClick } from "./hooks/use-click";
import { FocusTimeEventData, useFocusTime } from "./hooks/use-focus-time";
import { ScrollEventData, useScroll } from "./hooks/use-scroll";
type Props = {
	focusTimeSaveInterval: number;
	chunks: HTMLElement[];
	onFocusTimeEvent: (data: FocusTimeEventData, total: number) => Promise<void>;
	onClickEvent: (data: ClickEventData, event: MouseEvent) => Promise<void>;
	onScrollEvent: (data: ScrollEventData) => Promise<void>;
};

export const EventTracker = ({
	chunks,
	focusTimeSaveInterval,
	onScrollEvent,
	onFocusTimeEvent,
	onClickEvent,
}: Props) => {
	useClick({ onEvent: onClickEvent });

	useScroll({ onEvent: onScrollEvent });

	useFocusTime({
		onEvent: onFocusTimeEvent,
		chunks,
		saveInterval: focusTimeSaveInterval,
	});

	return null;
};
