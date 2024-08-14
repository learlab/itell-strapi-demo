"use client";
import React from "react";

import {
	Accordion as BaseAccordion,
	AccordionContent as BaseAccordionContent,
	AccordionItem as BaseAccordionItem,
	AccordionTrigger as BaseAccordionTrigger,
} from "@itell/ui/client";
import { cn } from "@itell/utils";

type AccordionProps = {
	className?: string;
	children: React.ReactNode;
	value: string[] | string;
};

type AccordionItemProps = React.ComponentPropsWithoutRef<
	typeof BaseAccordionItem
> & {
	value: string;
	title?: string;
	children: React.ReactNode;
	accordionTriggerClassName?: string;
	accordionContentClassName?: string;
};

export const AccordionItem = ({
	value,
	title,
	children,
	accordionTriggerClassName,
	accordionContentClassName,
	...rest
}: AccordionItemProps) => {
	return (
		<BaseAccordionItem value={value} {...rest}>
			{/* radix accordion title uses h3, which is too large in mdx components */}
			<BaseAccordionTrigger
				className={cn("text-lg py-1", accordionTriggerClassName)}
			>
				{title || value}
			</BaseAccordionTrigger>
			<BaseAccordionContent>
				<div
					className={cn(
						"font-light leading-relaxed",
						accordionContentClassName,
					)}
				>
					{children}
				</div>
			</BaseAccordionContent>
		</BaseAccordionItem>
	);
};

export const Accordion = ({ children, value, className }: AccordionProps) => {
	if (typeof value === "string") {
		value = [value];
	}
	return (
		<BaseAccordion type="multiple" defaultValue={value} className={className}>
			{children}
		</BaseAccordion>
	);
};
