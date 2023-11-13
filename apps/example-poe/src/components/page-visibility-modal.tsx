"use client";

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import Link from "next/link";
import { makeLocationHref } from "@/lib/utils";
import { useSectionStatus } from "@/lib/hooks/use-section-status";
import { GoogleLoginButton } from "./auth/login-buttons";
import { env } from "@/env.mjs";
import { useSession } from "next-auth/react";

export const PageVisibilityModal = () => {
	const { status, userLocation } = useSectionStatus();
	const [open, setOpen] = useState(true);

	if (status === undefined || status === "unlocked") return null;

	if (status === "unauthorized") {
		return (
			<Dialog
				open={open}
				onOpenChange={() => {
					if (process.env.NODE_ENV === "development") {
						setOpen(false);
					}
				}}
			>
				<DialogContent canClose={false}>
					<DialogHeader>
						<DialogTitle>Login in to view the textbook</DialogTitle>
						<DialogDescription>
							<Collapsible>
								<CollapsibleTrigger className="m-0 p-0">
									Why do I need to have an account?
								</CollapsibleTrigger>
								<CollapsibleContent>
									We collects anonymous data to improve learning experience. See{" "}
									<span className="underline">here</span> for more details.
								</CollapsibleContent>
							</Collapsible>
						</DialogDescription>
					</DialogHeader>
					<div className="mt-6">
						<GoogleLoginButton />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (status === "locked" && userLocation) {
		const href = makeLocationHref(userLocation);
		return (
			<Dialog
				open={open}
				onOpenChange={() => {
					if (process.env.NODE_ENV === "development") {
						setOpen(false);
					}
				}}
			>
				<DialogContent canClose={false}>
					<DialogHeader>
						<DialogTitle>You haven't unlocked this section yet</DialogTitle>
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
							<Link href={href}>Go to section</Link>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return null;
};
