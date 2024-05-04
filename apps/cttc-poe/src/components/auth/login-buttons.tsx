"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { CreateLoginButton } from "../client-components";

export const GoogleLoginButton = CreateLoginButton({
	action: async () => {
		const response = await signIn("google", {
			callbackUrl: "/",
		});
		if (response?.error) {
			console.log("google sign in error", response.error);
		}
	},
	icon: (
		<Image
			alt="Google"
			src="/icons/google.png"
			width={16}
			height={16}
			className="mr-2"
		/>
	),
	title: "Google",
});

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
			alt="outlook"
			src="/icons/outlook.png"
			width={28}
			height={28}
			className="mr-2"
		/>
	),
	title: "Outlook",
});
