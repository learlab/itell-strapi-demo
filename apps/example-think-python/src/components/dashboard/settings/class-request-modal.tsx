"use client";

import { Button, Label } from "@/components/client-components";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/spinner";
import { Input } from "@itell/ui/server";
import { User } from "@prisma/client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
	className?: string;
	user: User;
};

export const ClassRequestModal = ({ className, user }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		const email = e.currentTarget.email.value;
		const message = e.currentTarget.message.value;

		const response = await fetch("/api/send", {
			method: "POST",
			body: JSON.stringify({
				email,
				message,
			}),
		});
		if (response.status === 400) {
			toast.error(
				"An error happened while sending your message. Email lear.lab.vu@gmail.com directly to let us know.",
			);
		} else {
			setOpen(false);
			toast.success("Your message has been sent.");
		}

		setIsLoading(false);
	}
	return (
		<Dialog open={open} onOpenChange={(val) => setOpen(val)}>
			<DialogTrigger>
				<p className="text-muted-foreground underline mt-8">
					Contact us for using intelligent textbooks for your class
				</p>
			</DialogTrigger>

			<DialogContent className={className}>
				<DialogHeader>
					<DialogTitle>Request a class code</DialogTitle>
					<DialogDescription>
						Send us a message to use this textbook for your own class. After you
						are approved, you will be emailed a class code to send to students.
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<Input
						name="email"
						type="email"
						placeholder="your email"
						className="my-4"
					/>
					<Label>Message</Label>
					<textarea
						className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						name="message"
					/>
					<div className="flex justify-end">
						<Button type="submit" variant="outline" disabled={isLoading}>
							{isLoading ? <Spinner /> : "Send"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
