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

export function Accordion({ children, value, className }: AccordionProps) {
  if (typeof value === "string") {
    value = [value];
  }
  return (
    <BaseAccordion type="multiple" defaultValue={value} className={className}>
      {children}
    </BaseAccordion>
  );
}

type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof BaseAccordionItem
> & {
  value: string;
  title?: string;
  children: React.ReactNode;
  accordionTriggerClassName?: string;
  accordionContentClassName?: string;
};

export function AccordionItem({
  value,
  title,
  children,
  accordionTriggerClassName,
  accordionContentClassName,
  ...rest
}: AccordionItemProps) {
  return (
    <BaseAccordionItem value={value} {...rest}>
      {/* radix accordion title uses h3, which is too large in mdx components */}
      <BaseAccordionTrigger
        className={cn("py-1 text-lg", accordionTriggerClassName)}
      >
        {title ?? value}
      </BaseAccordionTrigger>
      <BaseAccordionContent>
        <div
          className={cn(
            "font-light leading-relaxed",
            accordionContentClassName
          )}
        >
          {children}
        </div>
      </BaseAccordionContent>
    </BaseAccordionItem>
  );
}
