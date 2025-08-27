-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."MaterialCategory" AS ENUM ('PROTEIN', 'VEGETABLE', 'FRUIT', 'GRAIN', 'DAIRY', 'SPICE', 'OIL', 'BEVERAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."QualityStatus" AS ENUM ('GOOD', 'FAIR', 'POOR', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "public"."TargetGroup" AS ENUM ('STUDENT', 'PREGNANT_WOMAN', 'LACTATING_MOTHER', 'TODDLER', 'ELDERLY');

-- CreateEnum
CREATE TYPE "public"."FoodCategory" AS ENUM ('RICE', 'MAIN_DISH', 'VEGETABLE', 'FRUIT', 'BEVERAGE', 'SNACK');

-- CreateEnum
CREATE TYPE "public"."ConsultationStatus" AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ProductionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."QualityCheckType" AS ENUM ('RAW_MATERIAL', 'PRODUCTION', 'PACKAGING', 'DISTRIBUTION');

-- CreateEnum
CREATE TYPE "public"."SampleType" AS ENUM ('RAW_MATERIAL', 'COOKED_FOOD', 'PACKAGED_MEAL');

-- CreateEnum
CREATE TYPE "public"."SampleStatus" AS ENUM ('STORED', 'TESTED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "public"."DistributionStatus" AS ENUM ('PREPARING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "public"."TransactionCategory" AS ENUM ('RAW_MATERIALS', 'TRANSPORTATION', 'UTILITIES', 'SALARIES', 'EQUIPMENT', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WasteType" AS ENUM ('ORGANIC', 'INORGANIC', 'PACKAGING');

-- CreateEnum
CREATE TYPE "public"."WasteSource" AS ENUM ('PREPARATION', 'PRODUCTION', 'PACKAGING', 'SCHOOL_LEFTOVER', 'EXPIRED_MATERIAL');

-- CreateEnum
CREATE TYPE "public"."FeedbackType" AS ENUM ('FOOD_QUALITY', 'DELIVERY_SERVICE', 'PORTION_SIZE', 'VARIETY', 'GENERAL', 'COMPLAINT');

-- CreateEnum
CREATE TYPE "public"."FeedbackSource" AS ENUM ('STUDENT', 'TEACHER', 'PARENT', 'SCHOOL_ADMIN', 'POSYANDU_STAFF');

-- CreateEnum
CREATE TYPE "public"."FeedbackStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('SYSTEM', 'PRODUCTION', 'DISTRIBUTION', 'QUALITY_ALERT', 'INVENTORY_LOW', 'BUDGET_ALERT', 'FEEDBACK');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "principalName" TEXT NOT NULL,
    "principalPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "notes" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "id" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "grade" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "notes" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posyandu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headName" TEXT NOT NULL,
    "headPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pregnant_women" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "posyanduId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "pregnant_women_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lactating_mothers" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "posyanduId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lactating_mothers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."toddlers" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "parentName" TEXT NOT NULL,
    "posyanduId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "toddlers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."raw_materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."MaterialCategory" NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "caloriesPer100g" DOUBLE PRECISION,
    "proteinPer100g" DOUBLE PRECISION,
    "fatPer100g" DOUBLE PRECISION,
    "carbsPer100g" DOUBLE PRECISION,
    "fiberPer100g" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "raw_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory_items" (
    "id" TEXT NOT NULL,
    "rawMaterialId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "batchNumber" TEXT,
    "supplierId" TEXT,
    "qualityStatus" "public"."QualityStatus" NOT NULL DEFAULT 'GOOD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "menuDate" TIMESTAMP(3) NOT NULL,
    "mealType" "public"."MealType" NOT NULL DEFAULT 'LUNCH',
    "targetGroup" "public"."TargetGroup" NOT NULL DEFAULT 'STUDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "totalCalories" DOUBLE PRECISION,
    "totalProtein" DOUBLE PRECISION,
    "totalFat" DOUBLE PRECISION,
    "totalCarbs" DOUBLE PRECISION,
    "totalFiber" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_items" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."FoodCategory" NOT NULL,
    "servingSize" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_item_ingredients" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "rawMaterialId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "menu_item_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nutrition_consultations" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" "public"."ConsultationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrition_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."productions" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "plannedPortions" INTEGER NOT NULL,
    "actualPortions" INTEGER,
    "productionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ProductionStatus" NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."production_ingredients" (
    "id" TEXT NOT NULL,
    "productionId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "plannedQuantity" DOUBLE PRECISION NOT NULL,
    "actualQuantity" DOUBLE PRECISION,

    CONSTRAINT "production_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."portions" (
    "id" TEXT NOT NULL,
    "productionId" TEXT NOT NULL,
    "portionType" "public"."FoodCategory" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "packagedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quality_checks" (
    "id" TEXT NOT NULL,
    "type" "public"."QualityCheckType" NOT NULL,
    "referenceType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "checkedBy" TEXT,
    "color" TEXT,
    "taste" TEXT,
    "aroma" TEXT,
    "texture" TEXT,
    "temperature" DOUBLE PRECISION,
    "status" "public"."QualityStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quality_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."food_samples" (
    "id" TEXT NOT NULL,
    "sampleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menuName" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "sampleType" "public"."SampleType" NOT NULL,
    "storageDays" INTEGER NOT NULL DEFAULT 3,
    "status" "public"."SampleStatus" NOT NULL DEFAULT 'STORED',
    "notes" TEXT,
    "disposedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_samples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributions" (
    "id" TEXT NOT NULL,
    "distributionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" TEXT,
    "vehicleId" TEXT,
    "status" "public"."DistributionStatus" NOT NULL DEFAULT 'PREPARING',
    "totalPortions" INTEGER NOT NULL,
    "notes" TEXT,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distribution_schools" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "plannedPortions" INTEGER NOT NULL,
    "actualPortions" INTEGER,
    "routeOrder" INTEGER NOT NULL,

    CONSTRAINT "distribution_schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distribution_portions" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "portionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "distribution_portions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastService" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deliveries" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "schoolId" TEXT,
    "posyanduId" TEXT,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "deliveryOrder" INTEGER NOT NULL,
    "plannedTime" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "completionTime" TIMESTAMP(3),
    "portionsDelivered" INTEGER,
    "status" "public"."DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryProof" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."financial_transactions" (
    "id" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "category" "public"."TransactionCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "referenceId" TEXT,
    "receiptUrl" TEXT,
    "budgetPeriod" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."budgets" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "category" "public"."TransactionCategory" NOT NULL,
    "allocated" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."waste_records" (
    "id" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wasteType" "public"."WasteType" NOT NULL,
    "source" "public"."WasteSource" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "schoolId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" TEXT NOT NULL,
    "type" "public"."FeedbackType" NOT NULL,
    "rating" INTEGER,
    "message" TEXT NOT NULL,
    "source" "public"."FeedbackSource" NOT NULL,
    "schoolId" TEXT,
    "studentId" TEXT,
    "status" "public"."FeedbackStatus" NOT NULL DEFAULT 'OPEN',
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "dataType" TEXT NOT NULL DEFAULT 'string',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "public"."verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "public"."verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "public"."user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "students_nisn_key" ON "public"."students"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "pregnant_women_nik_key" ON "public"."pregnant_women"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "lactating_mothers_nik_key" ON "public"."lactating_mothers"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "toddlers_nik_key" ON "public"."toddlers"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "menu_item_ingredients_menuItemId_rawMaterialId_key" ON "public"."menu_item_ingredients"("menuItemId", "rawMaterialId");

-- CreateIndex
CREATE UNIQUE INDEX "productions_batchNumber_key" ON "public"."productions"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "production_ingredients_productionId_inventoryItemId_key" ON "public"."production_ingredients"("productionId", "inventoryItemId");

-- CreateIndex
CREATE INDEX "quality_checks_referenceType_referenceId_idx" ON "public"."quality_checks"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "quality_checks_referenceType_referenceId_key" ON "public"."quality_checks"("referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_schools_distributionId_schoolId_key" ON "public"."distribution_schools"("distributionId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_portions_distributionId_portionId_key" ON "public"."distribution_portions"("distributionId", "portionId");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plateNumber_key" ON "public"."vehicles"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_period_category_key" ON "public"."budgets"("period", "category");

-- CreateIndex
CREATE UNIQUE INDEX "system_configs_key_key" ON "public"."system_configs"("key");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pregnant_women" ADD CONSTRAINT "pregnant_women_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lactating_mothers" ADD CONSTRAINT "lactating_mothers_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."toddlers" ADD CONSTRAINT "toddlers_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."raw_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory_items" ADD CONSTRAINT "inventory_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_item_ingredients" ADD CONSTRAINT "menu_item_ingredients_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_item_ingredients" ADD CONSTRAINT "menu_item_ingredients_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "public"."raw_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_consultations" ADD CONSTRAINT "nutrition_consultations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."productions" ADD CONSTRAINT "productions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_ingredients" ADD CONSTRAINT "production_ingredients_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "public"."productions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."production_ingredients" ADD CONSTRAINT "production_ingredients_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."portions" ADD CONSTRAINT "portions_productionId_fkey" FOREIGN KEY ("productionId") REFERENCES "public"."productions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checks" ADD CONSTRAINT "fk_quality_checks_production" FOREIGN KEY ("referenceId") REFERENCES "public"."productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checks" ADD CONSTRAINT "fk_quality_checks_inventory" FOREIGN KEY ("referenceId") REFERENCES "public"."inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quality_checks" ADD CONSTRAINT "fk_quality_checks_material" FOREIGN KEY ("referenceId") REFERENCES "public"."raw_materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribution_schools" ADD CONSTRAINT "distribution_schools_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "public"."distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribution_schools" ADD CONSTRAINT "distribution_schools_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribution_portions" ADD CONSTRAINT "distribution_portions_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "public"."distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distribution_portions" ADD CONSTRAINT "distribution_portions_portionId_fkey" FOREIGN KEY ("portionId") REFERENCES "public"."portions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "public"."distributions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."waste_records" ADD CONSTRAINT "waste_records_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
