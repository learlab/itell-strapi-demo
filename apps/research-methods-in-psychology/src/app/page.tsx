import { BrandIcon } from "@/components/brand-icon";
import { ContinueReading } from "@/components/continue-reading";
import { HtmlRenderer } from "@/components/html-renderer";
import { MainNav } from "@/components/main-nav";
import { SiteConfig } from "@/config/site";
import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";
import { home } from "#content";

export default async function () {
  return (
    <>
      <MainNav read />
      <main
        className="mx-auto max-w-3xl flex-1 space-y-6 px-6 py-8 md:px-10 lg:px-16"
        id={Elements.TEXTBOOK_MAIN}
        tabIndex={-1}
      >
        <HtmlRenderer html={home.html} />
        <div className="flex items-center justify-center">
          <ContinueReading className="w-48" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      id={Elements.SITE_FOOTER}
      className={cn(
        "flex flex-row items-center justify-between border-t-2 border-border px-16 py-8 lg:px-32",
        className
      )}
    >
      <p className="text-center text-sm leading-loose md:text-left">
        {SiteConfig.footer}
      </p>
      <a href="https://github.com/learlab/itell">
        <BrandIcon name="github/_/eee" />
        <span className="sr-only">github repository</span>
      </a>
    </footer>
  );
}
