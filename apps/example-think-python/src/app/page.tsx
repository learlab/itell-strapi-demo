import TextbookNavbar from "@/components/nav/textbook-nav";
import { Site, allSites } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { SiteFooter } from "@/components/site-footer";
import { StartOrContinueReading } from "@/components/start-or-continue-reading";
import { MainMdx } from "@/components/main-mdx";

const home = allSites.find((doc) => doc.slug === "home") as Site;

export default async function Home() {
	return (
		<section className="h-screen flex flex-col">
			<TextbookNavbar dashboardLink={false} />
			<div className="flex-1 px-6 md:px-10 lg:px-16 py-8 mx-auto max-w-3xl space-y-6">
				<MainMdx code={home.body.code} />
				<div className="flex justify-center items-center">
					<StartOrContinueReading />
				</div>
			</div>
			<SiteFooter />
		</section>
	);
}
