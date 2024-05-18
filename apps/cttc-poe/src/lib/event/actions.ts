"use server";

import { events, FocusTimeData, focus_times } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { PgInsertValue } from "drizzle-orm/pg-core";
import { isProduction } from "../constants";
import { db, first } from "../db";

export const createEvent = async (input: PgInsertValue<typeof events>) => {
	if (!isProduction) {
		return;
	}
	return await db.insert(events).values(input);
};

export const createFocusTime = async (
	input: PgInsertValue<typeof focus_times>,
) => {
	const record = first(
		await db
			.select()
			.from(focus_times)
			.where(
				and(
					eq(focus_times.userId, input.userId),
					eq(focus_times.pageSlug, input.pageSlug),
				),
			),
	);

	if (record) {
		const newData: FocusTimeData = {};
		const updateData = input.data as FocusTimeData;
		const oldData = record.data as FocusTimeData;
		// if there are legacy chunk ids that's not present in the new data
		// they will dropped during the update
		for (const chunkId in updateData) {
			if (chunkId in oldData) {
				newData[chunkId] = oldData[chunkId] + updateData[chunkId];
			} else {
				newData[chunkId] = updateData[chunkId];
			}
		}
		await db
			.update(focus_times)
			.set({ data: newData })
			.where(
				and(
					eq(focus_times.userId, input.userId),
					eq(focus_times.pageSlug, input.pageSlug),
				),
			);
	} else {
		await db.insert(focus_times).values(input);
	}
};
