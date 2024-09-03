"use client";

import { Role, useSidebar } from "@/components/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { ChevronsUpDown, User, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

const roles = [
	{
		name: "teacher",
		label: "Teacher",
		icon: UserPlus,
	},
	{
		name: "student",
		label: "Student",
		icon: User,
	},
];

// route to switch to when role is changed
const routeMappings: Record<Role, Record<string, string | undefined>> = {
	teacher: {
		"/dashboard": "/dashboard/teacher",
	},
	student: {
		"/dashboard/teacher": "/dashboard",
	},
};

export function RoleSwitcher() {
	const { role, onRoleChange } = useSidebar();
	const router = useRouter();
	const [pending, startTransition] = React.useTransition();
	const activeRole = role === "teacher" ? roles[0] : roles[1];
	const pathname = usePathname();

	const toggleRole = React.useCallback(
		(role: Role) => {
			onRoleChange(role);
			if (pathname) {
				const nextRoute = routeMappings[role][pathname];
				if (nextRoute) {
					startTransition(() => {
						router.push(nextRoute);
					});
				}
			}
		},
		[pathname],
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
				<div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
					<div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
						<activeRole.icon className="h-3.5 w-3.5 shrink-0" />
					</div>
					<div className="line-clamp-1 flex-1 pr-2 font-medium ">
						{activeRole?.label}
					</div>
					<ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-64"
				align="start"
				side="right"
				sideOffset={4}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Roles
				</DropdownMenuLabel>
				{roles.map((role, index) => (
					<DropdownMenuItem
						key={role.name}
						onClick={() => toggleRole(role.name as Role)}
						className="items-start gap-2 px-1.5"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
							<role.icon className="h-5 w-5 shrink-0" />
						</div>
						<div className="grid flex-1 leading-tight">
							<div className="line-clamp-1 font-medium">{role.label}</div>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
