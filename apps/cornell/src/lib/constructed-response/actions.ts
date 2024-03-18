"use server";

import { Prisma } from "@prisma/client";
import { getCurrentUser } from "../auth";
import db from "../db";

export const createConstructedResponse = async (
	input: Omit<Prisma.ConstructedResponseCreateInput, "user">,
) => {
	const user = await getCurrentUser();
	if (user) {
		return await db.constructedResponse.create({
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

export const createConstructedResponseFeedback = async (
	input: Omit<Prisma.ConstructedResponseFeedbackCreateInput, "user">,
) => {
	const user = await getCurrentUser();
	if (user) {
		return await db.constructedResponseFeedback.create({
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
