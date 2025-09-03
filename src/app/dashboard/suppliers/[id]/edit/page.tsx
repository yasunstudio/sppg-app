import { Metadata } from "next"
import { SupplierEdit } from "../../components/supplier-edit-v2"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Edit Supplier | SPPG",
  description: "Edit dan perbarui informasi supplier, detail kontak, dan alamat dalam sistem SPPG",
  keywords: ["edit supplier", "perbarui supplier", "informasi kontak", "alamat supplier", "SPPG"],
  openGraph: {
    title: "Edit Supplier | SPPG",
    description: "Form untuk mengedit informasi supplier yang sudah ada",
    type: "website",
  }
}

interface SupplierEditPageProps {
  params: { id: string }
}

export default async function SupplierEditPage({ params }: SupplierEditPageProps) {
  return (
    <PermissionGuard permission="suppliers.view">
      <SupplierEdit supplierId={params.id} />
    </PermissionGuard>
  )
}
