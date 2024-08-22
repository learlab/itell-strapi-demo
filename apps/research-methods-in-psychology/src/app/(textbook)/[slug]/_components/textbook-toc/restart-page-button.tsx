"use client";
import { useQuestionStore } from "@/components/provider/page-provider";
import { Button } from "@itell/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useTransition } from "react";
import { clearSummaryLocal } from "../summary/summary-input";

export const RestartPageButton = ({ pageSlug }: { pageSlug: string }) => {
	const [pending, startTransition] = useTransition();
	const store = useQuestionStore();
	return (
		<Button
			className="flex items-center justify-start w-full p-2 xl:text-lg"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					store.send({ type: "resetPage" });
					clearSummaryLocal(pageSlug);
					window.location.reload();
				});
			}}
			disabled={pending}
			pending={pending}
		>
			<span className="flex justify-start items-center gap-2 py-2 xl:gap-4 w-full">
				<RotateCcwIcon className="size-4 xl:size-6" />
				Reset
			</span>
		</Button>
	);
};
