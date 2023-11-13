import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
