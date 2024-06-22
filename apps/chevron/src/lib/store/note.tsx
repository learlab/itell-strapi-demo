import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type CreateNoteInput = {
	id: number;
	y: number;
	highlightedText: string;
	color: string;
	range: string;
};

export type UpdateNoteInput = {
	newId?: number;
	noteText?: string;
	color?: string;
};

export type NoteCard = {
	id: number;
	y: number;
	noteText: string;
	highlightedText: string;
	color: string;
	range: string;
	updatedAt?: Date;
	createdAt?: Date;
};

export type Highlight = {
	id: number;
	color: string;
	range: string;
};

type State = {
	notes: NoteCard[]; // only the newly created notes
	highlights: Highlight[]; // only the newly created highlights
};

type Actions = {
	createNote: (note: CreateNoteInput, theme?: string) => void;
	createHighlight: (highlight: Highlight) => void;
	updateNote: (id: number, input: UpdateNoteInput) => void;
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
		updateNote: (id, { noteText, color, newId }) =>
			set((state) => {
				const index = state.notes.findIndex((n) => n.id === id);
				if (index !== -1) {
					if (noteText) {
						state.notes[index].noteText = noteText;
					}
					if (color) {
						state.notes[index].color = color;
					}
					if (newId) {
						state.notes[index].id = newId;
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
