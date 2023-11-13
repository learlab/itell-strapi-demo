import { protectedProcedure, router } from "../utils";
import { Prisma } from "@prisma/client";

export const EventRouter = router({
	createMany: protectedProcedure
		.input((input) => input as Prisma.EventCreateInput[])
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.event.createMany({
				data: input,
			});
		}),
});
