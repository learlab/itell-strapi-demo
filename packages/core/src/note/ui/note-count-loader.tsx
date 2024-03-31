import { countNoteHighlight } from "@/lib/server-actions";
import { Skeleton } from "@itell/ui/server";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";
import { NoteCount } from "./note-count";

type Props = {
	pageSlug: string;
};

export const NoteCountLoader = async ({ pageSlug }: Props) => {
	const res = await countNoteHighlight(pageSlug);

	const noteCount = res.find((r) => r.type === "note")?.count || 0;
	const highlightCount = res.find((r) => r.type === "highlight")?.count || 0;

	return <NoteCount noteCount={noteCount} highlightCount={highlightCount} />;
};

NoteCountLoader.Skeleton = () => (
	<HoverCard>
		<HoverCardTrigger>
			<Skeleton className="w-24 h-6" />
		</HoverCardTrigger>
		<HoverCardContent className="w-48 text-sm">
			<p>Leave a note or highlight by selecting the text</p>
		</HoverCardContent>
	</HoverCard>
);
