"use client";

import { SelectNoteCount, noteStore } from "@/lib/store/note-store";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/client";
import { useSelector } from "@xstate/store/react";
import pluralize from "pluralize";

export const NoteCount = () => {
	const count = useSelector(noteStore, SelectNoteCount);

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<span>{`${pluralize("note", count, true)}`}</span>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				<p>
					You can take note by selecting text and click the "take note" button.
				</p>
			</HoverCardContent>
		</HoverCard>
	);
};
