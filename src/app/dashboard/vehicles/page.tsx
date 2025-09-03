import { VehicleManagement } from "./components/vehicle-management-simple"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function VehiclesPage() {
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard">
      <VehicleManagement />
    </PermissionGuard>
  )
}
