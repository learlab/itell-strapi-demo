import { cn } from "@itell/core/utils";
import NextImage from "next/image";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
} from "./dialog";
import { Button } from "./button";
import { ExpandIcon } from "lucide-react";

type ImageProps = {
	src: string;
	alt: string;
	children: React.ReactNode;
	width?: number;
	height?: number;
	rounded?: boolean;
	floatLeft?: boolean;
	floatRight?: boolean;
	expandable?: boolean;
	onExpandClick?: () => void;
	caption?: boolean;
};

export const Figure = ({
	src,
	alt,
	children,
	width = 600,
	height = 400,
	rounded = true,
	floatLeft = false,
	floatRight = false,
	expandable = true,
	caption = true,
	onExpandClick,
}: ImageProps) => {
	return (
		<figure
			className={cn("group", {
				"md:float-left md:mr-4": floatLeft,
				"md:float-right md:ml-4": floatRight,
			})}
		>
			{/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div className="relative flex justify-center items-center">
				<NextImage
					className={cn("object-cover", {
						"rounded-md": rounded,
					})}
					src={src}
					alt={alt}
					width={width}
					height={height}
				/>
				{expandable && (
					<Button
						variant="outline"
						className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-in-out "
						onClick={onExpandClick}
					>
						<ExpandIcon className="w-4 h-4 fill-primary" />
					</Button>
				)}
			</div>
			{caption && (
				<figcaption
					className={cn(
						"mt-2 text-sm text-center text-gray-500 dark:text-gray-400",
						{ "md:w-72 lg:w-96": floatLeft || floatRight },
					)}
				>
					{children}
				</figcaption>
			)}
		</figure>
	);
};

export const Image = (props: Omit<ImageProps, "caption" | "onExpandClick">) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<div className="image">
			<div className="relative">
				<Figure
					{...props}
					onExpandClick={() => {
						setModalOpen(true);
					}}
				/>
			</div>
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="max-w-4xl mx-auto">
					<DialogHeader>
						<DialogDescription>{props.children}</DialogDescription>
					</DialogHeader>
					<Figure {...props} caption={false} expandable={false} />
				</DialogContent>
			</Dialog>
		</div>
	);
};
