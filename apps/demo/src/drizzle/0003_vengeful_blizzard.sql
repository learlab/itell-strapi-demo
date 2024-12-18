CREATE TABLE IF NOT EXISTS "survey_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"survey_type" text NOT NULL,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_answers" ADD CONSTRAINT "survey_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
