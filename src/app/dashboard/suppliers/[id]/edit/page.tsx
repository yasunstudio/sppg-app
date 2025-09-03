import { Metadata } from "next"
import { SupplierEdit } from "../../components/supplier-edit-v2"
import { PermissionGuard } from '@/components/guards/permission-guard'

export const metadata: Metadata = {
  title: "Edit Supplier | SPPG",
  description: "Edit informasi dan detail kontak supplier",
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
