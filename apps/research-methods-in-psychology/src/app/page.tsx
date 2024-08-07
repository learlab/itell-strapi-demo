import { ContinueReading } from "@/components/continue-reading";
import { MainMdx } from "@/components/mdx";
import TextbookNavbar from "@/components/nav/textbook-nav";
import { SiteFooter } from "@/components/site-footer";
import { home } from "contentlayer/generated";

export default async function () {
	return (
		<section className="h-screen flex flex-col">
			<TextbookNavbar read />
			<div className="flex-1 px-6 md:px-10 lg:px-16 py-8 mx-auto max-w-3xl space-y-6">
				<MainMdx code={home.body.code} />
				<div className="flex justify-center items-center">
					<ContinueReading className="w-48" />
				</div>
			</div>
			<SiteFooter />
		</section>
	);
}
