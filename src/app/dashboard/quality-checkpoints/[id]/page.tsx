import { QualityCheckpointDetails } from "../components"

interface QualityCheckpointDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function QualityCheckpointDetailsPage({ params }: QualityCheckpointDetailsPageProps) {
  const { id } = await params
  return <QualityCheckpointDetails checkpointId={id} />
}
