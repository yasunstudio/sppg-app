import { UserCreatePageClient } from "../components/user-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tambah Pengguna Baru - Manajemen Pengguna | SPPG Management System",
  description: "Daftarkan pengguna baru ke sistem manajemen SPPG. Tambahkan detail lengkap pengguna termasuk informasi pribadi, peran, izin, dan parameter operasional untuk jaringan distribusi makanan SPPG.",
  keywords: [
    // Primary keywords
    "add user", "new user registration", "user form", "user management",
    // Indonesian keywords
    "tambah pengguna", "registrasi pengguna baru", "form pengguna", "manajemen pengguna",
    // SPPG specific
    "SPPG user registration", "SPPG pengguna", "registrasi akun SPPG",
    // Technical keywords
    "user management system", "user database", "user specifications",
    // Process keywords
    "user onboarding", "user registration process", "user documentation",
    // Feature keywords
    "role assignment", "permission setup", "user monitoring setup"
  ],
  openGraph: {
    title: "Tambah Pengguna Baru - SPPG Manajemen Pengguna",
    description: "Daftarkan pengguna baru untuk sistem SPPG. Registrasi lengkap pengguna dengan peran dan pengaturan izin.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/users/create",
  },
  twitter: {
    card: "summary",
    title: "Tambah Pengguna Baru - SPPG Manajemen Pengguna",
    description: "Daftarkan pengguna baru untuk sistem SPPG.",
  },
  robots: {
    index: false, // Private admin form
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/users/create",
  },
  other: {
    "application-name": "SPPG Management System",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "SPPG User Registration",
  }
}

export default function CreateUserPage() {
  return (
    <PermissionGuard permission="users.create" redirectTo="/dashboard/users">
      <UserCreatePageClient />
    </PermissionGuard>
  )
}
