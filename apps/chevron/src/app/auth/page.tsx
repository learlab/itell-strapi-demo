import { SiteConfig } from "@/config/site";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { AuthForm, LogoutButton } from "@auth/auth-form";
import { KnowledgeCarousel } from "@auth/knowledge-carousel";
import { Button } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { ChevronLeftIcon, CommandIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type PageProps = {
	searchParams?: unknown;
};

const ErrorDict: Record<string, string> = {
	oauth: "A problem occurred while logging in. Please try again later.",
	access_denied:
		"This application needs your consent to access your social account. You may come back at any time.",
};

export const generateMetadata = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> => {
	const fromDashboard = searchParams && searchParams.from_dashboard === "true";
	if (fromDashboard) {
		const title = "Dashboard";
		const description = `Learning statistics on the ${SiteConfig.title} intelligent textbook`;
		return {
			title,
			description,
			metadataBase: new URL(env.HOST),
			openGraph: {
				title: `${title} | ${SiteConfig.title}`,
				description,
				type: "article",
				url: `${env.HOST}/dashboard`,
				images: [
					{
						url: "/og?dashboard=true",
					},
				],
			},
		};
	}

	const title = "Create an account";
	const description = "Getting started with the textbook";
	return {
		title,
		description,
		openGraph: {
			title: `${title} | ${SiteConfig.title}`,
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

export default async function ({ searchParams }: PageProps) {
	const { error, join_class_code } =
		routes.auth.$parseSearchParams(searchParams);
	const { user } = await getSession();
	let errorMessage: string | null = null;
	if (error) {
		if (error in ErrorDict) {
			errorMessage = ErrorDict[error];
		} else {
			errorMessage = "An internal error occurred. Please try again later.";
		}
	}

	return (
		<div className="w-screen h-screen grid items-center lg:grid-cols-2">
			<div className="col-span-2 lg:p-8 lg:col-span-1">
				<header>
					<Link href="/" className={"absolute top-4 left-4 md:top-8 md:left-8"}>
						<Button variant="ghost">
							<ChevronLeftIcon />
							Home
						</Button>
					</Link>
				</header>
				<main className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<CommandIcon className="mx-auto size-6" />
						<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
						<p className="font-light tracking-tight text-lg">
							{SiteConfig.title}
						</p>
					</div>
					{error && (
						<Warning role="alert">
							{errorMessage ? errorMessage : error}
						</Warning>
					)}
					{user ? (
						<div className="text-center space-y-2">
							<p className="font-light">
								You are logged in as{" "}
								<span className="font-semibold">{user.name}</span>
							</p>
							<LogoutButton />
						</div>
					) : (
						<AuthForm joinClassCode={join_class_code} />
					)}
				</main>
			</div>
			<div
				aria-hidden="true"
				className="hidden h-full bg-muted lg:col-span-1 lg:flex lg:items-center"
			>
				<KnowledgeCarousel />
			</div>
		</div>
	);
}
