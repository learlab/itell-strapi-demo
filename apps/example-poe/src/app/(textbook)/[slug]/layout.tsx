import { allPagesSorted } from "@/lib/pages";
import { Button } from "@/components/client-components";
import { notFound } from "next/navigation";
import { getModuleChapters } from "@/lib/sidebar";
import { SectionLocation } from "@/types/location";
import { PageSummary } from "@/components/summary/page-summary";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { ModuleSidebar } from "@/components/module-sidebar";
import { PageProvider } from "@/components/provider/page-provider";

export const generateStaticParams = async () => {
	return allPagesSorted.map((section) => {
		return {
			slug: section.page_slug,
		};
	});
};

export const generateMetadata = ({
	params,
}: { params: { slug: string }; modal: React.ReactNode }) => {
	const page = allPagesSorted.find((page) => page.page_slug === params.slug);
	if (page) {
		return {
			title: page.title,
			description: page.body.raw.slice(0, 100),
		};
	}
};

const AnchorLink = ({
	text,
	href,
	icon,
}: { text: string; href: string; icon: React.ReactNode }) => {
	return (
		<a href={href}>
			<Button
				size="sm"
				variant="ghost"
				className="flex items-center gap-1 mb-0 py-1"
			>
				{icon}
				{text}
			</Button>
		</a>
	);
};

export default async function ({
	children,
	modal,
	params,
}: {
	children: React.ReactNode;
	modal: React.ReactNode;
	params: { slug: string };
}) {
	const pageIndex = allPagesSorted.findIndex((section) => {
		return section.page_slug === params.slug;
	});

	if (pageIndex === -1) {
		return notFound();
	}

	const page = allPagesSorted[pageIndex];
	const pageSlug = page.page_slug;
	const requireSummary = page.summary;
	const currentLocation = page.location as SectionLocation;

	const chapters = getModuleChapters(currentLocation.module);

	return (
		<PageProvider pageSlug={pageSlug}>
			<div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 px-2">
				<aside className="module-sidebar col-span-2 sticky top-20 h-fit">
					<div className="sticky top-20">
						<ModuleSidebar
							chapters={chapters}
							currentPage={{
								chapter: page.location.chapter,
								section: page.location.section,
								url: page.url,
							}}
						/>
						<div className="mt-12 flex flex-col gap-2">
							{requireSummary && (
								<AnchorLink
									icon={<PencilIcon className="size-4" />}
									text="Write a summary"
									href="#page-summary"
								/>
							)}
							<AnchorLink
								icon={<ArrowUpIcon className="size-4" />}
								text="Back to top"
								href="#page-title"
							/>
						</div>
					</div>
				</aside>

				{children}
				{modal}
			</div>
			{requireSummary && <PageSummary pageSlug={pageSlug} />}
		</PageProvider>
	);
}
