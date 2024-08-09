"use client";
import { useConstructedResponse } from "@/components/provider/page-provider";
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
import { useState, useTransition } from "react";

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
					<Button
						disabled={pending}
						onClick={() => {
							startTransition(async () => {
								const pageSlug = await resetUser(userId);
								localStorage.clear();
								window.location.href = makePageHref(pageSlug);
							});
						}}
						pending={pending}
					>
						Continue
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const conditions = [
	{
		label: "Simple",
		description:
			"No question and summary. Workers will read short questions and their correct answers and read professional summaries of the chapter. Workers will also read about strategies that can increase text comprehension.",
		value: Condition.SIMPLE,
	},
	{
		label: "Random rereading",
		description:
			"With question and summary, but no feedback on correctness. Can revise question answer. After writing a summary, workers will receive a random chunk to reread without stairs.",
		value: Condition.RANDOM_REREAD,
	},
	{
		label: "Stairs",
		description:
			"With question and summary, and feedback on correctness. User will interact with stairs for failing summaries.",
		value: Condition.STAIRS,
	},
];

export const AdminTools = ({ userId, condition }: Props) => {
	const finishPage = useConstructedResponse((state) => state.finishPage);
	const [pending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

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
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="flex justify-start items-center gap-2 w-full px-1 py-2"
				>
					<span className="inline-flex justify-center items-center gap-2">
						<SettingsIcon className="size-4" /> Admin tools
					</span>
				</Button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll">
				<SheetHeader>
					<SheetTitle>Configure ITELL</SheetTitle>
					<SheetDescription className="text-left">
						You can view this because you are recognized as an admin. Apply the
						configuration by clicking "Save Changes". Unsaved changes will be
						lost.
					</SheetDescription>
				</SheetHeader>
				<form className="grid gap-8 py-4" onSubmit={onSubmit}>
					<fieldset className="flex flex-col border p-4">
						<legend className="font-semibold">Feedback</legend>
						<RadioGroup
							className="space-y-4"
							name="condition"
							defaultValue={condition}
							aria-label="Select feedback type"
						>
							{conditions.map(({ label, description, value }) => (
								<Label
									key={label}
									className="flex items-center justify-between gap-6 font-normal"
								>
									<div className="text-balance space-y-2">
										<p className="font-semibold">{label}</p>
										<p
											className="text-sm text-muted-foreground"
											id={`desc-${value}`}
										>
											{description}
										</p>
									</div>
									<RadioGroupItem
										className="shrink-0"
										value={value}
										aria-describedby={`desc-${value}`}
									/>
								</Label>
							))}
						</RadioGroup>
					</fieldset>

					<fieldset className="flex flex-col gap-4 border p-4">
						<legend className="font-semibold">Progress</legend>
						<Label className="flex flex-col gap-2 font-normal">
							<p className="font-semibold">Set your progress to a page</p>
							<Select name="page-progress">
								<SelectTrigger className="text-left h-fit">
									<SelectValue placeholder="Select page" />
								</SelectTrigger>
								<SelectContent>
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
						</Label>
						<Label className="flex gap-6 items-center justify-between font-normal">
							<div className="flex flex-col gap-2 text-balance">
								<p className="font-semibold">Unblur current page</p>
								<p className="text-muted-foreground text-sm" id="unblur-desc">
									Unblur all chunks from the current page and unlock summary
									submission
								</p>
							</div>
							<Switch name="page-unblur" aria-describedby="unblur-desc" />
						</Label>
						<RestartTextbook userId={userId} />
					</fieldset>

					<footer className="flex justify-end">
						<Button type="submit" disabled={pending} pending={pending}>
							Save changes
						</Button>
					</footer>
				</form>
			</SheetContent>
		</Sheet>
	);
};
