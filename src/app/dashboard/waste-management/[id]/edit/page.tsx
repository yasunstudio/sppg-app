import { EditWasteRecord } from '../../components'

interface EditWasteRecordPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditWasteRecordPage({ params }: EditWasteRecordPageProps) {
  const { id } = await params
  return <EditWasteRecord recordId={id} />
}
