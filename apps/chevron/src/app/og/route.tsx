import { SiteConfig } from "@/config/site";
import { ImageResponse } from "next/og";
const size = {
	width: 1200,
	height: 630,
};
export const runtime = "edge";

export const GET = async (req: Request) => {
	const url = new URL(req.url);
	const heading = url.searchParams.get("title") || SiteConfig.title;
	const font = fetch(
		new URL("../../../public/fonts/kaisei-tokumin-bold.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const image = fetch(
		new URL("../../../public/images/avatars/favicon.png", import.meta.url),
	).then((res) => res.arrayBuffer());
	const fontData = await font;
	const imageData = await image;
	return new ImageResponse(
		<div
			style={{
				backgroundColor: "#1c1c28",
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				padding: "40px 40px",
			}}
		>
			<header
				style={{
					fontSize: 20,
					fontStyle: "normal",
					color: "gray",
				}}
			>
				<p>{SiteConfig.host}</p>
			</header>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "40px",
					marginBottom: "300px",
				}}
			>
				<img
					width="96"
					height="96"
					style={{ marginTop: "30px" }}
					// @ts-ignore
					src={imageData}
					alt="itell icon"
				/>
				<h1
					style={{
						fontSize: 60,
						whiteSpace: "pre-wrap",
						fontFamily: "Kaisei Tokumin",
						letterSpacing: "-0.05em",
						fontStyle: "normal",
						color: "white",
					}}
				>
					{heading}
				</h1>
			</div>
			<footer
				style={{
					display: "flex",
					color: "white",
					justifyContent: "space-between",
				}}
			>
				<p>A chapter from "{SiteConfig.title}"</p>
				<p>An intelligent textbook by LearLab</p>
			</footer>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Kaisei Tokumin",
					data: fontData,
					style: "normal",
				},
			],
		},
	);
};
