import { RootProvider } from "@/components/provider/root-provider";
import { env } from "@/env.mjs";
import { isProduction } from "@/lib/constants";

import "@/styles/globals.css";
import "@itell/ui/dist/style.css";

import { Roboto_Slab as FontSerif } from "next/font/google";
import { cn } from "@itell/utils";
import { volume } from "#content";
import { GeistSans as FontSans } from "geist/font/sans";

import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: {
      default: volume.title,
      template: `%s | ${volume.title}`,
    },
    description: volume.description,
    metadataBase: new URL(env.NEXT_PUBLIC_HOST),
    openGraph: {
      title: volume.title,
      description: volume.description,
      type: "article",
      url: env.NEXT_PUBLIC_HOST,
      images: [
        {
          url: "/og",
        },
      ],
    },
  };
}

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/images/avatars/favicon.png"
        />
        <link rel="prefetch" href="/driver.css" />
        {volume.latex ? <link rel="prefetch" href="/katex.min.css" /> : null}
      </head>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          FontSans.className,
          fontSerif.variable
        )}
      >
        <RootProvider>
          <TailwindIndicator />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

function TailwindIndicator() {
  if (isProduction) return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        sm
      </div>
      <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
      <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
