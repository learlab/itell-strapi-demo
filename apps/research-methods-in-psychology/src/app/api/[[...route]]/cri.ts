import { env } from "@/env.mjs";
import { zValidator } from "@hono/zod-validator";
import { ScoreSchema } from "@itell/core/question";
import { Hono } from "hono";
import { z } from "zod";
import { ifetch } from "./utils";

export const cri = new Hono()
	.post(
		"/",
		zValidator(
			"json",
			z.object({
				page_slug: z.string(),
				chunk_slug: z.string(),
				answer: z.string(),
			}),
		),
		async (c) => {
			const json = c.req.valid("json");
			const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/score/answer`, {
				method: "POST",
				body: JSON.stringify({
					page_slug: json.page_slug,
					chunk_slug: json.chunk_slug,
					answer: json.answer,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				return c.json(
					{
						error: "Failed to get cri response",
					},
					500,
				);
			}

			const parsed = ScoreSchema.safeParse(await response.json());
			if (parsed.success) {
				return c.json(parsed.data);
			}
			return c.json(
				{
					error: "Failed to parse response",
				},
				500,
			);
		},
	)
	.post(
		"/explain",
		zValidator(
			"json",
			z.object({
				page_slug: z.string(),
				chunk_slug: z.string(),
				student_response: z.string(),
			}),
		),
		async (c) => {
			const json = c.req.valid("json");
			const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/chat/CRI`, {
				method: "POST",
				body: JSON.stringify({
					page_slug: json.page_slug,
					chunk_slug: json.chunk_slug,
					student_response: json.student_response,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response;
		},
	);