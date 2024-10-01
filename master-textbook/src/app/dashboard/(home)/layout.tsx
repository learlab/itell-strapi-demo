import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { redirectWithSearchParams } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/tabs";

type Props = {
	children: React.ReactNode;
	teacher: React.ReactNode;
};

export default async function ({ children, teacher }: Props) {
	const { user } = await getSession();
	if (!user) {
		return redirectWithSearchParams("auth");
	}

	const [data, error] = await getTeacherAction({ userId: user.id });

	if (!data || error) {
		return <>{children}</>;
	}

	return (
		<Tabs defaultValue="class">
			<TabsList className="grid max-w-96 grid-cols-2">
				<TabsTrigger value="class">Class</TabsTrigger>
				<TabsTrigger value="personal">Personal</TabsTrigger>
			</TabsList>
			<TabsContent value="class">{teacher}</TabsContent>
			<TabsContent value="personal">{children}</TabsContent>
		</Tabs>
	);
}
