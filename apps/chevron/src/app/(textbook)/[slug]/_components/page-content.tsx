import { TextbookMdx } from "@/components/mdx";
import { Elements } from "@itell/constants";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return (
		<TextbookMdx aria-label={title} code={code} id={Elements.PAGE_CONTENT} />
	);
};
