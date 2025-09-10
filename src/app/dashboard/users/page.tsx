import { UserPageClient } from "./components/user-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management - Manajemen Pengguna | SPPG Management System",
  description: "Dashboard manajemen pengguna komprehensif untuk sistem SPPG. Kelola akun pengguna, atur peran dan izin, pantau aktivitas pengguna, dan awasi siklus hidup pengguna dengan analitik dan pelaporan canggih.",
  keywords: [
    // Primary keywords
    "user management", "pengguna management", "user dashboard", "manajemen pengguna",
    // Indonesian keywords
    "manajemen pengguna", "dashboard pengguna", "administrasi pengguna", "kelola pengguna",
    // SPPG specific
    "SPPG users", "SPPG pengguna", "sistem pengguna SPPG", "akun SPPG",
    // Technical keywords
    "user tracking", "role management", "permission management", "user monitoring",
    // Process keywords
    "user operations", "account management", "user status", "user performance",
    // Feature keywords
    "real-time monitoring", "user alerts", "operational efficiency", "user reporting"
  ],
  openGraph: {
    title: "User Management - SPPG Manajemen Pengguna",
    description: "Kelola semua pengguna sistem SPPG dengan alat pelacakan, manajemen peran, dan operasional yang canggih.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/users",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Management - SPPG Manajemen Pengguna",
    description: "Manajemen pengguna komprehensif untuk sistem SPPG.",
  },
  robots: {
    index: false, // Private admin dashboard
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/users",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG User Dashboard",
  }
}

export default function UsersPage() {
  return (
    <PermissionGuard permission="users.view" redirectTo="/dashboard">
      <UserPageClient />
    </PermissionGuard>
  )
}
