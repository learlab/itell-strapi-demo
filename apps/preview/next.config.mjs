/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "nbjrajrmujlgxmcvqsge.supabase.co",
			},
			{
				protocol: "https",
				hostname: "cdn.simpleicons.org",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		optimizePackageImports: ["shiki"],
	},
};

export default nextConfig;
