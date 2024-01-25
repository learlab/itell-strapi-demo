import {
	ChunkEntry,
	ChunkEntryWithLastTick,
	FocusTimeEventData,
} from "@/types/telemetry";
import { useEffect, useRef } from "react";

type Props = {
	chunks: HTMLDivElement[];
	onEvent: (data: FocusTimeEventData) => Promise<void>;
	saveInterval: number;
};

const COUNT_INTERVAL = 1000;

export const useFocusTime = ({ onEvent, saveInterval, chunks }: Props) => {
	const entries = useRef<ChunkEntryWithLastTick[]>([]);
	const isSaving = useRef(false);
	const visibleChunks = new Set<string>();
	const savedTime = useRef<Map<string, number>>(new Map());

	const options: IntersectionObserverInit = {
		root: null,
		rootMargin: "0px",
		threshold: 0,
	};

	let countTimer: NodeJS.Timeout | null = null;
	let saveTimer: NodeJS.Timeout | null = null;

	const pause = () => {
		if (countTimer) {
			clearInterval(countTimer);
		}

		if (saveTimer) {
			clearInterval(saveTimer);
		}
	};

	const start = () => {
		// clear the previous timer
		pause();
		// initiate all entries
		entries.current?.forEach((entry) => {
			entry.lastTick = performance.now();
		});
		countTimer = setInterval(() => {
			if (entries.current && !isSaving.current) {
				entries.current.forEach((entry) => {
					if (visibleChunks.has(entry.chunkId)) {
						entry.totalViewTime += Math.round(
							(performance.now() - entry.lastTick) / 1000,
						);
					}
					entry.lastTick = performance.now();
				});
			}
		}, COUNT_INTERVAL);
		saveTimer = setInterval(saveFocusTime, saveInterval);
	};

	const saveFocusTime = async () => {
		if (entries.current && !isSaving.current) {
			isSaving.current = true;

			const updatedEntries: ChunkEntry[] = entries.current.map((entry) => {
				const previouslySaved = savedTime.current.get(entry.chunkId) || 0;
				const durationSinceLastSave = entry.totalViewTime - previouslySaved;

				// Update the saved time reference
				savedTime.current.set(entry.chunkId, entry.totalViewTime);

				return {
					chunkId: entry.chunkId,
					totalViewTime: durationSinceLastSave,
				};
			});

			const eventData: FocusTimeEventData = {}
			updatedEntries.forEach((entry) => {
				eventData[entry.chunkId] = entry.totalViewTime
			})


			await onEvent(eventData);

			isSaving.current = false;
		}
	};

	const onVisibilityChange = () => {
		if (document.hidden) {
			pause();
		} else {
			start();
		}
	};

	useEffect(() => {
		// pause when the tab is not visible
		// start when the tab is visible
		window.addEventListener("visibilitychange", onVisibilityChange);

		entries.current = chunks.map((el) => ({
			chunkId: el.dataset.subsectionId as string,
			totalViewTime: 0,
			lastTick: performance.now(),
		}));

		// Initialize saved time for each section
		entries.current.forEach((entry) => {
			savedTime.current.set(entry.chunkId, 0);
		});

		// had to create the observer inside useEffect to avoid build error
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const target = entry.target as HTMLElement;
				const id = target.dataset.subsectionId as string;
				if (entry.isIntersecting) {
					visibleChunks.add(id);
				} else {
					visibleChunks.delete(id);
				}
			});
		}, options);

		chunks.forEach((el) => {
			observer.observe(el);
		});

		start();

		return () => {
			pause();
			chunks.forEach((el) => observer.unobserve(el));
			window.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, []);

	return { saveFocusTime, start, pause };
};
