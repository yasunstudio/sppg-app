import { CreateDriver } from '../components/create-driver'
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function CreateDriverPage() {
  return (
    <PermissionGuard permission="drivers.create" redirectTo="/dashboard/drivers">
      <CreateDriver />
    </PermissionGuard>
  )
}
