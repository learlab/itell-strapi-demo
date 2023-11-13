"use client";

import { createHighlightListeners, deleteHighlightListener } from "@/lib/note";

import { useNotesStore } from "@/lib/store";
import { createNoteElements, deserializeRange } from "@itell/core/note";
import { useEffect } from "react";
type Props = {
	id: string;
	color: string;
	range: string;
};

export const Highlight = ({ id, color, range }: Props) => {
	const incrementHighlightCount = useNotesStore(
		(store) => store.incrementHighlightCount,
	);

	useEffect(() => {
		try {
			createNoteElements({
				id,
				range: deserializeRange(range),
				color,
				isHighlight: true,
			});
			createHighlightListeners(id, (event) => {
				deleteHighlightListener(event);
				incrementHighlightCount(-1);
			});
		} catch (err) {
			console.error("create highlight error", err);
		}
	}, []);

	return null;
};
