"use client";

import { useDebounce } from "@itell/core/hooks";
import { Button, StatusButton } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	children: React.ReactNode;
	href: string;
}

export const NavigationButton = ({ children, href, ...props }: Props) => {
	const [pending, startTransition] = useTransition();
	const pendingDebounced = useDebounce(pending, 100);
	const router = useRouter();
	return (
		<StatusButton
			pending={pendingDebounced}
			disabled={pending}
			size={"lg"}
			{...props}
			onClick={() => {
				startTransition(() => {
					router.push(href);
				});
			}}
		>
			{children}
		</StatusButton>
	);
};
