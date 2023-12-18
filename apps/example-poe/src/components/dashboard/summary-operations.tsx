"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Summary } from "@prisma/client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@itell/ui/client";
import { CircleEllipsisIcon, TrashIcon } from "lucide-react";
import { trpc } from "@/trpc/trpc-provider";
import { Spinner } from "../spinner";
import Link from "next/link";
import { makeLocationHref } from "@/lib/utils";
import { deleteSummary } from "@/lib/server-actions";

export default function ({ summary }: { summary: Summary }) {
	const router = useRouter();
	const sectionHref = makeLocationHref({
		module: summary.module,
		chapter: summary.chapter,
		section: summary.section,
	});
	const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
	const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
					<CircleEllipsisIcon className="h-4 w-4" />
					<span className="sr-only">Open</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						className="flex cursor-pointer items-center"
						onSelect={() => setShowDeleteAlert(true)}
					>
						<Link href={sectionHref}>Go to section</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="flex cursor-pointer items-center text-destructive focus:text-destructive"
						onSelect={() => setShowDeleteAlert(true)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this summary?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							disabled={isDeleteLoading}
							onClick={async (event) => {
								event.preventDefault();
								setIsDeleteLoading(true);

								const deleted = await deleteSummary(summary.id);
								if (deleted) {
									setIsDeleteLoading(false);
									setShowDeleteAlert(false);
								}
								router.push("/dashboard");
							}}
							className="bg-red-600 focus:ring-red-600"
						>
							{isDeleteLoading ? (
								<Spinner className="mr-2" />
							) : (
								<TrashIcon className="mr-2 h-4 w-4" />
							)}
							<span>Delete</span>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
