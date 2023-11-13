import { MainMdx, Mdx } from "@/components/mdx";
import { Site, allSites } from "contentlayer/generated";

const userGuide = allSites.find((doc) => doc.slug === "userguide") as Site;

export default function () {
	return (
		<article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
			<h2 className="mb-4 text-center">iTELL User Guide</h2>
			<MainMdx code={userGuide.body.code} />
		</article>
	);
}
