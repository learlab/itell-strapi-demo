"use client";

import { useLocalStorage } from "@itell/core/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/client";
import React from "react";

type Props = {
	teacher: React.ReactNode;
	personal: React.ReactNode;
	tab: "class" | "personal" | undefined;
};

export const TeacherTabs = ({ teacher, personal, tab }: Props) => {
	const [value, setValue] = useLocalStorage<string>(
		"teacher-tabs",
		tab || "class",
	);

	return (
		<Tabs value={value} onValueChange={setValue}>
			<TabsList className="grid max-w-96 grid-cols-2">
				<TabsTrigger value="class">Class</TabsTrigger>
				<TabsTrigger value="personal">Personal</TabsTrigger>
			</TabsList>
			<TabsContent value="class">{teacher}</TabsContent>
			<TabsContent value="personal">{personal}</TabsContent>
		</Tabs>
	);
};
