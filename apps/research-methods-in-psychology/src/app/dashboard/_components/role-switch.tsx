"use client";

import { ClassRole } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { ChevronsUpDown, User, UserPlus } from "lucide-react";

import { useDashboard } from "./dashboard-context";

const roles = [
  {
    name: ClassRole.TEACHER,
    label: "Teacher",
    icon: UserPlus,
  },
  {
    name: ClassRole.STUDENT,
    label: "Student",
    icon: User,
  },
];

export function RoleSwitcher() {
  const { role, onRoleChange } = useDashboard();
  const activeRole = role === ClassRole.TEACHER ? roles[0] : roles[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <activeRole.icon className="h-3.5 w-3.5 shrink-0" />
          </div>
          <div className="line-clamp-1 flex-1 pr-2 font-medium">
            {activeRole.label}
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
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.name}
            onClick={() => { onRoleChange(role.name); }}
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
