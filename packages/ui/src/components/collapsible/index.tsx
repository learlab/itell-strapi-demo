"use client";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "../button";
import {
	Collapsible as BaseCollapsible,
	CollapsibleContent as BaseCollapsibleContent,
	CollapsibleTrigger as BaseCollapsibleTrigger,
} from "./collapsible";
import { cn } from "@itell/core/utils";

export function CollapsibleTrigger({
	children,
	icon = <ChevronsUpDown className="h-4 w-4" />,
	className,
}: { children: React.ReactNode; icon?: React.ReactNode; className?: string }) {
	return (
		<div className={cn("flex items-center justify-between px-4", className)}>
			<div className="flex-1">{children}</div>
			<BaseCollapsibleTrigger asChild>
				<Button variant="ghost" size="sm" className="w-9 p-0">
					{icon}
					<span className="sr-only">Toggle</span>
				</Button>
			</BaseCollapsibleTrigger>
		</div>
	);
}

export function CollapsibleContent({
	children,
}: { children: React.ReactNode }) {
	return (
		<BaseCollapsibleContent className="space-y-2">
			{children}
		</BaseCollapsibleContent>
	);
}

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
interface CollapsibleProps extends React.ComponentProps<any> {
	open?: boolean;
	className?: string;
	children: React.ReactNode;
}

export function Collapsible({
	open,
	children,
	className,
	...rest
}: CollapsibleProps) {
	return (
		<BaseCollapsible
			defaultOpen={open}
			className={cn("space-y-2", className)}
			{...rest}
		>
			{children}
		</BaseCollapsible>
	);
}
