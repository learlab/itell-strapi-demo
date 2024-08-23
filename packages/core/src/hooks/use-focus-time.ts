"use client";
import { useEffect, useRef } from "react";

type Props = {
	onEvent: (data: FocusTimeEventData, total: number) => Promise<void>;
	chunks: HTMLElement[];
	attr: string;
	saveInterval: number;
	updateInterval: number;
};

export const useFocusTime = ({
	onEvent,
	chunks,
	attr,
	saveInterval,
	updateInterval,
}: Props) => {
	const entries = useRef<ChunkEntryWithLastTick[]>([]);
	const isSaving = useRef(false);
	const visibleChunks = useRef<Set<string>>(new Set());

	const rafId = useRef<number | null>(null);
	const saveTimerId = useRef<NodeJS.Timeout | null>(null);
	const lastUpdateTime = useRef(0);

	useEffect(() => {
		const updateEntries = () => {
			const now = performance.now();
			if (now - lastUpdateTime.current >= updateInterval) {
				if (!isSaving.current) {
					entries.current.forEach((entry) => {
						if (visibleChunks.current.has(entry.chunkId)) {
							const elapsedTime = Math.round((now - entry.lastTick) / 1000);
							entry.totalViewTime += elapsedTime;
						}
						entry.lastTick = now;
					});
				}
				lastUpdateTime.current = now;
			}
			rafId.current = requestAnimationFrame(updateEntries);
		};

		const saveFocusTime = async () => {
			if (entries.current && !isSaving.current) {
				isSaving.current = true;
				const eventData: FocusTimeEventData = {};
				const now = performance.now();
				let total = 0;

				entries.current.forEach((entry) => {
					total += entry.totalViewTime;
					eventData[entry.chunkId] = entry.totalViewTime;

					entry.totalViewTime = 0;
					entry.lastTick = now;
				});

				try {
					await onEvent(eventData, total);
				} catch (error) {
					console.error("Failed to save focus time:", error);
				} finally {
					isSaving.current = false;
				}
			}
		};

		const startSaveInterval = () => {
			const scheduleNextSave = () => {
				const now = Date.now();
				const nextSaveTime = Math.ceil(now / saveInterval) * saveInterval;
				const timeUntilNextSave = nextSaveTime - now;

				saveTimerId.current = setTimeout(async () => {
					await saveFocusTime();
					scheduleNextSave();
				}, timeUntilNextSave);
			};

			scheduleNextSave();
		};

		const start = () => {
			if (rafId.current) cancelAnimationFrame(rafId.current);
			if (saveTimerId.current) clearTimeout(saveTimerId.current);

			lastUpdateTime.current = performance.now();
			entries.current.forEach((entry) => {
				entry.lastTick = lastUpdateTime.current;
			});
			rafId.current = requestAnimationFrame(updateEntries);
			startSaveInterval();
		};

		const pause = () => {
			if (rafId.current) cancelAnimationFrame(rafId.current);
			if (saveTimerId.current) clearTimeout(saveTimerId.current);
		};

		const onVisibilityChange = () => {
			if (document.hidden) {
				pause();
			} else {
				start();
			}
		};

		window.addEventListener("visibilitychange", onVisibilityChange);

		entries.current = chunks.map((chunk) => ({
			chunkId: chunk.dataset[attr] as string,
			totalViewTime: 0,
			lastTick: performance.now(),
		}));

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const target = entry.target as HTMLElement;
					const id = target.dataset[attr] as string;
					if (entry.isIntersecting) {
						visibleChunks.current.add(id);
					} else {
						visibleChunks.current.delete(id);
					}
				});
			},
			{ root: null, rootMargin: "0px", threshold: 0 },
		);

		chunks.forEach((el) => observer.observe(el));

		start();

		return () => {
			pause();
			chunks.forEach((el) => observer.unobserve(el));
			window.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [onEvent, saveInterval]);
};

export type FocusTimeEventData = Record<string, number>;
type ChunkEntry = {
	chunkId: string;
	totalViewTime: number;
};

type ChunkEntryWithLastTick = ChunkEntry & { lastTick: number };
