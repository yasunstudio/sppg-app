import { UserCreatePageClient } from "../components/user-create-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New User - User Management | SPPG Management System",
  description: "Register a new user to your SPPG management system. Add complete user details including profile information, role assignments, permissions, and account settings for SPPG system access.",
  keywords: [
    // Primary keywords
    "add user", "new user registration", "user form", "user management",
    // Indonesian keywords
    "tambah pengguna", "registrasi pengguna baru", "form pengguna", "manajemen pengguna",
    // SPPG specific
    "SPPG user registration", "system user management", "user account creation",
    // Technical keywords
    "user management system", "user database", "user profile setup",
    // Process keywords
    "user onboarding", "account registration process", "user documentation",
    // Feature keywords
    "role assignment", "permission setup", "user access control"
  ],
  openGraph: {
    title: "Add New User - SPPG User Management",
    description: "Register a new user for SPPG management system. Complete user registration with profile details and role assignment.",
    type: "website",
    siteName: "SPPG Management System",
    locale: "id_ID",
    url: "/dashboard/users/create",
  },
  twitter: {
    card: "summary",
    title: "Add New User - User Management",
    description: "Register new user for SPPG system with complete profile setup.",
  },
  robots: {
    index: false,
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
    "apple-mobile-web-app-title": "Add New User",
  }
}

export default function CreateUserPage() {
  return (
    <PermissionGuard permission="users.create" redirectTo="/dashboard/users">
      <UserCreatePageClient />
    </PermissionGuard>
  )
}
