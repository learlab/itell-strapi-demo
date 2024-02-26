"use server";

import page from "@/app/auth/page";
import { BotMessage, Message, UserMessage } from "@itell/core/chatbot";
import { SummaryResponse } from "@itell/core/summary";
import { FocusTimeEventData } from "@itell/core/types";
import { Prisma, QuizAnswer } from "@prisma/client";
import { JsonArray } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "./auth";
import { isProduction } from "./constants";
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

export const createChatMessage = async ({
	pageSlug,
	userText,
	botText,
}: {
	pageSlug: string;
	userText: string;
	botText: string;
}) => {
	const user = await getCurrentUser();
	if (user) {
		const record = await db.chatMessage.findUnique({
			select: {
				data: true,
			},
			where: {
				userId_pageSlug: {
					userId: user.id,
					pageSlug,
				},
			},
		});

		const userMessage = {
			isUser: true,
			text: userText,
		};
		const botMessage = {
			isUser: false,
			text: botText,
		};
		if (!record) {
			await db.chatMessage.create({
				data: {
					pageSlug,
					userId: user.id,
					data: [userMessage, botMessage],
				},
			});
		} else {
			const newData = [...record.data, userMessage, botMessage];
			await db.chatMessage.update({
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
		}
	}
};

export const getChatMessages = async (pageSlug: string) => {
	const user = await getCurrentUser();
	if (user) {
		const record = await db.chatMessage.findUnique({
			select: {
				data: true,
				updated_at: true,
			},
			where: {
				userId_pageSlug: {
					userId: user.id,
					pageSlug,
				},
			},
		});

		if (record) {
			return {
				updatedAt: record.updated_at,
				data: record.data,
			};
		}
	}

	return {
		updatedAt: new Date(),
		data: [],
	};
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
	if (!isProduction) {
		return;
	}
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
}: { data: PrismaJson.FocusTimeData; pageSlug: string }) => {
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

export const getNotes = async (pageSlug: string) => {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	return await db.note.findMany({
		where: {
			userId: user.id,
			pageSlug,
		},
	});
};

export const countNoteHighlight = async (pageSlug: string) => {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	return (await db.$queryRaw`
			SELECT COUNT(*),
					CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END as type
			FROM notes
			WHERE user_id = ${user.id} AND page_slug = ${pageSlug}
			GROUP BY CASE WHEN note_text IS NULL THEN 'highlight' ELSE 'note' END`) as {
		count: number;
		type: string;
	}[];
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
}: {
	pageSlug: string;
	data: {
		choices: Record<string, number[]>;
		correctCount: number;
	};
}) => {
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
