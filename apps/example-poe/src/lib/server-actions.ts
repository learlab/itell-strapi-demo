"use server";

import { Prisma } from "@prisma/client";
import db from "./db";

export const deleteSummary = async (id: string) => {
	return await db.summary.delete({
		where: {
			id,
		},
	});
};

export const deleteNote = async (id: string) => {
	return await db.note.delete({
		where: {
			id,
		},
	});
};

export const createConstructedResponse = async (
	input: Prisma.ConstructedResponseCreateInput,
) => {
	return await db.constructedResponse.create({
		data: input,
	});
};

export const createConstructedResponseFeedback = async (
	input: Prisma.ConstructedResponseFeedbackCreateInput,
) => {
	return await db.constructedResponseFeedback.create({
		data: input,
	});
};

export const updateUserWithClassId = async ({
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

export const createEvent = async (input: Prisma.EventCreateInput) => {
	return await db.event.create({
		data: input,
	});
};

export const createFocusTime = async (input: Prisma.FocusTimeCreateInput) => {
	return await db.focusTime.create({
		data: input,
	});
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
