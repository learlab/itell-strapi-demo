"use client";
import { SessionUser } from "@/lib/auth";
import { useSession } from "@/lib/auth/context";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { incrementUserPage } from "@/lib/user/actions";
import { PageData } from "@/lib/utils";
import { buttonVariants } from "@itell/ui/server";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "../client-components";
import { PageLink } from "../page/page-link";
import { useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";

type Props = {
	user: NonNullable<SessionUser>;
	pageStatus: PageStatus;
	page: PageData;
};

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending && <Spinner className="size-4 mr-2" />}I finished reading
		</Button>
	);
};

export const SummaryFormSimple = ({ user, pageStatus, page }: Props) => {
	const { currentChunk, chunks } = useConstructedResponse((state) => ({
		currentChunk: state.currentChunk,
		chunks: state.chunks,
	}));
	const isReady = currentChunk === chunks.at(-1);
	const { setUser } = useSession();
	const [state, action] = useFormState(
		async () => {
			if (!pageStatus.unlocked) {
				await incrementUserPage(user.id, page.page_slug);
				setUser({ ...user, pageSlug: page.nextPageSlug });
			}
			if (isLastPage(page.page_slug)) {
				setUser({ ...user, finished: true });
				toast.info(
					"You have finished the entire textbook! Redirecting to the outtake survey soon.",
				);
			}

			return { finished: true };
		},
		{ finished: pageStatus.unlocked },
	);

	if (!isReady) {
		return (
			<section className="max-w-2xl mx-auto">
				<p>Finish the entire page to move on.</p>
			</section>
		);
	}

	return (
		<section className="max-w-2xl mx-auto space-y-4">
			<p className="font-light text-lg mb-4">
				Below is a reference summary for this page. Please read it carefully to
				better understand the information presented.
			</p>
			<p>{page.referenceSummary}</p>

			<form className="flex justify-end gap-2" action={action}>
				{state.finished && page.nextPageSlug && (
					<PageLink
						pageSlug={page.nextPageSlug || ""}
						className={buttonVariants({ variant: "outline" })}
					>
						Go to next page
					</PageLink>
				)}

				{!state.finished && <SubmitButton />}
			</form>
		</section>
	);
};
