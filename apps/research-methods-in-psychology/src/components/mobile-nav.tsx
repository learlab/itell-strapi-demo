"use client";

import { useOptimistic, useState, useTransition } from "react";

import { useClickOutside, useDebounce } from "@itell/core/hooks";
import { cn } from "@itell/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Spinner } from "./spinner";

export type MobileNavItem = {
  title: string;
  /**
   * the destination url
   * also used to matched against usePathname to determine if the link is active
   */
  href: string;
  disabled?: boolean;
};
type MobileNavProps = {
  items: MobileNavItem[];
};
export const MobileNav = ({ items }: MobileNavProps) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isPending = useDebounce(pending, 100);
  const [activeRoute, setActiveRoute] = useOptimistic(
    items.find((item) => item.href === pathname)?.href
  );
  const ref = useClickOutside<HTMLDivElement>(() => setShowMobileMenu(false));
  return (
    <div className="block md:hidden">
      <button
        type="button"
        className="flex items-center space-x-2"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <XIcon /> : <MenuIcon />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && (
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-fit grid-flow-row auto-rows-max overflow-auto bg-background shadow-md animate-in slide-in-from-bottom-80 md:hidden"
          )}
        >
          <div className="relative grid gap-6 rounded-md bg-popover p-4 text-popover-foreground">
            <div className="border-b-2">
              <TopLink href="/" text="Home" active={pathname === "/"} />
              <TopLink
                href="/dashboard"
                text="Dashboard"
                active={pathname === "/dashboard"}
              />
            </div>
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRoute(item.href);
                    startTransition(() => {
                      router.push(item.disabled ? "#" : item.href);
                      setShowMobileMenu(false);
                    });
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:underline",
                    item.disabled && "cursor-not-allowed opacity-60",
                    item.href === activeRoute && "bg-accent"
                  )}
                >
                  <span>{item.title}</span>
                  {isPending && item.href === activeRoute && <Spinner />}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

const TopLink = ({
  href,
  text,
  active,
}: {
  href: string;
  text: string;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center rounded-md p-2 text-sm font-medium",
        active && "bg-accent"
      )}
    >
      <span className="font-bold">{text}</span>
    </Link>
  );
};
