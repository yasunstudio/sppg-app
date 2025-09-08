import { UserPageClient } from "./components/user-page-client"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Management - Account Operations | SPPG Management System",
  description: "Comprehensive user management dashboard for SPPG management system. Manage user accounts, roles, permissions, and access control with advanced user analytics and reporting.",
  keywords: [
    // Primary keywords
    "user management", "account management", "user dashboard", "user operations",
    "user administration", "role management", "permission control", "user analytics",
    
    // Secondary keywords
    "user accounts", "user monitoring", "user permissions", "user reporting",
    "access control", "user roles", "account administration", "user tracking",
    
    // SPPG specific
    "SPPG user management", "school user accounts", "educational user system",
    "staff management", "employee accounts", "school administration users",
    
    // Technical keywords
    "user management system", "account management platform", "user dashboard",
    "user analytics", "user management software", "role-based access control"
  ],
  openGraph: {
    title: "User Management Dashboard - SPPG Management System",
    description: "Manage user accounts, roles, and permissions with comprehensive tracking, analytics, and reporting tools for educational institutions.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function UsersPage() {
  return (
    <PermissionGuard permission="users.view" redirectTo="/dashboard">
      <UserPageClient />
    </PermissionGuard>
  )
}
