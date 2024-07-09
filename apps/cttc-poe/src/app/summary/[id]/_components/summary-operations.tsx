"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@itell/ui/client";
import { CircleEllipsisIcon } from "lucide-react";
import Link from "next/link";

type Props = {
	pageUrl: string;
};

export const SummaryOperations = ({ pageUrl }: Props) => {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
					<CircleEllipsisIcon className="size-4" />
					<span className="sr-only">Open</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem className="flex cursor-pointer items-center">
						<Link href={pageUrl}>Go to page</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
