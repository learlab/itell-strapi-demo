import { ContinueReading } from "@/components/continue-reading";
import { SiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { DashboardNavMenu } from "@dashboard/nav";
import Image from "next/image";
import Link from "next/link";
import { DashboardNavItem } from "./config";

export const DashboardNav = async () => {
	const { user } = await getSession();

	return (
		<div className="flex gap-4 md:gap-10 justify-between h-[var(--nav-height)] px-6">
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
				<ContinueReading
					text="Back to textbook"
					variant="outline"
					className="hidden md:block"
				/>
			</div>
			<DashboardNavMenu user={user} />
		</div>
	);
};
