-- CreateEnum
CREATE TYPE "public"."LicenseType" AS ENUM ('SIM_A', 'SIM_B1', 'SIM_B2', 'SIM_C', 'SIM_D');

-- AlterTable
ALTER TABLE "public"."drivers" ADD COLUMN     "licenseType" "public"."LicenseType" NOT NULL DEFAULT 'SIM_A';
