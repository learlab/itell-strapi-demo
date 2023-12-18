import Link from "next/link";
import TextbookScrollProgress from "./textbook-scroll-progress";
import SiteNav from "./site-nav";
import { getSiteConfig } from "@/lib/config";
import TextbookNavMenu from "./textbook-nav-menu";

export default async function TextbookNavbar() {
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
			<div className="container flex h-16 w-full items-center space-x-4 sm:justify-between sm:space-x-0">
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">{title}</span>
				</Link>
				<TextbookNavMenu />
			</div>

			<TextbookScrollProgress />
		</SiteNav>
	);
}
