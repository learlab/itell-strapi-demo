import { BrandIcon } from "@/components/brand-icon";
import { ContinueReading } from "@/components/continue-reading";
import { ProseContent } from "@/components/mdx";
import { TextbookNav } from "@/components/textbook-nav";
import { SiteConfig } from "@/config/site";
import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";
import { home } from "#content";

export default async function () {
	return (
		<>
			<TextbookNav read />
			<main
				className="flex-1 px-6 md:px-10 lg:px-16 py-8 mx-auto max-w-3xl space-y-6"
				id={Elements.TEXTBOOK_MAIN}
				tabIndex={-1}
			>
				<ProseContent html={home.html} />
				<div className="flex justify-center items-center">
					<ContinueReading className="w-48" />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}

const SiteFooter = async ({ className }: React.HTMLAttributes<HTMLElement>) => {
	return (
		<footer
			id={Elements.SITE_FOOTER}
			className={cn(
				"flex items-center justify-between px-16 lg:px-32 py-8 flex-row border-t-2 border-border",
				className,
			)}
		>
			<p className="text-center text-sm leading-loose md:text-left">
				{SiteConfig.footer}
			</p>
			<a href="https://github.com/learlab/itell">
				<BrandIcon name="github/_/eee" />
				<span className="sr-only">github repository</span>
			</a>
		</footer>
	);
};
