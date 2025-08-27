-- CreateTable
CREATE TABLE "public"."classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "teacherName" TEXT,
    "notes" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- RenameForeignKey
ALTER TABLE "public"."quality_checks" RENAME CONSTRAINT "fk_quality_checks_material" TO "fk_quality_checks_raw_material";

-- AddForeignKey
ALTER TABLE "public"."classes" ADD CONSTRAINT "classes_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
