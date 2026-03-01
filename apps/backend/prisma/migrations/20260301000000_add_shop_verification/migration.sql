-- AlterTable: Add verification fields to shops
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "is_google_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "is_customer_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "google_place_id" TEXT;
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "google_rating" DECIMAL(3,2);
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "google_reviews_count" INTEGER DEFAULT 0;
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "verification_status" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "verification_notes" TEXT;
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "verified_at" TIMESTAMP(3);

-- Create index for Google Place ID
CREATE INDEX IF NOT EXISTS "shops_google_place_id_idx" ON "shops"("google_place_id");
CREATE INDEX IF NOT EXISTS "shops_verification_status_idx" ON "shops"("verification_status");
