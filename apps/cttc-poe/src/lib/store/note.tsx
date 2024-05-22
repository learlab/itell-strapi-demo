import {
	CreateNoteInput,
	Highlight,
	NoteCard,
	UpdateNoteInput,
} from "@/types/note";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
	notes: NoteCard[]; // only the newly created notes
	highlights: Highlight[]; // only the newly created highlights
};

type Actions = {
	createNote: (note: CreateNoteInput, theme?: string) => void;
	createHighlight: (highlight: Highlight) => void;
	updateNote: (note: UpdateNoteInput) => void;
	deleteNote: (id: number) => void;
	deleteHighlight: (id: number) => void;
};

export const useNotesStore = create(
	immer<State & Actions>((set) => ({
		notes: [],
		highlights: [],
		createNote: ({ id, y, highlightedText, color, range }) =>
			set((state) => {
				state.notes.push({
					id,
					y,
					highlightedText,
					noteText: "",
					color,
					range,
				});
			}),
		updateNote: ({ id, noteText, color }) =>
			set((state) => {
				const index = state.notes.findIndex((n) => n.id === id);
				if (index !== -1) {
					if (noteText) {
						state.notes[index].noteText = noteText;
					}
					if (color) {
						state.notes[index].color = color;
					}
				}
			}),
		deleteNote: (id) =>
			set((state) => {
				const index = state.notes.findIndex((n) => n.id === id);
				if (index !== -1) {
					state.notes.splice(index, 1);
				}
			}),
		createHighlight: (highlight) =>
			set((state) => {
				state.highlights.push(highlight);
			}),
		deleteHighlight: (id) =>
			set((state) => {
				const index = state.highlights.findIndex((h) => h.id === id);
				if (index !== -1) {
					state.highlights.splice(index, 1);
				}
			}),
	})),
);
