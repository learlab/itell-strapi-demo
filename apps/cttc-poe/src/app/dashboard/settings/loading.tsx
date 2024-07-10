import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import { Separator } from "@itell/ui/client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
} from "@itell/ui/server";
import { Profile } from "@settings/profile";

export default function DashboardSettingsLoading() {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Settings"
				text="Manage account and website settings"
			/>
			<Card>
				<CardHeader className="gap-2">
					<CardTitle>Edit your settings</CardTitle>
					<CardDescription>configure the textbook to your need</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Profile.Skeleton />
					<Separator />
					<h3 className="mb-4 text-lg font-semibold leading-relaxed">
						Website Settings
					</h3>
					<Skeleton className="h-8 w-[120px]" />
					<Skeleton className="h-24 w-[400px]" />
					<Skeleton className="h-8 w-[40px]" />
					<Separator />
					<h3 className="mb-4 text-lg font-semibold leading-relaxed">
						Class Information
					</h3>
					<Skeleton className="h-8 w-[400px]" />
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
