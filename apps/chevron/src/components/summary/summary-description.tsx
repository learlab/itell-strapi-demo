import { summaryDescription } from "contentlayer/generated";
import { MainMdx } from "../mdx";
import { Accordion, AccordionItem } from "../ui/accordion";

export const SummaryDescription = () => {
	return (
		<MainMdx
			code={summaryDescription.body.code}
			components={{ Accordion, AccordionItem }}
		/>
	);
};
