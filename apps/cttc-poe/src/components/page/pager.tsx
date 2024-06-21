"use client";
import { useSession } from "@/lib/auth/context";
import { allPagesSorted } from "@/lib/pages";
import { PageData, getPageData } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { BanIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const getPagerLinks = ({
	pageIndex,
	userPageSlug,
}: { pageIndex: number; userPageSlug: string | null }) => {
	const userPage = getPageData(userPageSlug);
	const links: { prev: PageLinkData | null; next: PageLinkData | null } = {
		prev: pageIndex > 0 ? getPageLink(pageIndex - 1, userPage) : null,
		next:
			pageIndex < allPagesSorted.length - 1
				? getPageLink(pageIndex + 1, userPage)
				: null,
	};

	return links;
};

const getPageLink = (
	index: number,
	userPage: PageData | null,
): PageLinkData | null => {
	const page = allPagesSorted[index];
	if (!page) return null;

	const disabled = userPage ? userPage.index < index : index !== 0 && index > 1;
	return {
		text: page.title,
		href: page.url,
		disabled,
	};
};

export type PageLinkData = {
	text: string;
	href: string;
	disabled: boolean;
	icon?: React.ReactNode;
};
const PageLink = ({
	href,
	disabled,
	children,
}: { href: string; disabled: boolean; children: React.ReactNode }) => {
	return (
		<Link
			className={cn(
				buttonVariants({ variant: "outline" }),
				"flex items-center h-14 max-w-sm text-balance gap-2",
				{ "pointer-events-none opacity-50": disabled },
			)}
			href={href}
		>
			{children}
		</Link>
	);
};

type Props = {
	pageIndex: number;
};

export const Pager = ({ pageIndex }: Props) => {
	const { user } = useSession();
	const { prev, next } = getPagerLinks({
		pageIndex,
		userPageSlug: user?.pageSlug || null,
	});
	return (
		<div
			className={cn("flex flex-row items-center justify-between mt-5 pager", {
				"justify-end": next && !prev,
				"justify-start": prev && !next,
			})}
		>
			{prev && (
				<PageLink href={prev.href} disabled={prev.disabled}>
					{prev.disabled ? (
						<BanIcon className="size-4 shrink-0" />
					) : (
						<ChevronLeftIcon className="size-4 shrink-0" />
					)}
					<span className="line-clamp-2">{prev.text}</span>
				</PageLink>
			)}
			{next && (
				<PageLink href={next.href} disabled={next.disabled}>
					<span className="line-clamp-2">{next.text}</span>
					{next.disabled ? (
						<BanIcon className="size-4 shrink-0" />
					) : (
						<ChevronRightIcon className="size-4 shrink-0" />
					)}
				</PageLink>
			)}
		</div>
	);
};
