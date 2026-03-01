/*
  Warnings:

  - Made the column `google_reviews_count` on table `shops` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shops" ALTER COLUMN "google_reviews_count" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3);
