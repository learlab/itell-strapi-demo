"use client";

import { TeacherOnly } from "@/components/teacher-only";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../../_components/shell";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.student.title}
				text={Meta.student.description}
			/>
			<TeacherOnly />
		</DashboardShell>
	);
}
