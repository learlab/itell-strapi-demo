import { getSession } from "@/lib/auth";
import { countNoteHighlight } from "@/lib/note";
import { Skeleton } from "@itell/ui/server";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";
import { NoteCount } from "./note-count";

export const NoteCountLoader = async ({ pageSlug }: { pageSlug: string }) => {
	const { user } = await getSession();
	if (!user) {
		return null;
	}
	const res = await countNoteHighlight(user.id, pageSlug);

	const noteCount = res.find((r) => r.type === "note")?.count || 0;
	const highlightCount = res.find((r) => r.type === "highlight")?.count || 0;

	return (
		<HoverCard>
			<HoverCardTrigger>
				<NoteCount noteCount={noteCount} highlightCount={highlightCount} />
			</HoverCardTrigger>
			<HoverCardContent className="w-48 text-sm">
				<p>Leave a note or highlight by selecting the text</p>
			</HoverCardContent>
		</HoverCard>
	);
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
