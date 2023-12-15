"use client";

import { useState } from "react";
import { GoogleLoginButton } from "../auth/login-buttons";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "../client-components";
import { makeLocationHref } from "@/lib/utils";
import { isProduction } from "@/lib/constants";
import { SectionLocation } from "@/types/location";

type Props = {
	userLocation: SectionLocation;
};

export const PageLockedModal = ({ userLocation }: Props) => {
	const [open, setOpen] = useState(true);
	const href = makeLocationHref(userLocation);
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
					<Link href={href}>
						<span className="font-medium underline">
							{` Chapter ${userLocation.chapter}.${userLocation.section} `}
						</span>
					</Link>
					first.
				</div>
				<DialogFooter>
					<Button>
						<Link href={href}>Go to chapter</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
