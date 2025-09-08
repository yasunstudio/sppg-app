-- AlterTable
ALTER TABLE "public"."vehicles" ADD COLUMN     "brand" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "driver" TEXT,
ADD COLUMN     "fuelType" TEXT NOT NULL DEFAULT 'DIESEL',
ADD COLUMN     "insuranceExpiry" TIMESTAMP(3),
ADD COLUMN     "mileage" DOUBLE PRECISION,
ADD COLUMN     "model" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "nextService" TIMESTAMP(3),
ADD COLUMN     "registrationExpiry" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2020;
