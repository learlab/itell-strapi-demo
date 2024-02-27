"use client";

import {
	Avatar as BaseAvatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/client-components";

interface Props extends React.ComponentPropsWithoutRef<typeof BaseAvatar> {
	src: string | null;
	fallback: string;
}

export const Avatar = ({ src, fallback, ...rest }: Props) => {
	return (
		<BaseAvatar {...rest}>
			{src ? (
				<AvatarImage alt="Picture" src={src} />
			) : (
				<AvatarFallback>
					<span className="sr-only">{fallback}</span>
					<span>{fallback}</span>
				</AvatarFallback>
			)}
		</BaseAvatar>
	);
};
