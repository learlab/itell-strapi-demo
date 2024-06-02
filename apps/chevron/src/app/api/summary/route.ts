import { NewSummary, summaries, users } from "@/drizzle/schema";
import { db, findUser } from "@/lib/db";
import { isLastPage, isPageAfter, nextPage } from "@/lib/pages";
import { setUserPageSlug } from "@/lib/user/page-slug";
import { eq } from "drizzle-orm";

export type NewSummaryInput = NewSummary & { shouldUpdateUser: boolean };

export const POST = async (req: Request) => {
	const input = (await req.json()) as NewSummaryInput;

	try {
		await db.insert(summaries).values(input);
		if (input.shouldUpdateUser) {
			const user = await findUser(input.userId);
			// optionally increment user slug
			if (user) {
				const nextSlug = nextPage(input.pageSlug);
				const shouldUpdateUserPageSlug = isPageAfter(nextSlug, user.pageSlug);
				// only update a slug if user's slug is not greater
				if (shouldUpdateUserPageSlug) {
					setUserPageSlug(nextSlug);
				}
				await db
					.update(users)
					.set({
						pageSlug: shouldUpdateUserPageSlug ? nextSlug : undefined,
						finished: isLastPage(input.pageSlug),
					})
					.where(eq(users.id, input.userId));
			}
		}
		return new Response("summary created", { status: 200 });
	} catch (err) {
		return new Response(String(err), { status: 500 });
	}
};
