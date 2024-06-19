"use client";

import { useCallback, useEffect, useRef } from "react";

export const useTimer = () => {
	const time = useRef<number>(0);
	const interval = useRef<NodeJS.Timeout | null>(null);

	const clearTimer = useCallback(() => {
		if (interval.current) {
			clearInterval(interval.current);
			interval.current = null;
		}
	}, []);

	// after clearTimer is called, visibility change should not restart or pause timer
	const handleVisibilityChange = () => {
		if (interval.current) {
			if (document.hidden) {
				clearInterval(interval.current);
			} else {
				interval.current = setInterval(() => {
					time.current += 1;
				}, 1000);
			}
		}
	};

	useEffect(() => {
		document.addEventListener("visibilitychange", handleVisibilityChange);

		interval.current = setInterval(() => {
			time.current += 1;
		}, 1000);

		return () => {
			clearTimer();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return { time: time.current, clearTimer };
};
