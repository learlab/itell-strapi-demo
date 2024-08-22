const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
	process.env.VELITE_STARTED = "1";
	const { build } = await import("velite");
	await build({ watch: isDev, clean: !isDev });
}

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
		typedRoutes: true,
	},
};

export default nextConfig;
