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
	const { notesAdded, highlightsAdded } = useNotesStore((state) => ({
		notesAdded: state.notes.length,
		highlightsAdded: state.highlights.length,
	}));

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<span>
						{`${pluralize("note", noteCount + notesAdded, true)}, ${pluralize(
							"highlight",
							highlightCount + highlightsAdded,
							true,
						)}`}
					</span>
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				<p>Leave a note or highlight by selecting the text</p>
			</HoverCardContent>
		</HoverCard>
	);
};
