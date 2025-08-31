import { WasteRecordDetails } from '../components'

interface WasteRecordDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WasteRecordDetailPage({ params }: WasteRecordDetailPageProps) {
  const { id } = await params
  return <WasteRecordDetails recordId={id} />
}
