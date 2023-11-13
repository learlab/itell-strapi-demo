import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Skeleton,
	buttonVariants,
} from "@itell/ui/server";
import { getRecentSummaries } from "@/lib/dashboard";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

type Props = {
	uid: string;
};

export const RecentSummaries = async ({ uid }: Props) => {
	const summaries = await getRecentSummaries(uid);
	const num = summaries.length;

	return (
		<Card className="col-span-3">
			<CardHeader>
				<CardTitle>Recent Summaries</CardTitle>
				<CardDescription>
					You made {`${num} ${num > 1 ? "summaries" : "summary"} this week`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{num > 0 && (
					<div className="space-y-8">
						{summaries.slice(0, 6).map((s) => (
							<Link href={`/summary/${s.id}`} className="block group">
								<div className="flex items-center">
									<p>{`${s.chapter}.${s.section}`}</p>
									<div className="ml-4 mr-2 space-y-1">
										<p className="text-sm font-medium leading-none line-clamp-1 group-hover:underline">
											{s.text}
										</p>
										<p className="text-sm text-muted-foreground">
											{format(s.created_at, "LLL dd, y")}
										</p>
									</div>
									<div className="ml-auto font-medium">
										{s.isPassed ? (
											<CheckCircle className="w-4 h-4 stroke-info" />
										) : (
											<XCircle className="w-4 h-4 stroke-warning" />
										)}
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

RecentSummaries.Skeleton = () => <Skeleton className="col-span-3" />;
