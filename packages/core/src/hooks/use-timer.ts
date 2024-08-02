"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = () => {
	const [time, setTime] = useState<number>(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isRunning = useRef<boolean>(true);

	const clearTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		isRunning.current = false;
	}, []);

	const handleVisibilityChange = useCallback(() => {
		if (isRunning.current) {
			if (document.hidden) {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			} else {
				intervalRef.current = setInterval(() => {
					setTime((prevTime) => prevTime + 1);
				}, 1000);
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("visibilitychange", handleVisibilityChange);

		intervalRef.current = setInterval(() => {
			setTime((prevTime) => prevTime + 1);
		}, 1000);

		return () => {
			clearTimer();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [handleVisibilityChange, clearTimer]);

	return { time, clearTimer };
};
