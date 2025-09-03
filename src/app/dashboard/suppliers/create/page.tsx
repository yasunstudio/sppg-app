import { Metadata } from "next"
import { SupplierCreate } from "../components/supplier-create-v2"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Tambah Supplier | SPPG",
  description: "Tambah supplier baru dengan informasi kontak yang lengkap",
}

export default async function SupplierCreatePage() {
  return (
    <PermissionGuard permission="suppliers.view">
      <SupplierCreate />
    </PermissionGuard>
  )
}
