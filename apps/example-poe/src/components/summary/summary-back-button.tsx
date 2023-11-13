"use client";

import Link from "next/link";
import { buttonVariants } from "@itell/ui/server";
import { ChevronLeft } from "lucide-react";

export const SummaryBackButton = () => {
	return (
		<Link
			href={"/dashboard/summaries"}
			className={buttonVariants({ variant: "ghost" })}
		>
			<ChevronLeft className="w-4 h-4" />
			Back
		</Link>
	);
};
