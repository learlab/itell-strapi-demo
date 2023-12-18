"use server";

import { Prisma } from "@prisma/client";
import db from "./db";
import { revalidatePath } from "next/cache";
import { SectionLocation } from "@/types/location";
import { incrementLocation } from "./location";

export const deleteSummary = async (id: string) => {
	return await db.summary.delete({
		where: {
			id,
		},
	});
};

export const createSummary = async (input: Prisma.SummaryCreateInput) => {
	return await db.summary.create({
		data: input,
	});
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
	revalidatePath(".");
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

export const incrementUserLocation = async (
	userId: string,
	location: SectionLocation,
) => {
	const user = await db.user.findUnique({ where: { id: userId } });
	if (user) {
		const newLocation = incrementLocation(location);
		return await db.user.update({
			where: {
				id: userId,
			},
			data: {
				module: newLocation.module,
				chapter: newLocation.chapter,
				section: newLocation.section,
			},
		});
	}
};

export const getUserLocationSummaryCount = async (
	userId: string,
	location: SectionLocation,
) => {
	return await db.summary.count({
		where: {
			userId,
			module: location.module,
			chapter: location.chapter,
			section: location.section,
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

export const createNote = async (
	data: Prisma.NoteCreateInput,
	revalidate = true,
) => {
	await db.note.create({ data });

	if (revalidate) {
		revalidatePath(".");
	}
};

export const updateNote = async (id: string, data: Prisma.NoteUpdateInput) => {
	await db.note.update({ where: { id }, data });

	revalidatePath(".");
};
