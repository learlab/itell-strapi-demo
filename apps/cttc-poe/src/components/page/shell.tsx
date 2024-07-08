import { cn } from "@itell/core/utils";

export function DashboardShell({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("grid grid-cols-1 items-start gap-8", className)}
			{...props}
		>
			{children}
		</div>
	);
}
