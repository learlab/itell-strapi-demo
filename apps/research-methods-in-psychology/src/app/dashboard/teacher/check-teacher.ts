import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import "server-only";

export const checkTeacher = async () => {
	const { user } = await getSession();

	if (!user) {
		return redirect("/auth");
	}

	const [teacher, error] = await getTeacherAction();
	if (error) {
		throw new Error("failed to get teacher", { cause: error });
	}

	const isTeacher = !!teacher;
	if (!isTeacher) {
		throw new Error("teacher only");
	}

	return teacher;
};
