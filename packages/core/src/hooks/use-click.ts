"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./utils";
import { ClickEventData } from "@/types/telemetry";

type Props = {
	onEvent: (data: ClickEventData) => void;
};

export const useClick = ({ onEvent }: Props) => {
	const [currentClick, setCurrentClick] = useState<ClickEventData>();
	const clickDebounced = useDebounce(currentClick, 500);

	const handler = (event: MouseEvent) => {
		const element = event.target as HTMLElement;
		const eventData: ClickEventData = {
			x: event.x,
			y: event.y,
			element: `${element.tagName}-${element.textContent?.slice(0, 20)}`,
			timestamp: Date.now(),
		};
		setCurrentClick(eventData);
	};

	useEffect(() => {
		window.addEventListener("click", handler);

		return () => window.removeEventListener("click", handler);
	}, []);

	useEffect(() => {
		if (clickDebounced) {
			onEvent(clickDebounced);
		}
	}, [clickDebounced]);
};
