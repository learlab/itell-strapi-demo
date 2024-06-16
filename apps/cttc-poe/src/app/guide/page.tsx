import { MainMdx } from "@/components/mdx";
import { userGuide, userGuideSimple, userGuideReread } from "contentlayer/generated";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";

const { user } = await getSession();
const userCondition = user?.condition || Condition.STAIRS;

if (userCondition === Condition.STAIRS) {
  targetGuide = userGuide;
} else if (userCondition === Condition.RANDOM_REREAD) {
  targetGuide = userGuideReread;
} else if (userCondition === Condition.SIMPLE) {
  targetGuide = userGuideSimple;
}

export default function () {
	return (
		<article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
			<h2 className="mb-4 text-center">iTELL User Guide</h2>
			<MainMdx code={targetGuide.body.code} />
		</article>
	);
}
