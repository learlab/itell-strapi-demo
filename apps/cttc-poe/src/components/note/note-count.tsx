"use client";

import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/client-components";
import { useNotesStore } from "@/lib/store/note";
import pluralize from "pluralize";

type Props = {
	noteCount: number;
	highlightCount: number;
};

export const NoteCount = ({ noteCount, highlightCount }: Props) => {
	const { highlights, notes } = useNotesStore();

	return (
		<Button variant={"link"} className="text-sm px-0 text-left">
			<span>
				{`${pluralize("note", noteCount + notes.length, true)}, ${pluralize(
					"highlight",
					highlightCount + highlights.length,
					true,
				)}`}
			</span>
		</Button>
	);
};
