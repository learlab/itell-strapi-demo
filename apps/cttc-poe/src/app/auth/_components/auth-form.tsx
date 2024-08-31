"use client";

import { logout } from "@/lib/auth/actions";
import { Button } from "@itell/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ProlificForm } from "./prolific-form";

export const AuthForm = () => {
	return (
		<div className="grid gap-4 px-4">
			<ProlificForm />
			<div className="relative">
				<div className="relative space-y-2 mx-auto text-sm text-center text-muted-foreground">
					<p>Social Login</p>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<GoogleLoginButton />
			</div>
		</div>
	);
};

export const GoogleLoginButton = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					router.push("/auth/google");
				});
			}}
			variant={"outline"}
			disabled={pending}
			pending={pending}
		>
			<span className="inline-flex items-center gap-2">
				<Image
					alt="Google Icon"
					src="/icons/google.png"
					width={16}
					height={16}
				/>
				<span>Google</span>
			</span>
		</Button>
	);
};

export const LoginButton = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					router.push("/auth");
				});
			}}
			variant={"outline"}
			disabled={pending}
			pending={pending}
		>
			Log in
		</Button>
	);
};

export const LogoutButton = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<Button
			onClick={() => {
				startTransition(async () => {
					await logout();
					router.push("/auth");
				});
			}}
			disabled={pending}
			variant={"outline"}
			pending={pending}
		>
			Log out
		</Button>
	);
};
