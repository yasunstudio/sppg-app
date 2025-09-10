import { StudentPageClient } from "./components/student-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Management - SPPG Education System",
  description: "Comprehensive student management dashboard for SPPG school food program. View, search, edit, and manage all registered students with nutrition consultation tracking and school assignments.",
  keywords: [
    // Primary keywords
    "student management", "student dashboard", "student list", "student directory",
    // Indonesian keywords
    "manajemen siswa", "dashboard siswa", "daftar siswa", "direktori siswa",
    // SPPG specific
    "SPPG students", "school food program students", "nutrition tracking", "student database",
    // Management keywords
    "student administration", "student records", "education management", "student monitoring",
    // Action keywords
    "view students", "search students", "edit student", "manage students",
    // Feature keywords
    "school assignments", "nutrition consultation", "student profiles", "parent contacts",
    // Data keywords
    "student information", "student data", "education records", "student tracking"
  ],
  openGraph: {
    title: "Student Management Dashboard - SPPG",
    description: "Manage all students in the SPPG school food program. View student profiles, track nutrition consultations, and manage school assignments.",
    type: "website",
  },
  alternates: {
    canonical: "/dashboard/students",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Student Management",
  }
}

export default function StudentsPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard">
      <StudentPageClient />
    </PermissionGuard>
  )
}
