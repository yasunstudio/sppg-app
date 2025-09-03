import { WasteRecordDetails } from '../components'
import { PermissionGuard } from "@/components/guards/permission-guard"

interface WasteRecordDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WasteRecordDetailPage({ params }: WasteRecordDetailPageProps) {
  const { id } = await params
  return (
    <PermissionGuard permission="waste.view" redirectTo="/dashboard">
      <WasteRecordDetails recordId={id} />
    </PermissionGuard>
  )
}
