-- CreateEnum
CREATE TYPE "public"."ProgramType" AS ENUM ('MATERNAL_HEALTH', 'CHILD_NUTRITION', 'IMMUNIZATION', 'FAMILY_PLANNING', 'HEALTH_EDUCATION', 'GROWTH_MONITORING', 'NUTRITION_COUNSELING');

-- CreateEnum
CREATE TYPE "public"."ProgramStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ParticipantType" AS ENUM ('PREGNANT', 'LACTATING', 'TODDLER', 'ELDERLY', 'CHILD');

-- CreateEnum
CREATE TYPE "public"."NutritionStatus" AS ENUM ('NORMAL', 'UNDERWEIGHT', 'OVERWEIGHT', 'STUNTED', 'WASTED', 'SEVERE_MALNUTRITION', 'OBESITY');

-- CreateEnum
CREATE TYPE "public"."PlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "public"."MealTime" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK_MORNING', 'SNACK_AFTERNOON', 'SNACK_EVENING');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('HEALTH_CHECK', 'NUTRITION_COUNSELING', 'COOKING_DEMONSTRATION', 'HEALTH_EDUCATION', 'IMMUNIZATION', 'GROWTH_MONITORING', 'WEIGHT_MEASUREMENT', 'HEIGHT_MEASUREMENT', 'BLOOD_PRESSURE_CHECK', 'HEMOGLOBIN_TEST');

-- CreateEnum
CREATE TYPE "public"."ActivityStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "public"."VolunteerRole" AS ENUM ('CADRE_COORDINATOR', 'HEALTH_CADRE', 'NUTRITION_CADRE', 'DATA_RECORDER', 'COMMUNITY_MOBILIZER', 'TRAINING_COORDINATOR');

-- CreateEnum
CREATE TYPE "public"."TrainingStatus" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'CERTIFIED', 'NEEDS_REFRESH', 'NOT_TRAINED');

-- CreateTable
CREATE TABLE "public"."posyandu_programs" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "programType" "public"."ProgramType" NOT NULL,
    "targetBeneficiaries" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "public"."ProgramStatus" NOT NULL DEFAULT 'ACTIVE',
    "budget" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posyandu_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posyandu_participants" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "programId" TEXT,
    "name" TEXT NOT NULL,
    "nik" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "participantType" "public"."ParticipantType" NOT NULL,
    "currentWeight" DECIMAL(65,30),
    "currentHeight" DECIMAL(65,30),
    "nutritionStatus" "public"."NutritionStatus",
    "healthCondition" TEXT,
    "allergies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posyandu_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_records" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "weight" DECIMAL(65,30),
    "height" DECIMAL(65,30),
    "headCircumference" DECIMAL(65,30),
    "armCircumference" DECIMAL(65,30),
    "bloodPressure" TEXT,
    "hemoglobin" DECIMAL(65,30),
    "temperature" DECIMAL(65,30),
    "weightForAge" TEXT,
    "heightForAge" TEXT,
    "weightForHeight" TEXT,
    "symptoms" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "health_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nutrition_plans" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "programId" TEXT,
    "planName" TEXT NOT NULL,
    "description" TEXT,
    "targetCalories" INTEGER,
    "targetProtein" DECIMAL(65,30),
    "targetFat" DECIMAL(65,30),
    "targetCarbs" DECIMAL(65,30),
    "dietaryRestrictions" TEXT,
    "supplementation" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "public"."PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "nutrition_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nutrition_plan_recipes" (
    "id" TEXT NOT NULL,
    "nutritionPlanId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "portionSize" DECIMAL(65,30) NOT NULL,
    "mealTime" "public"."MealTime" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "nutrition_plan_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posyandu_activities" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "programId" TEXT,
    "activityName" TEXT NOT NULL,
    "activityType" "public"."ActivityType" NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "actualDate" TIMESTAMP(3),
    "duration" INTEGER,
    "participantCount" INTEGER,
    "targetParticipants" INTEGER,
    "status" "public"."ActivityStatus" NOT NULL DEFAULT 'PLANNED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posyandu_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posyandu_volunteers" (
    "id" TEXT NOT NULL,
    "posyanduId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "role" "public"."VolunteerRole" NOT NULL,
    "specialization" TEXT,
    "trainingStatus" "public"."TrainingStatus" NOT NULL DEFAULT 'BASIC',
    "activeStatus" BOOLEAN NOT NULL DEFAULT true,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posyandu_volunteers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posyandu_participants_nik_key" ON "public"."posyandu_participants"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "posyandu_volunteers_userId_key" ON "public"."posyandu_volunteers"("userId");

-- AddForeignKey
ALTER TABLE "public"."posyandu_programs" ADD CONSTRAINT "posyandu_programs_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_participants" ADD CONSTRAINT "posyandu_participants_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_participants" ADD CONSTRAINT "posyandu_participants_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."posyandu_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_records" ADD CONSTRAINT "health_records_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."posyandu_participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_plans" ADD CONSTRAINT "nutrition_plans_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."posyandu_participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_plans" ADD CONSTRAINT "nutrition_plans_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."posyandu_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_plan_recipes" ADD CONSTRAINT "nutrition_plan_recipes_nutritionPlanId_fkey" FOREIGN KEY ("nutritionPlanId") REFERENCES "public"."nutrition_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nutrition_plan_recipes" ADD CONSTRAINT "nutrition_plan_recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_activities" ADD CONSTRAINT "posyandu_activities_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_activities" ADD CONSTRAINT "posyandu_activities_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."posyandu_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_volunteers" ADD CONSTRAINT "posyandu_volunteers_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "public"."posyandu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posyandu_volunteers" ADD CONSTRAINT "posyandu_volunteers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
