import { makePageHref } from "@/lib/utils";
import Link from "next/link";

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
		<Link
			href={makePageHref(pageSlug, chunkSlug)}
			className={className}
			data-on-event={true}
		>
			{children}
		</Link>
	);
};
