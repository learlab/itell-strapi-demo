import { max } from "drizzle-orm";
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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

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

const CreatedAt = timestamp("created_at", {
  mode: "date",
  withTimezone: true,
})
  .defaultNow()
  .notNull();

const UpdatedAt = timestamp("updated_at", {
  mode: "date",
  withTimezone: true,
})
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull();

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  image: text("image"),
  pageSlug: text("page_slug"),
  email: text("email"),
  role: text("role").default("user").notNull(),
  classId: text("class_id"),
  finished: boolean("finished").default(false).notNull(),
  preferences: jsonb("preferences").$type<UserPreferences>(),
  personalization: jsonb("personalization_data").$type<PersonalizationData>(),
  conditionAssignments: jsonb("condition_assignments")
    .$type<ConditionAssignments>()
    .notNull(),
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  consent: boolean("consent").default(null),
});

export type ConditionAssignments = Record<string, string>;
export type User = InferSelectModel<typeof users>;
export type CreateUserInput = InferInsertModel<typeof users>;
export const UserPreferencesSchema = z
  .object({
    theme: z.string(),
    note_color_light: z.string(),
    note_color_dark: z.string(),
  })
  .partial();

export const PersonalizationDataSchema = z
  .object({
    summary_streak: z.number(),
    max_summary_streak: z.number(),
    cri_streak: z.number(),
    max_cri_streak: z.number(),
  })
  .partial();

export const CreateUserSchema = createInsertSchema(users, {
  preferences: UserPreferencesSchema.optional(),
  personalization: PersonalizationDataSchema.optional(),
  conditionAssignments: z.record(z.string()),
});
export const UpdateUserSchema = CreateUserSchema.partial();

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type PersonalizationData = z.infer<typeof PersonalizationDataSchema>;

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    expiresAt: timestamp("expires_at", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    createdAt: CreatedAt,
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    provider_id: text("provider_id").notNull(),
    provider_user_id: text("provider_user_id").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.provider_id, table.provider_user_id],
      name: "oauth_accounts_pk",
    }),
  ]
);

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey().notNull(),
    type: text("event_type").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    pageSlug: text("page_slug").notNull(),
    data: jsonb("data"),
    createdAt: CreatedAt,
  },
  (table) => [
    index("events_user_id_idx").on(table.userId),
    index("events_type_idx").on(table.type),
  ]
);
export const CreateEventSchema = createInsertSchema(events);

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey().notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  classId: text("class_id").notNull(),
});
export const TeacherSchema = createSelectSchema(teachers);

export const summaries = pgTable(
  "summaries",
  {
    id: serial("id").primaryKey().notNull(),
    text: text("text").notNull(),
    condition: text("condition").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    pageSlug: text("page_slug").notNull(),
    isPassed: boolean("is_passed").notNull(),
    containmentScore: doublePrecision("containment_score").notNull(),
    similarityScore: doublePrecision("similarity_score").notNull(),
    contentScore: doublePrecision("content_score"),
    contentThreshold: doublePrecision("content_threshold"),
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  },
  (table) => [index("summaries_user_id_idx").on(table.userId)]
);

export type Summary = InferSelectModel<typeof summaries>;
export type CreateSummaryInput = InferInsertModel<typeof summaries>;
export const CreateSummarySchema = createInsertSchema(summaries);

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    noteText: text("note_text").notNull(),
    highlightedText: text("highlighted_text").notNull(),
    pageSlug: text("page_slug").notNull(),
    chunkSlug: text("chunk_slug"),
    color: text("color").notNull(),
    range: text("range").notNull(),
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_page_slug_idx").on(table.pageSlug),
  ]
);

export const CreateNoteSchema = createInsertSchema(notes);
export const UpdateNoteSchema = CreateNoteSchema.partial();
export type Note = InferSelectModel<typeof notes>;

export const constructed_responses = pgTable(
  "constructed_responses",
  {
    id: serial("id").primaryKey().notNull(),
    text: text("text").notNull(),
    score: integer("score").notNull(),
    condition: text("condition").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    pageSlug: text("page_slug").notNull(),
    chunkSlug: text("chunk_slug").notNull(),
    createdAt: CreatedAt,
  },
  (table) => [
    index("constructed_responses_user_id_idx").on(table.userId),
    index("constructed_responses_page_slug_idx").on(table.pageSlug),
  ]
);

export type ConstructedResponse = InferSelectModel<
  typeof constructed_responses
>;
export const CreateConstructedResponseSchema = createInsertSchema(
  constructed_responses
);

export const constructed_responses_feedback = pgTable(
  "constructed_responses_feedback",
  {
    id: serial("id").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    pageSlug: text("page_slug").notNull(),
    chunkSlug: text("chunk_slug").notNull(),
    isPositive: boolean("is_positive").notNull(),
    text: text("text").notNull(),
    tags: text("tags").array().notNull(),
    createdAt: CreatedAt,
  }
);
export const CreateConstructedResponseFeedbackSchema = createInsertSchema(
  constructed_responses_feedback,
  {
    // fix for https://github.com/drizzle-team/drizzle-orm/issues/1110
    tags: z.array(z.string()),
  }
);

export const focus_times = pgTable(
  "focus_times",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    pageSlug: text("page_slug").notNull(),
    data: jsonb("data").notNull().$type<FocusTimeData>(),
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.pageSlug],
      name: "focus_times_pkey",
    }),
  ]
);
export const CreateFocusTimeSchema = createInsertSchema(focus_times);

export const chat_messages = pgTable(
  "chat_messages",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    pageSlug: text("page_slug").notNull(),
    data: jsonb("data").array().notNull().$type<ChatMessageData[]>(),
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.pageSlug],
      name: "chat_messages_pkey",
    }),
  ]
);
export const ChatMessageDataSchema = z.object({
  text: z.string(),
  is_user: z.boolean(),
  is_stairs: z.boolean(),
  timestamp: z.number(),
  stairs_data: z
    .object({
      chunk: z.string(),
      question_type: z.string(),
    })
    .optional(),
  context: z.string().optional(),
  transform: z.boolean().optional(),
});

export type ChatMessageData = z.infer<typeof ChatMessageDataSchema>;
export type FocusTimeData = Record<string, number>;
