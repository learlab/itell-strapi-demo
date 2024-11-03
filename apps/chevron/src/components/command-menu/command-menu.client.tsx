"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@itell/ui/command";
import { cn } from "@itell/utils";
import { type Page } from "#content";
import { Circle, File, Laptop, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function CommandMenuClient({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <search className="hidden md:block">
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-32 lg:w-48"
        )}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search ..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {config.tools.map((navItem) => (
              <CommandItem
                key={navItem.href}
                value={navItem.title}
                onSelect={() => {
                  runCommand(() => {
                    router.push(navItem.href);
                  });
                }}
                className="flex items-center gap-2"
              >
                <div className="flex size-4 items-center justify-center">
                  <Circle className="h-3 w-3" />
                </div>
                <div>
                  <p>{navItem.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {navItem.description}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Textbook">
            {pages.map((item) => (
              <CommandItem
                key={item.href}
                value={item.title}
                onSelect={() => {
                  runCommand(() => {
                    router.push(item.href);
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  <File className="size-4" />
                  {item.title}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={() => {
                runCommand(() => {
                  setTheme("light");
                });
              }}
            >
              <span className="flex items-center gap-2">
                <SunMedium className="size-4" />
                Light
              </span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => {
                  setTheme("dark");
                });
              }}
            >
              <span className="flex items-center gap-2">
                <Moon className="size-4" />
                Dark
              </span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => {
                  setTheme("system");
                });
              }}
            >
              <span className="flex items-center gap-2">
                <Laptop className="size-4" />
                System
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </search>
  );
}

const config = {
  tools: [
    {
      title: "Dashboard",
      href: "/api/dashboard",
      description: "View your learning statistics",
    },
    {
      title: "Summaries",
      href: "/dashboard/summaries",
      description: "Manage your summaries",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      description: "Configure personal settings",
    },
    {
      title: "Class",
      href: "/dashboard/class",
      description: "Monitor student progress",
    },
    {
      title: "Guide",
      href: "/guide",
      description: "Learn how to use the textbook",
    },
  ],
};
