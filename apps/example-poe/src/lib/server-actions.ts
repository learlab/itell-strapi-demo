"use server";

import { SummaryResponse } from "@itell/core/summary";
import { FocusTimeEventData } from "@itell/core/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "./auth";
import db from "./db";
import { isPageAfter, nextPage } from "./location";

export const deleteSummary = async (id: string) => {
	return await db.summary.delete({
		where: {
			id,
		},
	});
};

export const createSummary = async ({
	text,
	pageSlug,
	response,
}: { text: string; pageSlug: string; response: SummaryResponse }) => {
	const user = await getCurrentUser();
	if (user) {
		return await db.summary.create({
			data: {
				text,
				pageSlug,
				isPassed: response.is_passed,
				containmentScore: response.containment,
				similarityScore: response.similarity,
				wordingScore: response.wording,
				contentScore: response.content,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});
	}
};

export const updateSummary = async (
	id: string,
	data: Prisma.SummaryUpdateInput,
) => {
	return await db.summary.update({
		where: {
			id,
		},
		data,
	});
};

export const deleteNote = async (id: string) => {
	await db.note.delete({
		where: {
			id,
		},
	});
};

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

export const updateUser = async (
	userId: string,
	data: Prisma.UserUpdateInput,
) => {
	return await db.user.update({
		where: {
			id: userId,
		},
		data,
	});
};

export const updateUserClassId = async ({
	userId,
	classId,
}: {
	userId: string;
	classId: string | null;
}) => {
	return await db.user.update({
		where: {
			id: userId,
		},
		data: {
			classId,
		},
	});
};

export const incrementUserPage = async (userId: string, pageSlug: string) => {
	const user = await db.user.findUnique({ where: { id: userId } });
	if (user) {
		const nextSlug = nextPage(pageSlug);
		// only update a slug if user's slug is not greater
		if (isPageAfter(nextSlug, user.pageSlug)) {
			await db.user.update({
				where: {
					id: userId,
				},
				data: {
					pageSlug: nextSlug,
				},
			});

			revalidatePath(".");
		}
	}
};

export const getUserPageSummaryCount = async (
	userId: string,
	pageSlug: string,
) => {
	return await db.summary.count({
		where: {
			userId,
			pageSlug,
		},
	});
};

export const getTeacherWithClassId = async (classId: string | null) => {
	if (!classId) {
		return null;
	}
	const teacher = await db.teacher.findFirst({
		where: {
			classId,
		},
	});

	if (!teacher) {
		return null;
	}

	const user = await db.user.findFirst({
		where: {
			id: teacher.id,
		},
	});

	return user;
};

export const createEvent = async (
	input: Omit<Prisma.EventCreateInput, "user">,
) => {
	const user = await getCurrentUser();
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

export const findFocusTime = async (userId: string, pageSlug: string) => {
	return await db.focusTime.findUnique({
		where: {
			userId_pageSlug: {
				userId,
				pageSlug,
			},
		},
	});
};

export const createFocusTime = async ({
	data,
	pageSlug,
}: { data: FocusTimeEventData; pageSlug: string }) => {
	const user = await getCurrentUser();
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
			const oldData = record.data as FocusTimeEventData;
			const newData: FocusTimeEventData = {};
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

export const createNote = async (
	input: Omit<Prisma.NoteCreateInput, "user">,
) => {
	const user = await getCurrentUser();
	if (user) {
		await db.note.create({
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

export const updateNote = async (id: string, data: Prisma.NoteUpdateInput) => {
	await db.note.update({ where: { id }, data });
};

export const createQuizAnswer = async ({
	pageSlug,
	data,
}: { pageSlug: string; data: Record<string, any> }) => {
	const user = await getCurrentUser();
	if (user) {
		await db.quizAnswer.create({
			data: {
				pageSlug,
				data,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		finishQuiz(pageSlug);
	}
};

const quizCookieKey = (pageSlug: string) => `quiz-${pageSlug}-finished`;

export const maybeCreateQuizCookie = (pageSlug: string) => {
	// return true if the cookie was created
	const key = quizCookieKey(pageSlug);
	const c = cookies();
	if (!c.has(key)) {
		c.set(key, "false");
		return true;
	}

	return false;
};

export const finishQuiz = (pageSlug: string) => {
	const key = quizCookieKey(pageSlug);
	const c = cookies();
	c.set(key, "true");
};

export const isPageQuizUnfinished = (pageSlug: string) => {
	const key = quizCookieKey(pageSlug);
	const c = cookies();
	if (c.has(key)) {
		return c.get(key)?.value === "false";
	}

	return false;
};
