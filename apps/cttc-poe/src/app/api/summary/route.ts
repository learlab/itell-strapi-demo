import { NewSummary, summaries } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { incrementUserPage } from "@/lib/user/actions";

export type NewSummaryInput = NewSummary & { shouldUpdateUser: boolean };

export const POST = async (req: Request) => {
	const input = (await req.json()) as NewSummaryInput;

	try {
		await db.insert(summaries).values(input);
		let nextSlug: string | null = null;
		if (input.shouldUpdateUser) {
			nextSlug = await incrementUserPage(input.userId, input.pageSlug);
		}
		return Response.json({ nextSlug }, { status: 200 });
	} catch (err) {
		return new Response(String(err), { status: 500 });
	}
};
