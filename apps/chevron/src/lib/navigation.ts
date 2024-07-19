import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

export const { routes, useSafeParams, useSafeSearchParams } =
	createNavigationConfig((defineRoute) => ({
		home: defineRoute("/", {
			search: z
				.object({
					login: z.string().optional(),
				})
				.default({ login: undefined }),
		}),
		auth: defineRoute("/auth", {
			search: z
				.object({
					error: z.string().optional(),
					join_class_code: z.string().optional(),
				})
				.default({
					error: undefined,
					join_class_code: undefined,
				}),
		}),
		textbook: defineRoute("/[slug]", {
			params: z.object({
				slug: z.string(),
			}),
			search: z
				.object({
					summary: z.string().optional(),
				})
				.default({ summary: undefined }),
		}),
		dashboard: defineRoute("/dashboard", {
			search: z
				.object({
					join_class_code: z.string().optional(),
					reading_time_level: z.string().default(ReadingTimeChartLevel.week_1),
					tab: z.enum(["class", "personal"]).optional(),
				})
				.default({
					reading_time_level: ReadingTimeChartLevel.week_1,
					join_class_code: undefined,
				}),
		}),
		student: defineRoute("/dashboard/student/[id]", {
			params: z.object({
				id: z.string(),
			}),
			search: z
				.object({
					reading_time_level: z.string().default(ReadingTimeChartLevel.week_1),
				})
				.default({ reading_time_level: ReadingTimeChartLevel.week_1 }),
		}),
		settings: defineRoute("/dashboard/settings", {
			search: z
				.object({
					join_class_code: z.string().optional(),
				})
				.default({ join_class_code: undefined }),
		}),
	}));
