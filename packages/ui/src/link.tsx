import NextLink, { LinkProps } from "next/link";

interface CustomLinkProps extends LinkProps {
	href: string;
	children: React.ReactNode;
}

export const Link = ({ href, children, ...rest }: CustomLinkProps) => {
	if (href.startsWith("/")) {
		return (
			<NextLink href={href} {...rest}>
				{children}
			</NextLink>
		);
	}

	if (href.startsWith("#")) {
		return (
			<a href={href} {...rest}>
				{children}
			</a>
		);
	}

	return (
		<a target="_blank" rel="noopener noreferrer" {...rest}>
			{children}
		</a>
	);
};
