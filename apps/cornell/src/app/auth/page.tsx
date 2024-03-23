import { AuthForm } from "@/components/auth/auth-form";
import { KnowledgeCarousel } from "@/components/auth/knowledge-carousel";
import { Button } from "@/components/client-components";
import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/auth";
import { getSiteConfig } from "@/lib/config";
import { isProduction } from "@/lib/constants";
import { Warning } from "@itell/ui/server";
import { ChevronLeftIcon, CommandIcon } from "lucide-react";
import Link from "next/link";

type PageProps = {
	searchParams?: Record<string, string>;
};

const ErrorDict: Record<string, string> = {
	OAuthAccountNotLinked:
		"You already have an account. Please sign in using your original platform",
	Callback: `An internal error occurred. Please try again later or contact lear.lab.vu@gmail.com${
		isProduction ? "" : " Did you forgot to run prisma generate?"
	}`,
	InvalidEmail:
		"The email you provided is not found on the students list, plaase try logging in with your @cornell.edu email.",
};

export default async function ({ searchParams }: PageProps) {
	const config = await getSiteConfig();
	const error = searchParams?.error;
	const errorMessage = error ? ErrorDict[error] : null;
	const user = await getCurrentUser();
	const isAdmin = env.ADMINS?.includes(user?.email || "");

	return (
		<div className="w-screen h-screen grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<Link href="/" className={"absolute top-4 left-4 md:top-8 md:left-8"}>
				<Button variant="ghost">
					<ChevronLeftIcon />
					Home
				</Button>
			</Link>
			<div className="col-span-2 lg:p-8 lg:col-span-1">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<CommandIcon className="mx-auto size-6" />
						<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
						<p className="font-light tracking-tight text-lg">{config.title}</p>
						{/* <p className="text-sm text-muted-foreground">
							Enter your email to sign in to your account
						</p>
						<p className="text-sm text-muted-foreground">TBD</p> */}
					</div>
					{error && <Warning>{errorMessage ? errorMessage : error}</Warning>}
					<AuthForm isAdmin={isAdmin || false} />
				</div>
			</div>
			<div className="hidden h-full bg-gray-100 lg:col-span-1 lg:flex lg:items-center">
				<KnowledgeCarousel />
			</div>
		</div>
	);
}
