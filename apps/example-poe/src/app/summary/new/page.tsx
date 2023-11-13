import NewSummary from "@/components/dashboard/new-summary";
import { SummaryBackButton } from "@/components/summary/summary-back-button";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@itell/core/utils";
import { buttonVariants } from "@itell/ui/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function () {
	const user = await getCurrentUser();
	if (!user) {
		return redirect("/auth");
	}

	return (
		<div className="w-[800px] mx-auto">
			<div className="flex justify-start">
				<SummaryBackButton />
			</div>
			<NewSummary />
		</div>
	);
}
