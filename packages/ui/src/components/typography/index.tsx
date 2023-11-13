import React from "react";
import typographyStyles from "./typography-styles";
import typographyColors from "./typography-colors";
import { cn } from "@itell/core/utils";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
interface TypographyProps extends React.ComponentProps<any> {
	children: React.ReactNode;
	className?: string;
	as?: React.ElementType;
	variant?: keyof typeof typographyStyles["styles"]["variants"];
	color?: keyof typeof typographyColors;
	textGradient?: boolean;
}

export const Typography = ({
	as: Component = "p",
	variant = "paragraph",
	color = "inherit",
	textGradient = false,
	className = "",
	children,
	...rest
}: TypographyProps) => {
	const variantClasses = Object.values(
		typographyStyles.styles.variants[variant],
	).join(" ");
	const colors = typographyColors[color];
	if (textGradient && "gradient" in colors)
		colors.color = `${colors.gradient} ${typographyStyles.styles.textGradient}`;
	const classes = cn(variantClasses, colors.color, className);
	return (
		<Component {...rest} className={classes}>
			{children}
		</Component>
	);
};
