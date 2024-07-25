import { buttonVariants } from "@itell/ui/server";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const SummaryBackButton = () => {
	return (
		<Link
			href={"/dashboard/summaries"}
			className={buttonVariants({ variant: "ghost" })}
		>
			<span className="flex items-center gap-2">
				<ChevronLeft className="size-4" />
				Back
			</span>
		</Link>
	);
};
