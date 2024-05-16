"use server";

import { Prisma } from "@prisma/client";
import { getSessionUser } from "../auth";
import db from "../db";

export const deleteNote = async (id: string) => {
	await db.note.delete({
		where: {
			id,
		},
	});
};

export const createNote = async (
	input: Omit<Prisma.NoteCreateInput, "user">,
) => {
	const user = await getSessionUser();
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
