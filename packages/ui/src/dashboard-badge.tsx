import { cn } from "@itell/utils";

import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import { Skeleton } from "./skeleton.js";

type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function DashboardBadge({ title, icon, className, children }: Props) {
  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium lg:text-lg">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

DashboardBadge.Skeleton = function () {
  return <Skeleton className="h-40" />;
};
DashboardBadge.Skeletons = ({ num = 4 }: { num?: number }) =>
  Array.from(Array(num)).map(() => <DashboardBadge.Skeleton key={num} />);
