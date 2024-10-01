import { SiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { allPagesSorted } from "@/lib/pages";
import { Elements } from "@itell/constants";
import Image from "next/image";
import Link from "next/link";
import { CommandMenu } from "./command-menu";
import { ContinueReading } from "./continue-reading";
import { MobileNav } from "./mobile-nav";
import { ScrollProgress } from "./scroll-progress";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserAccountNav } from "./user-account-nav";

type Props = {
	scrollProgress?: boolean;
	read?: boolean;
};

export const TextbookNav = async ({ scrollProgress, read }: Props) => {
	const { user } = await getSession();

	return (
		<SiteNav mainContentId={Elements.TEXTBOOK_MAIN}>
			<div className="flex h-[var(--nav-height)] px-6 items-center justify-between sm:space-x-0">
				<div className="flex gap-4 items-center">
					<Link href="/" className="flex items-center gap-6">
						<Image
							src="/images/itell.svg"
							alt="itell logo"
							width={24}
							height={32}
						/>
						<span className="hidden font-bold md:inline-block">
							{SiteConfig.title}
						</span>
					</Link>
					{read && (
						<ContinueReading
							className="hidden md:block w-28"
							text="Read"
							variant="outline"
							size={"default"}
						/>
					)}
					<MobileNav
						items={allPagesSorted.map((page) => ({
							title: page.title,
							href: page.href,
						}))}
					/>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<CommandMenu />
					<ThemeToggle />
					<UserAccountNav user={user} />
				</div>
			</div>

			{scrollProgress && <ScrollProgress />}
		</SiteNav>
	);
};
