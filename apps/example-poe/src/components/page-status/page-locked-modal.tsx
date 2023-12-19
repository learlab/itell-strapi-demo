"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "../client-components";
import { isProduction } from "@/lib/constants";
import { makePageHref } from "@/lib/utils";

type Props = {
	userPageSlug: string | null;
};

export const PageLockedModal = ({ userPageSlug }: Props) => {
	const [open, setOpen] = useState(true);
	const href = makePageHref(userPageSlug || "what-is-law");
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				if (!isProduction) {
					setOpen(false);
				}
			}}
		>
			<DialogContent canClose={!isProduction}>
				<DialogHeader>
					<DialogTitle>You haven't unlocked this chapter yet</DialogTitle>
				</DialogHeader>
				<div>
					Submit a passing summary for
					<Link href={href} className="mx-1 underline font-semibold">
						<span> this page </span>
					</Link>
					first.
				</div>
				<DialogFooter>
					<Button>
						<Link href={href}>Go to page</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
