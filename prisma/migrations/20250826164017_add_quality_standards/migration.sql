/*
  Warnings:

  - You are about to drop the `distribution_portions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `portions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `production_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."QualityStandardCategory" AS ENUM ('TEMPERATURE_CONTROL', 'VISUAL_APPEARANCE', 'HYGIENE_STANDARDS', 'PORTION_CONTROL', 'NUTRITION_VALUE', 'SAFETY_STANDARDS');

-- DropForeignKey
ALTER TABLE "public"."distribution_portions" DROP CONSTRAINT "distribution_portions_distributionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."distribution_portions" DROP CONSTRAINT "distribution_portions_portionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."portions" DROP CONSTRAINT "portions_productionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."production_ingredients" DROP CONSTRAINT "production_ingredients_inventoryItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."production_ingredients" DROP CONSTRAINT "production_ingredients_productionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."productions" DROP CONSTRAINT "productions_menuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."quality_checks" DROP CONSTRAINT "fk_quality_checks_production";

-- DropTable
DROP TABLE "public"."distribution_portions";

-- DropTable
DROP TABLE "public"."portions";

-- DropTable
DROP TABLE "public"."production_ingredients";

-- DropTable
DROP TABLE "public"."productions";

-- CreateTable
CREATE TABLE "public"."quality_standards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "category" "public"."QualityStandardCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_standards_pkey" PRIMARY KEY ("id")
);
