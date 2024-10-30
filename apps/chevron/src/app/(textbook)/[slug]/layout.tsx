import { volume } from "#content";

import { MainNav } from "@/components/main-nav";
import { env } from "@/env.mjs";
import { allPagesSorted, getPage } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";

export const generateStaticParams = () => {
  return allPagesSorted.map((page) => {
    return {
      slug: page.slug,
    };
  });
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const page = getPage(params.slug);
  if (!page) {
    return {
      title: "Not Found",
    };
  }

  const title = page.title;
  const description = page.description ?? page.excerpt;
  const ogUrl = new URL(`${env.NEXT_PUBLIC_HOST}/og`);
  ogUrl.searchParams.set("title", page.title);
  ogUrl.searchParams.set("slug", page.slug);

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${volume.title}`,
      description,
      type: "article",
      url: `${env.NEXT_PUBLIC_HOST}${makePageHref(page.slug)}`,
      images: [
        {
          url: ogUrl,
        },
      ],
    },
  };
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNav scrollProgress />
      {children}
    </>
  );
}
