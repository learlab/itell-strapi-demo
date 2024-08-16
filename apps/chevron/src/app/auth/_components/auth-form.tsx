"use client";

import { BrandIcon } from "@/components/brand-icon";
import { logout } from "@/lib/auth/actions";
import { Button, Dialog, DialogContent, DialogTrigger } from "@itell/ui/client";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
	joinClassCode?: string;
};

export const AuthForm = ({ joinClassCode }: Props) => {
	return (
		<div className="grid gap-4 px-4">
			{joinClassCode && (
				<p className="font-light tracking-tight leading-relaxed">
					To join your class, please first log in via one of the following
					options.
				</p>
			)}
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
	const searchParams = useSearchParams();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					const url = new URL("/auth/google", window.location.href);
					if (searchParams) {
						for (const [key, value] of searchParams) {
							url.searchParams.set(key, value);
						}
					}
					router.push(url.toString());
				});
			}}
			aria-label="log in via google"
			variant={"outline"}
			disabled={pending}
			pending={pending}
		>
			<span className="flex items-center gap-2">
				<BrandIcon
					name="google"
					alt="log in via google"
					width={16}
					height={16}
				/>
				Google
			</span>
		</Button>
	);
};

export const OutlookLoginButton = () => {
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const searchParams = useSearchParams();

	return (
		<Button
			onClick={() => {
				startTransition(() => {
					if (searchParams) {
						const url = new URL("/auth/azure", window.location.href);
						for (const [key, value] of searchParams) {
							url.searchParams.set(key, value);
						}
						router.push(url.toString());
					}
				});
			}}
			aria-label="log in via outlook"
			variant={"outline"}
			disabled={pending}
			pending={pending}
		>
			<span className="flex items-center gap-2">
				<BrandIcon
					name="outlook"
					alt="log in via outlook"
					height={16}
					width={16}
				/>
				Outlook
			</span>
		</Button>
	);
};

export const LoginButton = () => {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant={"outline"} className="gap-2">
					<LogInIcon className="size-4" />
					Log in
				</Button>
			</DialogTrigger>
			<DialogContent>
				<AuthForm />
			</DialogContent>
		</Dialog>
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
			<span className="flex items-center gap-2">
				<LogOutIcon className="size-4" />
				Log out
			</span>
		</Button>
	);
};
