import {
	CreateNoteInput,
	Highlight,
	NoteCard,
	UpdateNoteInput,
} from "@/types/note";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Props {
	notes: NoteCard[];
	highlightCount: number;
}

interface State extends Props {
	createNote: (note: CreateNoteInput, theme?: string) => void;
	updateNote: (note: UpdateNoteInput) => void;
	deleteNote: (id: string) => void;
	addHighlight: () => void;
	removeHighlight: () => void;
}

export const useNotesStore = create(
	immer<State>((set) => ({
		notes: [],
		highlightCount: 0,
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
		updateNote: ({ id, noteText }) =>
			set((state) => {
				const index = state.notes.findIndex((n) => n.id === id);
				if (index !== -1) {
					state.notes[index].noteText = noteText;
				}
			}),
		deleteNote: (id) =>
			set((state) => {
				const index = state.notes.findIndex((n) => n.id === id);
				if (index !== -1) {
					state.notes.splice(index, 1);
				}
			}),
		addHighlight: () =>
			set((state) => {
				state.highlightCount++;
			}),
		removeHighlight: () =>
			set((state) => {
				state.highlightCount--;
			}),
	})),
);
