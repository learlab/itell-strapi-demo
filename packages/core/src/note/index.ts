import { getSafeRanges } from "./range";
export { serializeRange, deserializeRange } from "./range";
export {
	getElementsByNoteId,
	removeNotes,
} from "./dom";

export const createNoteElements = ({
	id,
	range,
	color,
	isHighlight = false,
}: { id: number; range: Range; color: string; isHighlight?: boolean }) => {
	const safeRanges = getSafeRanges(range);
	safeRanges.forEach((r) => {
		if (r.startOffset !== r.endOffset) {
			const newNode = document.createElement("span");
			newNode.classList.add(isHighlight ? "highlight" : "note");
			newNode.dataset.noteId = String(id);
			newNode.style.backgroundColor = color;
			r.surroundContents(newNode);
		}
	});
	return id;
};
