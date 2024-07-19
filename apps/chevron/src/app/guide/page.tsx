import { MainMdx } from "@/components/mdx";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { Guide, allGuides } from "contentlayer/generated";
export default async function () {
	const { user } = await getSession();
	const userCondition = user?.condition || Condition.STAIRS;
	const guide = allGuides.find((g) => g.condition === userCondition) as Guide;

	return (
		<>
			<h2 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight mb-4 text-center text-balance">
				iTELL User Guide
			</h2>
			<MainMdx code={guide.body.code} />
		</>
	);
}
