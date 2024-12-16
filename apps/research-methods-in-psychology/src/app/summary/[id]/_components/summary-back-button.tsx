import Link from "next/link";
import { buttonVariants } from "@itell/ui/button";
import { ChevronLeft } from "lucide-react";

export function SummaryBackButton() {
  return (
    <Link
      href="/dashboard/summaries"
      className={buttonVariants({ variant: "ghost" })}
    >
      <span className="flex items-center gap-2">
        <ChevronLeft className="size-4" />
        Back
      </span>
    </Link>
  );
}
