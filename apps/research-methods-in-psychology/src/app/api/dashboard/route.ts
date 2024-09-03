import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { SIDEBAR_ROLE_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: Request) => {
	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}
	const teacher = await getTeacherAction({ userId: user.id });
	const isTeacher = Boolean(teacher);

	return redirect(
		isTeacher
			? cookies().get(SIDEBAR_ROLE_COOKIE)?.value === "student"
				? "/dashboard"
				: "/dashboard/teacher"
			: "/dashboard",
	);
};
