"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { SectionLocation } from "@/types/location";
import { getLocationFromPathname } from "../utils";
import { useLocalStorage } from "@itell/core/hooks";

export const useCurrentChunkLocal = () => {
	const loc = getLocationFromPathname(location.pathname);
	const key = `current-chunk-chapter-${loc.chapter}-${loc.section}`;
	const [val, setVal] = useLocalStorage(key, 0);
	return [val, setVal] as const;
};

// TODO useCurrentChunkLocal throws an error (location is undefined)
// quick fix: use getCurrentChunkLocal instead, which is simply getting the value from localStorage
export const getCurrentChunkLocal = () => {
	const loc = getLocationFromPathname(location.pathname);
	const key = `current-chunk-chapter-${loc.chapter}-${loc.section}`;
	const val = localStorage.getItem(key);
	return val ? parseInt(val) : 0;
};
