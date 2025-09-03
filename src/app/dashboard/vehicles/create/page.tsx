import { CreateVehicle } from "../components"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function CreateVehiclePage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/vehicles">
      <CreateVehicle />
    </PermissionGuard>
  )
}
