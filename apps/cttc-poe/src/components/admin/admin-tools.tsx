"use client";
import {
	Button,
	Label,
	RadioGroup,
	RadioGroupItem,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Switch,
} from "@/components/client-components";
import { FeedbackType } from "@/lib/control/feedback";
import { SettingsIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useConfig, useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";

export const AdminTools = () => {
	const { data: session } = useSession();
	const { feedbackType: feedback, setFeedbackType } = useConfig(
		(state) => state,
	);
	const finishPage = useConstructedResponse((state) => state.finishPage);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const feedbackType = String(formData.get("ai-feedback")) as FeedbackType;
		setFeedbackType(feedbackType);
		finishPage();

		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-2 px-1 py-2">
					<SettingsIcon className="size-4" /> Admin tools
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Configure ITELL</SheetTitle>
					<SheetDescription>
						You can view this because {session?.user.email} is recognized as an
						admin.
					</SheetDescription>
				</SheetHeader>
				<form className="grid gap-8 py-4" onSubmit={onSubmit}>
					<div className="flex flex-col gap-4">
						<Label htmlFor="ai-feedback">AI feedback</Label>
						<RadioGroup
							id="ai-feedback"
							name="ai-feedback"
							defaultValue={feedback}
						>
							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									value={FeedbackType.SIMPLE}
									id={FeedbackType.SIMPLE}
								/>
								<div>
									<Label htmlFor={FeedbackType.SIMPLE}>Simple rereading</Label>
									<p className="text-sm text-muted-foreground">
										A digital textbook without AI-generated short questions,
										without summary production, and without STAIRS. Workers will
										instead read short questions and their correct answers and
										read professional summaries of the chapter. Workers will
										also read about strategies that can increase text
										comprehension including self-explanations.
									</p>
								</div>
							</div>

							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									value={FeedbackType.RANDOM_REREAD}
									id={FeedbackType.RANDOM_REREAD}
								/>
								<div>
									<Label htmlFor={FeedbackType.RANDOM_REREAD}>
										Random rereading
									</Label>
									<p className="text-sm text-muted-foreground">
										A digital textbook with AI generated short questions and
										with summary production. Workers, however, will not receive
										feedback on their answers to short questions nor the quality
										of their summaries. Students will be given the opportunity
										to revise their constructed responses. After writing a
										summary, workers will be asked to re-read a randomly
										selected section of text and may revise their summary if
										they choose. They will not interact with STAIRS
									</p>
								</div>
							</div>

							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									value={FeedbackType.STAIRS}
									id={FeedbackType.STAIRS}
								/>
								<div>
									<Label htmlFor={FeedbackType.STAIRS}>Stairs</Label>
									<p className="text-sm text-muted-foreground">
										A digital textbook with AI generated short questions and
										summary production. Workers will also receive AI driven
										feedback on their answers to short questions and the quality
										of their summaries and be given the opportunity to revise
										their responses. Critically, workers that do not pass their
										summaries will re-read and interact with STAIRS.
										:white_check_mark: 3
									</p>
								</div>
							</div>
						</RadioGroup>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex flex-row items-center justify-between">
							<Label htmlFor="unblur-page">Unblur current page</Label>
							<Switch />
						</div>
						<p className="text-muted-foreground text-sm">
							Unblur all chunks from the current page and unlock summary
							submission
						</p>
					</div>
					<SheetClose asChild>
						<Button type="submit" disabled={pending}>
							{pending && <Spinner className="size-4 mr-2" />} Save changes
						</Button>
					</SheetClose>
				</form>
			</SheetContent>
		</Sheet>
	);
};
