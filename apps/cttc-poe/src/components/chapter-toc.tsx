"use client";

import { SessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { getPageStatus } from "@/lib/page-status";
import { tocChapters } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { Page } from "contentlayer/generated";
import { ArrowUpIcon, ChevronsUpDown, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminTools } from "./admin/admin-tools";
import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";
import { RestartPageButton } from "./page/restart-page-button";

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
			<Button variant="ghost" className="flex items-center gap-2 px-1 py-2">
				{icon}
				{text}
			</Button>
		</a>
	);
};

type Props = {
	user: SessionUser;
	currentPage: Page;
};

export const ChapterToc = ({ currentPage, user }: Props) => {
	const [activePage, setActivePage] = useState(currentPage.page_slug);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const navigatePage = (pageSlug: string) => {
		setActivePage(pageSlug);
		startTransition(async () => {
			router.push(makePageHref(pageSlug));
		});
	};

	return (
		<>
			<ol className="space-y-2">
				{tocChapters.map((chapter) => {
					return (
						<Collapsible
							key={chapter.page_slug}
							defaultOpen={currentPage.chapter === chapter.chapter}
						>
							<Link
								href={makePageHref(chapter.page_slug)}
								className="flex px-1 py-2 items-center"
							>
								<p className="text-left text-pretty">{chapter.title}</p>
								<CollapsibleTrigger asChild>
									<Button variant={"ghost"} className="p-1">
										<ChevronsUpDown className="size-4" />
										<span className="sr-only">Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</Link>
							<CollapsibleContent>
								<ol className="space-y-1 text-sm px-1">
									{chapter.items.map((item) => {
										const { isPageLatest, isPageUnlocked } = getPageStatus(
											user,
											item.page_slug,
										);
										const visible = isPageLatest || isPageUnlocked;
										return (
											<li
												className={cn(
													"py-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
													{
														"bg-accent": item.page_slug === activePage,
														"text-muted-foreground": !visible,
													},
												)}
												key={item.page_slug}
											>
												<button
													type="button"
													onClick={() => navigatePage(item.page_slug)}
													disabled={(pending || !visible) && isProduction}
													className={pending ? "animate-pulse" : ""}
												>
													<p className="text-left text-pretty">
														{item.title}
														{visible ? "" : " 🔒"}
														{isPageUnlocked ? " ✅" : ""}
													</p>
												</button>
											</li>
										);
									})}
								</ol>
							</CollapsibleContent>
						</Collapsible>
					);
				})}
			</ol>
			<div className="mt-12 space-y-2">
				{isAdmin(user) && <AdminTools />}
				<RestartPageButton pageSlug={currentPage.page_slug} />
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
