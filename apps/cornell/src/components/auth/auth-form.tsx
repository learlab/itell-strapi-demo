"use client";

import { useLastVisitedPageUrl } from "@/lib/hooks/use-last-visited-page";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "../spinner";
import {GoogleLoginButton, OutlookLoginButton} from "./login-buttons";

export const AuthForm = () => {
	const searchParams = useSearchParams();
	const classId = searchParams?.get("join_class_code");
	const { data: session } = useSession();
	const lastPage = useLastVisitedPageUrl();
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			startTransition(() => {
				toast.success("You are logged in");
				if (!classId) {
					router.push(lastPage ?? "/");
				} else {
					router.push(`/dashboard/settings?join_class_code=${classId}`);
				}
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
