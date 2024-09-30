ALTER TABLE "users" ADD COLUMN "condition_assignments" jsonb;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "condition";