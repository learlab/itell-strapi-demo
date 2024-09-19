"use client";

import { logout } from "@/lib/auth/actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { User } from "lucia";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	CompassIcon,
	FileBoxIcon,
	LineChartIcon,
	LogOutIcon,
	SettingsIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { NavigationButton } from "./navigation-button";
import { Spinner } from "./spinner";
import { UserAvatar } from "./user-avatar";

const items = [
	{
		text: "Dashboard",
		href: "/dashboard",
		icon: <LineChartIcon className="size-4" />,
	},
	{
		text: "Summaries",
		href: "/dashboard/summaries",
		icon: <FileBoxIcon className="size-4" />,
	},
	{
		text: "Settings",
		href: "/dashboard/settings",
		icon: <SettingsIcon className="size-4" />,
	},
	{
		text: "Guide",
		href: "/guide",
		icon: <CompassIcon className="size-4" />,
	},
];

export const UserAccountNav = ({ user }: { user: User | null }) => {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState("");
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [logoutPending, setLogoutPending] = useState(false);

	if (!user) {
		return <NavigationButton href="/auth">Sign in</NavigationButton>;
	}

	return (
		<div className="ml-auto flex items-center gap-1">
			<DropdownMenu open={open} onOpenChange={(val) => setOpen(val)}>
				<DropdownMenuTrigger className="flex items-center gap-1">
					<UserAvatar image={user.image} name={user.name} className="h-8 w-8" />
					{open ? (
						<ChevronUpIcon className="size-4" />
					) : (
						<ChevronDownIcon className="size-4" />
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-40">
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
					{items.map((item) => (
						<DropdownMenuItem
							onSelect={(e) => {
								e.preventDefault();
								setActive(item.text);
								startTransition(() => {
									setOpen(false);
									router.push(item.href);
									setActive("");
								});
							}}
							disabled={active === item.text && pending}
							key={item.href}
						>
							<button type="button" className="flex items-center gap-2 w-full">
								{active === item.text ? <Spinner /> : item.icon}
								{item.text}
							</button>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						disabled={logoutPending}
						onSelect={async (event) => {
							event.preventDefault();
							setLogoutPending(true);
							startTransition(async () => {
								await logout();
								router.push("/auth");
								setOpen(false);
								setLogoutPending(false);
							});
						}}
					>
						<button type="button" className="flex items-center gap-2 w-full">
							{logoutPending ? <Spinner /> : <LogOutIcon className="size-4" />}
							Sign out
						</button>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
