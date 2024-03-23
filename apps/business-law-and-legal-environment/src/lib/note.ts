import {
	getElementsByNoteId,
	getHighlightId,
	removeHighlights,
} from "@itell/core/note";
import { deleteNote } from "./server-actions";
import { useNotesStore } from "./store/note";

export const deleteHighlightListener = async (event: Event, setOpen: (arg0: boolean) => void) => {
	event.preventDefault();
	// const el = event.currentTarget as HTMLSpanElement;
	// if (confirm("Delete this highlight?")) {
	// 	const id = getHighlightId(el);

	// 	if (id) {
	// 		removeHighlights(id);
	// 		deleteNote(id);
	// 	}
	// }
	console.log(getHighlightId(event.currentTarget as HTMLSpanElement))
	setOpen(true);
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
