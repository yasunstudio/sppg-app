import { SchoolPageClient } from "./components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manajemen Sekolah - SPPG Management System",
  description: "Kelola data sekolah, informasi kepala sekolah, dan jumlah siswa dalam sistem SPPG.",
}

export default function SchoolsPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard">
      <SchoolPageClient />
    </PermissionGuard>
  )
}
