import { buttonVariants } from "@itell/ui/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const SummaryBackButton = () => {
	return (
		<Link
			href={"/dashboard/summaries"}
			className={buttonVariants({ variant: "ghost" })}
		>
			<ChevronLeft className="size-4 mr-2" />
			Back
		</Link>
	);
};
