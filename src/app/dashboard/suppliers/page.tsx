import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { SuppliersManagement } from "./components"

export const metadata: Metadata = {
  title: "Suppliers Management | SPPG",
  description: "Comprehensive suppliers management system for SPPG application.",
}

export default async function SuppliersPage() {
  return (
    <PermissionGuard permission="suppliers.view">
      <SuppliersManagement />
    </PermissionGuard>
  )
}
