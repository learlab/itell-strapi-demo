import { MainMdx } from "./mdx";

export const PageContent = ({ code }: { code: string }) => {
	return <MainMdx code={code} id="page-content" />;
};
