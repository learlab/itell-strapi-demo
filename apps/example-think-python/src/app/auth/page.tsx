import { cn } from "@itell/core/utils";
import Link from "next/link";
import { ChevronLeftIcon, CommandIcon } from "lucide-react";
import { Button } from "@/components/client-components";
import FlipCard from "@/components/flip-card";
import { AuthForm } from "@/components/auth/auth-form";
import { Warning } from "@itell/ui/server";

type PageProps = {
	searchParams?: {
		error?: string;
	};
};

const ErrorDict: Record<string, string> = {
	OAuthAccountNotLinked:
		"You already have an account. Please sign in using your original platform",
};

export default async function ({ searchParams }: PageProps) {
	const error = searchParams?.error;
	const errorMessage = error ? ErrorDict[error] : null;
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
						<CommandIcon className="mx-auto h-6 w-6" />
						<h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
						{/* <p className="text-sm text-muted-foreground">
							Enter your email to sign in to your account
						</p>
						<p className="text-sm text-muted-foreground">TBD</p> */}
					</div>
					{error && <Warning>{errorMessage ? errorMessage : error}</Warning>}
					<AuthForm />
				</div>
			</div>
			<div className="hidden h-full bg-gray-100 lg:col-span-1 lg:block">
				<FlipCard />
			</div>
		</div>
	);
}
