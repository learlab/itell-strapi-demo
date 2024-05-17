import { SessionUser } from "@/lib/auth";
import { User } from "@prisma/client";
import { JoinClassForm } from "./join-class-form";

type Props = {
	user: User;
};

export const ClassRegister = async ({ user }: Props) => {
	return (
		<div className="space-y-4" id="enroll">
			<h3 className="mb-4 text-lg font-medium">Class Registration</h3>
			<JoinClassForm user={user} />
		</div>
	);
};
