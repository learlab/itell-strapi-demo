import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/client";
import { useSession } from "./provider/session-provider";

interface Props extends React.ComponentPropsWithoutRef<typeof Avatar> {
	className?: string;
	alt?: string;
}

export const UserAvatar = ({ className, alt, ...rest }: Props) => {
	const session = useSession();
	if (!session.user) return null;
	const name = session.user.name?.[0]?.toUpperCase() || "User";

	return (
		<Avatar className={className} {...rest}>
			{session.user.image ? (
				<>
					<AvatarImage
						src={session.user.image}
						alt={alt || "user profile photo"}
					/>
					<AvatarFallback>{name}</AvatarFallback>
				</>
			) : (
				<AvatarFallback>{name}</AvatarFallback>
			)}
		</Avatar>
	);
};
