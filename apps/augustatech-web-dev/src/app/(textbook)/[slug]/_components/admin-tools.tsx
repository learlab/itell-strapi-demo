"use client";
import { resetUserAction, updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/interval-error";
import { useQuestionStore } from "@/components/provider/page-provider";
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
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

type Props = {
	condition: string;
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

export const AdminTools = ({ condition }: Props) => {
	const store = useQuestionStore();
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
			startTransition(() => {
				store.send({ type: "finishPage" });
			});
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
					<SettingsIcon className="size-4 xl:size-6" />
					<span>Admin tools</span>
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
						<RestartTextbook />
					</fieldset>

					<footer className="flex justify-end">
						<Button type="submit" disabled={isPending}>
							<span className="flex items-center gap-2">
								{isPending && <Spinner className="size-4" />}
								Save changes
							</span>
						</Button>
					</footer>

					{isError && <InternalError />}
				</form>
			</SheetContent>
		</Sheet>
	);
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
							window.location.href = data.pageSlug
								? makePageHref(data.pageSlug)
								: "/";
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
