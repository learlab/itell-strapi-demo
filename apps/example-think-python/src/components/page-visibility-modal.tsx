"use client";

import {
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./client-components";
import {
	DialogFooter,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Link from "next/link";
import { useChapterStatus } from "@/lib/hooks/use-chapter-status";
import { makeChapterHref } from "@/lib/utils";
import { GoogleLoginButton } from "./auth/login-buttons";

export const PageVisibilityModal = () => {
	const { status, userChapter } = useChapterStatus();
	const [open, setOpen] = useState(true);
	const isDev = process.env.NODE_ENV === "development";

	if (status === undefined || status === "unlocked" || !userChapter)
		return null;

	if (status === "unauthorized") {
		return (
			<Dialog
				open={open}
				onOpenChange={() => {
					if (isDev) {
						setOpen(false);
					}
				}}
			>
				<DialogContent canClose={isDev}>
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

	if (status === "locked") {
		const href = makeChapterHref(userChapter);
		return (
			<Dialog
				open={open}
				onOpenChange={() => {
					if (isDev) {
						setOpen(false);
					}
				}}
			>
				<DialogContent canClose={isDev}>
					<DialogHeader>
						<DialogTitle>You haven't unlocked this chapter yet</DialogTitle>
					</DialogHeader>
					<div>
						Submit a passing summary for
						<Link href={href}>
							<span className="font-medium underline">
								{` Chapter ${userChapter} `}
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
	}

	return null;
};
