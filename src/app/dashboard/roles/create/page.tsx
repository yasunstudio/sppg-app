import { Metadata } from "next"
import { RoleCreatePageClient } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"

export const metadata: Metadata = {
  title: "Tambah Role Baru | SPPG",
  description: "Buat role baru dengan permissions khusus untuk sistem SPPG",
}

export default async function RoleCreatePage() {
  return (
    <PermissionGuard permission="system.config" redirectTo="/dashboard/roles">
      <RoleCreatePageClient />
    </PermissionGuard>
  )
}
