import Link from "next/link";
import React from "react";

import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { DashboardNavItem } from "@/types/nav";
import { ContinueReading } from "../continue-reading";
import { DashboardNavMenu } from "./dashboard-nav-menu";

interface Props {
	items?: DashboardNavItem[];
	children?: React.ReactNode;
}

export async function DashboardNav(props: Props) {
	const { title } = await getSiteConfig();
	const { user } = await getSession();

	return (
		<div className="flex gap-6 md:gap-10 justify-between">
			<div className="flex gap-4 items-center">
				<Link href="/" className="hidden items-center space-x-2 md:flex">
					<span className="hidden font-bold sm:inline-block">{title}</span>
				</Link>
				<ContinueReading
					text="Back to textbook"
					variant="outline"
					className="w-48"
				/>
			</div>
			<DashboardNavMenu user={user} {...props} />
		</div>
	);
}
