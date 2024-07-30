"use client";
import { resetUserAction, updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/interval-error";
import { useQuestion } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { Condition } from "@/lib/constants";
import { allSummaryPagesSorted } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import {
	AlertDialog,
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
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Switch,
} from "@itell/ui/client";
import { SettingsIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

type Props = {
	condition: string;
};

const RestartTextbook = () => {
	const { isPending, isError, execute } = useServerAction(resetUserAction);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>Restart textbook</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription asChild>
						<div className="grid gap-2">
							<p className="text-sm text-muted-foreground">
								This action will reset your progress to the first page and
								delete all of your data, including summaries, chat messages,
								question answers, etc.
							</p>
							{isError && <InternalError />}
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
					<Button
						disabled={isPending}
						onClick={async () => {
							const [data, err] = await execute();
							if (err) {
								return toast.error(err.data);
							}
							localStorage.clear();
							window.location.href = makePageHref(data.pageSlug);
						}}
					>
						<span className="flex items-center gap-2">
							{isPending && <Spinner />}
							Continue
						</span>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export const AdminTools = ({ condition }: Props) => {
	const finishPage = useQuestion((state) => state.finishPage);
	const [open, setOpen] = useState(false);
	const { execute, isPending, isError } = useServerAction(updateUserAction);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const condition = String(formData.get("condition"));
		const pageSlug =
			formData.get("page-progress") !== ""
				? String(formData.get("page-progress"))
				: undefined;

		if (formData.get("page-unblur") === "on") {
			finishPage();
		}

		const [_, err] = await execute({
			condition,
			pageSlug,
			finished: false,
		});
		if (!err) {
			setOpen(false);
			if (pageSlug) {
				window.location.href = makePageHref(pageSlug);
			} else {
				window.location.reload();
			}
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="flex justify-start items-center gap-2 w-full px-1 py-2 xl:text-lg xl:gap-4"
				>
					<SettingsIcon className="size-4 xl:size-6" /> Admin
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
				<form
					className="grid gap-8 py-4 justify-items-start"
					onSubmit={onSubmit}
				>
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

					<div className="grid gap-2">
						<Button type="submit" disabled={isPending}>
							<span className="flex items-center gap-2">
								{isPending && <Spinner className="size-4" />}
								Save changes
							</span>
						</Button>
						<RestartTextbook />
						{isError && <InternalError />}
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
};
