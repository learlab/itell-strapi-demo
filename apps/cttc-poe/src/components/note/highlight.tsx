"use client";

import { deleteNote } from "@/lib/note/actions";
import { useNotesStore } from "@/lib/store/note";
import {
	createNoteElements,
	deserializeRange,
	getElementsByNoteId,
	removeHighlights,
} from "@itell/core/note";
import React, { useState } from "react";
import { useEffect } from "react";
import { NoteDelete } from "./node-delete";
type Props = {
	id: number;
	color: string;
	range: string;
};

export const Highlight = React.memo(({ id, color, range }: Props) => {
	const [open, setOpen] = useState(false);
	const { deleteHighlight: deleteHighlightLocal } = useNotesStore();
	useEffect(() => {
		try {
			createNoteElements({
				id,
				range: deserializeRange(range),
				color,
				isHighlight: true,
			});
		} catch (err) {
			console.error("create highlight error", err);
		}

		const highlightElements = getElementsByNoteId(id);
		if (!highlightElements) {
			return;
		}
		Array.from(highlightElements).forEach((el) => {
			if (el) {
				el.addEventListener("click", () => setOpen(true));
			}
		});
	}, []);

	return (
		<NoteDelete
			open={open}
			onOpenChange={(val) => setOpen(val)}
			onDelete={async () => {
				// decrement highlight count
				deleteHighlightLocal(id);
				// remove dom element
				removeHighlights(id);
				// remove database record
				deleteNote(id);
			}}
		/>
	);
});
