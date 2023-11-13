import { cn } from "@itell/core/utils";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { buttonVariants } from "./button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export type PageLinkData = {
	text: string;
	href: string;
	icon?: React.ReactNode;
};
interface Props extends React.HTMLAttributes<HTMLDivElement> {
	prev: PageLinkData | null;
	next: PageLinkData | null;
}

export const PageLink = ({ text, href, icon }: PageLinkData) => {
	return (
		<Link
			href={href}
			className={cn(buttonVariants({ variant: "outline" }), "h-fit max-w-sm")}
		>
			{icon}
			<p className="font-light leading-relaxed">
				<Balancer>{text}</Balancer>
			</p>
		</Link>
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
					icon={prev.icon || <ChevronLeftIcon className="w-4 h-4 mr-2" />}
				/>
			)}
			{next && (
				<PageLink
					text={next.text}
					href={next.href}
					icon={next.icon || <ChevronRightIcon className="w-4 h-4 mr-2" />}
				/>
			)}
		</div>
	);
};
