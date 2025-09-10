import { Metadata } from "next"
import { RolePageClient } from "./components"
import { PermissionGuard } from "@/components/guards/permission-guard"

export const metadata: Metadata = {
  title: "Manajemen Role | SPPG",
  description: "Sistem manajemen role dan permissions yang komprehensif untuk aplikasi SPPG.",
}

export default async function RolesPage() {
  return (
    <PermissionGuard permission="system.config" redirectTo="/dashboard">
      <RolePageClient />
    </PermissionGuard>
  )
}
