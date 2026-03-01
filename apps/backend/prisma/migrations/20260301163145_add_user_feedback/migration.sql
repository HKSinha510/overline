-- CreateTable
CREATE TABLE "user_feedback" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,
    "staff_id" TEXT,
    "rating" INTEGER NOT NULL,
    "behavior" TEXT,
    "note" TEXT,
    "was_on_time" BOOLEAN NOT NULL DEFAULT true,
    "was_polite" BOOLEAN NOT NULL DEFAULT true,
    "would_serve_again" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_feedback_booking_id_key" ON "user_feedback"("booking_id");

-- CreateIndex
CREATE INDEX "user_feedback_user_id_idx" ON "user_feedback"("user_id");

-- CreateIndex
CREATE INDEX "user_feedback_shop_id_idx" ON "user_feedback"("shop_id");

-- CreateIndex
CREATE INDEX "user_feedback_booking_id_idx" ON "user_feedback"("booking_id");
