"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { isProduction } from "@/lib/constants";
import { useState } from "react";
import {GoogleLoginButton, OutlookLoginButton} from "../auth/login-buttons";

export const PageUnauthorizedModal = () => {
	const [open, setOpen] = useState(true);

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
					<DialogTitle>Log in to view the textbook</DialogTitle>
					<DialogDescription>
						We collects anonymous data to improve learning experience
					</DialogDescription>
				</DialogHeader>
				<div className="mt-6 flex justify-center">
					<GoogleLoginButton />
				</div>
			</DialogContent>
		</Dialog>
	);
};
