import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getChapterFromPathname } from "../utils";
import { useLocalStorage } from "@itell/core/hooks";

export const useCurrentChapter = () => {
	const pathname = usePathname();
	const [chapter, setChapter] = useState<number | null>(null);

	useEffect(() => {
		if (pathname) {
			// chapter-1
			const pathSplitted = pathname.split("-");
			if (pathSplitted.length === 2) {
				const chapter = Number(pathSplitted[1]);
				setChapter(chapter);
			}
		}
	}, [pathname]);

	return chapter;
};

export const useCurrentChunkLocal = () => {
	const chapter = getChapterFromPathname(location.pathname);
	const key = `current-chunk-chapter-${chapter}`;
	const [val, setVal] = useLocalStorage(key, 0);
	return [val, setVal] as const;
};
