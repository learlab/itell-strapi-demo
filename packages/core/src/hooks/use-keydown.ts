"use client";

import { useCallback, useEffect, useRef } from "react";

// keycode, cursor position, timestamp
type KeydownEvent = [string, number, number][];

export const useKeydown = () => {
	const ref = useRef<HTMLElement>(null);
	const data = useRef<KeydownEvent>([]);

	const handleKeydown = (e: KeyboardEvent) => {
		data.current.push([
			e.code,
			(ref.current as HTMLTextAreaElement).selectionStart,
			e.timeStamp,
		]);
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
