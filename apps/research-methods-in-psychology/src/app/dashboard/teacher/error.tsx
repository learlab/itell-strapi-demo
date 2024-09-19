"use client";

import { TeacherOnly } from "@/components/teacher-only";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader heading={"Class Information"} />
			<TeacherOnly />
		</DashboardShell>
	);
}
