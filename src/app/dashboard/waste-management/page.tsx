import { WasteRecordsManagement } from './components'
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function WasteManagementPage() {
  return (
    <PermissionGuard permission="waste.view" redirectTo="/dashboard">
      <WasteRecordsManagement />
    </PermissionGuard>
  )
}
