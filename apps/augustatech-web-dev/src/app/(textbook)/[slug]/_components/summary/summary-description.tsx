import { MainMdx } from "@/components/mdx";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Condition, Elements } from "@/lib/constants";
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
		<aside aria-labelledby="summary-guide-heading">
			<h2 id="summary-guide-heading" className="sr-only">
				summary writing guide
			</h2>
			<a className="sr-only" href={`#${Elements.SUMMARY_FORM}`}>
				skip to summary submission
			</a>
			<MainMdx
				article={false}
				components={{ AccordionItem, Accordion }}
				code={guide.body.code}
			/>
		</aside>
	);
};
