import { cn } from "@itell/utils";
import { BanIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

export type PageLinkData = {
	text: string;
	href: string;
	disabled?: boolean;
	icon?: React.ReactNode;
};
interface Props extends React.HTMLAttributes<HTMLDivElement> {
	prev: PageLinkData | null;
	next: PageLinkData | null;
}

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

export const Pager = ({ prev, next, ...rest }: Props) => {
	return (
		<div
			className={cn("flex flex-row items-center justify-between mt-5", {
				"justify-end": next && !prev,
				"justify-start": prev && !next,
			})}
			{...rest}
		>
			{prev && (
				<PageLink
					text={prev.text}
					href={prev.href}
					disabled={prev.disabled}
					icon={
						prev.icon ? (
							prev.icon
						) : prev.disabled ? (
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
						next.icon ? (
							next.icon
						) : next.disabled ? (
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
