import { HtmlRenderer } from "@/components/html-renderer";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Condition } from "@/lib/constants";
import { Elements } from "@itell/constants";
import { Image } from "@itell/ui/image";
import { guides } from "#content";

export const SummaryDescription = ({ condition }: { condition: string }) => {
	const guideCondition =
		condition === Condition.STAIRS
			? "summary_description_stairs"
			: condition === Condition.RANDOM_REREAD
				? "summary_description_reread"
				: undefined;
	const guide = guides.find((g) => g.condition === guideCondition);
	if (!guide) return null;

	return (
		<section aria-labelledby="summary-guide">
			<h2 id="summary-guide" className="sr-only">
				summary writing guide
			</h2>
			<a className="sr-only" href={`#${Elements.SUMMARY_FORM}`}>
				skip to summary submission
			</a>
			<HtmlRenderer
				className="xl:text-lg xl:leading-relaxed"
				components={{
					"i-image": Image,
					"i-accordion": Accordion,
					"i-accordion-item": AccordionItem,
				}}
				html={guide.html}
			/>
		</section>
	);
};
