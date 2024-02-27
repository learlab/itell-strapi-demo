"use client";

import { createHighlightListeners, deleteHighlightListener } from "@/lib/note";
import { useNotesStore } from "@/lib/store/note";
import { createNoteElements, deserializeRange } from "@itell/core/note";
import React from "react";
import { useEffect } from "react";
type Props = {
	id: string;
	color: string;
	range: string;
};

export const Highlight = React.memo(({ id, color, range }: Props) => {
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
			});
		} catch (err) {
			console.error("create highlight error", err);
		}
	}, []);

	return null;
});
