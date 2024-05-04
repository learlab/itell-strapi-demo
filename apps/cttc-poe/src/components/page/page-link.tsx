import { makePageHref } from "@/lib/utils";
import Link, { LinkProps } from "next/link";

interface Props {
	pageSlug: string;
	children: React.ReactNode;
	className?: string;
	chunkSlug?: string;
}

export const PageLink = ({
	children,
	pageSlug,
	chunkSlug,
	className,
}: Props) => {
	return (
		<Link href={makePageHref(pageSlug, chunkSlug)} className={className}>
			{children}
		</Link>
	);
};
