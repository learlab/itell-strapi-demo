import { ProseContent } from "@/components/mdx";
import { TextbookComponents } from "@/components/mdx-components";
import { Elements } from "@itell/constants";

export const PageContent = ({
	html,
	title,
}: { html: string; title?: string }) => {
	return (
		<ProseContent
			components={TextbookComponents}
			aria-label={title}
			html={html}
			id={Elements.PAGE_CONTENT}
		/>
	);
};
