import { ClassCreatePageClient } from "../components/class-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Class - School Management | SPPG Management System",
  description: "Create a new class in your school management system. Add complete class details including grade level, capacity, teacher assignments, and academic parameters for SPPG school network.",
  keywords: [
    // Primary keywords
    "add class", "new class creation", "class form", "school expansion",
    // Indonesian keywords
    "tambah kelas", "buat kelas baru", "form kelas", "ekspansi sekolah",
    // SPPG specific
    "SPPG class creation", "school class management", "student class registration",
    // Technical keywords
    "class management system", "school database", "class specifications",
    // Process keywords
    "class setup", "enrollment process", "class documentation",
    // Feature keywords
    "capacity management", "teacher assignment", "academic parameters"
  ],
  openGraph: {
    title: "Add New Class - SPPG School Management",
    description: "Create a new class for SPPG school network. Complete class setup with enrollment capacity and teacher assignment.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/classes/create",
  },
  twitter: {
    card: "summary",
    title: "Add New Class - SPPG School Management",
    description: "Create a new class for SPPG school network.",
  },
  robots: {
    index: false, // Private admin form
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/classes/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Class Creation",
  }
}

export default function CreateClassPage() {
  return (
    <PermissionGuard permission="schools.view" redirectTo="/dashboard/classes">
      <ClassCreatePageClient />
    </PermissionGuard>
  )
}
