"use client";

import { useNoteCount } from "@/lib/store/note-store";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/client";
import pluralize from "pluralize";

export const NoteCount = () => {
	const count = useNoteCount();

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
