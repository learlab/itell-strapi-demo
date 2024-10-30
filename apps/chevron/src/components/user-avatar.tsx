import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { type User } from "lucia";

interface Props extends React.ComponentPropsWithoutRef<typeof Avatar> {
  user: User;
  className?: string;
  alt?: string;
}

export function UserAvatar({ user, className, alt, ...rest }: Props) {
  const name = user.name?.[0]?.toUpperCase() ?? "User";

  return (
    <Avatar className={className} {...rest}>
      {user.image ? (
        <>
          <AvatarImage src={user.image} alt={alt ?? "user profile photo"} />
          <AvatarFallback>{name}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback>{name}</AvatarFallback>
      )}
    </Avatar>
  );
}
