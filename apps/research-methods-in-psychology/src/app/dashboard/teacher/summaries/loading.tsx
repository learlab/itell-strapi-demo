import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { Card, CardContent } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { SummaryItemSkeleton } from "@summaries/summary-list";

export default function () {
	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.summaries.title}
				text={Meta.summaries.description}
			/>
			<Card>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<p className="font-semibold text-lg text-center">
							All Summaries from Class
						</p>
						<div className="flex items-center justify-center">
							<Skeleton className="aspect-square h-[300px]" />
						</div>
					</div>
					<div className="flex items-center flex-col sm:flex-row justify-between p-2">
						<Skeleton className="h-12 w-[300px]" />
						<Skeleton className="h-12 w-[150px]" />
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
