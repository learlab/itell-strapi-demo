"use client";

import { logout } from "@/lib/auth/actions";
import { useSession } from "@/lib/auth/context";
import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../client-components";
import { Spinner } from "../spinner";
import { ProlificForm } from "./prolific-form";

export const AuthForm = () => {
	const { user } = useSession();
	const lastPage = useLastVisitedPageUrl();
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	// useEffect(() => {
	// 	if (session?.user) {
	// 		startTransition(() => {
	// 			toast.success("You are logged in");
	// 			if (!join_class_code) {
	// 				router.push(lastPage ?? "/");
	// 			} else {
	// 				const url = new URL("dashboard/settings", window.location.origin);
	// 				url.searchParams.append("join_class_code", join_class_code);
	// 				router.push(url.toString());
	// 			}
	// 		});
	// 	}
	// }, [session]);

	return (
		<div className="grid gap-6">
			<ProlificForm />
			<div className="relative">
				<div className="relative space-y-2 mx-auto text-sm text-center text-muted-foreground">
					<p>Social Login</p>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<GoogleLoginButton />
			</div>
			{pending && (
				<div className="flex flex-row gap-1 items-center justify-center">
					<Spinner />
					<p className="text-muted-foreground text-sm">
						Redirecting to home page
					</p>
				</div>
			)}
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
			variant={"outline"}
		>
			{pending && <Spinner className="size-4 mr-2" />}
			<span>Log out</span>
		</Button>
	);
};
