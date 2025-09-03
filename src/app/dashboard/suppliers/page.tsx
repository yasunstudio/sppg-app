import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { SuppliersManagement } from "./components"

export const metadata: Metadata = {
  title: "Manajemen Supplier | SPPG",
  description: "Sistem manajemen supplier komprehensif untuk aplikasi SPPG dengan fitur pencarian, filter, dan pagination.",
  keywords: ["supplier", "manajemen", "SPPG", "sekolah", "pembelian", "inventori"],
  openGraph: {
    title: "Manajemen Supplier | SPPG",
    description: "Kelola data supplier untuk distribusi makanan sekolah",
    type: "website",
  }
}

export default async function SuppliersPage() {
  return (
    <PermissionGuard permission="suppliers.view">
      <SuppliersManagement />
    </PermissionGuard>
  )
}
