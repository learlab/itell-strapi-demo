import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
	createNavigationConfig((defineRoute) => ({
		home: defineRoute("/", {
			search: z.object({
				text: z.string().optional(),
				page: z.coerce.number().optional(),
				example: z.string().optional(),
			}),
		}),
	}));
