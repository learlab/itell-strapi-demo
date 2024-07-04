import { Condition } from "@/lib/control/condition";
import { allGuides } from "contentlayer/generated";
import { MainMdx } from "../mdx";
import { Accordion, AccordionItem } from "../ui/accordion";

export const SummaryDescription = ({ condition }: { condition: string }) => {
	const guideCondition =
		condition === Condition.STAIRS
			? "summary_description_stairs"
			: condition === Condition.RANDOM_REREAD
				? "summary_description_reread"
				: undefined;
	const guide = allGuides.find((g) => g.condition === guideCondition);
	if (!guide) return null;

	return (
		<MainMdx code={guide.body.code} components={{ Accordion, AccordionItem }} />
	);
};
