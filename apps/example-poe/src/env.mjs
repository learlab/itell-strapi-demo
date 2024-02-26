import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
	AZURE_CLIENT_ID: z.string(),
	AZURE_CLIENT_SECRET: z.string(),
	NEXTAUTH_URL: z.string(),
	NEXTAUTH_SECRET: z.string(),
	DATABASE_URL: z.string(),
	ADMINS: z.string().optional(),
	CLASS_ONE_EMAILS: z
		.string()
		.optional()
		.transform((val) => (val ? JSON.parse(val) : [])),
	CLASS_TWO_EMAILS: z
		.string()
		.optional()
		.transform((val) => (val ? JSON.parse(val) : [])),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
	NEXT_PUBLIC_SCORE_API_URL: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
	NODE_ENV: process.env.NODE_ENV,
	AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET: process.env.AZURE_CLIENT_SECRET,
	NEXTAUTH_URL: process.env.NEXTAUTH_URL,
	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
	SCORE_API_URL: process.env.SCORE_API_URL,
	DATABASE_URL: process.env.DATABASE_URL,
	NEXT_PUBLIC_SCORE_API_URL: process.env.NEXT_PUBLIC_SCORE_API_URL,
	NO_FEEDBACK_EMAILS: process.env.NO_FEEDBACK_EMAILS,
	ADMINS: process.env.ADMINS,
	CLASS_ONE_EMAILS: process.env.CLASS_ONE_EMAILS,
	CLASS_TWO_EMAILS: process.env.CLASS_TWO_EMAILS,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION === false) {
	const isServer = typeof window === "undefined";

	const parsed = /** @type {MergedSafeParseReturn} */ (
		isServer
			? merged.safeParse(processEnv) // on server we can validate all env vars
			: client.safeParse(processEnv) // on client we can only validate the ones that are exposed
	);

	if (parsed.success === false) {
		console.error(
			"❌ Invalid environment variables:",
			parsed.error.flatten().fieldErrors,
		);
		throw new Error("Invalid environment variables");
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== "string") return undefined;
			// Throw a descriptive error if a server-side env var is accessed on the client
			// Otherwise it would just be returning `undefined` and be annoying to debug
			if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
				throw new Error(
					process.env.NODE_ENV === "production"
						? "❌ Attempted to access a server-side environment variable on the client"
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`,
				);
			return target[/** @type {keyof typeof target} */ (prop)];
		},
	});
}

export { env };
