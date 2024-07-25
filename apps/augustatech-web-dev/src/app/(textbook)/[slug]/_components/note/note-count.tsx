"use client";

import { useNotesStore } from "@/lib/store/note";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/client";
import pluralize from "pluralize";

export const NoteCount = () => {
	const { highlights, notes } = useNotesStore();

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<span>
						{`${pluralize("note", notes.length, true)}, ${pluralize(
							"highlight",
							highlights.length,
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
