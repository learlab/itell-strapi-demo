import { Note } from "@/drizzle/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type CreateNoteInput = {
	id: number;
	highlightedText: string;
	color: string;
	range: string;
};

export type UpdateNoteInput = {
	newId?: number;
	noteText?: string;
	color?: string;
};

export type NoteData = {
	id: number;
	noteText: string;
	highlightedText: string;
	color: string;
	range: string;
	updatedAt?: Date;
	createdAt?: Date;
	local?: boolean;
};

export type Highlight = {
	id: number;
	color: string;
	range: string;
};

type State = {
	data: NoteData[];
};

type Actions = {
	init: (notes: Note[]) => void;
	createNote: (note: CreateNoteInput, theme?: string) => void;
	updateNote: (id: number, input: UpdateNoteInput) => void;
	deleteNote: (id: number) => void;
};

const useNotesStore = create(
	immer<State & Actions>((set) => ({
		data: [],
		highlights: [],
		init: (notes) =>
			set((state) => {
				state.data = notes;
			}),
		createNote: ({ id, highlightedText, color, range }) =>
			set((state) => {
				state.data.push({
					id,
					highlightedText,
					noteText: "",
					color,
					range,
					local: true,
				});
			}),
		updateNote: (id, { noteText, color, newId }) =>
			set((state) => {
				const index = state.data.findIndex((n) => n.id === id);
				if (index !== -1) {
					if (noteText) {
						state.data[index].noteText = noteText;
					}
					if (color) {
						state.data[index].color = color;
					}
					if (newId) {
						state.data[index].id = newId;
					}
				}
			}),
		deleteNote: (id) =>
			set((state) => {
				const index = state.data.findIndex((n) => n.id === id);
				if (index !== -1) {
					state.data.splice(index, 1);
				}
			}),
	})),
);

export const useNotes = () => useNotesStore((state) => state.data);
export const useCreateNote = () => useNotesStore((state) => state.createNote);
export const useUpdateNote = () => useNotesStore((state) => state.updateNote);
export const useDeleteNote = () => useNotesStore((state) => state.deleteNote);
export const useInitNotes = () => useNotesStore((state) => state.init);
export const useNoteCount = () => useNotesStore((state) => state.data.length);
