"use client";
import { InternalError } from "@/components/interval-error";
import { Meta } from "@/config/metadata";
import { Card, CardContent } from "@itell/ui/server";
import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.settings.title}
				text={Meta.settings.description}
			/>
			<Card>
				<CardContent>
					<InternalError />
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
