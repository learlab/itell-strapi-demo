"use client";
import { Site, allSites } from "contentlayer/generated";
import { Accordion, AccordionItem } from "@/components/client-components";
import { Mdx } from "../mdx";
const description = allSites.find(
	(doc) => doc.slug === "summary-description",
) as Site;

// had to avoid using <Mdx /> for this
// so that <Mdx /> don't have to import client components

export const SummaryDescription = () => {
	return (
		<div className="summary-description prose dark:prose-invert">
			<Mdx
				code={description.body.code}
				components={{
					Accordion,
					AccordionItem,
				}}
			/>
		</div>
	);
};
