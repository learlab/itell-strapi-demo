import { getSiteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";
import TextbookNavMenu from "./textbook-nav-menu";
import { ScrollProgress } from "./textbook-scroll-progress";

export default async function TextbookNavbar() {
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
			<div className="container flex h-16 w-full items-center space-x-4 sm:justify-between sm:space-x-0">
				<Image
					src="/images/itell.svg"
					alt="itell logo"
					width={24}
					height={32}
					className="mr-2"
				/>
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">{title}</span>
				</Link>
				<TextbookNavMenu />
			</div>

			<ScrollProgress />
		</SiteNav>
	);
}
