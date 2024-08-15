import { cn } from "@itell/utils";
import { ExpandIcon } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent } from "./dialog";

interface FigureProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	layout?: "responsive" | "fill";
	className?: string;
	children?: React.ReactNode;
	rounded?: boolean;
	floatLeft?: boolean;
	floatRight?: boolean;
	expandable?: boolean;
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
	floatLeft = false,
	floatRight = false,
	expandable = true,
	showCaption = false,
	onExpandClick,
}: FigureProps) => {
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
				/>
				{expandable && (
					<Button
						variant="outline"
						className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ease-in-out "
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
			<div className="relative">
				<Figure
					{...props}
					showCaption={false}
					onExpandClick={() => {
						setModalOpen(true);
					}}
				/>
			</div>
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="max-w-4xl mx-auto">
					<Figure {...props} showCaption={true} expandable={false} />
				</DialogContent>
			</Dialog>
		</div>
	);
};
