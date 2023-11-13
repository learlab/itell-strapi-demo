// @ts-nocheck
// there is a  bug in the typings for ui/command, ignore for now
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Circle, File, Laptop, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@itell/core/utils";

import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "./client-components";
import { CommandMenuConfig } from "@/config/command-menu";

export function CommandMenu() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const { setTheme } = useTheme();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button
				variant="outline"
				className={cn(
					"hidden relative w-full justify-start text-sm text-muted-foreground sm:inline-flex sm:pr-12 md:w-32 lg:w-48",
				)}
				onClick={() => setOpen(true)}
			>
				<span className="inline-flex">Search...</span>
				<kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
					<span className="text-xs">⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search ..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Tools">
						{CommandMenuConfig.tools.map((navItem) => (
							<CommandItem
								key={navItem.href}
								value={navItem.title}
								onSelect={() => {
									runCommand(() => router.push(navItem.href as string));
								}}
							>
								<div className="mr-2 flex h-4 w-4 items-center justify-center">
									<Circle className="h-3 w-3" />
								</div>
								<div>
									<p>{navItem.title}</p>
									<p className="text-muted-foreground text-xs">
										{navItem.description}
									</p>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading="Textbook">
						{CommandMenuConfig.textbookPages.map((navItem) => (
							<CommandItem
								key={navItem.href}
								value={navItem.title}
								onSelect={() => {
									runCommand(() => router.push(navItem.href as string));
								}}
							>
								<File className="mr-2 h-4 w-4" />
								{navItem.title}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />
					<CommandGroup heading="Theme">
						<CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
							<SunMedium className="mr-2 h-4 w-4" />
							Light
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
							<Moon className="mr-2 h-4 w-4" />
							Dark
						</CommandItem>
						<CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
							<Laptop className="mr-2 h-4 w-4" />
							System
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
