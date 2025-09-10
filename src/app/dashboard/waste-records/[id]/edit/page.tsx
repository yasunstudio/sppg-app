import { EditWasteRecord } from '../../components'
import { PermissionGuard } from "@/components/guards/permission-guard"

interface EditWasteRecordPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditWasteRecordPage({ params }: EditWasteRecordPageProps) {
  const { id } = await params
  return (
    <PermissionGuard permission="waste.edit" redirectTo="/dashboard/waste-records">
      <EditWasteRecord recordId={id} />
    </PermissionGuard>
  )
}
