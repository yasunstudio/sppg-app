import { DriverDetails } from '../components/driver-details'
import { PermissionGuard } from "@/components/guards/permission-guard"

interface DriverDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DriverDetailPage({ params }: DriverDetailPageProps) {
  const { id } = await params
  return (
    <PermissionGuard permission="drivers.view" redirectTo="/dashboard">
      <DriverDetails driverId={id} />
    </PermissionGuard>
  )
}
