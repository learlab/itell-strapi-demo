import { MainMdx } from "@/components/mdx";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { Guide, allGuides } from "contentlayer/generated";
export default async function () {
	const { user } = await getSession();
	const userCondition = user?.condition || Condition.STAIRS;
	const guide = allGuides.find((g) => g.condition === userCondition) as Guide;

	return (
		<article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
			<h2 className="mb-4 text-center">iTELL User Guide</h2>
			<MainMdx code={guide.body.code} />
		</article>
	);
}
