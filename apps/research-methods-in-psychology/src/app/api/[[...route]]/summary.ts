import { env } from "@/env.mjs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ifetch } from "./utils";

export const summary = new Hono()
	.post(
		"/",
		zValidator(
			"json",
			z.object({ summary: z.string(), page_slug: z.string() }),
		),
		async (c) => {
			const json = c.req.valid("json");
			const response = await ifetch(
				`${env.NEXT_PUBLIC_API_URL}/score/summary`,
				{
					method: "POST",
					body: JSON.stringify(json),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			return response;
		},
	)
	.post(
		"/stairs",
		zValidator(
			"json",
			z.object({
				page_slug: z.string(),
				summary: z.string(),
				focus_time: z.record(z.string(), z.number()).optional(),
				chat_history: z
					.array(
						z.object({
							agent: z.string(),
							text: z.string(),
						}),
					)
					.optional(),
				excluded_chunks: z.array(z.string()).optional(),
			}),
		),
		async (c) => {
			const json = c.req.valid("json");
			const response = await ifetch(
				`${env.NEXT_PUBLIC_API_URL}/score/summary/stairs`,
				{
					method: "POST",
					body: JSON.stringify(json),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			return response;
		},
	);
