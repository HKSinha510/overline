-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PREPAID', 'PAY_LATER');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('FREE_CASH_CREDIT', 'FREE_CASH_DEBIT', 'FREE_CASH_RETURN', 'REFUND', 'REWARD', 'ADMIN_CREDIT', 'ADMIN_DEBIT');

-- CreateEnum
CREATE TYPE "CancellationReason" AS ENUM ('SHOP_CLOSED', 'EMERGENCY', 'WRONG_BOOKING', 'FOUND_BETTER', 'PRICE_ISSUE', 'SCHEDULE_CONFLICT', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('AWAITING_CODE', 'IN_SERVICE', 'COMPLETED', 'DISPUTED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cancellation_details" TEXT,
ADD COLUMN     "cancellation_reason" "CancellationReason",
ADD COLUMN     "code_verified_at" TIMESTAMP(3),
ADD COLUMN     "code_verified_by" TEXT,
ADD COLUMN     "display_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "free_cash_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "free_cash_returned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "free_cash_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_type" "PaymentType" NOT NULL DEFAULT 'PAY_LATER',
ADD COLUMN     "service_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "service_status" "ServiceStatus" NOT NULL DEFAULT 'AWAITING_CODE',
ADD COLUMN     "verification_code" TEXT;

-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "allow_cancellation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allow_reschedule" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "free_cancellation_minutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "free_reschedule_minutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "require_owner_approval" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "free_cash_balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "locked_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_earned" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_spent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "previous_balance" DECIMAL(10,2) NOT NULL,
    "new_balance" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancellation_requests" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" "CancellationReason" NOT NULL,
    "reason_details" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_within_grace_period" BOOLEAN NOT NULL DEFAULT false,
    "free_cash_refunded" BOOLEAN NOT NULL DEFAULT false,
    "refund_amount" DECIMAL(10,2),
    "owner_approved" BOOLEAN,
    "owner_response_at" TIMESTAMP(3),
    "owner_note" TEXT,
    "is_valid_reason" BOOLEAN NOT NULL DEFAULT true,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancellation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reschedule_requests" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "original_start_time" TIMESTAMP(3) NOT NULL,
    "original_end_time" TIMESTAMP(3) NOT NULL,
    "new_start_time" TIMESTAMP(3) NOT NULL,
    "new_end_time" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_approved" BOOLEAN,
    "owner_response_at" TIMESTAMP(3),
    "owner_note" TEXT,
    "suggested_time" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reschedule_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallets_user_id_idx" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_idx" ON "wallet_transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_booking_id_idx" ON "wallet_transactions"("booking_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_type_idx" ON "wallet_transactions"("type");

-- CreateIndex
CREATE INDEX "wallet_transactions_created_at_idx" ON "wallet_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_requests_booking_id_key" ON "cancellation_requests"("booking_id");

-- CreateIndex
CREATE INDEX "cancellation_requests_booking_id_idx" ON "cancellation_requests"("booking_id");

-- CreateIndex
CREATE INDEX "cancellation_requests_user_id_idx" ON "cancellation_requests"("user_id");

-- CreateIndex
CREATE INDEX "reschedule_requests_booking_id_idx" ON "reschedule_requests"("booking_id");

-- CreateIndex
CREATE INDEX "reschedule_requests_user_id_idx" ON "reschedule_requests"("user_id");

-- CreateIndex
CREATE INDEX "otp_verifications_phone_idx" ON "otp_verifications"("phone");

-- CreateIndex
CREATE INDEX "otp_verifications_otp_idx" ON "otp_verifications"("otp");

-- CreateIndex
CREATE INDEX "otp_verifications_expires_at_idx" ON "otp_verifications"("expires_at");

-- CreateIndex
CREATE INDEX "bookings_verification_code_idx" ON "bookings"("verification_code");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
