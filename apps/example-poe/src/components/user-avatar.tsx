import { Avatar as BaseAvatar } from "@/components/client-components";
import { Session } from "next-auth";
import { Avatar } from "./ui/avatar";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	user: {
		name: string | null | undefined;
		image: string | null | undefined;
	};
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
