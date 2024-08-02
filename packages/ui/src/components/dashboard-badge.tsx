import { cn } from "@itell/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

type Props = {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	className?: string;
};

export const DashboardBadge = ({ title, icon, className, children }: Props) => {
	return (
		<Card className={cn("flex flex-col justify-between", className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-base lg:text-lg font-medium">
					{title}
				</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
};

DashboardBadge.Skeleton = () => <Skeleton className="h-40" />;
DashboardBadge.Skeletons = ({ num = 4 }: { num?: number }) =>
	Array.from(Array(num)).map(() => <DashboardBadge.Skeleton key={num} />);
