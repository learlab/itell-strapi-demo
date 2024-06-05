"use client";
import { useSession } from "@/lib/auth/context";
import { allPagesSorted } from "@/lib/pages";
import { PageData, getPageData } from "@/lib/utils";
import { cn } from "@itell/core/utils";
import { BanIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../client-components";

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
	disabled?: boolean;
	icon?: React.ReactNode;
};
const PageLink = ({ text, href, icon, disabled }: PageLinkData) => {
	return (
		<Button variant="outline" disabled={disabled} className="max-w-sm h-fit">
			<Link
				href={href}
				className="font-light leading-relaxed text-pretty inline-flex items-center gap-2"
			>
				{icon}
				{text}
			</Link>
		</Button>
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
			className={cn("flex flex-row items-center justify-between mt-5", {
				"justify-end": next && !prev,
				"justify-start": prev && !next,
			})}
		>
			{prev && (
				<PageLink
					text={prev.text}
					href={prev.href}
					disabled={prev.disabled}
					icon={
						prev.disabled ? (
							<BanIcon className="size-4 mr-2" />
						) : (
							<ChevronLeftIcon className="size-4 mr-2" />
						)
					}
				/>
			)}
			{next && (
				<PageLink
					text={next.text}
					href={next.href}
					disabled={next.disabled}
					icon={
						next.disabled ? (
							<BanIcon className="size-4 mr-2" />
						) : (
							<ChevronRightIcon className="size-4 mr-2" />
						)
					}
				/>
			)}
		</div>
	);
};
