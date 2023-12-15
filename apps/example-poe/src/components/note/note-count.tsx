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
import { StickyNoteIcon } from "lucide-react";

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
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<span>
						<StickyNoteIcon className="w-4 h-4 mr-1 inline" />
						{`${pluralize("note", count.note, true)}, ${pluralize(
							"highlight",
							count.highlight,
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
