import { MainMdx } from "@/components/mdx";
import { userGuide } from "contentlayer/generated";

export default function () {
	return (
		<>
			<h2 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight mb-4 text-center text-balance">
				iTELL User Guide
			</h2>
			<MainMdx code={userGuide.body.code} />
		</>
	);
}
