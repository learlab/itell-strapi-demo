"use client";

import { useSafeSearchParams } from "@/lib/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const LoginRefresher = () => {
	const { login } = useSafeSearchParams("home");
	const router = useRouter();

	useEffect(() => {
		if (login === "true") {
			router.refresh();
		}
	}, [login]);

	return null;
};
