import { User } from "@/drizzle/schema";
import { QuitClass } from "./quit-class";

type Props = {
	user: User;
	teacherName: string;
};

export const ClassInfo = ({ user, teacherName }: Props) => {
	return (
		<div>
			<h3 className="mb-4 text-lg font-medium">Class Information</h3>
			<p className="text-muted-foreground text-sm max-w-lg mb-4">
				You are enrolled in a class taught by {teacherName}.
			</p>
			<QuitClass userId={user.id} />
		</div>
	);
};
