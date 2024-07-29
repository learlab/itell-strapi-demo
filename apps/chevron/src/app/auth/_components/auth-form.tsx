"use client";

import { Spinner } from "@/components/spinner";
import { BrandIcon } from "@/components/ui/brand-icon";
import { logout } from "@/lib/auth/actions";
import { Button } from "@itell/ui/client";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const AuthForm = () => {
	return (
		<div className="grid gap-4 px-4">
			<div className="relative">
				<div className="relative space-y-2 mx-auto text-sm text-center text-muted-foreground">
					<p>Social Login</p>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<GoogleLoginButton />
				<OutlookLoginButton />
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
			aria-label="log in via google"
			variant={"outline"}
			disabled={pending}
		>
			<span className="flex items-center gap-2">
				{pending ? (
					<Spinner className="size-4" />
				) : (
					<BrandIcon name="google/_/eee" width={16} height={16} />
				)}
				Google
			</span>
		</Button>
	);
};

export const OutlookLoginButton = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					router.push("/auth/azure");
				});
			}}
			aria-label="log in via outlook"
			variant={"outline"}
			disabled={pending}
		>
			<span className="flex items-center gap-2">
				{pending ? (
					<Spinner className="size-4" />
				) : (
					<BrandIcon name="outlook" height={16} width={16} />
				)}
				Outlook
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
		>
			<span className="flex items-center gap-2">
				{pending ? <Spinner /> : <LogInIcon className="size-4" />}
				Log in
			</span>
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
			<span className="flex items-center gap-2">
				{pending ? <Spinner /> : <LogOutIcon className="size-4" />}
				Log out
			</span>
		</Button>
	);
};
