import { MainMdx } from "./main-mdx";
import { TrackLastVisitedChapter } from "./chapter/chapter-last-visited";

export const PageContent = ({ code }: { code: string }) => {
	return (
		<>
			<TrackLastVisitedChapter />
			<article
				className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none"
				id="page-content"
			>
				<MainMdx code={code} />
			</article>
		</>
	);
};
