import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { RawMaterialsManagement } from "./components/raw-materials-management"
import { generateRawMaterialMetadata } from "./components/utils/raw-material-metadata"

export const metadata: Metadata = generateRawMaterialMetadata('list')

export default async function RawMaterialsPage() {
  return (
    <PermissionGuard permission="inventory.view">
      <RawMaterialsManagement />
    </PermissionGuard>
  )
}
