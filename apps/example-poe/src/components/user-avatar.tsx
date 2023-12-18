"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./client-components";
import { User } from "@prisma/client";

interface Props extends React.ComponentPropsWithoutRef<typeof Avatar> {
	user: Pick<User, "name" | "image" | "email">;
}

export default function UserAvatar({ user, ...rest }: Props) {
	return (
		<Avatar {...rest}>
			{user.image ? (
				<AvatarImage alt="Picture" src={user.image} />
			) : (
				<AvatarFallback>
					<span className="sr-only">{user.name}</span>
					<span>{user.name?.[0]?.toUpperCase()}</span>
				</AvatarFallback>
			)}
		</Avatar>
	);
}
