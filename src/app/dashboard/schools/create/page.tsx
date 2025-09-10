import { SchoolCreatePageClient } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tambah Sekolah Baru - SPPG Management System",
  description: "Daftarkan sekolah baru ke dalam sistem manajemen pendidikan SPPG.",
}

export default function CreateSchoolPage() {
  return (
    <PermissionGuard permission="schools.manage" redirectTo="/dashboard/schools">
      <SchoolCreatePageClient />
    </PermissionGuard>
  )
}
