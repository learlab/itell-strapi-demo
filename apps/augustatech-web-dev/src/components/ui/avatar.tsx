"use client";

import {
	AvatarFallback,
	AvatarImage,
	Avatar as BaseAvatar,
} from "@itell/ui/client";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	src: string | null;
	fallback: string;
}

export const Avatar = ({ src, fallback, ...rest }: Props) => {
	return (
		<BaseAvatar {...rest}>
			{src ? (
				<AvatarImage alt="User profile photo" src={src} />
			) : (
				<AvatarFallback>
					<span className="User profile photo">{fallback}</span>
					<span>{fallback}</span>
				</AvatarFallback>
			)}
		</BaseAvatar>
	);
};
