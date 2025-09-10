import { SystemConfigPageClient } from "./components/system-config-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manajemen Konfigurasi Sistem - Administrasi Sistem SPPG",
  description: "Dashboard manajemen konfigurasi sistem yang komprehensif untuk aplikasi SPPG. Kelola pengaturan database, konfigurasi email, notifikasi, parameter keamanan, dan pengaturan aplikasi dengan fitur kategorisasi dan pencarian canggih.",
  keywords: [
    // Primary keywords
    "konfigurasi sistem", "pengaturan sistem", "config aplikasi", "manajemen konfigurasi",
    // Indonesian keywords
    "konfigurasi sistem", "pengaturan sistem", "manajemen konfigurasi", "setting aplikasi",
    // SPPG specific
    "SPPG system config", "sistem sekolah", "parameter aplikasi", "admin sistem",
    // Management keywords
    "dashboard konfigurasi", "administrasi sistem", "kategori config", "pengaturan environment",
    // Action keywords
    "lihat konfigurasi", "edit pengaturan sistem", "kelola configs", "parameter sistem",
    // Feature keywords
    "config database", "pengaturan email", "config keamanan", "setting notifikasi",
    // Data keywords
    "variabel sistem", "pengaturan aplikasi", "config environment", "nilai konfigurasi"
  ],
  openGraph: {
    title: "Manajemen Konfigurasi Sistem - SPPG",
    description: "Kelola semua konfigurasi sistem untuk aplikasi manajemen sekolah SPPG. Konfigurasi database, email, notifikasi, dan pengaturan keamanan.",
    type: "website",
  },
  alternates: {
    canonical: "/dashboard/system-config",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG Konfigurasi Sistem",
  }
}

export default async function SystemConfigPage() {
  return (
    <PermissionGuard permission="production.view">
      <SystemConfigPageClient />
    </PermissionGuard>
  )
}
