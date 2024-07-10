import { ContinueReading } from "@/components/continue-reading";
import { MainMdx } from "@/components/mdx";
import { TextbookNav } from "@/components/textbook-nav";
import { getSiteConfig } from "@/config/site";
import { cn } from "@itell/core/utils";
import { home } from "contentlayer/generated";
import { GithubIcon } from "lucide-react";

export default async function () {
	return (
		<section className="h-screen flex flex-col">
			<TextbookNav read />
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

const SiteFooter = async ({ className }: React.HTMLAttributes<HTMLElement>) => {
	const { footer } = await getSiteConfig();

	return (
		<footer className={cn("border-t-2 border-border", className)}>
			<div className="container flex items-center justify-between gap-8 py-10 h-24 flex-row">
				<p className="text-center text-sm leading-loose md:text-left">
					{footer}
				</p>
				<div>
					<a href="https://github.com/learlab/itell">
						<GithubIcon />
					</a>
				</div>
			</div>
		</footer>
	);
};
