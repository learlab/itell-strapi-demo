"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./utils";
import { ScrollEventData } from "@/types/telemetry";

type Props = {
	onEvent: (data: ScrollEventData) => void;
};

export const useScroll = ({ onEvent }: Props) => {
	const [pageHeight, setPageHeight] = useState<number>(0);

	const [currentScroll, setCurrentScroll] = useState<ScrollEventData>();
	const scrollDebounced = useDebounce(currentScroll, 500);

	const handler = () => {
		setCurrentScroll({
			offset: window.scrollY,
			percentage: window.scrollY / pageHeight,
			timestamp: Date.now(),
		});
	};

	useEffect(() => {
		setPageHeight(
			document.documentElement.scrollHeight -
				document.documentElement.clientHeight,
		);
		window.addEventListener("scroll", handler);

		return () => window.removeEventListener("scroll", handler);
	}, []);

	useEffect(() => {
		if (scrollDebounced) {
			onEvent(scrollDebounced);
		}
	}, [scrollDebounced]);
};
