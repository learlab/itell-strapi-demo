"use client";

import { createHighlightListeners, deleteHighlightListener } from "@/lib/note";
import { useNotesStore } from "@/lib/store/note";
import {
  createNoteElements,
  deserializeRange,
  removeHighlights,
} from "@itell/core/note";
import React from "react";
import { useEffect } from "react";
import { NoteDelete } from "./node-delete";
import { deleteNote } from "@/lib/server-actions";
type Props = {
  id: string;
  color: string;
  range: string;
};

export const Highlight = React.memo(({ id, color, range }: Props) => {
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  console.log(range, deserializeRange(range));
  useEffect(() => {
    try {
      createNoteElements({
        id,
        range: deserializeRange(range),
        color,
        isHighlight: true,
      });
      createHighlightListeners(id, (event) => {
        deleteHighlightListener(event, setOpenDeleteModal);
      });
    } catch (err) {
      console.error("create highlight error", err);
    }
  }, []);

  const handleDelete = () => {
    removeHighlights(id);
    deleteNote(id);
    setOpenDeleteModal(false);
  };

  return (
    <NoteDelete
      open={openDeleteModal}
      onOpenChange={(val) => setOpenDeleteModal(false)}
      onDelete={handleDelete}
      isNote={false}
    />
  );
});
