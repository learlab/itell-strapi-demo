"use server";

import { db } from "@/actions/db";
import { events, CreateEventSchema } from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { authedProcedure } from "./utils";

/**
 * Create event
 */
export const createEventAction = authedProcedure
	.input(CreateEventSchema.omit({ userId: true }))
	.handler(async ({ input, ctx }) => {
		if (isProduction) {
			return await db.insert(events).values({
				...input,
				userId: ctx.user.id,
			});
		}
	});
