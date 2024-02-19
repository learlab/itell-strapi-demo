import { MainMdx } from "../mdx";

export const PageContent = ({ code }: { code: string }) => {
	return (
		<>
			<article
				className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none"
				id="page-content"
			>
				<MainMdx code={code} />
			</article>
		</>
	);
};
