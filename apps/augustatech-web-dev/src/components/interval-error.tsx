import { cn } from "@itell/utils";
import React from "react";

export const InternalError = ({
	className,
	children,
}: { className?: string; children?: React.ReactNode }) => {
	return (
		<div
			className={cn("text-red-500 tex-sm font-light leading-snug", className)}
		>
			{children ? (
				children
			) : (
				<p>An internal error occurred. Please try again later.</p>
			)}
		</div>
	);
};
