import { cookies } from "next/headers";
import { allPagesSorted } from "../pages";

export const isPageUnlockedWithoutUser = (slug: string) => {
	return false;
};

export const setUserPageSlug = (val: string) =>
	cookies().set("user-page-slug", val);
export const getUserPageSlug = () => cookies().get("user-page-slug")?.value;
