import { useEffect, useState } from "react";
import { useCurrentChapter } from "./utils";
import { makeChapterHref } from "../utils";
import { useLocalStorage } from "@itell/core/hooks";

export const useTrackLastVisitedChapter = () => {
	const currentChapter = useCurrentChapter();
	const [_, setLastVisitedChapter] = useLocalStorage<number | undefined>(
		"think-python-last-visited-chapter",
		undefined,
	);

	useEffect(() => {
		if (currentChapter) {
			setLastVisitedChapter(currentChapter);
		}
	}, [currentChapter]);
};

export const useLastVisitedChapterUrl = () => {
	const [lastVisitedChapter, _] = useLocalStorage<number | undefined>(
		"think-python-last-visited-chapter",
		undefined,
	);
	const [url, setUrl] = useState<string>("/chapter-0");

	useEffect(() => {
		if (lastVisitedChapter) {
			setUrl(makeChapterHref(lastVisitedChapter));
		}
	}, [lastVisitedChapter]);

	return url;
};
