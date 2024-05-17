import {
	boolean,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const code_challenge_method = pgEnum("code_challenge_method", [
	"s256",
	"plain",
]);
export const factor_status = pgEnum("factor_status", [
	"unverified",
	"verified",
]);
export const factor_type = pgEnum("factor_type", ["totp", "webauthn"]);
export const one_time_token_type = pgEnum("one_time_token_type", [
	"confirmation_token",
	"reauthentication_token",
	"recovery_token",
	"email_change_token_new",
	"email_change_token_current",
	"phone_change_token",
]);
export const key_status = pgEnum("key_status", [
	"default",
	"valid",
	"invalid",
	"expired",
]);
export const key_type = pgEnum("key_type", [
	"aead-ietf",
	"aead-det",
	"hmacsha512",
	"hmacsha256",
	"auth",
	"shorthash",
	"generichash",
	"kdf",
	"secretbox",
	"secretstream",
	"stream_xchacha20",
]);
export const action = pgEnum("action", [
	"INSERT",
	"UPDATE",
	"DELETE",
	"TRUNCATE",
	"ERROR",
]);
export const equality_op = pgEnum("equality_op", [
	"eq",
	"neq",
	"lt",
	"lte",
	"gt",
	"gte",
	"in",
]);

export const users = pgTable("users", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	image: text("image"),
	createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		mode: "date",
		withTimezone: true,
	})
		.defaultNow()
		.notNull(),
	pageSlug: text("page_slug"),
	timeZone: text("time_zone"),
	googleId: text("google_id"),
	prolificId: text("prolific_pid"),
	email: text("email"),
	role: text("role").default("user").notNull(),
	classId: text("class_id"),
	finished: boolean("finished").default(false).notNull(),
});

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
	expiresAt: timestamp("expires_at", {
		mode: "date",
		withTimezone: true,
	}).notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
});

export const events = pgTable("events", {
	id: serial("id").primaryKey().notNull(),
	type: text("event_type").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
	pageSlug: text("page_slug").notNull(),
	data: jsonb("data"),
	createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const teachers = pgTable("teachers", {
	id: text("id").primaryKey().notNull(),
	isApproved: boolean("is_approved").default(false).notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	classId: text("class_id").notNull(),
});

export const summaries = pgTable("summaries", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
	classId: text("class_id"),
	pageSlug: text("page_slug").notNull(),
	isPassed: boolean("isPassed").notNull(),
	containmentScore: doublePrecision("containment_score").notNull(),
	similarityScore: doublePrecision("similarity_score").notNull(),
	wordingScore: doublePrecision("wording_score"),
	contentScore: doublePrecision("content_score"),
	text: text("text").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 3,
		mode: "string",
	}).notNull(),
});

export const notes = pgTable("notes", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
	y: doublePrecision("y").notNull(),
	noteText: text("note_text"),
	highlightedText: text("highlighted_text").notNull(),
	pageSlug: text("page_slug").notNull(),
	color: text("color").default("#3730a3").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: "string" })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", {
		precision: 3,
		mode: "string",
	}).notNull(),
	range: text("range").notNull(),
});

export const constructed_responses = pgTable(
	"constructed_responses",
	{
		id: serial("id").primaryKey().notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		pageSlug: text("page_slug").notNull(),
		chunkSlug: text("chunk_slug").notNull(),
		score: integer("score").notNull(),
		response: text("response").notNull(),
		createdAt: timestamp("created_at", { precision: 3, mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			user_id_idx: index("constructed_responses_user_id_idx").on(table.userId),
		};
	},
);

export const constructed_responses_feedback = pgTable(
	"constructed_responses_feedback",
	{
		id: serial("id").primaryKey().notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		pageSlug: text("page_slug").notNull(),
		chunkSlug: text("chunk_slug").notNull(),
		isPositive: boolean("is_positive").notNull(),
		feedback: text("feedback").notNull(),
		tags: text("tags").array(),
		createdAt: timestamp("created_at", { precision: 3, mode: "string" })
			.defaultNow()
			.notNull(),
	},
);

export const focus_times = pgTable(
	"focus_times",
	{
		id: serial("id").primaryKey().notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "cascade",
			}),
		pageSlug: text("page_slug").notNull(),
		data: jsonb("data").notNull(),
		createdAt: timestamp("created_at", { precision: 3, mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", {
			precision: 3,
			mode: "string",
		}).notNull(),
	},
	(table) => {
		return {
			focus_times_pkey: primaryKey({
				columns: [table.userId, table.pageSlug],
				name: "focus_times_pkey",
			}),
		};
	},
);

export const chat_messages = pgTable(
	"chat_messages",
	{
		id: serial("id").primaryKey().notNull(),
		userId: text("user_id").notNull(),
		pageSlug: text("page_slug").notNull(),
		// TODO: failed to parse database type 'jsonb[]'
		data: jsonb("data").array(),
		createdAt: timestamp("created_at", { precision: 3, mode: "string" })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", {
			precision: 3,
			mode: "string",
		}).notNull(),
	},
	(table) => {
		return {
			chat_messages_pkey: primaryKey({
				columns: [table.userId, table.pageSlug],
				name: "chat_messages_pkey",
			}),
		};
	},
);
