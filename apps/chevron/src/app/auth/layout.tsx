import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { Metadata } from "next";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export const generateMetadata = async (): Promise<Metadata> => {
	const title = `Create an account | ${SiteConfig.title}`;
	const description = "Getting started with the textbook";
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			url: `${env.HOST}/auth`,
			images: [
				{
					url: "/og?auth=true",
				},
			],
		},
	};
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return <div className="min-h-screen">{children}</div>;
}
