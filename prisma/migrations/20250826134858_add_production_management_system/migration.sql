-- CreateEnum
CREATE TYPE "public"."RecipeCategory" AS ENUM ('MAIN_COURSE', 'SIDE_DISH', 'DESSERT', 'BEVERAGE', 'SNACK');

-- CreateEnum
CREATE TYPE "public"."RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."ItemCategory" AS ENUM ('STAPLE_FOOD', 'PROTEIN', 'VEGETABLES', 'FRUITS', 'DAIRY', 'SPICES_SEASONING', 'COOKING_OIL', 'BEVERAGES', 'SNACKS', 'OTHERS');

-- CreateEnum
CREATE TYPE "public"."ItemUnit" AS ENUM ('KG', 'GRAM', 'LITER', 'ML', 'PCS', 'PACK', 'BOX', 'BOTTLE', 'CAN', 'SACHET');

-- CreateEnum
CREATE TYPE "public"."ProductionPlanStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "public"."ProductionBatchStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'QUALITY_CHECK', 'COMPLETED', 'REJECTED', 'REWORK_REQUIRED');

-- CreateEnum
CREATE TYPE "public"."ProductionResourceType" AS ENUM ('EQUIPMENT', 'STAFF', 'KITCHEN_AREA', 'VEHICLE', 'STORAGE');

-- CreateEnum
CREATE TYPE "public"."ResourceStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE', 'RETIRED');

-- CreateEnum
CREATE TYPE "public"."QualityCheckStatus" AS ENUM ('PASS', 'FAIL', 'CONDITIONAL', 'PENDING', 'REWORK_REQUIRED');

-- CreateTable
CREATE TABLE "public"."items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."ItemCategory" NOT NULL,
    "unit" "public"."ItemUnit" NOT NULL,
    "unitPrice" DOUBLE PRECISION,
    "nutritionPer100g" JSONB,
    "allergens" TEXT[],
    "shelfLife" INTEGER,
    "storageRequirement" TEXT,
    "supplierId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."RecipeCategory" NOT NULL,
    "servingSize" INTEGER NOT NULL,
    "prepTime" INTEGER NOT NULL,
    "cookTime" INTEGER NOT NULL,
    "difficulty" "public"."RecipeDifficulty" NOT NULL,
    "instructions" JSONB NOT NULL,
    "nutritionInfo" JSONB,
    "allergenInfo" TEXT[],
    "cost" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_ingredients" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_plans" (
    "id" TEXT NOT NULL,
    "planDate" TIMESTAMP(3) NOT NULL,
    "targetPortions" INTEGER NOT NULL,
    "menuId" TEXT,
    "kitchenId" TEXT,
    "status" "public"."ProductionPlanStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedStartTime" TIMESTAMP(3),
    "plannedEndTime" TIMESTAMP(3),
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_batches" (
    "id" TEXT NOT NULL,
    "productionPlanId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "recipeId" TEXT,
    "plannedQuantity" INTEGER NOT NULL,
    "actualQuantity" INTEGER,
    "status" "public"."ProductionBatchStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "qualityScore" DOUBLE PRECISION,
    "temperatureLog" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ProductionResourceType" NOT NULL,
    "capacityPerHour" INTEGER,
    "availabilitySchedule" JSONB,
    "maintenanceSchedule" JSONB,
    "status" "public"."ResourceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "location" TEXT,
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resource_usage" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "plannedDuration" INTEGER NOT NULL,
    "actualDuration" INTEGER,
    "efficiency" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_checkpoints" (
    "id" TEXT NOT NULL,
    "productionPlanId" TEXT,
    "batchId" TEXT,
    "checkpointType" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedBy" TEXT NOT NULL,
    "status" "public"."QualityCheckStatus" NOT NULL,
    "temperature" DOUBLE PRECISION,
    "visualInspection" TEXT,
    "tasteTest" TEXT,
    "textureEvaluation" TEXT,
    "correctiveAction" TEXT,
    "photos" TEXT[],
    "metrics" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quality_checkpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_metrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalProduction" INTEGER NOT NULL,
    "targetProduction" INTEGER NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,
    "qualityScore" DOUBLE PRECISION NOT NULL,
    "wastageAmount" DOUBLE PRECISION NOT NULL,
    "costPerPortion" DOUBLE PRECISION NOT NULL,
    "energyUsage" DOUBLE PRECISION,
    "waterUsage" DOUBLE PRECISION,
    "laborHours" DOUBLE PRECISION NOT NULL,
    "equipmentUptime" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MenuToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MenuToRecipe_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "production_metrics_date_key" ON "public"."production_metrics"("date");

-- CreateIndex
CREATE INDEX "_MenuToRecipe_B_index" ON "public"."_MenuToRecipe"("B");

-- AddForeignKey
ALTER TABLE "public"."items" ADD CONSTRAINT "items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_plans" ADD CONSTRAINT "production_plans_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_batches" ADD CONSTRAINT "production_batches_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "public"."production_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_batches" ADD CONSTRAINT "production_batches_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_usage" ADD CONSTRAINT "resource_usage_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."production_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_usage" ADD CONSTRAINT "resource_usage_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."production_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checkpoints" ADD CONSTRAINT "quality_checkpoints_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "public"."production_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checkpoints" ADD CONSTRAINT "quality_checkpoints_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."production_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checkpoints" ADD CONSTRAINT "quality_checkpoints_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToRecipe" ADD CONSTRAINT "_MenuToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToRecipe" ADD CONSTRAINT "_MenuToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
