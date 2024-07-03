import { MainMdx } from "../mdx";

export const PageContent = ({ code }: { code: string }) => {
	return (
		<>
			<article
				className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none xl:text-lg xl:leading-relaxed"
				id="page-content"
			>
				<MainMdx code={code} />
			</article>
		</>
	);
};
