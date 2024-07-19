import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TeacherTabs } from "./_components/teacher-tabs";

type Props = {
	children: React.ReactNode;
	teacher: React.ReactNode;
	searchParams?: unknown;
};

export default async function ({ children, teacher, searchParams }: Props) {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("auth", searchParams);
	}

	const { tab } = routes.dashboard.$parseSearchParams(searchParams);
	const [data, error] = await getTeacherAction({ userId: user.id });

	if (!data || error) {
		return <>{children}</>;
	}

	return <TeacherTabs tab={tab} teacher={teacher} personal={children} />;
}
