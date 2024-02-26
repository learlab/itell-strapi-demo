import {
	removeHighlights,
	getHighlightId,
	getElementsByNoteId,
} from "@itell/core/note";
import { deleteNote } from "./server-actions";

export const deleteHighlightListener = (event: Event) => {
	event.preventDefault();
	const el = event.currentTarget as HTMLSpanElement;
	if (confirm("Delete this highlight?")) {
		const id = getHighlightId(el);
		if (id) {
			removeHighlights(id);
			deleteNote(id);
		}
	}
};

export const createHighlightListeners = (
	id: string,
	cb: (e: Event) => void,
) => {
	const highlightElements = getElementsByNoteId(id);
	if (!highlightElements) {
		return;
	}
	Array.from(highlightElements).forEach((el) => {
		if (el) {
			el.addEventListener("click", cb);
		}
	});
};
