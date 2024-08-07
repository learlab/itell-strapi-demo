"use client";

import { Spinner } from "@/components/spinner";
import { logout } from "@/lib/auth/actions";
import { Button } from "@itell/ui/client";
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
		>
			{pending ? (
				<Spinner className="size-4 mr-2" />
			) : (
				<Image
					alt="Google Icon"
					src="/icons/google.png"
					width={16}
					height={16}
					className="mr-2"
				/>
			)}
			<span>Google</span>
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
		>
			{pending && <Spinner className="size-4 mr-2" />}
			<span>Log in</span>
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
		>
			{pending && <Spinner className="size-4 mr-2" />}
			<span>Log out</span>
		</Button>
	);
};
