import { incrementViewHandler } from "@/actions/dashboard";
import { TextbookComponents } from "@/components/content-components";
import { HtmlRenderer } from "@/components/html-renderer";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { notFound } from "next/navigation";
import { guides } from "#content";

export default async function () {
	const { user } = await getSession();
	const userCondition = Condition.STAIRS;
	const guide = guides.find((g) => g.condition === userCondition);

	if (!guide) {
		return notFound();
	}

	// use the handler directly instead of action here because we allow
	// unauthenticated users to access this page
	incrementViewHandler(
		user?.id || "",
		"guide",
		{
			condition: userCondition,
		},
		"guide_page_view",
	);

	return (
		<>
			<h2 className="text-2xl md:text-3xl 2xl:text-4xl font-extrabold tracking-tight mb-4 text-center text-balance">
				iTELL User Guide
			</h2>
			<HtmlRenderer components={TextbookComponents} html={guide.html} />
		</>
	);
}
