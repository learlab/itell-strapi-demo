import Image from "next/image";
import Link from "next/link";
import { Elements } from "@itell/constants";
import { volume } from "#content";

import { getSession } from "@/lib/auth";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { CommandMenu } from "./command-menu";
import { ContinueReading } from "./continue-reading";
import { MobileNav } from "./mobile-nav";
import { ScrollProgress } from "./scroll-progress";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserAccountNav } from "./user-account-nav";

type Props = {
  scrollProgress?: boolean;
  read?: boolean;
};

export async function MainNav({ scrollProgress, read }: Props) {
  const { user } = await getSession();

  return (
    <SiteNav mainContentId={Elements.TEXTBOOK_MAIN}>
      <div className="flex h-[var(--nav-height)] items-center justify-between px-6 sm:space-x-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-6">
            <Image
              src="/images/itell.svg"
              alt="itell logo"
              width={28}
              height={30}
              priority
            />
            <span className="hidden font-bold md:inline-block">
              {volume.title}
            </span>
          </Link>
          {read ? (
            <ContinueReading
              className="hidden w-28 md:block"
              text="Read"
              variant="outline"
              size="default"
            />
          ) : null}
          <MobileNav
            items={allPagesSorted.map((page) => ({
              title: page.title,
              href: page.href,
            }))}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />
          <UserAccountNav user={user} />
        </div>
      </div>

      {scrollProgress ? <ScrollProgress /> : null}
    </SiteNav>
  );
}
