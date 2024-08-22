"use client";

import { useQuestionStore } from "@/components/provider/page-provider";
import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { Elements } from "@itell/constants";
import { Button, buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { clearSummaryLocal } from "@textbook/summary/summary-input";
import { ArrowUpIcon, PencilIcon, RotateCcwIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useOptimistic, useTransition } from "react";
import { Page } from "#content";
import { AdminTools } from "./admin-tools";

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
	text: string;
	href: string;
	icon: React.ReactNode;
}

const AnchorLink = ({ text, href, icon, className, ...rest }: LinkProps) => {
	return (
		<a
			href={href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"flex items-center justify-start px-1 py-2 xl:text-lg",
				className,
			)}
			{...rest}
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
		<>
			<nav aria-label="textbook primary">
				<a className="sr-only" href={`#${Elements.TEXTBOOK_MAIN}`}>
					skip to main content
				</a>
				<ol
					aria-label="list of chapters"
					className="border-l-2 leading-relaxed tracking-tight"
				>
					{allPagesSorted.map((p) => {
						const { latest, unlocked } = getPageStatus({
							pageSlug: p.slug,
							userPageSlug,
							userFinished,
						});

						const visible = latest || unlocked;

						return (
							<li
								className={cn(
									"transition ease-in-out duration-200 relative hover:bg-accent",
									{
										"bg-accent": p.slug === activePage,
										"text-muted-foreground": !visible,
									},
								)}
								key={p.slug}
							>
								<button
									type="button"
									onClick={() => navigatePage(p.slug)}
									disabled={(pending || !visible) && isProduction}
									className={cn(
										"w-full text-left text-balance inline-flex justify-between items-start text-base lg:text-lg 2xl:text-xl xl:gap-4 p-2",
										{
											"animate-pulse": pending,
										},
									)}
									role="link"
									aria-busy={pending}
									aria-label={`${p.title} - ${
										unlocked ? "Unlocked" : visible ? "Visible" : "Locked"
									}`}
								>
									<span className="flex-1">{p.title}</span>
									<span
										className="hidden xl:inline"
										aria-label={`${
											unlocked ? "Unlocked" : visible ? "Visible" : "Locked"
										}`}
									>
										{unlocked ? "✅" : visible ? "" : "🔒"}
									</span>
								</button>
							</li>
						);
					})}
				</ol>
			</nav>
			<div className="mt-12 space-y-2">
				<p className="sr-only">page control</p>
				{isAdmin(userRole) && <AdminTools condition={condition} />}
				{currentPage.summary && (
					<AnchorLink
						icon={<PencilIcon className="size-4 xl:size-6" />}
						text="Assignment"
						href={`#${Elements.PAGE_ASSIGNMENTS}`}
						aria-label="assignments for this page"
					/>
				)}
				<RestartPageButton pageSlug={currentPage.slug} />

				<AnchorLink
					icon={<ArrowUpIcon className="size-4 xl:size-6" />}
					text="Back to top"
					href={`#${Elements.PAGE_TITLE}`}
				/>
			</div>
		</>
	);
};

const RestartPageButton = ({ pageSlug }: { pageSlug: string }) => {
	const [pending, startTransition] = useTransition();
	const store = useQuestionStore();
	return (
		<Button
			className="flex items-center justify-start w-full p-0 xl:text-lg"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					store.send({ type: "resetPage" });
					clearSummaryLocal(pageSlug);
					window.location.reload();
				});
			}}
			disabled={pending}
			pending={pending}
		>
			<span className="flex justify-start items-center gap-2 px-1 py-2 xl:gap-4 w-full">
				<RotateCcwIcon className="size-4 xl:size-6" />
				Reset
			</span>
		</Button>
	);
};
