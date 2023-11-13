import { cn } from "@itell/core/utils";

export const getYoutubeLinkFromEmbed = (url: string) => {
	const regex = /embed\/([\w-]+)\?/;
	const match = url.match(regex);

	if (match) {
		return `https://www.youtube.com/watch?v=${match[1]}`;
	}

	return url;
};

type Props = {
	src: string;
	width?: number;
	height?: number;
	youtube?: boolean;
	title?: string;
	children?: React.ReactNode;
};

export const YoutubeVideo = ({
	src,
	width = 500,
	height = 300,
	youtube = true,
	title,
	children,
}: Props) => {
	return (
		<div
			className={cn("my-4 rounded-md max-w-2xl mx-auto", {
				"border-2 p-2": youtube,
			})}
		>
			<div className="flex justify-center items-center flex-col p-4 gap-2">
				<iframe
					src={src}
					width={width}
					height={height}
					className="rounded-md aspect-video w-full mb-4"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
				{title && (
					<h5
						className="text-xl font-semibold leading-snug"
						data-testid="title"
					>
						{title}
					</h5>
				)}
				{children && <div className="text-sm font-light">{children}</div>}
			</div>
		</div>
	);
};
