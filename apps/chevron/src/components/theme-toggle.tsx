"use client";

import { updateUserPrefsAction } from "@/actions/user";
import { Button } from "@itell/ui/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@itell/ui/client";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useServerAction } from "zsa-react";

export const ThemeToggle = () => {
	const { setTheme: _setTheme } = useTheme();
	const { execute } = useServerAction(updateUserPrefsAction);

	const setTheme = (theme: string) => {
		if (!document.startViewTransition) _setTheme(theme);
		document.startViewTransition(() => {
			execute({ preferences: { theme } });
			_setTheme(theme);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 w-8 px-0">
					<SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<span className="flex items-center gap-2">
						<SunIcon className="size-4" />
						Light
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<span className="flex items-center gap-2">
						<MoonIcon className="size-4" />
						Dark
					</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<span className="flex items-center gap-2">
						<LaptopIcon className="size-4" />
						System
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
