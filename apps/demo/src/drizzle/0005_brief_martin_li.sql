ALTER TABLE "survey_answers" RENAME TO "survey_sessions";--> statement-breakpoint
ALTER TABLE "survey_sessions" RENAME COLUMN "survey_type" TO "survey_id";--> statement-breakpoint
ALTER TABLE "survey_sessions" DROP CONSTRAINT "survey_answers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_sessions" ADD COLUMN "finished_at" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_sessions" ADD CONSTRAINT "survey_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "survey_completed";
