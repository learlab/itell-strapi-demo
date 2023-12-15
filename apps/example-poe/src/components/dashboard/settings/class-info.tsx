import { User } from "@prisma/client";

import { ClassRegister } from "./class-register";
import { QuitClass } from "./quit-class";

type Props = {
	user: User;
	teacher: User;
};

export const ClassInfo = ({ user, teacher }: Props) => {
	return (
		<div>
			<h3 className="mb-4 text-lg font-medium">Class Information</h3>
			<p className="text-muted-foreground text-sm max-w-lg mb-4">
				You are enrolled in a class taught by {teacher.name}.
			</p>
			<QuitClass userId={user.id} />
		</div>
	);
};
