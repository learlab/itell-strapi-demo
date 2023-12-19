"use client";

import { useLocalStorage } from "@itell/core/hooks";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nonTextbookPaths = ["/", "/dashboard", "/auth", "/guide", "/summary"];

export const usePageSlug = () => {
	const [slug, setSlug] = useState<string | undefined>();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname && !nonTextbookPaths.includes(pathname)) {
			const splitted = pathname.split("/");
			if (splitted.length === 2) {
				setSlug(splitted[1]);
			}
		}
	}, [pathname]);

	return slug;
};

export const useCurrentChunkLocal = (pageSlug: string) => {
	const key = `current-chunk-${pageSlug}`;
	const [val, setVal] = useLocalStorage(key, 0);
	return [val, setVal] as const;
};

// TODO useCurrentChunkLocal throws an error (location is undefined)
// quick fix: use getCurrentChunkLocal instead, which is simply getting the value from localStorage
export const getCurrentChunkLocal = (pageSlug: string) => {
	const key = `current-chunk-${pageSlug}`;
	const val = localStorage.getItem(key);
	return val ? parseInt(val) : 0;
};
