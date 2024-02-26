"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { CreateLoginButton } from "../client-components";

export const OutlookLoginButton = CreateLoginButton({
	action: async () => {
		try {
			await signIn("azure-ad");
		} catch (error) {
			console.log(error);
		}
	},
	icon: (
		<Image
			alt="Google"
			src="/icons/outlook.png"
			width={32}
			height={32}
			className="mr-2"
		/>
	),
	title: "Outlook",
});
