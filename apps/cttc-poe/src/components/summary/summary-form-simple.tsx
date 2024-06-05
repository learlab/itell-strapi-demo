"use client";
import { useSession, useSessionAction } from "@/lib/auth/context";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { incrementUserPage } from "@/lib/user/actions";
import { PageData, reportSentry } from "@/lib/utils";
import { Warning } from "@itell/ui/server";
import { User } from "lucia";
import { ArrowRightIcon, CheckSquare2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { StatusButton } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";

type Props = {
	userId: string;
	prolificId: string | null;
	pageStatus: PageStatus;
	page: PageData;
};

const SubmitButton = ({
	children,
	disabled,
}: { children: React.ReactNode; disabled?: boolean }) => {
	const { pending } = useFormStatus();

	return (
		<StatusButton pending={pending} disabled={disabled} className="w-44">
			{children}
		</StatusButton>
	);
};

type FormState = { finished: boolean; error: string | null };

export const SummaryFormSimple = React.memo(
	({ userId, pageStatus, page, prolificId }: Props) => {
		console.log("rerender");
		const { currentChunk, chunks } = useConstructedResponse((state) => ({
			currentChunk: state.currentChunk,
			chunks: state.chunks,
		}));
		const isReady = pageStatus.unlocked || currentChunk === chunks.at(-1);
		const router = useRouter();
		const { updateUser } = useSessionAction();
		const [state, action] = useFormState<FormState>(
			async (state) => {
				try {
					if (state.finished) {
						if (page.nextPageSlug) {
							router.push(page.nextPageSlug);
						}
					}

					const nextSlug = await incrementUserPage(userId, page.page_slug);
					if (!isLastPage(page.page_slug)) {
						updateUser({ pageSlug: nextSlug });
					} else {
						updateUser({ finished: true });
						toast.info(
							"You have finished the entire textbook! Redirecting to the outtake survey soon.",
						);
						setTimeout(() => {
							window.location.href = `https://peabody.az1.qualtrics.com/jfe/form/SV_9GKoZxI3GC2XgiO?PROLIFIC_PID=${prolificId}`;
						}, 3000);
					}

					return { finished: true, error: null };
				} catch (err) {
					reportSentry("summary simple", {
						pageSlug: page.page_slug,
						error: err,
					});
					return { finished: false, error: "internal" };
				}
			},
			{ finished: pageStatus.unlocked, error: null },
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
					Below is a reference summary for this page. Please read it carefully
					to better understand the information presented.
				</p>
				<p>{page.referenceSummary}</p>

				<form className="flex justify-end gap-2" action={action}>
					<SubmitButton disabled={state.finished && !page.nextPageSlug}>
						{!state.finished ? (
							<span className="inline-flex gap-1 items-center">
								<CheckSquare2Icon className="size-4" /> Mark as completed
							</span>
						) : page.nextPageSlug ? (
							<span className="inline-flex gap-1 items-center">
								<ArrowRightIcon className="size-4" /> Go to next page
							</span>
						) : (
							<span>Textbook finished</span>
						)}
					</SubmitButton>
				</form>
				{state.error && (
					<Warning>An internal error occurred. Please try again later.</Warning>
				)}
			</section>
		);
	},
);
