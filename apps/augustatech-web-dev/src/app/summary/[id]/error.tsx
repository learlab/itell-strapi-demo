"use client";

import { ContinueReading } from "@/components/continue-reading";
import { InternalError } from "@/components/interval-error";

export default function () {
	return (
		<InternalError className="flex flex-col gap-2">
			Failed to get the request summary at this point, please try again later.
			<ContinueReading className="w-48" text="Back to textbook" />
		</InternalError>
	);
}
