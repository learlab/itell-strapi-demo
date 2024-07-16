import { getSession } from "@/lib/auth";
import { isTeacher } from "@/lib/user/teacher";
import { redirectWithSearchParams } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/client";
import React from "react";

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

	const userIsTeacher = await isTeacher(user.id);

	if (!userIsTeacher) {
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
