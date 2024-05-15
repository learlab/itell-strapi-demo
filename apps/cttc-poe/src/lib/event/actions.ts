"use server";

import { Prisma } from "@prisma/client";
import { getSessionUser } from "../auth";
import { isProduction } from "../constants";
import db from "../db";

export const createEvent = async (
	input: Omit<Prisma.EventCreateInput, "user">,
) => {
	if (!isProduction) {
		return;
	}
	const user = await getSessionUser();
	if (user) {
		return await db.event.create({
			data: {
				...input,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}
};

export const createFocusTime = async ({
	data,
	pageSlug,
}: { data: PrismaJson.FocusTimeData; pageSlug: string }) => {
	const user = await getSessionUser();
	if (user) {
		const record = await db.focusTime.findUnique({
			where: {
				userId_pageSlug: {
					userId: user.id,
					pageSlug,
				},
			},
		});

		if (record) {
			const oldData = record.data;
			const newData: PrismaJson.FocusTimeData = {};
			// if there are legacy chunk ids that's not present in the new data
			// they will dropped during the update
			for (const chunkId in data) {
				if (chunkId in oldData) {
					newData[chunkId] = oldData[chunkId] + data[chunkId];
				} else {
					newData[chunkId] = data[chunkId];
				}
			}
			await db.focusTime.update({
				where: {
					userId_pageSlug: {
						userId: user.id,
						pageSlug,
					},
				},
				data: {
					data: newData,
				},
			});
		} else {
			await db.focusTime.create({
				data: {
					userId: user.id,
					pageSlug,
					data,
				},
			});
		}
	}
};
