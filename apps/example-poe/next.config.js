const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({
	output: "standalone",
	redirects: async () => {
		return [
			{
				source: "/module-1",
				destination: "/module-1/chapter-1",
				permanent: true,
			},
			{
				source: "/module-2",
				destination: "/module-2/chapter-5",
				permanent: true,
			},
			{
				source: "/module-3",
				destination: "/module-3/chapter-9",
				permanent: true,
			},
			{
				source: "/module-4",
				destination: "/module-4/chapter-13",
				permanent: true,
			},
			{
				source: "/module-5",
				destination: "/module-5/chapter-17",
				permanent: true,
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},
});

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: "Referrer-Policy",
		value: "origin-when-cross-origin",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];
