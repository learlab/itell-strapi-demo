import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { TrpcContext } from "./trpc-context";
import { z } from "zod";
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TrpcContext>().create({
	transformer: superjson,
});

const isAuthed = t.middleware(({ next, ctx }) => {
	// ctx.session is set by `createTrpcContext`
	if (!ctx.session) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			user: ctx.session.user,
		},
	});
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
