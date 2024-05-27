"use server";
import { cookies } from "next/headers";

export const setUserPageSlug = (val: string) =>
	cookies().set("user_page_slug", val);
export const getUserPageSlug = () =>
	cookies().get("user_page_slug")?.value || null;
