/*
  Warnings:

  - You are about to drop the `user_nutrition_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."quality_checks" DROP CONSTRAINT "fk_quality_checks_inventory";

-- DropForeignKey
ALTER TABLE "public"."quality_checks" DROP CONSTRAINT "fk_quality_checks_raw_material";

-- DropForeignKey
ALTER TABLE "public"."user_nutrition_profiles" DROP CONSTRAINT "user_nutrition_profiles_userId_fkey";

-- DropTable
DROP TABLE "public"."user_nutrition_profiles";

-- DropEnum
DROP TYPE "public"."ActivityLevel";
