"use client";

import { updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/interval-error";
import { Spinner } from "@/components/spinner";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";
import {
	Button,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@itell/ui/client";
import { User } from "lucia";
import React from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

const timeZoneData = [
	"America/Los_Angeles", // Pacific Time Zone
	"America/Denver", // Mountain Time Zone
	"America/Chicago", // Central Time Zone
	"America/New_York", // Eastern Time Zone
	"America/Anchorage", // Alaska Time Zone
	"Pacific/Honolulu", // Hawaii-Aleutian Time Zone
	"Pacific/Pago_Pago", // Samoa Time Zone
	"Pacific/Saipan", // Chamorro Time Zone
];

export const WebsiteSettings = ({ user }: { user: User }) => {
	const { execute, isError, isPending } = useServerAction(updateUserAction);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = {
			timeZone: String(formData.get("time_zone")),
		};

		const [_, err] = await execute(data);
		if (!err) {
			toast.success("Settings saved!");
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="mb-4 text-lg font-medium leading-relaxed">
				Website Settings
			</h3>
			<form onSubmit={onSubmit} className="grid gap-2 max-w-2xl">
				<Label htmlFor="time_zone">Time Zone</Label>
				<Select
					name="time_zone"
					defaultValue={user.timeZone || DEFAULT_TIME_ZONE}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a time zone" />
					</SelectTrigger>
					<SelectContent>
						{timeZoneData.map((timeZone) => (
							<SelectItem value={timeZone} key={timeZone}>
								{timeZone}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{isError && <InternalError />}
				<footer>
					<Button disabled={isPending} type="submit">
						<span className="flex items-center gap-2">
							{isPending && <Spinner className="size-4" />}
							Save
						</span>
					</Button>
				</footer>
			</form>
		</div>
	);
};
