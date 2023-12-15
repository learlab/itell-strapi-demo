import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { User } from "@prisma/client";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../client-components";
import { StickyNoteIcon } from "lucide-react";
import pluralize from "pluralize";

type Props = {
	user: User;
	chapter: number;
};

export const NoteCount = async ({ user, chapter }: Props) => {
	const res = (await db.$queryRaw`
			SELECT COUNT(*),
					CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END as type
			FROM notes
			WHERE user_id = ${user.id} AND chapter = ${chapter}
			GROUP BY CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`) as {
		count: number;
		type: string;
	}[];

	const noteCount = res.find((r) => r.type === "note")?.count || 0;
	const highlightCount = res.find((r) => r.type === "highlight")?.count || 0;

	return (
		<HoverCard>
			<HoverCardTrigger>
				<Button variant={"link"} className="text-sm px-0 text-left">
					<StickyNoteIcon className="w-4 h-4 mr-1 inline" />
					<span>
						{`${pluralize("note", noteCount, true)}, ${pluralize(
							"highlight",
							highlightCount,
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
