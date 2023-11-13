import {
	YoutubeVideo,
	getYoutubeLinkFromEmbed,
} from "../src/components/youtube";
import { render } from "./utils";
import React from "react";
import { screen } from "@testing-library/react";
import { it, expect } from "vitest";

const embedUrl =
	"https://www.youtube.com/embed/?list=PLKcwEC4jDwiN5sOIay2qkpjTuvRTvkdso&listType=playlist&wmode=opaque&widget_referrer=https%3A%2F%2Fintromacro.econ.gatech.edu%2F&origin=https%3A%2F%2Fcdn.embedly.com&widgetid=1&enablejsapi=1";
const buttonTitle = "How to Use FRED";

it("should work", () => {
	const { user } = render(<YoutubeVideo src={embedUrl} title={buttonTitle} />);
	const title = screen.getByTestId("title");
	const link = screen.getByRole("link") as HTMLAnchorElement;

	expect(title).toHaveTextContent(buttonTitle);
	expect(link.href).toBe(getYoutubeLinkFromEmbed(embedUrl));
});
