CREATE INDEX IF NOT EXISTS "events_user_id_idx" ON "events" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" ("user_id");