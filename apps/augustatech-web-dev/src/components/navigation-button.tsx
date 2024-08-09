"use client";

import { useDebounce } from "@itell/core/hooks";
import { Button, StatusButton } from "@itell/ui/client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
	children: React.ReactNode;
	href: string;
}

export const NavigationButton = ({
	children,
	href,
	onClick,
	...props
}: Props) => {
	const [pending, startTransition] = useTransition();
	const isPending = useDebounce(pending, 100);
	const router = useRouter();
	return (
		<StatusButton
			pending={isPending}
			size={"lg"}
			onClick={(e) => {
				startTransition(() => {
					onClick?.(e);
					router.push(href);
				});
			}}
			{...props}
		>
			{children}
		</StatusButton>
	);
};
