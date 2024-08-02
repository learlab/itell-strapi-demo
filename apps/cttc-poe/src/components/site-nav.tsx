import { cn } from "@itell/utils";

import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export const SiteNav = ({ children, className, ...rest }: Props) => {
	return (
		<header
			id="site-nav"
			className={cn(
				"sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				className,
			)}
			{...rest}
		>
			{children}
		</header>
	);
};
