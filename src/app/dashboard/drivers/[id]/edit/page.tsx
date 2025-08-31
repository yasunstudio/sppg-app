import { EditDriver } from '@/components/dashboard/drivers/components/edit-driver'

interface EditDriverPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params
  return <EditDriver driverId={id} />
}
