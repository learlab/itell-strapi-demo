"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
export default function ShowToast() {
	const searchParams = useSearchParams();
	const { data: session } = useSession();

	useEffect(() => {
		if (searchParams) {
			const isAuthRedirect = searchParams.get("auth-redirect");
			if (session?.user && isAuthRedirect) {
				toast.success("Successfully signed in!");
			}
		}
	}, [searchParams, session]);

	return null;
}
