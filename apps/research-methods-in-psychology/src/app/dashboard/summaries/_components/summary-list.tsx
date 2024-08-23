"use client";
import { Summary } from "@/drizzle/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

type SummaryData = Summary & { pageTitle: string };

export const SummaryList = ({
	data,
}: {
	data: Record<string, SummaryData[]>;
}) => {
	return (
		<ol className="divide-y divide-border rounded-md border mt-4">
			{Object.entries(data).map(([title, summaries]) => (
				<Card key={title}>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<CardContent>
						<ol className="divide-y divide-border">
							{summaries.map((summary) => (
								<li key={summary.id}>
									<SummaryItem summary={summary} />
								</li>
							))}
						</ol>
					</CardContent>
				</Card>
			))}
		</ol>
	);
};

interface SummaryItemProps {
	summary: SummaryData;
}

export const SummaryItem = ({ summary }: SummaryItemProps) => {
	return (
		<Link
			href={`/summary/${summary.id}`}
			className="flex px-2 py-4 flex-col hover:bg-accent transition-all ease-out duration-150 rounded-md"
			aria-label="user summary"
		>
			<header className="flex flex-col text-sm text-muted-foreground">
				<p>{summary.createdAt.toLocaleDateString()}</p>
			</header>
			<div className="flex items-center justify-between gap-2">
				<p className="flex-1 line-clamp-2">{summary.text}</p>
				{summary.isPassed ? (
					<CheckCircle className="size-4 stroke-info" />
				) : (
					<XCircle className="size-4 stroke-warning" />
				)}
			</div>
		</Link>
	);
};

export const SummaryItemSkeleton = () => (
	<div className="p-4">
		<div className="space-y-3">
			<Skeleton className="h-5 w-2/5" />
			<Skeleton className="h-4 w-4/5" />
		</div>
	</div>
);
