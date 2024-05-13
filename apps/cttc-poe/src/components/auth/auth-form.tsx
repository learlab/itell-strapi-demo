"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { useSafeSearchParams } from "@/lib/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../spinner";
import { GoogleLoginButton } from "./login-buttons";

export const AuthForm = ({ isAdmin }: { isAdmin: boolean }) => {
	const { join_class_code } = useSafeSearchParams("auth");
	const { data: session } = useSession();
	const lastPage = useLastVisitedPageUrl();
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			startTransition(() => {
				toast.success("You are logged in");
				if (!join_class_code) {
					router.push(lastPage ?? "/");
				} else {
					const url = new URL("dashboard/settings", window.location.origin);
					url.searchParams.append("join_class_code", join_class_code);
					router.push(url.toString());
				}
			});
		}
	}, [session]);

	return (
		<div className="grid gap-6">
			<div className="relative">
				<div className="relative space-y-2 mx-auto text-sm text-center text-muted-foreground">
					<p>Log in via one of the options below</p>
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
