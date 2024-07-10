import { DashboardHeader, DashboardShell } from "@dashboard//shell";
import { UserDetails } from "@dashboard//user-details";
import { Card, CardContent, Skeleton } from "@itell/ui/server";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading="Learning Statistics"
				text="Understand your learning journey"
			/>
			<Card>
				<CardContent className="space-y-4">
					<UserDetails.Skeleton />
					<div className="space-y-4">
						<Skeleton className="h-[350px]" />
						<Skeleton className="h-[350px]" />
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
