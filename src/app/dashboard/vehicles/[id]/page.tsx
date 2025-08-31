import { VehicleDetails } from '../components'

interface VehicleDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = await params
  return <VehicleDetails vehicleId={id} />
}
