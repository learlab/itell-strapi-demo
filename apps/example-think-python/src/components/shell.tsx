import * as React from "react";

import { cn } from "@itell/core/utils";

export function DashboardShell({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("grid items-start gap-8", className)} {...props}>
			{children}
		</div>
	);
}
