import { CreateWasteRecord } from '../components'
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function CreateWasteRecordPage() {
  return (
    <PermissionGuard permission="waste.create" redirectTo="/dashboard/waste-management">
      <CreateWasteRecord />
    </PermissionGuard>
  )
}
