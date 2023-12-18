import { z } from "zod";
import { protectedProcedure, router } from "../utils";
import { SectionLocationSchema } from "../schema";

export const NoteRouter = router({
	getByLocation: protectedProcedure
		.input(z.object({ location: SectionLocationSchema }))
		.query(async ({ ctx, input }) => {
			const { id } = ctx.user;
			const res = await ctx.prisma.note.findMany({
				where: {
					userId: id,
					module: input.location.module,
					chapter: input.location.chapter,
					section: input.location.section,
				},
			});
			return res;
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.user;
		return await ctx.prisma.note.findMany({
			where: {
				userId: id,
			},
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				y: z.number(),
				noteText: z.string().optional(),
				highlightedText: z.string(),
				color: z.string(),
				range: z.string(),
				location: SectionLocationSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = ctx.user;
			return await ctx.prisma.note.create({
				data: {
					id: input.id,
					noteText: input.noteText,
					highlightedText: input.highlightedText,
					y: input.y,
					module: input.location.module,
					chapter: input.location.chapter,
					section: input.location.section,
					color: input.color,
					userId: id,
					range: input.range,
				},
			});
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				noteText: z.string().optional(),
				color: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.note.update({
				where: {
					id: input.id,
				},
				data: {
					noteText: input.noteText,
					color: input.color,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.note.delete({
				where: {
					id: input.id,
				},
			});
		}),
});
