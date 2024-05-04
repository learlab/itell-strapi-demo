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
import { FeedbackType } from "@/lib/store/config";
import { SettingsIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useConfig, useConstructedResponse } from "../provider/page-provider";
import { Spinner } from "../spinner";

export const AdminTools = () => {
	const { data: session } = useSession();
	const { feedbackType: feedback, setFeedback } = useConfig((state) => state);
	const finishPage = useConstructedResponse((state) => state.finishPage);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const feedbackType = String(formData.get("ai-feedback")) as FeedbackType;
		setFeedback(feedbackType);
		finishPage();

		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-2">
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
								<RadioGroupItem value="stairs" id="stairs" />
								<div>
									<Label htmlFor="stairs">Stairs</Label>
									<p className="text-sm text-muted-foreground">
										ITELL AI will prompt user to answer a question and return to
										the summary
									</p>
								</div>
							</div>
							<div className="flex items-baseline space-x-2">
								<RadioGroupItem value="simple" id="simple" />
								<div>
									<Label htmlFor="simple">Simple rereading</Label>
									<p className="text-sm text-muted-foreground">
										ITELL AI will only tell the user to reread the selected
										chunk.
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
