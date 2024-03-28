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
    highlights: NoteCard[];
}

interface State extends Props {
    createNote: (note: CreateNoteInput, theme?: string) => void;
    updateNote: (note: UpdateNoteInput) => void;
    deleteNote: (id: string) => void;
    createHighlight: (note: CreateNoteInput) => void;
    deleteHighlight: (id: string) => void;
}

export const useNotesStore = create(
    immer<State>((set) => ({
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
        createHighlight: ({ id, y, highlightedText, color, range }) =>
            set((state) => {
                state.highlights.push({
                    id,
                    y,
                    highlightedText,
                    noteText: "",
                    color,
                    range,
                });
            }),
        deleteHighlight: (id) =>
            set((state) => {
                const index = state.highlights.findIndex((n) => n.id === id);
                if (index !== -1) {
                    state.highlights.splice(index, 1);
                }
            }),
    }))
);
