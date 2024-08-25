"use client";
import { cn } from "@itell/utils";
import { ExpandIcon } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { Button } from "./button.js";
import { Dialog, DialogContent } from "./dialog.js";

interface FigureProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	priority?: boolean;
	layout?: "responsive" | "fill";
	className?: string;
	children?: React.ReactNode;
	rounded?: boolean;
	floatLeft?: boolean;
	floatRight?: boolean;
	expandable?: boolean | string;
	onExpandClick?: () => void;
	showCaption?: boolean;
}

export const Figure = ({
	src,
	alt,
	width = 600,
	height = 400,
	className,
	children,
	layout,
	rounded = true,
	priority = false,
	floatLeft = false,
	floatRight = false,
	showCaption = false,
	expandable = true,
	onExpandClick,
}: FigureProps) => {
	const shouldExpand = expandable && expandable !== "false";
	return (
		<figure
			className={cn("group", {
				"md:float-left md:mr-4": floatLeft,
				"md:float-right md:ml-4": floatRight,
			})}
		>
			<div className="relative flex justify-center items-center">
				<NextImage
					className={cn("object-cover", {
						"rounded-md": rounded,
						className,
					})}
					src={src}
					alt={alt}
					width={width}
					height={height}
					layout={layout}
					priority={priority}
				/>
				{shouldExpand && (
					<Button
						variant="outline"
						className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-in-out"
						onClick={onExpandClick}
						aria-label="expand image"
					>
						<ExpandIcon className="size-4 fill-primary" />
					</Button>
				)}
			</div>
			{showCaption && (
				<figcaption
					className={cn(
						"mt-2 text-sm text-center text-gray-500 dark:text-gray-400",
						{ "md:w-72 lg:w-96": floatLeft || floatRight },
					)}
				>
					{children || alt}
				</figcaption>
			)}
		</figure>
	);
};

type ImageProps = Omit<FigureProps, "caption" | "onExpandClick">;

export declare namespace Image {
	export type Props = ImageProps;
}

export const Image = (props: ImageProps) => {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<div className="image">
			<Figure
				{...props}
				showCaption={false}
				onExpandClick={() => {
					setModalOpen(true);
				}}
			/>
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="max-w-4xl mx-auto">
					<Figure {...props} showCaption={true} expandable={false} />
				</DialogContent>
			</Dialog>
		</div>
	);
};
