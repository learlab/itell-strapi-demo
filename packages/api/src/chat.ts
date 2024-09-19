import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createChatRouter = ({
	apiUrl,
	fetcher,
}: { apiUrl: string; fetcher: typeof fetch }) => {
	return new Hono()
		.post(
			"/",
			zValidator(
				"json",
				z.object({
					page_slug: z.string(),
					message: z.string(),
					history: z
						.array(
							z.object({
								agent: z.string(),
								text: z.string(),
							}),
						)
						.optional(),
					current_chunk: z.string().optional().nullable(),
					summary: z.string().optional(),
				}),
			),
			async (c) => {
				const json = c.req.valid("json");
				const response = await fetcher(`${apiUrl}/chat`, {
					method: "POST",
					body: JSON.stringify(json),
					headers: {
						"Content-Type": "application/json",
					},
				});
				return response;
			},
		)
		.post(
			"/stairs",
			zValidator(
				"json",
				z.object({
					page_slug: z.string(),
					message: z.string(),
					history: z
						.array(
							z.object({
								agent: z.string(),
								text: z.string(),
							}),
						)
						.optional(),
					current_chunk: z.string(),
					summary: z.string().optional(),
				}),
			),
			async (c) => {
				const json = c.req.valid("json");
				const response = await fetcher(`${apiUrl}/chat/SERT`, {
					method: "POST",
					body: JSON.stringify(json),
					headers: {
						"Content-Type": "application/json",
					},
				});
				return response;
			},
		);
};
