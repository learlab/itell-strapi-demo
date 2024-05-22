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
import { GoogleLoginButton } from "../auth/auth-form";

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
			<DialogContent canClose={!isProduction} className="space-y-6">
				<DialogHeader>
					<DialogTitle>Log in to read the textbook</DialogTitle>
					<DialogDescription>
						We collects anonymous data to improve learning experience
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-center">
					<GoogleLoginButton />
				</div>
			</DialogContent>
		</Dialog>
	);
};
