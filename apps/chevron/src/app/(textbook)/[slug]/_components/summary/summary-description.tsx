import { MainMdx } from "@/components/mdx";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Condition } from "@/lib/control/condition";
import { allGuides } from "contentlayer/generated";

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
		<MainMdx components={{ AccordionItem, Accordion }} code={guide.body.code} />
	);
};
