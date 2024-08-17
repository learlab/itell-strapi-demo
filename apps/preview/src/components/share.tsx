"use client";

import { useEditor } from "@/app/home-provider";
import { rewriteSearchParams } from "@/lib/utils";
import { Button } from "@itell/ui/client";
import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

export const Share = () => {
	const { value } = useEditor();

	return (
		<Button
			className="gap-2"
			variant={"outline"}
			onClick={() => {
				const url = new URL(window.location.href);
				rewriteSearchParams(url, { text: btoa(value) });
				navigator.clipboard.writeText(url.toString());

				toast.success("Copied to clipboard");
			}}
		>
			<ShareIcon className="size-4" />
			<span>Share</span>
		</Button>
	);
};
