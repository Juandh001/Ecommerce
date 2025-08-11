-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'PSE';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "pseBankCode" TEXT,
ADD COLUMN     "psePaymentId" TEXT,
ADD COLUMN     "pseRedirectUrl" TEXT;
