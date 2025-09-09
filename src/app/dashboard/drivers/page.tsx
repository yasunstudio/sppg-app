import { DriverPageClient } from "./components"
import { PermissionGuard } from "@/components/guards/permission-guard"

export default function DriversPage() {
  return (
    <PermissionGuard permission="drivers.view" redirectTo="/dashboard">
      <DriverPageClient />
    </PermissionGuard>
  )
}
