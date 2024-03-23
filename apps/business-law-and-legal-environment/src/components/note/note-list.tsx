"use client";

import { useNotesStore } from "@/lib/store/note";
import { Note } from "@prisma/client";
import { Highlight } from "./highlight";
import { NoteCard } from "./note-card";

type Props = {
  notes: Note[];
  highlights: Note[];
  pageSlug: string;
};

export const NoteList = ({ notes, highlights, pageSlug }: Props) => {
  const newNotes = useNotesStore((store) => store.notes);
  const newHighlights = useNotesStore((store) => store.highlights);
  console.log(newHighlights, highlights);

  return (
    <>
      {notes.map((note) => (
        // @ts-ignore
        <NoteCard key={note.y} {...note} pageSlug={pageSlug} />
      ))}
      {highlights.map((highlight) => (
        <Highlight key={highlight.y} newHighlight={false} {...highlight} />
      ))}
      {newNotes.map((note) => (
        <NoteCard key={note.id} {...note} pageSlug={pageSlug} newNote={true} />
      ))}
      {newHighlights.map((highlight) => (
        <Highlight newHighlight={true} key={highlight.y} {...highlight} />
      ))}
    </>
  );
};
