-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cancelled_bookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completed_bookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "no_show_bookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_bookings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trust_score" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
ALTER COLUMN "gender" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_messages_booking_id_idx" ON "chat_messages"("booking_id");

-- CreateIndex
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages"("created_at");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
