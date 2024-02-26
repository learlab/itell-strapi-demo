import { getSiteConfig } from "@/lib/config";
import { cn } from "@itell/core/utils";
import { GithubIcon } from "lucide-react";
import * as React from "react";

export async function SiteFooter({
	className,
}: React.HTMLAttributes<HTMLElement>) {
	const { footer } = await getSiteConfig();

	return (
		<footer className={cn("border-t-2 border-border", className)}>
			<div className="container flex items-center justify-between gap-8 py-10 h-24 flex-row">
				<p className="text-center text-sm leading-loose md:text-left">
					{footer}
				</p>
				<div>
					<a href="https://github.com/learlab/itell">
						<GithubIcon />
					</a>
				</div>
			</div>
		</footer>
	);
}
