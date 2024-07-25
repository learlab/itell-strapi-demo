import { MainMdx } from "@/components/mdx";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return <MainMdx title={title} code={code} id="page-content" />;
};
