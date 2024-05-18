import { relations } from "drizzle-orm/relations";
import {
	events,
	constructed_responses,
	constructed_responses_feedback,
	focus_times,
	notes,
	sessions,
	summaries,
	users,
} from "./schema";

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const eventsRelations = relations(events, ({ one }) => ({
	user: one(users, {
		fields: [events.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	events: many(events),
	summaries: many(summaries),
	notes: many(notes),
	constructed_responses: many(constructed_responses),
	constructed_responses_feedbacks: many(constructed_responses_feedback),
	focus_times: many(focus_times),
}));

export const summariesRelations = relations(summaries, ({ one }) => ({
	user: one(users, {
		fields: [summaries.userId],
		references: [users.id],
	}),
}));

export const notesRelations = relations(notes, ({ one }) => ({
	user: one(users, {
		fields: [notes.userId],
		references: [users.id],
	}),
}));

export const constructed_responsesRelations = relations(
	constructed_responses,
	({ one }) => ({
		user: one(users, {
			fields: [constructed_responses.userId],
			references: [users.id],
		}),
	}),
);

export const constructed_responses_feedbackRelations = relations(
	constructed_responses_feedback,
	({ one }) => ({
		user: one(users, {
			fields: [constructed_responses_feedback.userId],
			references: [users.id],
		}),
	}),
);

export const focus_timesRelations = relations(focus_times, ({ one }) => ({
	user: one(users, {
		fields: [focus_times.userId],
		references: [users.id],
	}),
}));
