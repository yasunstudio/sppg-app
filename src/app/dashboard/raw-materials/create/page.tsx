import { Metadata } from "next"
import { PermissionGuard } from '@/components/guards/permission-guard'
import { RawMaterialCreate } from "../components/raw-material-create"
import { generateRawMaterialMetadata } from "../components/utils/raw-material-metadata"

export const metadata: Metadata = generateRawMaterialMetadata('create')

export default async function RawMaterialCreatePage() {
  return (
    <PermissionGuard permission="inventory.create">
      <RawMaterialCreate />
    </PermissionGuard>
  )
}
