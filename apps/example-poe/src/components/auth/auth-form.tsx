"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GoogleLoginButton, OutlookLoginButton } from "./login-buttons";
import { useEffect, useTransition } from "react";
import { Spinner } from "../spinner";

export const AuthForm = () => {
	const { data: session } = useSession();
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			startTransition(() => {
				toast.success("You are logged in");
				router.push("/");
			});
		}
	}, [session]);

	return (
		<div className="grid gap-6">
			<div className="relative">
				{/* <div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div> */}

				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Log in via one of the options below
					</span>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<OutlookLoginButton />
			</div>
			{pending && (
				<div className="flex flex-row gap-1 items-center justify-center">
					<Spinner />
					<p className="text-muted-foreground text-sm">
						Redirecting to home page ...
					</p>
				</div>
			)}
		</div>
	);
};
