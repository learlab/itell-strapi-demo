"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/client-components";
import { isProduction } from "@/lib/constants";
import { LoginButton } from "@auth/_components/auth-form";
import { useState } from "react";

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
						We collects anonymous data to improve learning experience.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-center">
					<LoginButton />
				</div>
			</DialogContent>
		</Dialog>
	);
};
