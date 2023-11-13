import { MainMdx } from "../mdx";
import { TrackLastVisitedSection } from "./section-last-visited";
import { MdxComponents } from "../mdx-components";

export const PageContent = ({ code }: { code: string }) => {
	return (
		<>
			<TrackLastVisitedSection />
			<article
				className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none"
				id="page-content"
			>
				<MainMdx code={code} />
			</article>
		</>
	);
};
