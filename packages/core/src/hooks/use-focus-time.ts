import { useEffect, useRef } from "react";

export type FocusTimeEntry = {
	sectionId: string;
	totalViewTime: number;
	lastTick: number;
};

type MutationFnArgs = {
	summaryId?: string;
	focusTimeData: FocusTimeEntry[];
	totalViewTime: number;
};

type Props = {
	chunksFn: () => HTMLDivElement[];
	mutationFn: (args: MutationFnArgs) => Promise<void>;
	countInterval: number;
};

export const useFocusTime = ({
	mutationFn,
	countInterval,
	chunksFn,
}: Props) => {
	const data = useRef<FocusTimeEntry[]>();
	const isSaving = useRef(false);
	const visibleSections = new Set<string>();
	const savedTime = useRef<Map<string, number>>(new Map());

	const options: IntersectionObserverInit = {
		root: null,
		rootMargin: "0px",
		threshold: 0,
	};

	let countTimer: NodeJS.Timeout | null = null;

	const pause = () => {
		if (countTimer) {
			clearInterval(countTimer);
		}
	};

	const start = () => {
		pause();
		data.current?.forEach((entry) => {
			entry.lastTick = performance.now();
		});
		countTimer = setInterval(() => {
			if (data.current && !isSaving.current) {
				data.current.forEach((entry) => {
					if (visibleSections.has(entry.sectionId)) {
						entry.totalViewTime += Math.round(
							(performance.now() - entry.lastTick) / 1000,
						);
					}
					entry.lastTick = performance.now();
				});
			}
		}, countInterval);
	};

	const saveFocusTime = async (summaryId?: string) => {
		if (data.current && !isSaving.current) {
			isSaving.current = true;

			const adjustedFocusTimeData = data.current.map((entry) => {
				const previouslySaved = savedTime.current.get(entry.sectionId) || 0;
				const durationSinceLastSave = entry.totalViewTime - previouslySaved;

				// Update the saved time reference
				savedTime.current.set(entry.sectionId, entry.totalViewTime);

				return {
					...entry,
					totalViewTime: durationSinceLastSave,
				};
			});

			await mutationFn({
				summaryId,
				focusTimeData: adjustedFocusTimeData,
				totalViewTime: adjustedFocusTimeData.reduce(
					(acc, entry) => acc + entry.totalViewTime,
					0,
				),
			});

			isSaving.current = false;
		}
	};

	const handleVisibilityChange = () => {
		if (document.hidden) {
			pause();
		} else {
			start();
		}
	};

	useEffect(() => {
		// pause when the tab is not visible
		// start when the tab is visible
		document.addEventListener("visibilitychange", handleVisibilityChange);

		const chunks = chunksFn();

		data.current = chunks.map((el) => ({
			sectionId: el.dataset.subsectionId as string,
			totalViewTime: 0,
			lastTick: performance.now(),
		}));

		// Initialize saved time for each section
		data.current.forEach((entry) => {
			savedTime.current.set(entry.sectionId, 0);
		});

		// had to create the observer inside useEffect to avoid build error
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				const target = entry.target as HTMLElement;
				const id = target.dataset.subsectionId as string;
				if (entry.isIntersecting) {
					visibleSections.add(id);
				} else {
					visibleSections.delete(id);
				}
			});
		}, options);

		chunks.forEach((el) => {
			observer.observe(el);
		});

		start();

		return () => {
			chunks.forEach((el) => observer.unobserve(el));
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			pause();
		};
	}, []);

	return { saveFocusTime, start, pause };
};
