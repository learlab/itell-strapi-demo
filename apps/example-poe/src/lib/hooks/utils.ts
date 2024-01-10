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

export const useCurrentChunk = (pageSlug: string, defaultVal: string) => {
	const key = `current-chunk-${pageSlug}`;
	const [val, setVal] = useLocalStorage<string>(key, defaultVal);
	return [val, setVal] as const;
};

export const resetPageChunk = (pageSlug: string) => {
	const key1 = `current-chunk-${pageSlug}`;
	localStorage.removeItem(key1);

	const key2 = `finished-${pageSlug}`;
	localStorage.setItem(key2, "false");
};

export const useIsPageFinished = (pageSlug: string, defaultVal: boolean) => {
	const key = `finished-${pageSlug}`;
	const [val, setVal] = useLocalStorage<boolean>(key, defaultVal);
	return [val, setVal] as const;
};
