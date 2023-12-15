"use client";

import { createHighlightListeners, deleteHighlightListener } from "@/lib/note";

import { createNoteElements, deserializeRange } from "@itell/core/note";
import { useEffect } from "react";
type Props = {
	id: string;
	color: string;
	range: string;
};

export const Highlight = ({ id, color, range }: Props) => {
	useEffect(() => {
		try {
			createNoteElements({
				id,
				range: deserializeRange(range),
				color,
				isHighlight: true,
			});
			createHighlightListeners(id, deleteHighlightListener);
		} catch (err) {
			console.error("create highlight error", err);
		}
	}, []);

	return null;
};
