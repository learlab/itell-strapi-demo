"use client";

import { allPagesSorted, firstPage, isPageAfter } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { Page } from "contentlayer/generated";
import { ArrowUpIcon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminTools } from "./admin/admin-tools";
import { Button } from "./client-components";
import { RestartPageButton } from "./page/restart-page-button";
import { useConfig } from "./provider/page-provider";

const AnchorLink = ({
	text,
	href,
	icon,
}: {
	text: string;
	href: string;
	icon: React.ReactNode;
}) => {
	return (
		<a href={href} className="block">
			<Button variant="ghost" className="flex items-center gap-2">
				{icon}
				{text}
			</Button>
		</a>
	);
};

type Props = {
	currentPage: Page;
	userPageSlug: string | null;
};

export const ChapterToc = ({ currentPage, userPageSlug }: Props) => {
	const [activePage, setActivePage] = useState(currentPage.page_slug);
	const [pending, startTransition] = useTransition();
	const isAdmin = useConfig((state) => state.isAdmin);
	const router = useRouter();

	const navigatePage = (pageSlug: string) => {
		startTransition(() => {
			setActivePage(pageSlug);
			router.push(makePageHref(pageSlug));
		});
	};

	return (
		<>
			<ol className="space-y-2">
				{allPagesSorted.map((page) => {
					const visible = userPageSlug
						? !isPageAfter(page.page_slug, userPageSlug)
						: page.page_slug === firstPage.page_slug;
					return (
						<li
							className={cn(
								"px-4 py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
								{
									"bg-accent": page.page_slug === activePage,
									"text-muted-foreground": !visible,
								},
							)}
							key={page.url}
						>
							<button
								type="button"
								onClick={() => navigatePage(page.page_slug)}
								disabled={pending || !visible}
							>
								<p className="text-left text-pretty">
									{page.chapter}. {page.title}
									{visible ? "" : "🔒"}
								</p>
							</button>
						</li>
					);
				})}
			</ol>
			<div className="mt-12 space-y-2">
				{isAdmin && <AdminTools />}
				<RestartPageButton />
				{currentPage.summary && (
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
		</>
	);
};
