"use client";

import { Spinner } from "@/components/spinner";
import { User } from "@/drizzle/schema";
import { DEFAULT_TIME_ZONE } from "@/lib/constants";
import { updateUser } from "@/lib/user/actions";
import {
	Button,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@itell/ui/client";
import { Errorbox } from "@itell/ui/server";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

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

type FormState = { error: null | string };

const SubmitButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending}>
			{pending && <Spinner className="mr-2 size-4" />} Save
		</Button>
	);
};

export const WebsiteSettings = ({ user }: { user: User }) => {
	const router = useRouter();
	const onSubmit = async (
		prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		const data = {
			timeZone: String(formData.get("time_zone")),
		};

		try {
			await updateUser(user.id, data);
			toast.success("Settings saved!");
			router.refresh();
			return { error: null };
		} catch (err) {
			return { error: "Failed to save settings. Please try again later." };
		}
	};

	const [formState, formAction] = useFormState(onSubmit, { error: null });

	return (
		<div className="space-y-4">
			<h3 className="mb-4 text-lg font-medium leading-relaxed">
				Website Settings
			</h3>
			<form action={formAction} className="space-y-2 max-w-2xl">
				{formState.error && (
					<Errorbox title="Error">{formState.error}</Errorbox>
				)}
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
					<SubmitButton />
				</Select>
			</form>
		</div>
	);
};
