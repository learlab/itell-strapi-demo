"use client";
import React from "react";

import {
	Accordion as BaseAccordion,
	AccordionContent as BaseAccordionContent,
	AccordionItem as BaseAccordionItem,
	AccordionTrigger as BaseAccordionTrigger,
} from "@itell/ui/accordion";
import { cn } from "@itell/utils";

type AccordionProps = {
	className?: string;
	children: React.ReactNode;
	value?: string[] | string;
};

/**
 * Top-level accordion wrapper
 * @module Accordion
 * @param value {string | string[] | undefined} - The value of the accordion item to be expanded. If not provided, all items will be collapsed.
 * @param children - nested elements
 * @example
 * ```tsx
 * <i-accordion value="1">
 * 	<i-accordion-item value="1" title="Item 1">
 * 		<p>Item 1 content</p>
 * 	</i-accordion-item>
 * 	<i-accordion-item value="2" title="Item 2">
 * 		<p>Item 2 content</p>
 * 	</i-accordion-item>
 * </i-accordion>
 * ```
 */
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

type AccordionItemProps = React.ComponentPropsWithoutRef<
	typeof BaseAccordionItem
> & {
	value: string;
	title?: string;
	children: React.ReactNode;
	accordionTriggerClassName?: string;
	accordionContentClassName?: string;
};

/**
 * An item in the accordion
 * @module AccordionItem
 * @param value {string} - The identifier for the accordion item, must be unique inside the same accordion
 * @param title {string} - The title of the accordion item, optional. If not provided, the title will be the value.
 * @param children - nested elements
 */
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
