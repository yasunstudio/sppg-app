import { SystemConfigCreatePageClient } from "../components/system-config-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tambah Konfigurasi Sistem Baru - Manajemen Sistem | SPPG Management System",
  description: "Buat konfigurasi sistem baru untuk mengelola pengaturan aplikasi. Konfigurasi koneksi database, pengaturan email, notifikasi, parameter keamanan, dan lainnya untuk sistem manajemen SPPG.",
  keywords: [
    // Primary keywords
    "add system config", "new system configuration", "system settings", "application config",
    // Indonesian keywords
    "tambah konfigurasi sistem", "pengaturan sistem baru", "konfigurasi aplikasi", "setting sistem",
    // SPPG specific
    "SPPG system config", "school management settings", "application parameters", "system management",
    // Technical keywords
    "database configuration", "email settings", "notification config", "security settings",
    // Process keywords
    "system setup", "configuration management", "application settings", "system parameters",
    // Feature keywords
    "config categories", "data types", "environment variables", "system variables"
  ],
  openGraph: {
    title: "Add New System Configuration - SPPG System Management",
    description: "Create new system configuration for SPPG school management system. Set up database, email, notifications, and security parameters.",
    type: "website",
  },
  alternates: {
    canonical: "/dashboard/system-config/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG System Config",
  }
}

export default async function SystemConfigCreatePage() {
  return (
    <PermissionGuard permission="production.view">
      <SystemConfigCreatePageClient />
    </PermissionGuard>
  )
}
