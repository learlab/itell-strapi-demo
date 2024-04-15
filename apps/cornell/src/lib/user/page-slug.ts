import { cookies } from "next/headers";

export const isPageUnlockedWithoutUser = (slug: string) => {
	return false;
};

export const setUserPageSlug = (val: string) =>
	cookies().set("user-page-slug", val);
export const getUserPageSlug = () => cookies().get("user-page-slug")?.value;
