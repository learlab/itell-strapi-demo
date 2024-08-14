import { Mdx } from "@/components/mdx";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { Image } from "@itell/ui/client";
import { notFound } from "next/navigation";
import { guides } from "velite/generated";
export default async function () {
	const { user } = await getSession();
	const userCondition = user?.condition || Condition.STAIRS;
	const guide = guides.find((g) => g.condition === userCondition);

	if (!guide) {
		return notFound();
	}

	return (
		<>
			<h2 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight mb-4 text-center text-balance">
				iTELL User Guide
			</h2>
			<Mdx components={{ Image }} code={guide.code} />
		</>
	);
}
