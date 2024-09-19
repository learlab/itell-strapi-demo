import { Avatar as BaseAvatar } from "@itell/ui/avatar";
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
