"use client";

import { Avatar as BaseAvatar } from "@/components/client-components";
import { Session, User } from "@prisma/client";
import { Avatar } from "./ui/avatar";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	user: {
		image: string | null;
		name: string | null;
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
