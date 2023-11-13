import {
	CreateNoteInput,
	Highlight,
	NoteCard,
	UpdateNoteInput,
} from "@/types/note";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Count = {
	note: number; // total number of notes
	highlight: number; // total number of highlights
};

type State = {
	notes: NoteCard[]; // only the newly created notes
	highlights: Highlight[]; // only the newly created highlights
	count: Count;
};

type Actions = {
	createNote: (note: CreateNoteInput, theme?: string) => void;
	updateNote: (note: UpdateNoteInput) => void;
	deleteNote: (id: string) => void;
	deleteHighlight: (id: string) => void;
	setCount: (count: Count) => void;
	incrementNoteCount: (num?: number) => void;
	incrementHighlightCount: (num?: number) => void;
};

export const useNotesStore = create(
	immer<State & Actions>((set) => ({
		notes: [],
		highlights: [],
		count: {
			note: 0,
			highlight: 0,
		},
		createNote: ({ id, y, highlightedText, color, serializedRange }) =>
			set((state) => {
				state.notes.push({
					id,
					y,
					highlightedText,
					noteText: "",
					color,
					serializedRange,
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
		deleteHighlight: (id) =>
			set((state) => {
				const index = state.highlights.findIndex((h) => h.id === id);
				if (index !== -1) {
					state.highlights.splice(index, 1);
				}
			}),
		setCount: (count) => {
			set((state) => {
				state.count = count;
			});
		},
		incrementNoteCount: (num) => {
			set((state) => {
				state.count.note += num || 1;
			});
		},
		incrementHighlightCount: (num) => {
			set((state) => {
				state.count.highlight += num || 1;
			});
		},
	})),
);
