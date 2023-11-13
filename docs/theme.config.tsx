import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
	logo: <span>ITELL</span>,
	project: {
		link: "https://github.com/learlab/itell",
	},
	chat: {
		link: "https://github.com/learlab/itell/discussions",
	},
	docsRepositoryBase: "https://github.com/shuding/nextra-docs-template",
	footer: {
		text: "Building intelligent textbooks powered by AI",
	},
};

export default config;
