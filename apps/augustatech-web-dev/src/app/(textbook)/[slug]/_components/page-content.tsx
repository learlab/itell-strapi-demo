import { MainMdx } from "@/components/mdx";
import { Runner } from "./sandbox/runner";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return (
		<>
			<Runner />
			<MainMdx title={title} code={code} id="page-content" />
		</>
	);
};
