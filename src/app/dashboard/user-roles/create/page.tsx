import { UserRoleCreatePageClient } from '../components/user-role-create-page-client';
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tugaskan Role Pengguna - Manajemen Role | SPPG Management System",
  description: "Tugaskan role baru kepada pengguna dalam sistem manajemen SPPG. Konfigurasi izin pengguna dan kontrol akses untuk manajemen jaringan distribusi makanan.",
  keywords: [
    // Primary keywords
    "tugaskan role pengguna", "penugasan role pengguna", "manajemen role", "izin pengguna",
    // Indonesian keywords
    "assign role user", "penugasan role user", "manajemen role", "izin pengguna",
    // SPPG specific
    "manajemen pengguna SPPG", "role distribusi makanan", "penugasan staff",
    // Technical keywords
    "kontrol akses pengguna", "manajemen izin", "akses berbasis role",
    // Process keywords
    "onboarding pengguna", "proses penugasan role", "setup izin",
    // Feature keywords
    "manajemen level akses", "setup hak pengguna", "konfigurasi role"
  ],
  openGraph: {
    title: "Tugaskan Role Pengguna - Manajemen Role SPPG",
    description: "Tugaskan role baru kepada pengguna dalam sistem manajemen SPPG. Konfigurasi izin pengguna dan kontrol akses.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/user-roles/create",
  },
  twitter: {
    card: "summary",
    title: "Assign User Role - SPPG Role Management",
    description: "Assign new roles to users in SPPG management system.",
  },
  robots: {
    index: false, // Private admin form
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  alternates: {
    canonical: "/dashboard/user-roles/create",
  },
}

export default function CreateUserRolePage() {
  return (
    <PermissionGuard 
      permission="users.create"
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to assign user roles.</p>
          </div>
        </div>
      }
    >
      <UserRoleCreatePageClient />
    </PermissionGuard>
  )
}
