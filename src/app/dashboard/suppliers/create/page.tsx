import { Metadata } from "next"
import { SupplierCreate } from "../components/supplier-create-v2"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Tambah Supplier Baru | SPPG",
  description: "Tambah supplier baru dengan informasi kontak yang lengkap untuk distribusi makanan sekolah",
  keywords: ["tambah supplier", "supplier baru", "kontak supplier", "SPPG"],
  openGraph: {
    title: "Tambah Supplier Baru | SPPG",
    description: "Form untuk menambahkan supplier baru ke sistem SPPG",
    type: "website",
  }
}

export default async function SupplierCreatePage() {
  return (
    <PermissionGuard permission="suppliers.view">
      <SupplierCreate />
    </PermissionGuard>
  )
}
