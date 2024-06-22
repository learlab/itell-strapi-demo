"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./utils";

export type ScrollEventData = {
	offset: number;
	timestamp: number;
	percentage: number;
};

type Props = {
	onEvent: (data: ScrollEventData) => void;
};

export const useScroll = ({ onEvent }: Props) => {
	const [currentScroll, setCurrentScroll] = useState<ScrollEventData>();
	const scrollDebounced = useDebounce(currentScroll, 500);

	const updateScroll = () => {
		setCurrentScroll({
			offset: window.scrollY,
			percentage: window.scrollY / document.documentElement.scrollHeight,
			timestamp: Date.now(),
		});
	};

	useEffect(() => {
		// Optionally, update the height on window resize or other events
		window.addEventListener("scroll", updateScroll);

		return () => {
			window.removeEventListener("scroll", updateScroll);
		};
	}, []);

	useEffect(() => {
		if (scrollDebounced) {
			onEvent(scrollDebounced);
		}
	}, [scrollDebounced]);
};
