"use client";
import { useQuestion } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { Condition } from "@/lib/control/condition";
import { allSummaryPagesSorted } from "@/lib/pages";
import { resetUser, updateUser } from "@/lib/user/actions";
import { makePageHref } from "@/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	Label,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Switch,
} from "@itell/ui/client";
import { SettingsIcon } from "lucide-react";
import { useTransition } from "react";

type Props = {
	userId: string;
	condition: string;
};

const RestartTextbook = ({ userId }: { userId: string }) => {
	const [pending, startTransition] = useTransition();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>Restart textbook</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action will reset your progress to the first page and delete
						all of your data, including summaries, chat messages, question
						answers, etc.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={pending}
						onClick={() => {
							startTransition(async () => {
								const pageSlug = await resetUser(userId);
								localStorage.clear();
								window.location.href = makePageHref(pageSlug);
							});
						}}
					>
						{pending && <Spinner className="inline mr-2" />} Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export const AdminTools = ({ userId, condition }: Props) => {
	const finishPage = useQuestion((state) => state.finishPage);
	const [pending, startTransition] = useTransition();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const condition = String(formData.get("condition"));
		const pageSlug =
			formData.get("page-progress") !== ""
				? String(formData.get("page-progress"))
				: undefined;

		startTransition(async () => {
			if (formData.get("page-unblur") === "on") {
				finishPage();
			}

			await updateUser(userId, {
				condition,
				pageSlug,
				finished: false,
			});

			if (pageSlug) {
				window.location.href = makePageHref(pageSlug);
			} else {
				window.location.reload();
			}
		});
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="flex justify-start items-center gap-2 w-full px-1 py-2"
				>
					<SettingsIcon className="size-4" /> Admin tools
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Configure ITELL</SheetTitle>
					<SheetDescription>
						You can view this because you are recognized as an admin. Apply the
						configuration by clicking "Save Changes". Unsaved changes will be
						lost.
					</SheetDescription>
				</SheetHeader>
				<form className="grid gap-8 py-4" onSubmit={onSubmit}>
					<div className="flex flex-col gap-4">
						<Label htmlFor="condition">AI feedback</Label>
						<RadioGroup
							id="condition"
							name="condition"
							defaultValue={condition}
						>
							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									className="shrink-0"
									value={Condition.SIMPLE}
									id={Condition.SIMPLE}
								/>
								<div>
									<Label htmlFor={Condition.SIMPLE}>Simple</Label>
									<p className="text-sm text-muted-foreground">
										No question and summary. Workers will read short questions
										and their correct answers and read professional summaries of
										the chapter. Workers will also read about strategies that
										can increase text comprehension.
									</p>
								</div>
							</div>

							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									className="shrink-0"
									value={Condition.RANDOM_REREAD}
									id={Condition.RANDOM_REREAD}
								/>
								<div>
									<Label htmlFor={Condition.RANDOM_REREAD}>
										Random rereading
									</Label>
									<p className="text-sm text-muted-foreground">
										With question and summary, but no feedback on correctness.
										Can revise question answer. After writing a summary, workers
										will receive a random chunk to reread without stairs.
									</p>
								</div>
							</div>

							<div className="flex items-baseline space-x-2">
								<RadioGroupItem
									className="shrink-0"
									value={Condition.STAIRS}
									id={Condition.STAIRS}
								/>
								<div>
									<Label htmlFor={Condition.STAIRS}>Stairs</Label>
									<p className="text-sm text-muted-foreground">
										With question and summary, and feedback on correctness. User
										will interact with stairs for failing summaries.
									</p>
								</div>
							</div>
						</RadioGroup>
					</div>
					<div className="flex flex-col gap-4">
						<Label htmlFor="page-progress">Set your progress to a page</Label>
						<Select name="page-progress">
							<SelectTrigger className="text-left h-fit">
								<SelectValue placeholder="Set progress" />
							</SelectTrigger>
							<SelectContent id="page-progress">
								<SelectGroup>
									<SelectLabel>Page</SelectLabel>
									{allSummaryPagesSorted.map((page) => (
										<SelectItem key={page.page_slug} value={page.page_slug}>
											{page.title}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex flex-row items-center justify-between">
							<Label htmlFor="page-unblur">Unblur current page</Label>
							<Switch id="page-unblur" name="page-unblur" />
						</div>
						<p className="text-muted-foreground text-sm">
							Unblur all chunks from the current page and unlock summary
							submission
						</p>
					</div>
					<div>
						<RestartTextbook userId={userId} />
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
