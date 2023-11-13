"use client";
import React from "react";

import {
	Accordion as BaseAccordion,
	AccordionContent as BaseAccordionContent,
	AccordionItem as BaseAccordionItem,
	AccordionTrigger as BaseAccordionTrigger,
} from "./accordion";

type Props = {
	children: React.ReactNode;
	value: string[] | string;
	className?: string;
};

export const AccordionItem = ({
	value,
	title,
	children,
}: { value: string; title?: string; children: React.ReactNode }) => {
	return (
		<BaseAccordionItem value={value}>
			{/* radix accordion title uses h3, which is too large in mdx components */}
			<BaseAccordionTrigger className="text-lg py-1">
				{title || value}
			</BaseAccordionTrigger>
			<BaseAccordionContent>
				<div className="font-light leading-relaxed">{children}</div>
			</BaseAccordionContent>
		</BaseAccordionItem>
	);
};

export const Accordion = ({ children, value, className }: Props) => {
	if (typeof value === "string") {
		value = [value];
	}
	return (
		<BaseAccordion type="multiple" defaultValue={value} className={className}>
			{children}
		</BaseAccordion>
	);
};
