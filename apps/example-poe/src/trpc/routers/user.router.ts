import { z } from "zod";
import { SectionLocationSchema } from "../schema";
import { protectedProcedure, router } from "../utils";
import { incrementLocation } from "@/lib/location";

export const userRouter = router({
	getLocation: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.user.findUnique({
			select: {
				module: true,
				chapter: true,
				section: true,
			},
			where: {
				id: ctx.user.id,
			},
		});
	}),
	update: protectedProcedure
		.input(
			z.object({
				timeZone: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.user.update({
				where: {
					id: ctx.user.id,
				},
				data: input,
			});
		}),
	incrementLocation: protectedProcedure
		.input(SectionLocationSchema)
		.mutation(async ({ ctx, input }) => {
			const { id } = ctx.user;
			const newLocation = incrementLocation(input);
			const {
				module: nextModule,
				chapter: nextChapter,
				section: nextSectionNumber,
			} = newLocation;
			return await ctx.prisma.user.update({
				where: {
					id,
				},
				data: {
					module: nextModule,
					chapter: nextChapter,
					section: nextSectionNumber,
				},
			});
		}),
});
