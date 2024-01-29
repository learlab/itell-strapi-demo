import { env } from "@/env.mjs";
import { SummaryResponse, SummaryResponseSchema } from "@itell/core/summary";
import { decodeStream } from "@itell/core/utils";
import { parse } from "date-fns";
import db from "./db";

export const getSummaryResponse = async ({
	input,
	userId,
	pageSlug,
}: { input: string; userId: string; pageSlug: string }) => {
	"use server";
	const focusTime = await db.focusTime.findUnique({
		where: {
			userId_pageSlug: {
				userId,
				pageSlug,
			},
		},
		select: {
			data: true,
		},
	});
	const response = await fetch(
		"https://itell-api.learlab.vanderbilt.edu/score/summary/stairs",
		{
			method: "POST",
			body: JSON.stringify({
				summary: input,
				page_slug: pageSlug,
				focus_time: focusTime?.data ?? undefined,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	let summaryResponse: SummaryResponse | undefined;
	try {
		await decodeStream(response.body as ReadableStream, (data, index) => {
			const value = data.trim().split("\u0000")[0];
			const text =
				value.search("request_id") === -1
					? value
					: value.substring(0, value.search("request_id") - 2);
			const parsed = SummaryResponseSchema.safeParse(JSON.parse(text));
			if (parsed.success) {
				summaryResponse = parsed.data;
			}
		});
	} catch (err) {
		console.log("summary scoring error", err);
	}

	return { summaryResponse };
};
