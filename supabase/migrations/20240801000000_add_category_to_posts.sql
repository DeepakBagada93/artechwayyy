-- Add the 'category' column to the 'posts' table
ALTER TABLE "public"."posts"
ADD COLUMN "category" "text" NULL;

-- Backfill existing posts with a default category if needed
UPDATE "public"."posts"
SET "category" = 'General'
WHERE "category" IS NULL;

-- It's a good practice to set it as NOT NULL after backfilling
-- if all posts should have a category going forward.
-- ALTER TABLE "public"."posts"
-- ALTER COLUMN "category" SET NOT NULL;
