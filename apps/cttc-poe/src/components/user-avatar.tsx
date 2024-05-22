import { Avatar as BaseAvatar } from "@/components/client-components";
import { useSession } from "@/lib/auth/context";
import { Avatar } from "./ui/avatar";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	image: string | null;
	name: string | null;
}

export const UserAvatar = ({ image, name, ...rest }: Props) => {
	return (
		<Avatar
			{...rest}
			src={image}
			fallback={name?.[0]?.toUpperCase() || "User"}
		/>
	);
};
