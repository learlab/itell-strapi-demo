"use client";

import { useCallback, useEffect, useRef } from "react";

type KeydownEvent = [string, number][];

export const useKeydown = () => {
	const ref = useRef<HTMLElement>(null);
	const data = useRef<KeydownEvent>([]);

	const handleKeydown = (e: KeyboardEvent) => {
		data.current.push([e.code, e.timeStamp]);
	};

	const clear = useCallback(() => {
		data.current = [];
	}, []);

	useEffect(() => {
		ref.current?.addEventListener("keydown", handleKeydown);

		return () => {
			ref.current?.removeEventListener("keydown", handleKeydown);
		};
	}, []);

	return { ref, data: data.current, clear };
};
