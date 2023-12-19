"use client";

import { getLocationFromPathname } from "../utils";
import { useLocalStorage } from "@itell/core/hooks";

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
