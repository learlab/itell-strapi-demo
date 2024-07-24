import { getSiteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { AuthForm, LogoutButton } from "@auth/auth-form";
import { KnowledgeCarousel } from "@auth/knowledge-carousel";
import { Button } from "@itell/ui/client";
import { Warning } from "@itell/ui/server";
import { ChevronLeftIcon, CommandIcon } from "lucide-react";
import Link from "next/link";

type PageProps = {
	searchParams?: unknown;
};

const ErrorDict: Record<string, string> = {
	google_oauth:
		"A problem occurred while logging in with Google. Please try again later.",
	prolific_oauth:
		"A problem occurred while logging in with Prolific. Please try again later.",
	prolific_missing_pid: "Please enter a valid Prolific ID.",
	prolific_wrong_pid: "Please use the same Prolific ID you used to sign up.",
};

export default async function ({ searchParams }: PageProps) {
	const config = await getSiteConfig();
	const { error } = routes.auth.$parseSearchParams(searchParams);
	const { user } = await getSession();
	let errorMessage: string | null = null;
	if (error) {
		if (error in ErrorDict) {
			errorMessage = ErrorDict[error];
		} else if (error.startsWith("prolific_existing_pid_")) {
			const storedPid = error.replace("prolific_existing_pid_", "");
			errorMessage = `Please use the same Prolific ID you used to sign up (${storedPid}).`;
		}
	}

	return (
		<div className="w-screen h-screen grid items-center lg:max-w-none lg:grid-cols-2">
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
					<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="flex flex-col space-y-2 text-center">
							<CommandIcon className="mx-auto size-6" />
							<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
							<p className="font-light tracking-tight text-lg">
								{config.title}
							</p>
						</div>
						{error && <Warning>{errorMessage ? errorMessage : error}</Warning>}
						{user ? (
							<div className="text-center space-y-2">
								<p>You have already logged in</p>
								<LogoutButton />
							</div>
						) : (
							<AuthForm />
						)}
					</div>
				</main>
			</div>

			<div
				aria-hidden="true"
				className="hidden h-full bg-gray-100 lg:col-span-1 lg:flex lg:items-center"
			>
				<KnowledgeCarousel />
			</div>
		</div>
	);
}
