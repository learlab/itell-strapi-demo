import { SnapshotFromStore, createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

export type NoteData = {
	id: number;
	noteText: string;
	highlightedText: string;
	color: string;
	range: string;
	chunkSlug: string | null;
	updatedAt?: Date;
	local?: boolean;
};

export type CreateNoteInput = {
	id: number;
	highlightedText: string;
	color: string;
	range: string;
	chunkSlug: string | null;
};

export type UpdateNoteInput = {
	noteText?: string;
	color?: string;
};

type NoteStore = typeof noteStore;
export const noteStore = createStoreWithProducer(
	produce,
	{
		notes: [] as NoteData[],
	},
	{
		initialize: (context, event: { data: NoteData[] }) => {
			context.notes = event.data;
		},
		create: (context, event: CreateNoteInput) => {
			context.notes.push({
				id: event.id,
				highlightedText: event.highlightedText,
				noteText: "",
				color: event.color,
				range: event.range,
				chunkSlug: event.chunkSlug,
				local: true,
			});
		},
		update: (context, event: { id: number; data: UpdateNoteInput }) => {
			const note = context.notes.find((n) => n.id === event.id);
			if (note) {
				if (event.data.noteText) {
					note.noteText = event.data.noteText;
				}
				if (event.data.color) {
					note.color = event.data.color;
				}
			}
		},
		delete: (context, event: { id: number }) => {
			context.notes = context.notes.filter((n) => n.id !== event.id);
		},
	},
);

type Selector<T> = (state: SnapshotFromStore<NoteStore>) => T;
export const SelectNotes: Selector<NoteData[]> = (state) => state.context.notes;
export const SelectNoteCount: Selector<number> = (state) =>
	state.context.notes.length;
