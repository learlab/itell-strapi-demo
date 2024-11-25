import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { ClassRole, DASHBOARD_ROLE_COOKIE } from "@/lib/constants";

export const GET = async (req: Request) => {
  const { user } = await getSession();
  if (!user) {
    return redirect("/auth");
  }
  const [teacher, _] = await getTeacherAction();
  const isTeacher = Boolean(teacher);

  if (isTeacher) {
    (await cookies()).set(DASHBOARD_ROLE_COOKIE, ClassRole.TEACHER);
  } else {
    (await cookies()).set(DASHBOARD_ROLE_COOKIE, ClassRole.STUDENT);
  }
  const redirectPath = isTeacher ? "/dashboard/teacher" : "/dashboard";
  return redirect(redirectPath);
};
