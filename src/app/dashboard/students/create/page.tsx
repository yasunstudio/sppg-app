import { StudentCreatePageClient } from "../components/student-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Student - Student Management | SPPG Management System",
  description: "Register a new student to the SPPG education management system. Add complete student details including personal information, school assignment, parent contact, and nutritional consultation setup for comprehensive student management.",
  keywords: [
    // Primary keywords
    "add student", "new student registration", "student form", "student enrollment",
    // Indonesian keywords
    "tambah siswa", "registrasi siswa baru", "form siswa", "pendaftaran siswa",
    // SPPG specific
    "SPPG student registration", "school food program", "nutrition consultation", "student management",
    // Technical keywords
    "student database", "education management", "student tracking", "school assignment",
    // Process keywords
    "student onboarding", "enrollment process", "student documentation", "parent contact",
    // Feature keywords
    "nutrition monitoring", "school integration", "student profile", "consultation setup"
  ],
  openGraph: {
    title: "Add New Student - SPPG Student Management",
    description: "Register a new student for SPPG school food program. Complete student registration with school assignment and nutrition consultation setup.",
    type: "website",
  },
  alternates: {
    canonical: "/dashboard/students/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Student Registration",
  }
}

export default function CreateStudentPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/students">
      <StudentCreatePageClient />
    </PermissionGuard>
  )
}
