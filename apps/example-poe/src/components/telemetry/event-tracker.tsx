"use client";

import { useDebounce } from "@itell/core/hooks";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import type { Prisma } from "@prisma/client";
import { TELEMETRY_SAVE_INTERVAL } from "@/lib/constants";
import { ClickEventData, ScrollEventData } from "@itell/core/types";
import { createEvents } from "@/lib/server-actions";

export const EventTracker = () => {
	const { data: session } = useSession();

	const [currentClick, setCurrentClick] = useState<{
		x: number;
		y: number;
		element: string;
	}>();
	const [scrollPosition, setScrollPosition] = useState<number>();
	const scrollPositionDebounced = useDebounce(scrollPosition, 500);
	const clickPositionDebounced = useDebounce(currentClick, 500);

	const scrollEvents = useRef<ScrollEventData[]>([]);
	const clickEvents = useRef<ClickEventData[]>([]);

	const handleScroll = (event: Event) => {
		setScrollPosition(window.scrollY);
	};

	const handleClick = (event: MouseEvent) => {
		const element = event.target as HTMLElement;
		setCurrentClick({
			x: event.x,
			y: event.y,
			element: `${element.tagName}-${element.textContent?.slice(0, 20)}`,
		});
	};

	useEffect(() => {
		const saveInterval = setInterval(() => {
			if (session?.user) {
				const allScrollEvents: Prisma.EventCreateInput[] =
					scrollEvents.current.map((e) => ({
						eventType: "scroll",
						userId: session.user.id,
						page: location.href,
						data: e,
					}));
				const allClickEvents: Prisma.EventCreateInput[] =
					clickEvents.current.map((e) => ({
						eventType: "click",
						userId: session.user.id,
						page: location.href,
						data: e,
					}));
				const allEvents = allScrollEvents.concat(allClickEvents);
				if (allEvents.length > 0) {
					scrollEvents.current = [];
					clickEvents.current = [];
					createEvents(allEvents);
				}
			}
		}, TELEMETRY_SAVE_INTERVAL);

		return () => clearInterval(saveInterval);
	}, [session]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		window.addEventListener("click", handleClick);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("click", handleClick);
		};
	}, []);

	useEffect(() => {
		if (scrollPositionDebounced) {
			scrollEvents.current = [
				...scrollEvents.current,
				{
					offset: scrollPositionDebounced,
					timestamp: new Date().toLocaleString("en-us", {
						timeZone: "America/Chicago",
					}),
					percentage: scrollPositionDebounced / pageHeight,
				},
			];
		}
	}, [scrollPositionDebounced]);

	useEffect(() => {
		if (clickPositionDebounced) {
			clickEvents.current = [
				...clickEvents.current,
				{
					x: clickPositionDebounced.x,
					y: clickPositionDebounced.y,
					timestamp: new Date().toLocaleString("en-us", {
						timeZone: "America/Chicago",
					}),
					element: clickPositionDebounced.element,
				},
			];
		}
	}, [clickPositionDebounced]);

	if (typeof document === "undefined") return null;

	const pageHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;

	return null;
};
