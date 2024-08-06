import { TextbookMdx } from "@/components/mdx";
import { Elements } from "@itell/constants";
import { SandboxProvider } from "@itell/js-sandbox/provider";
import { Runner } from "@itell/js-sandbox/runner";

export const PageContent = ({
	code,
	title,
}: { code: string; title?: string }) => {
	return (
		<SandboxProvider>
			<Runner />
			<TextbookMdx aria-label={title} code={code} id={Elements.PAGE_CONTENT} />
		</SandboxProvider>
	);
};
