import { EditVehicle } from '../../components'

interface EditVehiclePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  return <EditVehicle vehicleId={id} />
}
