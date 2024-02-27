import { cn } from "@itell/core/utils";
import Image from "next/image";

export const TextOverImage = ({
	src,
	className,
	children,
	width = 600,
	height = 400,
	alt = "Card Image",
	rounded = true,
	priority = false,
}: {
	src: string;
	className?: string;
	children: React.ReactNode;
	alt?: string;
	width?: number;
	height?: number;
	rounded?: boolean;
	priority?: boolean;
}) => {
	return (
		<div className="hidden md:flex justify-center items-center relative group">
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				priority={priority}
				className={cn(
					"blur-sm group-hover:blur-md transition-all duration-100 object-cover",
					{
						"rounded-md": rounded,
					},
				)}
			/>
			<div
				className={cn(
					"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group-hover:font-bold",
					className,
				)}
			>
				<div className="text-xl leading-relaxed text-card-foreground">
					{children}
				</div>
			</div>
		</div>
	);
};
