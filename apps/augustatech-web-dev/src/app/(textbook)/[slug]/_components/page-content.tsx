import { MainMdx } from "@/components/mdx";
import { SandboxProvider } from "@/components/provider/sandbox-provider";
import { Runner } from "./sandbox/runner";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return (
		<SandboxProvider>
			<Runner />
			<MainMdx title={title} code={code} id="page-content" />
		</SandboxProvider>
	);
};
