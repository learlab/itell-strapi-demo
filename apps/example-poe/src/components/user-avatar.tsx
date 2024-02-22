import { Avatar as BaseAvatar } from "@/components/client-components";
import { SessionUser } from "@/lib/auth";
import { Avatar } from "./ui/avatar";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	user: NonNullable<SessionUser>;
}

export const UserAvatar = ({ user, ...rest }: Props) => {
	return (
		<Avatar
			{...rest}
			src={user.image || null}
			fallback={user.name?.[0]?.toUpperCase() || "User"}
		/>
	);
};
