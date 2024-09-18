import { env } from "@/env.mjs";
import { zValidator } from "@hono/zod-validator";
import { ScoreSchema } from "@itell/core/question";
import { createFetchWithBearerToken } from "@itell/utils";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

const ifetch = createFetchWithBearerToken(env.ITELL_API_KEY || "");

const routes = app
	.post(
		"cri",
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
		"cri/explain",
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
	)
	.post(
		"chat",
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
			const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/chat`, {
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
		"chat/stairs",
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
			const response = await ifetch(`${env.NEXT_PUBLIC_API_URL}/chat/SERT`, {
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
		"summary",
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
		"summary/stairs",
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

export type ApiType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
