import { EditVehicle } from "../../components"
import { PermissionGuard } from "@/components/guards/permission-guard"

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  
  return (
    <PermissionGuard permission="production.view" redirectTo="/dashboard/vehicles">
      <EditVehicle vehicleId={id} />
    </PermissionGuard>
  )
}
