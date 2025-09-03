import { EditDriver } from '../../components/edit-driver'
import { PermissionGuard } from "@/components/guards/permission-guard"

interface EditDriverPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params
  return (
    <PermissionGuard permission="drivers.edit" redirectTo="/dashboard/drivers">
      <EditDriver driverId={id} />
    </PermissionGuard>
  )
}
