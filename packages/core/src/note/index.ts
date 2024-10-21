import { getSafeRanges } from "./range";

export { serializeRange, deserializeRange } from "./range";
export { getElementsByNoteId, removeNotes } from "./dom";

export const createNoteElements = async ({
  id,
  range,
  color,
  isHighlight = false,
}: {
  id: number;
  range: Range;
  color: string;
  isHighlight?: boolean;
}) => {
  const safeRanges = getSafeRanges(range);
  const elements: HTMLSpanElement[] = [];
  safeRanges.forEach((r) => {
    if (r.startOffset !== r.endOffset) {
      const newNode = document.createElement("span");
      newNode.classList.add(isHighlight ? "highlight" : "note");
      newNode.dataset.noteId = String(id);
      newNode.role = "mark";
      newNode.style.backgroundColor = color;
      r.surroundContents(newNode);

      elements.push(newNode);
    }
  });
  return elements;
};
