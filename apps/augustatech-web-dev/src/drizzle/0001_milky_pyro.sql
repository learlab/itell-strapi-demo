ALTER TABLE "users" ADD COLUMN "preferences" jsonb;--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN IF EXISTS "y";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "time_zone";