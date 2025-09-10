import { ClassPageClient } from "./components/class-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Class Management - Student Classes | SPPG Management System",
  description: "Comprehensive class management dashboard for SPPG school system. Monitor class capacity, manage student enrollment, track class status, and oversee the complete academic class lifecycle with advanced analytics and reporting.",
  keywords: [
    // Primary keywords
    "class management", "student classes", "class dashboard", "academic management",
    // Indonesian keywords
    "manajemen kelas", "kelas siswa", "dashboard kelas", "manajemen akademik",
    // SPPG specific
    "SPPG classes", "school class management", "student enrollment", "SPPG education",
    // Technical keywords
    "class tracking", "enrollment monitoring", "class analytics", "student monitoring",
    // Process keywords
    "academic operations", "class optimization", "class status", "enrollment performance",
    // Feature keywords
    "real-time monitoring", "capacity alerts", "academic efficiency", "class reporting"
  ],
  openGraph: {
    title: "Class Management - SPPG Academic Operations",
    description: "Manage your complete academic classes for SPPG school system with advanced tracking, enrollment, and operational tools.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/classes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Class Management - SPPG Academic Operations",
    description: "Comprehensive class management system for educational operations.",
    creator: "@sppg_system",
    site: "@sppg_system",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  other: {
    "application-name": "SPPG Management System",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  }
}

export default function ClassesPage() {
  return (
    <PermissionGuard 
      permission="schools.view"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to view class management.</p>
          </div>
        </div>
      }
    >
      <ClassPageClient />
    </PermissionGuard>
  )
}
