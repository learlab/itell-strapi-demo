"use client";

import { InternalError } from "@/components/interval-error";
import { NavigationButton } from "@/components/navigation-button";

export default function () {
	return (
		<InternalError className="flex flex-col gap-2">
			Failed to retreive your summary at this point, please try again later
			<NavigationButton href="/home">Back to home</NavigationButton>
		</InternalError>
	);
}
