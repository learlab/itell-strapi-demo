"use client";

import { useQuestion } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { Condition } from "@/lib/constants";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { Button } from "@itell/ui/client";
import { buttonVariants } from "@itell/ui/server";
import { clearSummaryLocal } from "@textbook/summary/summary-input";
import type { Page } from "contentlayer/generated";
import { ArrowUpIcon, PencilIcon, RotateCcwIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { AdminTools } from "./admin-tools";

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
		<a
			href={href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"flex items-center justify-start  px-1 py-2 xl:text-lg",
			)}
		>
			<span className="flex items-center gap-2 xl:gap-4">
				{icon}
				{text}
			</span>
		</a>
	);
};

type Props = {
	currentPage: Page;
	userRole: string;
	userFinished: boolean;
	userPageSlug: string | null;
	condition: string;
};

export const ChapterToc = ({
	currentPage,
	userRole,
	userPageSlug,
	userFinished,
	condition,
}: Props) => {
	const pathname = usePathname();
	const [activePage, setActivePage] = useOptimistic(pathname?.slice(1));
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const navigatePage = (pageSlug: string) => {
		setActivePage(pageSlug);
		startTransition(async () => {
			router.push(makePageHref(pageSlug));
		});
	};

	return (
		<nav>
			<ol className="space-y-2 leading-relaxed tracking-tight">
				{allPagesSorted.map((p) => {
					const { latest, unlocked } = getPageStatus({
						pageSlug: p.page_slug,
						userPageSlug,
						userFinished,
					});

					const visible = latest || unlocked;

					return (
						<li
							className={cn(
								"p-1 transition ease-in-out duration-200 relative rounded-md hover:bg-accent",
								{
									"bg-accent": p.page_slug === activePage,
									"text-muted-foreground": !visible,
								},
							)}
							key={p.page_slug}
						>
							<button
								type="button"
								onClick={() => navigatePage(p.page_slug)}
								disabled={(pending || !visible) && isProduction}
								className={cn(
									"w-full text-left text-balance inline-flex justify-between items-start text-lg xl:text-xl xl:gap-4",
									{
										"animate-pulse": pending,
									},
								)}
								aria-busy={pending}
								aria-label={`${p.title} - ${
									unlocked ? "Unlocked" : visible ? "Visible" : "Locked"
								}`}
							>
								<span>{p.title}</span>
								<span aria-hidden="true">
									{unlocked ? "✅" : visible ? "" : "🔒"}
								</span>
							</button>
						</li>
					);
				})}
			</ol>
			<div className="mt-12 space-y-2" aria-label="page control">
				{isAdmin(userRole) && <AdminTools condition={condition} />}
				{currentPage.summary && condition !== Condition.SIMPLE && (
					<AnchorLink
						icon={<PencilIcon className="size-4 xl:size-6" />}
						text="Summarize"
						href="#page-summary"
					/>
				)}
				<RestartPageButton pageSlug={currentPage.page_slug} />

				<AnchorLink
					icon={<ArrowUpIcon className="size-4 xl:size-6" />}
					text="Back"
					href="#page-title"
				/>
			</div>
		</nav>
	);
};

const RestartPageButton = ({ pageSlug }: { pageSlug: string }) => {
	const [pending, startTransition] = useTransition();
	const resetPage = useQuestion((state) => state.resetPage);
	return (
		<Button
			className="flex items-center justify-start w-full p-0 xl:text-lg"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					resetPage();
					clearSummaryLocal(pageSlug);
					window.location.reload();
				});
			}}
			disabled={pending}
		>
			<span className="flex justify-start items-center gap-2 px-1 py-2 xl:gap-4 w-full">
				{pending ? (
					<Spinner className="size-4 xl:size-6 " />
				) : (
					<RotateCcwIcon className="size-4 xl:size-6" />
				)}
				Reset
			</span>
		</Button>
	);
};
