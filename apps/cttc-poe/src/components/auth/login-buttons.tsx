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
