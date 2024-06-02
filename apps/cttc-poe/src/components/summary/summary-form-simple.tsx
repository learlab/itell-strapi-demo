import { SessionUser } from "@/lib/auth";
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
	const [state, action] = useFormState(
		async () => {
			if (!pageStatus.unlocked) {
				await incrementUserPage(user.id, page.page_slug);
			}
			if (isLastPage(page.page_slug)) {
				toast.info(
					"You have finished the textbook! Redirecting to the outtake survey soon.",
				);
				setTimeout(() => {
					window.location.href = `https://peabody.az1.qualtrics.com/jfe/form/SV_9GKoZxI3GC2XgiO?PROLIFIC_PID=${user.prolificId}`;
				}, 3000);
			}

			return { finished: true };
		},
		{ finished: pageStatus.unlocked },
	);
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

				<SubmitButton />
			</form>
		</section>
	);
};
