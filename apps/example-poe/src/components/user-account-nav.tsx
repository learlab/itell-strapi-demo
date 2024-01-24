"use client";

import {
	ChevronDownIcon,
	ChevronUpIcon,
	CompassIcon,
	FileBoxIcon,
	LineChartIcon,
	LogOutIcon,
	SettingsIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./client-components";
import { Spinner } from "./spinner";
import { UserAvatar } from "./user-avatar";

export const UserAccountNav = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const { data: session, status } = useSession();
	const user = session?.user;

	if (status === "loading") {
		return <Spinner />;
	}

	if (!user) {
		return (
			<Link href="/auth">
				<Button>Sign in</Button>
			</Link>
		);
	}

	return (
		<div className="ml-auto flex items-center gap-1">
			<DropdownMenu open={menuOpen} onOpenChange={(val) => setMenuOpen(val)}>
				<DropdownMenuTrigger className="flex items-center gap-1">
					<UserAvatar
						className="h-8 w-8"
						user={{
							image: user.image || null,
							name: user.name || null,
						}}
					/>
					{menuOpen ? (
						<ChevronUpIcon className="size-4" />
					) : (
						<ChevronDownIcon className="size-4" />
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{/* user name and email */}
					<div className="flex items-center justify-start gap-2 p-2">
						<div className="flex flex-col space-y-1 leading-none">
							{user.name && <p className="font-medium">{user.name}</p>}
							{user.email && (
								<p className="w-[200px] truncate text-sm text-muted-foreground">
									{user.email}
								</p>
							)}
						</div>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/dashboard">
							<LineChartIcon className="size-4 mr-2" /> Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/summaries">
							<FileBoxIcon className="size-4 mr-2" />
							Summaries
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings">
							<SettingsIcon className="size-4 mr-2" /> Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/guide">
							<CompassIcon className="size-4 mr-2" /> Guide
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={(event) => {
							event.preventDefault();
							signOut({
								callbackUrl: `${window.location.origin}/auth`,
							});
						}}
					>
						<LogOutIcon className="size-4 mr-2" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
