"use client";

import { useClick } from "@/hooks/use-click";
import { useFocusTime } from "@/hooks/use-focus-time";
import { useScroll } from "@/hooks/use-scroll";
import { ClickEventData, FocusTimeEventData, ScrollEventData } from "@/types";

type Props = {
	focusTimeSaveInterval: number;
	chunks: HTMLElement[];
	onFocusTimeEvent: (data: FocusTimeEventData) => Promise<void>;
	onClickEvent: (data: ClickEventData) => Promise<void>;
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
