"use server";

import { db } from "@/actions/db";
import { events, CreateEventSchema } from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { reportSentry } from "@/lib/utils";
import { authedProcedure } from "./utils";

/**
 * Create event
 */
export const createEventAction = authedProcedure
	.createServerAction()
	.input(CreateEventSchema.omit({ userId: true }))
	.onError((err) => {
		reportSentry("create event", { error: err });
	})
	.handler(async ({ input, ctx }) => {
		if (isProduction) {
			return await db.insert(events).values({
				...input,
				userId: ctx.user.id,
			});
		}
	});
