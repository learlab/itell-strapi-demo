import { ContinueReading } from "@/components/continue-reading";
import { SiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { DashboardNavMenu } from "@dashboard/nav";
import { Elements } from "@itell/constants";
import Image from "next/image";
import Link from "next/link";
import { DashboardNavItem } from "./config";

interface DashboardNavProps {
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}

export const DashboardNav = async (props: DashboardNavProps) => {
	const { user } = await getSession();

	return (
		<div className="flex gap-6 md:gap-10 justify-between h-[var(--nav-height)] px-8">
			<div className="flex gap-4 items-center">
				<Image
					src="/images/itell.svg"
					alt="itell logo"
					width={24}
					height={32}
				/>
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">
						{SiteConfig.title}
					</span>
				</Link>
				<ContinueReading
					text="Back to textbook"
					variant="outline"
					className="hidden md:block"
				/>
			</div>
			<DashboardNavMenu user={user} {...props} />
		</div>
	);
};
