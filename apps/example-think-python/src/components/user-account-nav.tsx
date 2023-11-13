"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	Button,
	DropdownMenuSeparator,
} from "./client-components";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	FileBoxIcon,
	GraduationCapIcon,
	LineChartIcon,
	LogOutIcon,
	SettingsIcon,
} from "lucide-react";
import Spinner from "./spinner";
import Link from "next/link";
import UserAvatar from "./user-avatar";

export const UserAccountNav = () => {
	const [isSignOutLoading, setIsSignOutLoading] = useState(false);
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
		<div className="ml-auto">
			<DropdownMenu open={menuOpen} onOpenChange={(val) => setMenuOpen(val)}>
				<DropdownMenuTrigger className="flex items-center gap-1">
					<UserAvatar
						className="h-8 w-8"
						user={{
							name: user.name || null,
							email: user.email || null,
							image: user.image || null,
						}}
					/>
					{menuOpen ? (
						<ChevronUpIcon className="h-4 w-4" />
					) : (
						<ChevronDownIcon className="h-4 w-4" />
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
							<LineChartIcon className="h-4 w-4 mr-2" /> Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/summaries">
							<FileBoxIcon className="h-4 w-4 mr-2" />
							Summaries
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/settings">
							<SettingsIcon className="h-4 w-4 mr-2" /> Settings
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/dashboard/class">
							<GraduationCapIcon className="h-4 w-4 mr-2" /> Class
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						disabled={isSignOutLoading}
						onSelect={async (event) => {
							event.preventDefault();
							setIsSignOutLoading(true);
							await signOut({
								callbackUrl: `${window.location.origin}/auth`,
							});
							setIsSignOutLoading(false);
						}}
					>
						{isSignOutLoading ? (
							<Spinner className="w-4 h-4 mr-2" />
						) : (
							<LogOutIcon className="w-4 h-4 mr-2" />
						)}
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
