import { DriverDetails } from '@/components/dashboard/drivers/components/driver-details'

interface DriverDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DriverDetailPage({ params }: DriverDetailPageProps) {
  const { id } = await params
  return <DriverDetails driverId={id} />
}
