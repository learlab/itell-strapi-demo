"use client";

import { Count, useNotesStore } from "@/lib/store";
import { useEffect } from "react";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/client-components";
import pluralize from "pluralize";

type Props = {
	count: Count;
};

// rendered by NoteList to set the count in the store
export const SetNoteCount = (props: Props) => {
	const setCount = useNotesStore((store) => store.setCount);

	useEffect(() => {
		setCount(props.count);
	}, []);

	return null;
};

// rendered by TocSidebar
export const NoteCount = () => {
	const count = useNotesStore((store) => store.count);
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button variant="link" className="pl-0">
					{`${pluralize("note", count.note, true)}, ${pluralize(
						"highlight",
						count.highlight,
						true,
					)}`}
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-40 text-sm">
				<div>Leave a note or highlight by selecting the text</div>
			</HoverCardContent>
		</HoverCard>
	);
};
