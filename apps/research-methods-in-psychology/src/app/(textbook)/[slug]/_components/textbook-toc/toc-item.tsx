"use client";
import { isProduction } from "@/lib/constants";
import { PageStatus } from "@/lib/page-status";
import { TocPageItem } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type TocItemProps = {
	item: TocPageItem & { status: PageStatus };
	inGroup: boolean;
	activePage: string;
	onClick: (slug: string) => void;
	className?: string;
};

export const TocItem = ({
	item,
	inGroup,
	activePage,
	className,
	onClick,
}: TocItemProps) => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const { visible, label, icon } = getPageState({
		status: item.status,
		title: item.title,
	});

	return (
		<li
			className={cn(
				"transition ease-in-out duration-200 relative hover:bg-accent border-l-2",
				{
					"bg-accent": item.slug === activePage,
					"text-muted-foreground": !visible,
					"pl-2": inGroup,
				},
				className,
			)}
		>
			<button
				type="button"
				onClick={() => {
					onClick(item.slug);
					startTransition(async () => {
						router.push(makePageHref(item.slug));
					});
				}}
				disabled={pending && isProduction}
				className={cn(
					"w-full text-left text-balance inline-flex justify-between items-start text-base lg:text-lg 2xl:text-xl xl:gap-4 p-2",
					{
						"animate-pulse": pending,
						"text-base 2xl:text-lg": inGroup,
					},
				)}
				role="link"
				aria-label={label}
			>
				<span className="flex-1">{item.title}</span>
				<span className="hidden xl:inline">{icon}</span>
			</button>
		</li>
	);
};

const getPageState = ({
	status,
	title,
}: { status: PageStatus; title: string }) => {
	const visible = status.latest || status.unlocked;
	const label = `${title} - ${
		status.unlocked ? "Unlocked" : visible ? "Visible" : "Locked"
	}`;
	const icon = status.unlocked ? "✅" : status.latest ? "" : "🔒";
	return { label, icon, visible };
};
