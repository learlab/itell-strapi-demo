"use client";
import { isProduction } from "@/lib/constants";
import { PageStatus } from "@/lib/page-status";
import { firstPage } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { LoginButton } from "@auth//auth-form";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@itell/ui/client";
import { User } from "lucia";
import Link from "next/link";
import { useState } from "react";

type Props = {
	user: User | null;
	pageStatus: PageStatus;
};

export const PageStatusModal = ({ user, pageStatus }: Props) => {
	const { latest, unlocked } = pageStatus;
	if (unlocked) {
		return null;
	}

	if (user) {
		if (latest) {
			return null;
		}

		const href = makePageHref(user.pageSlug || firstPage.slug);

		// user with locked page
		return (
			<Modal
				title="You haven't unlocked this page yet"
				userPageSlug={user.pageSlug}
			>
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
			</Modal>
		);
	}

	// no user, and page is locked
	return (
		<Modal
			title="Log in to access the textbook"
			userPageSlug={null}
			description="We collects anonymous data to improve learning experience."
		>
			<div className="flex justify-center">
				<LoginButton />
			</div>
		</Modal>
	);
};

const Modal = ({
	userPageSlug,
	title,
	description,
	children,
}: {
	userPageSlug: string | null;
	title: string;
	description?: string;
	children: React.ReactNode;
}) => {
	const [open, setOpen] = useState(true);
	const href = makePageHref(userPageSlug || firstPage.slug);

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
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
};
