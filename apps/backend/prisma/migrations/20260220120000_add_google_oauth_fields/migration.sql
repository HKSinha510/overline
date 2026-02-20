-- AlterTable: Make hashedPassword nullable for OAuth users
ALTER TABLE "users" ALTER COLUMN "hashed_password" DROP NOT NULL;

-- AlterTable: Add Google OAuth fields
ALTER TABLE "users" ADD COLUMN "google_id" TEXT;
ALTER TABLE "users" ADD COLUMN "auth_provider" TEXT NOT NULL DEFAULT 'local';

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
