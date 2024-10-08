import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { CommandMenu } from "./command-menu";
import { ContinueReading } from "./continue-reading";
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
	const { title } = await getSiteConfig();

	return (
		<SiteNav>
			<div className="flex h-[var(--nav-height)] px-6 items-center space-x-4 justify-between sm:space-x-0">
				<div className="flex gap-4 items-center">
					<Image
						src="/images/itell.svg"
						alt="itell logo"
						width={24}
						height={32}
					/>
					<Link href="/" className="hidden items-center space-x-2 md:flex">
						<span className="hidden font-bold sm:inline-block">{title}</span>
					</Link>
					{read && (
						<ContinueReading
							className="w-32"
							text="Read"
							variant="outline"
							size={"default"}
						/>
					)}
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
