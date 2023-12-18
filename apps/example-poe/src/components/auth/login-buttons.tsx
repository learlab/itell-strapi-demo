"use client";

import { signIn } from "next-auth/react";
import { CreateLoginButton } from "../client-components";
import Image from "next/image";

export const GoogleLoginButton = CreateLoginButton({
	action: () => {
		let res;
		try{
			res = signIn("google")
		}
		catch(e){
			console.log(e);
		}
		return res
	},
	icon: (
		<Image
			alt="Google"
			src="/icons/google.png"
			width={18}
			height={16}
			className="mr-2"
		/>
	),
	title: "Google",
});

export const OutlookLoginButton = CreateLoginButton({
	action: () => signIn("azure-ad"),
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
