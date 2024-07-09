import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryItem } from "@/components/dashboard/summary-item";
import { DashboardShell } from "@/components/page/shell";
import { Card, CardContent, Skeleton } from "@itell/ui/server";

export default function DashboardLoading() {
	return (
		<DashboardShell>
			<DashboardHeader heading="Summary" text="Manage summaries" />
			<Card>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<p className="font-semibold text-lg text-center">
							Summary Submission History
						</p>
						<div className="flex items-center justify-center">
							<Skeleton className="aspect-square h-[300px]" />
						</div>
					</div>
					<div className="flex items-center flex-col sm:flex-row gap-4 p-2">
						<Skeleton className="h-12 w-[300px]" />
						<Skeleton className="h-12 w-[150px]" />
					</div>
					<div className="divide-border-200 divide-y rounded-md border">
						<SummaryItem.Skeleton />
						<SummaryItem.Skeleton />
						<SummaryItem.Skeleton />
						<SummaryItem.Skeleton />
						<SummaryItem.Skeleton />
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
