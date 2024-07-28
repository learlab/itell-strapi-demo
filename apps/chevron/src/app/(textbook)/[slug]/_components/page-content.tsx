import { MainMdx } from "@/components/mdx";
import { Elements } from "@/lib/constants";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return <MainMdx title={title} code={code} id={Elements.PAGE_CONTENT} />;
};
