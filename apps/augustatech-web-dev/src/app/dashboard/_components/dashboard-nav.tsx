import { ContinueReading } from "@/components/continue-reading";
import { SiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { Elements } from "@/lib/constants";
import { DashboardNavMenu } from "@dashboard/nav";
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
		<div className="flex gap-6 md:gap-10 justify-between h-16 px-8">
			<a className="sr-only" href={`#${Elements.DASHBOARD_MAIN}`}>
				skip to main content
			</a>
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
					className="w-48 hidden md:block"
				/>
			</div>
			<DashboardNavMenu user={user} {...props} />
		</div>
	);
};