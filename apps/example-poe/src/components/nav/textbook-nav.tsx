import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";
import TextbookScrollProgress from "./textbook-scroll-progress";
import SiteNav from "./site-nav";
import { getSiteConfig } from "@/lib/config";
import ThemeToggle from "../theme/theme-toggle";
import { cn } from "@itell/core/utils";
import { CommandMenu } from "../command-menu";
import { UserAccountNav } from "../user-account-nav";

type Props = {
	dashboardLink?: boolean;
};

export default async function TextbookNavbar({ dashboardLink = true }: Props) {
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
			<div className="container flex h-16 items-center space-x-4 justify-between sm:space-x-0">
				<div className="flex gap-4 items-center">
					<Link href="/" className="hidden items-center space-x-2 md:flex">
						<span className="hidden font-bold sm:inline-block">{title}</span>
					</Link>
					<Link
						href={dashboardLink ? "/dashboard" : "/chapter-0"}
						className={cn(
							buttonVariants({ variant: "outline" }),
							"flex items-center space-x-2 text-base",
						)}
					>
						<span className="font-bold sm:inline-block">
							{dashboardLink ? "Dashboard" : "Read"}
						</span>
					</Link>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<CommandMenu />
					<ThemeToggle />
					<UserAccountNav />
				</div>
			</div>

			<TextbookScrollProgress />
		</SiteNav>
	);
}
