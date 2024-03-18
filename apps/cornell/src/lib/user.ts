"use server";
import { cookies } from "next/headers";
import db from "./db";

export const getUser = async (userId: string) => {
	return await db.user.findUnique({
		where: {
			id: userId,
		},
	});
};

export const isTeacher = async (userId: string) => {
	const teacher = await db.teacher.findUnique({
		where: {
			id: userId,
		},
	});

	return !!teacher;
};

export const setUserPageSlug = (val: string) =>
	cookies().set("user-page-slug", val);
export const getUserPageSlug = () => cookies().get("user-page-slug")?.value;
